import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("All fields are required"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data.user));
        navigate("/");
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };
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
              applications. Unlock the power of Tech, Sign In Now
            </p>
          </div>
          {/* right */}
          <div className="md:w-[30%]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Label value="Your Email" />
                <TextInput
                  type="email"
                  placeholder="example@company.com"
                  id="email"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="Your Password" />
                <TextInput
                  type="password"
                  placeholder="********"
                  id="password"
                  onChange={handleChange}
                />
              </div>
              <Button
                gradientDuoTone="purpleToBlue"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3 text-sm font-semibold">
                      Loading...
                    </span>
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <OAuth />
            </form>
            <div className="flex p-2 text-sm gap-1">
              <p>Don&apos;t have an account?</p>
              <Link to={"/sign-up"} className="text-sky-700">
                Sign up
              </Link>
            </div>
            {error && (
              <Alert className="mt-5" color="failure">
                {error}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
