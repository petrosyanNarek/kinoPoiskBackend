const { Actor } = require("../models");
const pageLimitChek = require("./hooks/pageLimitChek");
const sortBySearchBy = require("./hooks/sortBySearchBy");

class ActorController {

    static async getAllActors(req, res) {
        const actors = await Actor.findAll()

        res.status(200).send(actors)
    }

    static async addActor(req, res) {
        const { actor } = req.body;

        await Actor.create(actor)
        res.status(200).send('added')
    }

    static async deleteActor(req, res) {
        const { id } = req.body

        await Actor.destroy({
            where: {
                id
            }
        })

        res.status(200).send("deleted")
    }

    static async updateActor(req, res) {
        const { actor, id } = req.body

        await Actor.update({
            ...actor
        }, {
            where: {
                id
            }
        })

        res.status(200).send('updated')
    }

    static async getActorById(req, res) {
        const { id } = req.headers

        const author = await Actor.findOne({
            where: {
                id
            }
        })

        res.status(200).send(author)

    }
    static async getFilteredActor(req, res) {
        const { page, limit } = pageLimitChek(req.body.page, req.body.limit);
        const sortBy = req.body.sortBy || "createdAt";
        const sortOrder = req.body.sortOrder || "DESC";
        const filterValue = req.body.filterValue || "";
        const attributes = Object.keys(Actor.rawAttributes);


        const options = sortBySearchBy(
            sortBy,
            sortOrder,
            attributes,
            filterValue
        );

        const results = await Actor.findAll(options);
        let actors = await Actor.findAll({
            ...options,
            limit,
            offset: page,
        });
        res.status(200).send({
            actors,
            totoalActorsCount: results.length,
            totalPageCount: Math.ceil(results.length / limit),
        });
    }
}

module.exports = { ActorController }