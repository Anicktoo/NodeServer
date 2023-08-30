const Contact = require('../models/contact');
const createPath = require('../helpers/create-path');
const { handleError } = require('../helpers/handle-error');

const getContacts = (req, res) => {
    const title = 'Contacts';
    Contact
        .find()
        .then((contacts) => res.render(createPath('contacts'), { contacts, title }))
        .catch((error) => handleError(res, error));
};

module.exports = {
    getContacts,
};