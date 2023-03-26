module.exports = async (ids, model) => {
    const modelItem = await model.findAll({
        where: {
            id: ids
        },
    });
    return modelItem.length === ids.length
}