const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Post = require('./models/post');
const Contact = require('./models/contact');


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

// Используем morgan (logger), в котором уже есть метод для логирования инф-ии о запросе
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

//Middleware, который парсит url строку
app.use(express.urlencoded({ extended: false }));

//Middleware который делает папку доступной клиенту (по умолчанию Node закрывает папки от клиента).
//Данный пример использует вируальный путь styles. Такой папки может не быть, но она будет указана в URL. В поле статик указывается папка в которой на самом деле нужно искать файл.
app.use('/styles', express.static('styles'));

app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    const title = 'Home';
    res.render(createPath('index'), { title });
});

app.get('/contacts', (req, res) => {
    const title = 'Contacts';
    Contact
        .find()
        .then((contacts) => res.render(createPath('contacts'), { contacts, title }))
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

app.get('/posts/:id', (req, res) => {
    const title = 'Post';
    Post
        .findById(req.params.id)
        .then((post) => {
            res.render(createPath('post'), { title, post });
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

app.get('/edit/:id', (req, res) => {
    const title = 'Edit Post';
    Post
        .findById(req.params.id)
        .then((post) => {
            res.render(createPath('edit-post'), { title, post });
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

app.put('/edit/:id', (req, res) => {
    console.log('OKAY');
    const { title, author, text } = req.body;
    const { id } = req.params;
    Post
        .findByIdAndUpdate(id, { title, author, text })
        .then((result) => {
            res
                .status(301)
                .redirect(`/posts/${id}`);
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

app.delete('/posts/:id', (req, res) => {
    Post
        .findByIdAndDelete(req.params.id)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

app.get('/posts', (req, res) => {
    const title = 'Posts';
    Post
        .find()
        .sort({ createdAt: -1 })
        .then((posts) => {
            res.render(createPath('posts'), { title, posts });
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

app.post('/add-post', (req, res) => {
    const { title, author, text } = req.body;
    const post = new Post({ title, author, text });
    post
        .save()
        .then((result) => {
            res
                .status(301)
                .redirect(`/posts`);
        })
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