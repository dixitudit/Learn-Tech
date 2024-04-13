import Comment from '../models/comment.model.js';

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