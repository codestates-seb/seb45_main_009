import { useEffect, useState } from "react";
import { login } from "../redux/reducers/loginSlice";
import { UserInfo, RootState } from "../types/types";
import { useSelector, useDispatch } from "react-redux";

function useUserSession() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: RootState) => state.login.isAuthenticated);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
    const userInfoString = sessionStorage.getItem("user_info");

    if (accessToken && userInfoString) {
      try {
        const userInfo: UserInfo = JSON.parse(userInfoString);
        dispatch(login(userInfo));
      } catch (error) {
        console.error("Error decoding user info:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return isLoading;
}
export default useUserSession;
