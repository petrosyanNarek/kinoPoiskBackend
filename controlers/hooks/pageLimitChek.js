module.exports = ( page , limit) => {   
    limit = !limit ? 10 : +limit
    page = !page ?  0 : (+page - 1) * limit
    return({  page , limit })
}