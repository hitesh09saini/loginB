const mongoose = require('mongoose')

const employSchema = new mongoose.Schema({
    name: String,
    password: String
})

const employModel = mongoose.model("employs", employSchema);

module.exports = employModel;