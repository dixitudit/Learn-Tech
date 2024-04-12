import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  // console.log(req.user);
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Access Denied"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    return next(err);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    // console.log(req.query);
    // here query is something which is written after ? in the url separated by & for this route for example someone call get request for ip/api/posts/getposts?startIndex=0&limit=10&order=asc&category=uncategorized then req.query will be {startIndex: 0, limit: 10, order: 'asc', category: 'uncategorized'}

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (err) {
    return next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.params.userId !== req.user.id) {
      return next(errorHandler(403, "Access Denied"));
    }
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: "post deleted successfully" });
  } catch (err) {
    return next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.params.userId !== req.user.id) {
      return next(errorHandler(403, "Access Denied"));
    }
    const updated = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          image: req.body.image,
          content: req.body.content,
          category: req.body.category,
        },
      },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    return next(err);
  }
};
