// import React from 'react';
import { Button, Navbar, TextInput } from "flowbite-react";
import "./Header.css";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
const Header = () => {
    const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-sm font-semibold dark:text-white"
      >
        <span className="px-2 py-1 rounded-lg grad">Learn</span>
        Tech
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          className="hidden lg:inline"
          rightIcon={AiOutlineSearch}
        />
      </form>
      <Button className="w-10 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch className="mt-[2px]" />
      </Button>
      <div className="flex gap-2 md:order-10">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
        <Link to={"/sign-in"}>
          <Button gradientDuoTone={"purpleToBlue"}>Sign In</Button>
        </Link>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link to={"/"}>
          <Navbar.Link active={path==='/'} as={'div'}>Home</Navbar.Link>
        </Link>
        <Link to={"/about"}>
          <Navbar.Link active={path==='/about'} as={'div'}>About</Navbar.Link>
        </Link>
        <Link to={"/projects"}>
          <Navbar.Link active={path==='/projects'} as={'div'}>Projects</Navbar.Link>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
