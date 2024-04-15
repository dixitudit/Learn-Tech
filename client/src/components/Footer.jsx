// import React from 'react'
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
const FooterComponent = () => {
  return (
    <div>
      <Footer className="border border-t-8 border-teal-500" container>
        <div className="w-full mx-auto">
          <div className="sm:grid sm:grid-cols-2">
            <div className="mt-5">
              <Link
                to={"/"}
                className="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
              >
                <span className="px-2 py-1 text-xl rounded-lg grad">Learn</span>
                Tech
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3 sm:gap-10">
              <div className="mt-5">
                <Footer.Title title="Quick Links" />
                <Footer.LinkGroup col>
                  <Footer.Link href="/about">About</Footer.Link>
                  <Footer.Link href="https://github.com/dixitudit?tab=repositories">Projects</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div className="mt-5">
                <Footer.Title title="Connect" />
                <Footer.LinkGroup col>
                  <Footer.Link href="https://www.linkedin.com/in/uditndixit/">Linkedin</Footer.Link>
                  <Footer.Link href="https://github.com/dixitudit/">Github</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div className="mt-5">
                <Footer.Title title="Legal" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">Privacy Policy</Footer.Link>
                  <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
                </Footer.LinkGroup>
              </div>
            </div>
          </div>
          <Footer.Divider/>
          <div className="">
            <Footer.Copyright href="#" by="LearnTech by Udit Narayan Dixit" year={new Date().getFullYear()}/>
          </div>
        </div>
      </Footer>
    </div>
  );
};

export default FooterComponent;
