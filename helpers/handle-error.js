const createPath = require('./create-path');
const { errorMsg } = require('./chalkMessage');

const handleError = (res, error) => {
    const title = 'Error';
    error && console.log(errorMsg(error));
    res
        .status(404)
        .render(createPath('error'), { title });
}

const handleApiError = (res, error) => {
    error && console.log(errorMsg(error));
    res.status(500).send(error.message);
}

module.exports = {
    handleError,
    handleApiError
};