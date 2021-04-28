const BlogPost = require("../models/blog-post");
const User = require("../models/user");
const successResponse = require("../lib/success-response-sender");
const errorResponse = require("../lib/error-response-sender");

let sendMail = require("../lib/send-mail/nodemailer");

module.exports = {
  fetchAll: async (req, res) => {
    try {
      const blogPosts = await BlogPost.find()
        .populate("category", "name")
        .populate("user", "full_name email");
      successResponse(res, "List of all blog posts", blogPosts);
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  },
  fetchOne: async (req, res) => {
    console.log(req.user);
    try {
      const blogPost = await BlogPost.findById(req.params.id)
        .populate("category", "name")
        .populate("user", "full_name email");
      if (!blogPost) errorResponse(res, 400, "No user with the provided id");

      successResponse(res, `Post with id #${req.params.id}`, blogPost);
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  },
  create: async (req, res) => {
    try {
      const blogPost = await BlogPost.create(req.body);

      const userEmail = await BlogPost.findById(blogPost._id).populate(
        "user",
        "email"
      );
      const sendBlogPost = await BlogPost.findById(blogPost._id).populate(
        "category",
        "name"
      );
      successResponse(res, "New blog post created", blogPost);
      sendMail(
        userEmail,
        "New post is created",
        `Wow, you created a new blog post with TITLE: ${sendBlogPost.title} and CONTENT: ${sendBlogPost.content}`
      );
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  },
  patchUpdate: async (req, res) => {
    try {
      const blogPost = await BlogPost.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      successResponse(res, "Blog post updated", blogPost);
    } catch (error) {
      errorResponse(res, 500, {
        ...req.body,
        _id: req.params.id,
        error: error.message,
      });
    }
  },
  putUpdate: async (req, res) => {
    try {
      const blogPost = await BlogPost.findOneAndReplace(
        { _id: req.params.id },
        req.body
      );
      successResponse(res, "Blog post updated", blogPost);
    } catch (error) {
      errorResponse(res, 500, {
        ...req.body,
        _id: req.params.id,
        error: error.message,
      });
    }
  },
  delete: async (req, res) => {
    try {
      await BlogPost.remove({ _id: req.params.id });
      res.send(`BlogPost ${req.params.id} is deleted`);
    } catch (error) {
      res.send({ message: error });
    }
  },
};
