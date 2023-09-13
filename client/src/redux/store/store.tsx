import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../reducers/loginSlice";
import filterSlice from "../reducers/feedSlice";

const store = configureStore({
  reducer: {
    login: loginSlice,
    feed: filterSlice,
  },
});

export default store;
