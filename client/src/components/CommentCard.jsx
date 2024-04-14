import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export default function CommentCard({ comment, onEdit, onLike, onDelete }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleEdit = async () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });
      const data = await res.json();
      // console.log(data);
      if(res.ok){
        setIsEditing(false);
        onEdit(comment, data.content);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const getUser = async () => {
      // console.log(comment);
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          // console.log(user);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getUser();
  }, [comment]);

  return (
    <div>
      <div className="flex p-4 border-b dark:border-gray-600 text-sm">
        <div className="flex-shrink-0 mr-3">
          <img
            src={
              user
                ? user.profilePic
                : "https://firebasestorage.googleapis.com/v0/b/learn-tech-ef5c2.appspot.com/o/PlaceholderImage.jpg?alt=media&token=01f99222-5005-455d-9ec1-4007de96fdce"
            }
            alt="profile"
            className="w-10 h-10 bg-gray-200 rounded-full"
          />
        </div>
        <div className="flex-1">
          <div className=" flex items-center mb-1">
            <span className="font-bold mr-2 text-xs truncate">
              @{user ? user.username : "anonymous"}
            </span>
            <span className="text-xs opacity-60">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
          {isEditing ? (
            <>
              <Textarea
                className="mb-2"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              ></Textarea>
              <div className="flex justify-end gap-2 text-xs">
                <Button
                  type="button"
                  size="sm"
                  gradientDuoTone="purpleToBlue"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  size="sm"
                  gradientDuoTone="purpleToBlue"
                  onClick={() => setIsEditing(false)}
                  outline
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-500 pb-2">{comment.content}</p>
              <div className="flex items-center pt-2 ">
                <button
                  className="text-gray-400 px-2  hover:text-blue-500"
                  type="button"
                  onClick={() => onLike(comment._id)}
                >
                  <FaThumbsUp
                    className={`text-sm ${
                      !currentUser ||
                      comment.likes.indexOf(currentUser._id) === -1
                        ? ""
                        : "text-teal-500"
                    }`}
                  />
                </button>
                <p className="text-xs text-gray-400">
                  {comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes > 1 ? "likes" : "like")}
                </p>
                {currentUser && currentUser._id === comment.userId && (
                  <>
                    <button
                      onClick={() => handleEdit(comment._id)}
                      className="text-gray-400 px-2 hover:text-blue-500"
                    >
                      Edit
                    </button>
                  </>
                )}
                {currentUser &&
                  (currentUser._id === comment.userId ||
                    currentUser.isAdmin) && (
                    <>
                      <button
                        className="text-red-400  hover:underline"
                        onClick={() => onDelete(comment._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
