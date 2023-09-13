// store.js
import { createSlice } from "@reduxjs/toolkit";
import { FeedData, UserData } from "../../types/types";

export type FeedState = {
  allFeedData: FeedData[];
  allUserData: UserData[];
  page: number;
  loading: boolean;
  hasMore: boolean;
  filteredDatas: FeedData[]; // filteredData 필드 추가
};

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    allFeedData: [] as FeedData[],
    allUserData: [] as UserData[],
    page: 1,
    loading: false,
    hasMore: true,
    filteredDatas: [] as FeedData[], // 초기 상태에서 빈 배열로 설정
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
      state.filteredDatas = action.payload; // filteredData를 설정하는 액션 추가
    },
  },
});

export const {
  setAllFeedData,
  setAllUserData,
  setPage,
  setLoading,
  setHasMore,
  setFilteredData, // 새로 추가한 액션을 내보내줍니다.
} = feedSlice.actions;

export default feedSlice.reducer;
