import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import Cookies from 'js-cookie';

export default function IsCookiePresent() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const token = Cookies.get("isTokenPresent");
  useEffect(() => {
    if (!token && currentUser) {
      dispatch(signOut());
    }
  }, [token]);
}
