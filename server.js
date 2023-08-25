const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Post = require('./models/post');

const PORT = 3000;
const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`);
const db = "mongodb+srv://Anicktoo:c1zUxqzxukCS5QeC@cluster0.dyraobv.mongodb.net/node-blog?retryWrites=true&w=majority";

mongoose
    .connect(db)
    .then((res) => console.log('Connected to DB'))
    .catch(console.error);

const app = express();
app.set('view engine', 'ejs');

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`Listening port ${PORT}`);
});

// middleware или промежуточное ПО.Функция отрабатывает и передает контроль дальше.
// Middleware должен идти после listening но до возврата конкретных страниц.Порядок важен!
// Можно писать их вручную (здесь логгирование инф-ии о запросе):
// app.use((req, res, next) => {
//     console.log(`path: ${req.path}`);
//     console.log(`method: ${req.method}`);
//     next();
// });

// Можно использовать готовые промежуточные обработчики:
// https://expressjs.com/ru/resources/middleware.html

// Используем morgan (logger), в котором уже есть метод для логирования инф-ии о запросе

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));


//Middleware, который парсит url строку
app.use(express.urlencoded({ extended: false }));

//Middleware который делает папку доступной клиенту (по умолчанию Node закрывает папки от клиента).
//Данный пример использует вируальный путь styles. Такой папки может не быть, но она будет указана в URL. В поле статик указывается папка в которой на самом деле нужно искать файл.
app.use('/styles', express.static('styles'));

// Другой способ сделать так:
// app.use(express.static('styles'));
//В таком случае в пути в html нужнго указать путь "/styles.css". И Node будет автоматически искать в статик папке styles.

app.get('/', (req, res) => {
    const title = 'Home';
    res.render(createPath('index'), { title });
});

app.get('/contacts', (req, res) => {
    const title = 'Contacts';
    const contacts = [
        { name: 'GitHub', link: 'https://github.com/Anicktoo' },
        { name: 'Telegram', link: 'https://t.me/Anicktoo' },
        { name: 'VK', link: 'https://vk.com/anicktoo' },
    ];
    res.render(createPath('contacts'), { contacts, title });
});

app.get('/posts/:id', (req, res) => {
    const title = 'Post';
    const post = {
        id: '1',
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente quidem provident, dolores, vero laboriosam nemo mollitia impedit unde fugit sint eveniet, minima odio ipsum sed recusandae aut iste aspernatur dolorem.',
        title: 'Lorem impsum',
        date: '05.05.2021',
        author: 'Anicktoo',
    };
    res.render(createPath('post'), { title, post });
});

app.get('/posts', (req, res) => {
    const title = 'Posts';
    const posts = [
        {
            id: '1',
            text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente quidem provident, dolores, vero laboriosam nemo mollitia impedit unde fugit sint eveniet, minima odio ipsum sed recusandae aut iste aspernatur dolorem.',
            title: 'Lorem impsum',
            date: '05.05.2021',
            author: 'Anicktoo',
        },
        {
            id: '2',
            text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente quidem provident, dolores, vero laboriosam nemo mollitia impedit unde fugit sint eveniet, minima odio ipsum sed recusandae aut iste aspernatur dolorem.',
            title: 'Ipsum lorem',
            date: '06.05.2021',
            author: 'Anicktoo',
        },
    ];
    res.render(createPath('posts'), { title, posts });
});

app.post('/add-post', (req, res) => {
    const { title, author, text } = req.body;
    const post = new Post({ title, author, text });
    post
        .save()
        .then((result) => res.send(result))
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' })
        });
});

app.get('/add-post', (req, res) => {
    const title = 'Add post';
    res.render(createPath('add-post'), { title });
});

app.get('/about-us', (req, res) => {
    res
        .status(301)
        .redirect('/contacts');
});

app.use((req, res) => {
    const title = 'Error page';
    res
        .status(404)
        .render(createPath('error'), { title });
});