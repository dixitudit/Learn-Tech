import { Alert, Button, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CommentCard from "./CommentCard";

export default function CommentSection({ postId }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [commentError, setCommentError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setComments(data);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };
    fetchComments();
  }, [postId]);

  const handleLike = async (commentId)=>{
    try{
      if(!currentUser){
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`,{
        method: "PUT",
      });
      const data = await res.json();

      setComments(comments.map((comment)=>
        comment._id === commentId ?{
        ...comment,
        likes: data.likes,
        numberOfLikes: data.numberOfLikes,}:comment
      ));
    }
    catch(err){
      console.error(err);
    }
  }

  const handleEdit = async (comment, editedContent) => {
    setComments(comments.map((c)=> c._id === comment._id ? {...c, content: editedContent}: c))
  };


  const handleDelete = async (commentId) => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      comment.length > 200 ||
      currentUser === null ||
      (!comment && !comment.trim())
    ) {
      setCommentError(true);
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCommentError(false);
        setComment("");
        setComments((prev) => [data, ...prev]);
        // console.log(data);
      }
    } catch (err) {
      setCommentError(true);
      console.error(err);
    }
  };

  return (
    <div>
      {currentUser ? (
        <>
          <div className="flex items-center text-xs p-2">
            <p>Signed in as:</p>
            <img
              className="w-5 h-5 m-1 rounded-full"
              src={currentUser.profilePic}
              alt={currentUser.username}
            />
            <Link
              to={`/dashboard?tab=profile`}
              className="text-cyan-600 hover:underline"
            >
              @{currentUser.username}
            </Link>
          </div>
          <div>
            <form
              onSubmit={handleSubmit}
              className="border p-3 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none shadow-md"
            >
              <Textarea
                placeholder="Write a comment..."
                rows="3"
                maxLength="200"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex items-center justify-between p-3">
                <p className="text-xs">
                  {200 - comment.length} character remaining
                </p>
                <Button
                  gradientDuoTone="purpleToBlue"
                  outline
                  className="rounded-tl-md rounded-br-md rounded-tr-none rounded-bl-none"
                  type="submit"
                >
                  Add comment
                </Button>
              </div>
              {commentError && (
                <Alert color="failure">
                  Something went wrong, try again later.
                </Alert>
              )}
            </form>
          </div>
        </>
      ) : (
        <div className="flex space-x-3 ">
          <p className="text-xs">You must be signed in to comment.</p>
          <Link to="/sign-in" className="text-teal-500 text-xs hover:underline">
            Sign in
          </Link>
          <Link to="/sign-up" className="text-teal-500 hover:underline text-xs">
            Sign up
          </Link>
          .
        </div>
      )}
      <div className="p-3 border-b-2">
        <p>
          Comments{" "}
          <span className="border-2 shadow-md px-2">
            {comments.length || 0}
          </span>
        </p>
      </div>
      <div>
        {!loading && comments.map((comment) => (
          <CommentCard key={comment._id} onDelete={handleDelete} comment={comment} onEdit={handleEdit} onLike={handleLike}/>
          
        ))}
      </div>
    </div>
  );
}
