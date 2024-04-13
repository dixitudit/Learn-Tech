import { Button, Textarea } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
//8:35

export default function CommentSection({ postId }) {
  const [comment, setComment] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const handleSubmit = async (e) => {};
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
    </div>
  );
}
