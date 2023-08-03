// create web server
// create database connection
// create schema
// create model
// create route
// create view
// create controller
// create test

// import modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Comment = require('./models/comment');
const CommentController = require('./controllers/commentController');

// create web server
const app = express();

// create database connection
mongoose.connect('mongodb://localhost:27017/comments', { useNewUrlParser: true });

// create schema
const commentSchema = new mongoose.Schema({
  name: String,
  comment: String
});

// create model
const Comment = mongoose.model('Comment', commentSchema);

// set view engine
app.set('view engine', 'ejs');

// set public directory
app.use(express.static('public'));

// set body parser
app.use(bodyParser.urlencoded({ extended: true }));

// create route
app.get('/', (req, res) => {
  Comment.find({}, (err, comments) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { comments: comments });
    }
  });
});

app.post('/', (req, res) => {
  const comment = new Comment(req.body);
  comment.save(err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

// create controller
const CommentController = require('./controllers/commentController');

// create test
describe('CommentController', () => {
  describe('getComments', () => {
    it('should return all comments', done => {
      const Comment = {
        find: sinon.spy()
      };

      const commentController = CommentController(Comment);

      commentController.getComments((err, comments) => {
        Comment.find.calledOnce.should.be.true;
        done();
      });
    });
  });
});

// listen on port
app.listen(3000, () => {
  console.log('server listening on port 3000');
});