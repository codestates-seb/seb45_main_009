import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { login } from "../redux/reducers/loginSlice";
import { UserInfo } from "../types/types";

export function useUserSession() {
  console.log("useSession");
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
    const userInfoString = sessionStorage.getItem("user_info");

    if (accessToken && userInfoString) {
      axios.defaults.headers.common["Authorization"] = `${accessToken}`;

      try {
        const userInfo: UserInfo = JSON.parse(userInfoString);

        dispatch(login(userInfo));
      } catch (error) {
        console.error("Error decoding user info:", error);
      }
    }
  }, [dispatch]);
}
