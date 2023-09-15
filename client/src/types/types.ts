export interface UserInfo {
  userType: "USER" | "STORE";
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

export interface RootState {
  login: {
    isAuthenticated: boolean;
    userInfo: UserInfo;
  };
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
