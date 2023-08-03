// create web server with express
const express = require('express');
const app = express();
// create body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// create mongoose
const mongoose = require('mongoose');
// connect to mongoDB
mongoose.connect('mongodb://localhost:27017/itcast', { useNewUrlParser: true, useUnifiedTopology: true });
// create schema
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: false
    }
});
// create model
const Comment = mongoose.model('Comment', commentSchema);
// set view engine
app.set('view engine', 'ejs');
// set view path
app.set('views', './views');
// set static path
app.use('/public', express.static('./public'));
// create router
app.get('/', (req, res) => {
    Comment.find((err, data) => {
        if (err) {
            return res.status(500).send('Server error.');
        }
        res.render('index.html', { comments: data });
    });
});
app.get('/post', (req, res) => {
    res.render('post.html');
});
app.post('/post', (req, res) => {
    const comment = new Comment(req.body);
    comment.save((err, data) => {
        if (err) {
            return res.status(500).send('Server error.');
        }
        res.redirect('/');
    });
});
app.listen(3000, () => {
    console.log('Server is running at port 3000.');
});