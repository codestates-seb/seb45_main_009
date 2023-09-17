// feedSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  feeds: [],
};

const allDataSlice = createSlice({
  name: "allData",
  initialState,
  reducers: {
    setData: (state, action) => {
      const { users, feeds } = action.payload;
      state.users = users;
      state.feeds = feeds;
    },
  },
});

export const { setData } = allDataSlice.actions;
export default allDataSlice.reducer;
