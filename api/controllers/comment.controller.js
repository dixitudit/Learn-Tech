import Comment from '../models/comment.model.js';
import { errorHandler } from '../utils/error.js';

export const createComment = async (req, res, next) => {

    const { content, postId, userId } = req.body;
    if(req.user.id !== userId) {
        return next(errorHandler(403, "Unauthorized"));
    }
    if (!content || !postId || !userId) {
        return next(errorHandler(400, "All fields are required"));
    }

    const newComment = new Comment({
        content,
        postId,
        userId,
    });

    try {
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        next(err);
    }
}

export const getPostComments = async (req, res, next) => {
    const postId = req.params.postId;

    try {
        const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
}