// fetchData.js

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import globalAxios from "../../data/data";
import { setData } from "../../redux/reducers/allDataSlice"; // setData로 변경

const FetchData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await globalAxios.get("feed/search?keyword=");
        const data = response.data;

        dispatch(setData(data)); // 데이터를 한 번에 설정하도록 수정
      } catch (err) {}
    };

    fetchData();
  }, []);

  return null;
};

export default FetchData;
