import { FeedState } from "../redux/reducers/feedSlice";

export interface UserInfo {
  userType: "USER" | "STORE";
  userNickname: string;
  userId: number;
}
export interface ImageData {
  file: File | null;
  src: string;
  tags: TagData[];
}

export interface TagData {
  x: number;
  y: number;
  data?: { name: string; price: string; info: string };
}

export interface FetcedImageData {
  imageId: number;
  src: string;
}

export interface FeedData {
  bio: string;
  feedId: number;
  nickname: string;
  profileImageUrl: string;
  content: string;
  relatedTags: string[];
  images: {
    imageId: number;
    imageUrl: string;
    imageTags: string[];
  }[];
}

export interface UserData {
  bio: string;
  createdAt: string;
  email: string;
  height: number;
  location: string;
  modifiedAt: string;
  nickname: string;
  price: number | string;
  profileimg: string;
  roles: string[];
  sport: string;
  userId: number;
  weight: number;
}
export interface RootState {
  login: {
    isAuthenticated: boolean;
    userInfo: UserInfo;
  };
  allData: AllDataState;
}
export interface RootStates {
  feed: FeedState;
}

export interface User {
  bio: string;
  createdAt: string;
  email: string;
  height: number;
  location: string;
  modifiedAt: string;
  nickname: string;
  price: number | string;
  profileimg: string;
  roles: string[];
  userId: number;
  weight: number;
}

export interface Feed {
  bio: string;
  feedId: number;
  nickname: string;
  profileImageUrl: string;
  content: string;
  relatedTags: string[];
  images: {
    imageId: number;
    imageUrl: string;
    imageTags: string[];
  }[];
}

export interface AllDataState {
  users: User[];
  feeds: Feed[];
}
