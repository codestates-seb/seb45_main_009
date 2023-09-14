import { createSlice } from "@reduxjs/toolkit";
import { FeedData, UserData } from "../../types/types";

export type FeedState = {
  allFeedDatas: FeedData[];
  allFeedDataB: FeedData[];
  allUserData: UserData[];
  page: number;
  loading: boolean;
  hasMore: boolean;
  filteredDatas: FeedData[];
};

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    allFeedDatas: [] as FeedData[],
    allFeedDataB: [] as FeedData[],
    allUserData: [] as UserData[],
    page: 1,
    loading: false,
    hasMore: true,
    filteredDatas: [] as FeedData[],
  },
  reducers: {
    setAllFeedDatas: (state, action) => {
      state.allFeedDatas = [...state.allFeedDatas, ...action.payload];
    },

    setAllFeedDataB: (state, action) => {
      state.allFeedDataB = [...state.allFeedDataB, ...action.payload];
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
  setAllFeedDatas,
  setAllFeedDataB,
  setAllUserData,
  setPage,
  setLoading,
  setHasMore,
  setFilteredData,
} = feedSlice.actions;

export default feedSlice.reducer;
