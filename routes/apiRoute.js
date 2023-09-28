const express = require('express');
const authController = require('../controllers/authController.js');
const blogController = require('../controllers/blogController.js');

const apiRouter = express.Router();

apiRouter.route('/register').post(authController.register);
apiRouter.route('/login').post(authController.login);

apiRouter.use(authController.protect);

apiRouter
    .route('/blogs')
    .get(blogController.getAllBlogs)
    .post(blogController.createBlog);

apiRouter
    .route('/blogs/:id')
    .patch(blogController.updateBlog)
    .put(blogController.updateBlog)
    .delete(blogController.deleteBlog);

apiRouter.route('/api/blogs/:id/like').patch(blogController.addLike);

apiRouter.route('/api/blogs/:id/comment').patch(blogController.addComment);

module.exports = {apiRouter};
