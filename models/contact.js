const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    link: {
        type: String,
        require: true,
    },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;