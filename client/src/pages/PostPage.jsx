import { Button, Spinner } from "flowbite-react";
import { set } from "mongoose";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState(null);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    // console.log(postSlug);
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
        } else {
          setPost(data.posts[0]);
          setPostContent(data.posts[0].content);
        //   console.log(data.posts);
          setLoading(false);
        }
      } catch (err) {
        setError(true);
        setLoading(false);
        console.log(err.message);
      }
    };
    fetchPost();
  }, [postSlug]);
  return (
    <>
      {loading ? (
        <>
          <div className="flex justify-center min-h-screen items-center mx-auto h-96">
            <Spinner size="lg" />
            <div className="pl-3">loading...</div>
          </div>
        </>
      ) : (
        <main className="p-3 flex flex-col max-w-3xl mx-auto min-h-screen">
          <h1 className="text-3xl max-w-2xl mx-auto font-bold font-serif mt-10 p-3 text-center lg:text-4xl">
            {post && post.title}
          </h1>
          <Link className="mx-auto m-5" to={`/search?category=${post && post.category}`}>
            <Button color='gray' pill size='xs'>{post && post.category}</Button>
          </Link>
          <img src={post && post.image} alt={post && post.title} className="mx-auto mt-10 p-3 max-h-[500px] w-full object-cover" />
          <div className="flex text-xs justify-between py-3 px-4">
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="mx-2">{post && (post.content.length/1000).toFixed(0)} mins read</span>
          </div>
          <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html: post && post.content}}>

          </div>
        </main>
      )}
    </>
  );
}
