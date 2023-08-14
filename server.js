const express = require('express');
const path = require('path');

const PORT = 3000;
const createPath = (page) => path.resolve(__dirname, 'views', `${page}.html`);

const app = express();

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`Listening port ${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(createPath('index'));
});

app.get('/contacts', (req, res) => {
    res.sendFile(createPath('contacts'));
});

app.get('/about-us', (req, res) => {
    res
        .status(301)
        .redirect('/contacts');
});

app.use((req, res) => {
    res
        .status(404)
        .sendFile(createPath('error'));
});