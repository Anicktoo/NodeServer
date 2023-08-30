const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();
const postRouter = require('./routes/post-routes');
const postApiRouter = require('./routes/api-post-routes');
const contactRouter = require('./routes/contact-router');
const createPath = require('./helpers/create-path');
const { handleError } = require('./helpers/handle-error');
const { errorMsg, successMsg } = require('./helpers/chalkMessage');

const PORT = process.env.PORT;
const app = express();

app.set('view engine', 'ejs');

mongoose
    .connect(process.env.MONGO_URL)
    .then((res) => console.log(successMsg('Connected to DB')))
    .catch((error) => console.log(errorMsg(error)));

app.listen(PORT, (error) => {
    error ? console.log(errorMsg(error)) : console.log(successMsg(`Listening port ${PORT}`));
});

// Используем morgan (logger), в котором уже есть метод для логирования инф-ии о запросе
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

//Middleware, который парсит url строку
app.use(express.urlencoded({ extended: false }));

//Middleware который делает папку доступной клиенту (по умолчанию Node закрывает папки от клиента).
//Данный пример использует вируальный путь styles. Такой папки может не быть, но она будет указана в URL. В поле статик указывается папка в которой на самом деле нужно искать файл.
app.use(express.static(path.resolve(__dirname, 'styles')));

app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    const title = 'Home';
    res.render(createPath('index'), { title });
});

app.use(postRouter);
app.use(contactRouter);
app.use(postApiRouter);

app.use((req, res) => handleError(res));