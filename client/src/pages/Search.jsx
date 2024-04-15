import { Button, Select, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

export default function Search() {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    order: "desc",
    category: "uncategorised",
  });
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);

    urlParams.set("searchTerm", sidebarData.searchTerm);

    urlParams.set("order", sidebarData.order);

    urlParams.set("category", sidebarData.category);

    navigate(`/search?${urlParams.toString()}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const orderFromUrl = urlParams.get("order");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || orderFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        order: orderFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
          setLoading(false);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        } else {
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res =  await fetch(`/api/post/getposts?${searchQuery}`);
    const data = await res.json();
    if(!res.ok){
        return;
    }
    setPosts([...posts, ...data.posts]);
    if(data.posts.length < 9){
        setShowMore(false);
    }
  }
  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      const term = e.target.value;
      setSidebarData({ ...sidebarData, searchTerm: term });
    }
    if (e.target.id === "order") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, order: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorised";
      setSidebarData({ ...sidebarData, category: category });
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-4 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 ">
            <label
              className="whitespace-nowrap font-semibold"
              htmlFor="searchTerm"
            >
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2 ">
            <label className="whitespace-nowrap font-semibold" htmlFor="order">
              Sort:
            </label>
            <Select
              id="order"
              onChange={handleChange}
              value={sidebarData.order}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </Select>
          </div>
          <div className="flex items-center gap-2 ">
            <label
              className="whitespace-nowrap font-semibold"
              htmlFor="category"
            >
              Category:
            </label>
            <Select
              id="category"
              onChange={handleChange}
              value={sidebarData.category}
            >
              <option value="uncategorised">Uncategorised</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>
          <Button
            type="submit"
            outline
            gradientDuoTone="purpleToPink"
            className="w-full"
          >
            Apply Filter
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 w-full">
          Search Results:
        </h1>
        <div className="p-4 flex flex-wrap gap-4 justify-center">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500 ">No posts found</p>
          )}
          {loading && (
            <div className="flex justify-center items-center mx-auto h-96">
              <Spinner size="lg" />
              <div className="pl-3">loading...</div>
            </div>
          )}
          {
            !loading && posts && posts.map((post)=>(
                <PostCard key={post._id} post={post} />
            ))
          }
          {showMore && (
                  <button
                    className="w-full flex justify-center items-center text-teal-500 gap-2 text-sm py-7 hover:underline"
                    onClick={handleShowMore}
                  >
                    Show more
                  </button>
                )}
        </div>
      </div>
    </div>
  );
}
