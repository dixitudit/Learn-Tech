import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function CommentCard({ comment, onLike }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
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
          <p className="text-gray-500 pb-2">{comment.content}</p>
          <div className="flex items-center pt-2 ">
            <button
              className="text-gray-400 px-2  hover:text-blue-500"
              type="button"
              onClick={() => onLike(comment._id)}
            >
              <FaThumbsUp
                className={`text-sm ${
                  !currentUser || comment.likes.indexOf(currentUser._id) === -1
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
          </div>
        </div>
      </div>
    </div>
  );
}
