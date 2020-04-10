const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Post & Profil Model
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//Validation
const validatePostInput = require("../../validation/post");
//@route   Get routes/api/posts/test
router.get("/test", (req, res) => res.send({ msg: "posts Works" }));

//@route   Get routes/api/posts
//@desc    GET posts
//@access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No posts found " }));
});

//@route   Get routes/api/posts
//@desc    GET post by id
//@access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that Id" })
    );
});

//@route   POST routes/api/posts
//@desc    creat post
//@access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Chack the validation
    if (!isValid) {
      //If any errors, send 400 with errors object
      res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

//@route   DELETE routes/api/posts/:id
//@desc    DELETE post
//@access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }
          //Delete
          post.remove().then(() => res.json({ succes: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

//@route   Post routes/api/like/:id
//@desc    Like post
//@access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }
          //Add the user id to likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);
//@route   Post routes/api/unlike/:id
//@desc    Unlike post
//@access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this post" });
          }
          //GET remove index
          const removeIndex=post.likes
          .map(el=>el.user.toString())
          .indexOf(req.user.id)
          //splice of array
          post.likes.splice(removeIndex,1)
          //save
          post.save().then(post=>res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

//@route   Post routes/api/comment/:id
//@desc    Add comment to post
//@access  Private
router.post('/comment/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const { errors, isValid } = validatePostInput(req.body);

    //Chack the validation
    if (!isValid) {
      //If any errors, send 400 with errors object
      res.status(400).json(errors);
    }
    Post.findById(req.params.id)
    .then(post=>{
        const newComment={
            text:req.body.text,
            name:req.body.name,
            avatar:req.body.avatar,
            user:req.user.id,
        }
        //ADD to comments array
        post.comments.unshift(newComment)
        //save
        post.save().then(post=>res.json(post))
    })
    .catch(err=>res.status(404).json({postnotfound:'No post found'}))
})
//@route   DELETE routes/api/comment/:id/comment_id 
//@desc    Remove comment from post
//@access  Private
router.delete('/comment/:id/:comment_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    
    Post.findById(req.params.id)
    .then(post=>{
        //check if the comment exists
        if(post.comment.filter(comment=>comment._id.toString()===req.params.comment_id).length===0){
    return res.status(404).json({commentnotexists:'comment does not exist'})
        }
        //Get remove index
        const removeIndex=post.comments
        .map(el=>el._id.toString())
        .indexOf(req.params.comment_id)

        //splice comment out of array
        post.comments.splice(removeIndex,1)
        post.save().then(post=>res.json(post))

    })
    .catch(err=>res.status(404).json({postnotfound:'No post found'}))
})
module.exports = router;
