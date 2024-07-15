import cloudinary from "cloudinary";

import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.v2.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error in createPost controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) return res.status(400).json({ error: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.v2.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted succefully" });
  } catch (error) {
    console.log("Error in deletePost controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) return res.status(400).json({ error: "Text field is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post not found" });

    const comment = { user: userId, text };

    post.comments.push(comment);
    await post.save();

    res.status(200).json({ post });
  } catch (error) {
    console.log("Error in commentOnPost controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: "Post not found" });

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike Post
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });
      res.status(200).json({ message: "Post unliked succefully" });
    } else {
      // Like Post
      await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });

      // Send notification
      const newNotification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });

      await newNotification.save();
      res.status(200).json({ message: "Post liked succefully" });
    }
  } catch (error) {
    console.log("Error in likeUnlikePost controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password");

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate("user", "-password")
      .populate("comments.user", "-password");

    if (likedPosts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const feedPosts = await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .populate("comments.user", "-password");

    if (feedPosts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserPosts = async (req, res) => {
    try {
      const username = req.params.username
  
      const user = await User.findOne({username});
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const userPosts = await Post.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate("user", "-password")
        .populate("comments.user", "-password");
  
      if (userPosts.length === 0) {
        return res.status(200).json([]);
      }
  
      res.status(200).json(userPosts);
    } catch (error) {
      console.log("Error in getUserPosts controller: ", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };