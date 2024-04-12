import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import {
  HiChevronDoubleDown,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(true);
  const [showMoreLoading, setShowMoreLoading] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [delIndex, setDelIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/user/getusers/${currentUser._id}`);
        //get request do not require to add method in fetch
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
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
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    setShowMoreLoading(true);
    try {
      const res = await fetch(
        `/api/user/getusers/${currentUser._id}?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUsers([...users, ...data.users]);
        if (data.users.length < 9) {
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
  const handleDeleteUser = async () => {
    try {
      const res = await fetch(
        `/api/user/deleteuser/${toDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (res.ok) {
        setToDelete(null);
        //navigate works but refershes the entire page here we just want to refresh the DashPost component
        //navigate(0);
        setUsers(users.filter((item, i) => i !== delIndex));
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
                    <Table.HeadCell>User Image</Table.HeadCell>
                    <Table.HeadCell>Username</Table.HeadCell>
                    <Table.HeadCell>Email</Table.HeadCell>
                    <Table.HeadCell>Admin</Table.HeadCell>
                    <Table.HeadCell>Delete</Table.HeadCell>
                  </Table.Head>
                  {users.map((user, index) => (
                    <Table.Body className="divide-y" key={user._id}>
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell>
                          <img
                            src={user.profilePic}
                            alt={user.username}
                            className="w-10 h-10 object-cover bg-gray-500 rounded-full mx-auto"
                          />
                        </Table.Cell>
                        <Table.Cell className="font-semibold">{user.username}</Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>
                          {user.isAdmin ? (
                            <GiCheckMark className="mx-auto text-green-600"/>
                          ) : (
                            <RxCross2 className="text-lg mx-auto text-red-500" />
                          )}
                        </Table.Cell>
                        <Table.Cell
                          onClick={() => {
                            setShowModal(true);
                            setDelIndex(index);
                            setToDelete(user._id);
                            
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
                          Are you sure you want to permanently DELETE this user?
                        </h1>
                        <div className="flex justify-between gap-4 mt-5">
                          <Button
                            gradientMonochrome="failure"
                            pill
                            onClick={handleDeleteUser}
                            disabled={users[delIndex].isAdmin}
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
              <h1>You have no users yet</h1>
            )}
          </div>
        </>
      )}
    </>
  );
}
