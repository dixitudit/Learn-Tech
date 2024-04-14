import { Button } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="w-full m-2 h-[240px] border border-teal-500 hover:border-2 transition-all group relative rounded-lg sm:w-[240px]">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt={post.title}
          className="h-[140px] rounded-lg w-full object-cover group-hover:h-[120px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="flex flex-col gap-2 p-3">
        <p className="text-lg font-semibold line-clamp-1">{post.title}</p>
        <span className="italic text-sm">{post.category}</span>
        <Link to={`/post/${post.slug}`} className="group-hover:bottom-0 hidden group-hover:inline absolute z-10 left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2">
          Read Article
        </Link>
      </div>
    </div>
  );
}
