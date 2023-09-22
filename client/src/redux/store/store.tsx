import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../reducers/loginSlice";
import feedSlice from "../reducers/feedSlice";
import allDataSlice from "../reducers/allDataSlice";

const store = configureStore({
  reducer: {
    login: loginSlice,
    feed: feedSlice,
    allData: allDataSlice,
  },
});

export default store;
