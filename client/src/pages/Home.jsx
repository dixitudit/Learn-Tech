import { ReactTyped } from "react-typed";
import { Button, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [rLoading, setRLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setRLoading(false);
        }
      } catch (err) {
        console.log(err);
        setRLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen p-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col relative gap-6 pl-10 w-[50%]">
          <h1 className="text-2xl font-bold lg:text-5xl">
            Welcome to Learn Tech
          </h1>
          <p className="text-gray-500 max-h-5 text-xs sm:text-sm lg:text-xl">
            Here you'll find a variety of articles and tutorials on topics such
            as{" "}
            <ReactTyped
              className=""
              strings={[
                "Web Development.",
                "Software Engineering.",
                "Programming Languages.",
                "JavaScript.",
                "React Js.",
                "Node Js.",
                "Next Js.",
              ]}
              typeSpeed={120}
              backSpeed={150}
              loop
            />
          </p>
          <Link to="/search">
            <Button
              gradientDuoTone="purpleToBlue"
              outline
              size="sm"
              className="absolute bottom-[-60px] left-10"
            >
              View all posts
            </Button>
          </Link>
        </div>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/learn-tech-ef5c2.appspot.com/o/homeImg-removebg.png?alt=media&token=10d1f0e1-a122-4e54-aa36-518a82236d38"
          alt="home"
          className="w-[50%] rounded-[40px] h-full mt-5 object-cover shadow-[10px_5px_6px_3px_rgba(0,0,0,0.3)]"
        />
      </div>
      <div className="flex flex-col border-t w-[60%] mx-auto justify-center items-center mt-[95px] m-5">
        <h1 className="text-2xl font-semibold p-2">Recent Articles</h1>
        {!posts || rLoading ? (
          <div className="flex">
            <span>
              <Spinner size="md" />
            </span>
            <span className="ml-2">loading...</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1 mt-5 justify-center">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
      <Link to='/search'
        className="w-full flex justify-center items-center text-teal-500 text-sm py-7 hover:underline"
      >
        View all posts
      </Link>
    </div>
  );
};

export default Home;
