const { Video } = require("../models")

class VideoController {
    static async addWideo(req,res){
        const { video } = req.body

        await Video.create(video)
        res.status(200).send('created')

    }

    static async getVidioByFilm(req,res){
        const { id } = req.body

       const vidio =  await Vidio.findOne({
            where:{
                filmId:id
            }
        })

        res.status(200).send(vidio)
    }

    static async deleteVidio(req,res){
        const { id } = req.body;

        await Video.destroy({
            where:{
                id
            }
        })

        res.status(200).send("deleted")
    }

    static async updateVidio(req,res){
        const { id , newVideo } = req.body

        await Video.update({
            ...newVideo,
            where:{
                id
            }
        })
        res.status(200).send("updated")
    }


}

module.exports = { VideoController }