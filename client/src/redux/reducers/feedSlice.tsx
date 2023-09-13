import { createSlice } from "@reduxjs/toolkit";
import { FeedData, UserData } from "../../types/types";

export type FeedState = {
  allFeedData: FeedData[];
  allUserData: UserData[];
  page: number;
  loading: boolean;
  hasMore: boolean;
  filteredDatas: FeedData[];
};

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    allFeedData: [] as FeedData[],
    allUserData: [] as UserData[],
    page: 1,
    loading: false,
    hasMore: true,
    filteredDatas: [] as FeedData[],
  },
  reducers: {
    setAllFeedData: (state, action) => {
      state.allFeedData = [...state.allFeedData, ...action.payload];
    },
    setAllUserData: (state, action) => {
      state.allUserData = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setFilteredData: (state, action) => {
      state.filteredDatas = action.payload;
    },
  },
});

export const {
  setAllFeedData,
  setAllUserData,
  setPage,
  setLoading,
  setHasMore,
  setFilteredData,
} = feedSlice.actions;

export default feedSlice.reducer;
