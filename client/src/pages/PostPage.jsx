import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [rLoading, setRLoading] = useState(true);

  useEffect(() => {
    // console.log(postSlug);
    setRLoading(true);
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (!res.ok) {
          setRLoading(false);
        } else {
          setRecentPosts(data.posts);
          console.log(recentPosts);
          setRLoading(false);
        }
      } catch (err) {
        setRLoading(false);
        console.log(err.message);
      }
    };
    fetchRecentPosts();
  }, []);

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
      {loading || error || rLoading ? (
        <>
          <div className="flex justify-center min-h-screen items-center mx-auto h-96">
            <Spinner size="lg" />
            <div className="pl-3">loading...</div>
          </div>
        </>
      ) : (
        <main className="p-3 flex flex-col max-w-4xl mx-auto min-h-screen">
          <h1 className="text-3xl max-w-2xl mx-auto font-bold font-serif mt-10 p-3 text-center lg:text-4xl">
            {post && post.title}
          </h1>
          <Link
            className="mx-auto m-5"
            to={`/search?category=${post && post.category}`}
          >
            <Button color="gray" pill size="xs">
              {post && post.category}
            </Button>
          </Link>
          <img
            src={post && post.image}
            alt={post && post.title}
            className="mx-auto mt-10 p-3 max-h-[500px] w-full object-cover"
          />
          <div className="flex text-xs justify-between py-3 px-4">
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="mx-2">
              {post && (post.content.length / 1000).toFixed(0)} mins read
            </span>
          </div>
          <div
            className="p-3 max-w-3xl mx-auto w-full post-content"
            dangerouslySetInnerHTML={{ __html: post && post.content }}
          ></div>
          <CommentSection postId={post._id} />
          <div className="flex flex-col w-full items-center mb-5">
            <h1 className="text-xl mt-5">Recent Articles</h1>
            {!recentPosts || rLoading ? (
              <div className="flex">
                <span>
                  <Spinner size="md" />
                </span>
                <span className="ml-2">loading...</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1 mt-5 justify-center">
                {recentPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        </main>
      )}
    </>
  );
}
