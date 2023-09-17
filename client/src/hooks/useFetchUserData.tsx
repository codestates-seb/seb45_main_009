// useFetchUserData.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAllUserDatas } from "../redux/reducers/feedSlice";
import globalAxios from "../data/data";

const useFetchUserData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const response = await globalAxios.get("/users");
      const data = response.data;
      dispatch(setAllUserDatas(data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return fetchData;
};

export default useFetchUserData;
