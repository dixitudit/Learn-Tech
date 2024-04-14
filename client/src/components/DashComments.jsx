import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import {
  HiChevronDoubleDown,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(true);
  const [showMoreLoading, setShowMoreLoading] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [delIndex, setDelIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/comment/getcomments`);
        //get request do not require to add method in fetch
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
          setLoading(false);
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
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    setShowMoreLoading(true);
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments([...comments, ...data.comments]);
        if (data.comments.length < 9) {
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
  const handleDeleteComment = async () => {
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${toDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (res.ok) {
        setToDelete(null);
        //navigate works but refershes the entire page here we just want to refresh the DashPost component
        //navigate(0);
        setComments(comments.filter((item, i) => i !== delIndex));
        setDelIndex(null);
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log("failed to delete user try again later.");
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
                    <Table.HeadCell>Date Created</Table.HeadCell>
                    <Table.HeadCell>Comment content</Table.HeadCell>
                    <Table.HeadCell>Number of Likes</Table.HeadCell>
                    <Table.HeadCell>Post Id</Table.HeadCell>
                    <Table.HeadCell>User Id</Table.HeadCell>
                    <Table.HeadCell>Delete</Table.HeadCell>
                  </Table.Head>
                  {comments.map((comment, index) => (
                    <Table.Body className="divide-y" key={comment._id}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>
                          {new Date(comment.updatedAt).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell>
                          {comment.content}
                        </Table.Cell>
                        <Table.Cell className="font-semibold">{comment.numberOfLikes}</Table.Cell>
                        <Table.Cell>{comment.postId}</Table.Cell>
                        <Table.Cell>
                          {comment.userId}
                        </Table.Cell>
                        <Table.Cell
                          onClick={() => {
                            setShowModal(true);
                            setDelIndex(index);
                            setToDelete(comment._id);
                            
                          }}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          <span>Delete</span>
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
                          Are you sure you want to permanently DELETE this comment?
                        </h1>
                        <div className="flex justify-between gap-4 mt-5">
                          <Button
                            gradientMonochrome="failure"
                            pill
                            onClick={handleDeleteComment}
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
              <h1>You have no comments yet</h1>
            )}
          </div>
        </>
      )}
    </>
  );
}
