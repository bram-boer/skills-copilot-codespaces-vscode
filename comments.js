// create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { randomBytes } = require('crypto');

// create express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// create comments object
const commentsByPostId = {};

// create route
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// create route
app.post('/posts/:id/comments', async (req, res) => {
  // generate random id
  const commentId = randomBytes(4).toString('hex');
  // get comment from request body
  const { content } = req.body;
  // get comments array by post id
  const comments = commentsByPostId[req.params.id] || [];
  // push new comment to comments array
  comments.push({ id: commentId, content, status: 'pending' });
  // update commentsByPostId
  commentsByPostId[req.params.id] = comments;
  // send event to event bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending',
    },
  });
  // send response
  res.status(201).send(comments);
});

// create route
app.post('/events', async (req, res) => {
  // get event from request body
  const { type, data } = req.body;
  // check if event type is CommentModerated
  if (type === 'CommentModerated') {
    // get comment from commentsByPostId
    const { id, postId, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    // update comment status
    comment.status = status;
    // send event to event bus
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        postId,
        status,
        content,
      },
    });
  }
  // send response
  res.send({});
});

// listen