import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiChevronDoubleDown,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

export default function DashPosts() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(true);
  const [showMoreLoading, setShowMoreLoading] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [delIndex, setDelIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        //get request do not require to add method in fetch
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
          setLoading(false);
          //console.log(userPosts);
        } else {
          setLoading(false);
          console.log(data.message);
        }
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    setShowMoreLoading(true);
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts([...userPosts, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
        setShowMoreLoading(false);
      } else {
        setShowMoreLoading(false);
        console.log(data.message);
      }
    } catch (err) {
      setShowMoreLoading(false);
      console.log(err.message);
    }
  };
  const handleDeletePost = async () => {
    try {
      const res = await fetch(
        `/api/post/delete/${toDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (res.ok) {
        setToDelete(null);
        //navigate works but refershes the entire page here we just want to refresh the DashPost component
        //navigate(0);
        setUserPosts(userPosts.filter((item, i) => i !== delIndex));
        setDelIndex(null);
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log("failed to delete post try again later.");
    }
  };

  return (
    <>
      {loading ? (
        <>
          <div className="flex justify-center items-center mx-auto h-96">
            <Spinner size="lg" />
            <div className="pl-3">loading...</div>
          </div>
        </>
      ) : (
        <>
          <div className="table-auto w-full overflow-x-scroll sm:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500  ">
            {currentUser.isAdmin ? (
              <>
                <Table hoverable className="shadow-md">
                  <Table.Head>
                    <Table.HeadCell>Date updated</Table.HeadCell>
                    <Table.HeadCell>Post image</Table.HeadCell>
                    <Table.HeadCell>Title</Table.HeadCell>
                    <Table.HeadCell>Category</Table.HeadCell>
                    <Table.HeadCell>Delete</Table.HeadCell>
                    <Table.HeadCell>
                      <span>Edit</span>
                    </Table.HeadCell>
                  </Table.Head>
                  {userPosts.map((post, index) => (
                    <Table.Body className="divide-y" key={post._id}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>
                          {new Date(post.updatedAt).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell>
                          <Link to={`/post/${post.slug}`}>
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-20 h-10 object-cover bg-gray-500"
                            />
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          <Link
                            className="font-medium text-gray-900 dark:text-white"
                            to={`/post/${post.slug}`}
                          >
                            {post.title}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>{post.category}</Table.Cell>
                        <Table.Cell
                          onClick={() => {
                            setShowModal(true);
                            setDelIndex(index);
                            setToDelete(post._id);
                          }}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          <span>Delete</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Link
                            className="text-teal-500 cursor-pointer"
                            to={`/update-post/${post._id}`}
                          >
                            <span>Edit</span>
                          </Link>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
                {showMore && (
                  <button
                    className="w-full flex justify-center items-center text-teal-500 gap-2 text-sm py-7 hover:underline"
                    onClick={handleShowMore}
                  >
                    {showMoreLoading ? (
                      <Spinner size="md" />
                    ) : (
                      <HiChevronDoubleDown />
                    )}
                    Show more
                  </button>
                )}
                {showModal && (
                  <Modal
                    show={showModal}
                    popup
                    size={"md"}
                    onClose={() => setShowModal(false)}
                  >
                    <Modal.Header />
                    <Modal.Body>
                      <div className="p-5">
                        <h1 className="text-xl font-semibold text-center text-gray-600">
                          <HiOutlineExclamationCircle className="text-red-500 text-5xl mx-auto" />
                          Are you sure you want to permanently DELETE this post?
                        </h1>
                        <div className="flex justify-between gap-4 mt-5">
                          <Button
                            gradientMonochrome="failure"
                            pill
                            onClick={handleDeletePost}
                          >
                            Yes, I'm sure
                          </Button>
                          <Button
                            gradientDuoTone="purpleToBlue"
                            pill
                            onClick={() => setShowModal(false)}
                          >
                            No, Cancel
                          </Button>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                )}
              </>
            ) : (
              <h1>You have no posts yet</h1>
            )}
          </div>
        </>
      )}
    </>
  );
}
