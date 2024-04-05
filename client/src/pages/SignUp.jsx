import { Link } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
const SignUp = () => {
  return (
    <>
      <div className=" max-md:flex max-md:flex-col max-md:mx-auto min-h-screen mt-20  max-md:w-[60%]">
        <div className="md:flex md:items-center gap-6 space-y-6 p-3 w-full justify-center">
          {/* left */}
          <div className="md:w-[30%]">
            <Link to={"/"} className=" text-4xl font-bold dark:text-white">
              <span className="px-2 py-1 text-4xl rounded-lg grad">Learn</span>
              Tech
            </Link>
            <p className="text-sm mt-5">
              This website will help you learn new technologies to build web
              applications. Unlock the power of Tech, Sign Up Now
            </p>
          </div>
          {/* right */}
          <div className="md:w-[30%]">
            <form className="flex flex-col gap-4">
              <div>
                <Label value="Your Username" />
                <TextInput type="text" placeholder="Username" id="username" />
              </div>
              <div>
                <Label value="Your Email" />
                <TextInput type="text" placeholder="example@company.com" id="email" />
              </div>
              <div>
                <Label value="Your Password" />
                <TextInput type="text" placeholder="Password" id="password" />
              </div>
              <Button gradientDuoTone='purpleToBlue' type="submit">
                Sign Up
              </Button>
            </form>
            <div className="flex text-sm gap-1">
              <p>
                Already have an account?
              </p>
              <Link to={'/sign-in'} className="text-sky-700">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
      <div>hello</div>
    </>
  );
};

export default SignUp;
