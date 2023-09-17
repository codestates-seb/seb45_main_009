import { createSlice } from "@reduxjs/toolkit";
import { FeedData, UserData } from "../../types/types";

export type FeedState = {
  allFeedDatas: FeedData[];
  allFeedDataB: FeedData[];
  allUserDatas: UserData[];
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
    allUserDatas: [] as UserData[],
    page: 1,
    loading: false,
    hasMore: true,
    filteredDatas: [] as FeedData[],
  },
  reducers: {
    setAllFeedDatas: (state, action) => {
      state.allFeedDatas = action.payload;
    },

    setAllFeedDataB: (state, action) => {
      state.allFeedDataB = action.payload;
    },
    setAllUserDatas: (state, action) => {
      state.allUserDatas = action.payload;
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
  setAllUserDatas,
  setPage,
  setLoading,
  setHasMore,
  setFilteredData,
} = feedSlice.actions;

export default feedSlice.reducer;
