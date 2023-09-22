import { FeedState } from "../redux/reducers/feedSlice";

export interface UserInfo {
  userType: "USER" | "STORE" | "DEFAULT";
  userNickname: string;
  userId: number;
}

export interface RootState {
  login: {
    isAuthenticated: boolean;
    userInfo: UserInfo;
  };
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
  userId: number;
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
// export interface RootState {
//   login: {
//     isAuthenticated: boolean;
//     userInfo: UserInfo;
//   };
//   allData: AllDataState;
// }
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

export interface ResponseDataType {
  createdAt: string;
  feedId: number;
  userId: number;
  nickname: string;
  profileImageUrl: string;
  content: string;
  bio: string;
  relatedTags: string[];
  images: Array<{
    imageId: number;
    imageUrl: string;
    imageTags: any[];
  }>;
}
export interface CommentTypes {
  userId: number;
  feedCommentId: number;
  feedId: number;
  content: string;
  nickname: string;
  createdAt: string;
  modifiedAt: string;
  profileImageUrl: string;
}

export interface PageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// export interface CommentDataTypes {
//   feedCommentData: CommentTypes[];
//   pageInfo: PageInfo;
// }
