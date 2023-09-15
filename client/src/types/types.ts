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

export interface RootState {
  login: {
    isAuthenticated: boolean;
    userInfo: UserInfo;
  };
}

export interface ResponseDataType {
  feedId: number;
  userNickname: string;
  profileImageUrl: string;
  content: string;
  relatedTags: string[];
  images: Array<{
    imageId: number;
    imageUrl: string;
    imageTags: any[];
  }>;
}
