const createPath = require('./create-path');

const handleError = (res, error) => {
    const title = 'Error';
    error && console.log(error);
    res
        .status(404)
        .render(createPath('error'), { title });
}

module.exports = handleError;