import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import globalAxios from "../../data/data";
import { useDispatch, useSelector } from "react-redux";
import { RootStates, RootState } from "../../types/types";
import { setAllFeedDatas, setAllUserDatas, setAllFeedDataB } from "../../redux/reducers/feedSlice";
import noFeed from "../../assets/images/nofeed.png";

interface UserData {
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

interface FeedData {
  bio: string;
  feedId: number;
  nickname: string;
  profileImageUrl: string;
  content: string;
  userId: number;
  relatedTags: string[];
  images: {
    imageId: number;
    imageUrl: string;
    imageTags: string[];
  }[];
}

interface FeedProps {
  selectedFilter: string[];
}

const Feed = ({ selectedFilter }: FeedProps) => {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.login.userInfo);
  useEffect(() => console.log("userInfo:", userInfo), [userInfo]);
  const { filteredDatas } = useSelector((state: RootStates) => state.feed);
  const [allFeedData, setAllFeedData] = useState<FeedData[]>([]);
  const [allUserData, setAllUserData] = useState<UserData[]>([]);
  console.log(filteredDatas);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [ref, inView] = useInView();

  const dispatch = useDispatch();
  const location = useLocation();
  // const currentFeed = location.pathname === "/" ? "/feedformind" : "/feedformcor";
  const currentDetail = location.pathname === "/" ? "/feeddetailind" : "/feeddetailcor";
  const currentPage = location.pathname === "/" ? "/" : "/store";

  const PAGE_SIZE = 4; // 페이지당 데이터 개수

  const getMainListData = async () => {
    try {
      setLoading(true);

      // 서버에서 페이지네이션을 고려하여 데이터를 가져옴
      const response = await globalAxios.get(currentPage, {
        params: { page, pageSize: PAGE_SIZE },
      });
      const getData = response.data.feedList;

      if (getData.length === 0) {
        // 더 이상 데이터가 없는 경우
        setHasMore(false);
      } else {
        // 이전 데이터와 새로운 데이터 합치기
        const updatedFeedData = [...allFeedData, ...getData];
        setAllFeedData(updatedFeedData);
        setPage((prevPage) => prevPage + 1);

        dispatch(setAllFeedDataB(updatedFeedData));
      }

      setLoading(false);
    } catch (err) {
      console.log("Error >>", err);
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const response = await globalAxios.get("/users");
      const getData = response.data;
      console.log(getData, "getData");
      setAllUserData(getData);
      dispatch(setAllUserDatas(getData));
    } catch (err) {
      console.log("Error >>", err);
    }
  };

  const getAllDataOnce = async () => {
    try {
      const response = await globalAxios.get("/feed/search?keyword=");
      const getData = response.data.feeds;
      dispatch(setAllFeedDatas(getData));
    } catch (err) {
      console.log("Error >>", err);
    }
  };

  useEffect(() => {
    getAllDataOnce();
  }, []);

  useEffect(() => {
    if (inView && !loading && hasMore) {
      getMainListData();
      getUserData();
    }
  }, [inView, loading, hasMore]);

  const usethis = filteredDatas.length !== 0 ? filteredDatas : allFeedData;

  console.log("allFeedData", filteredDatas);
  const filteredData = usethis.filter((user) => {
    const hasExerciseTag =
      selectedFilter.includes("운동전체") || selectedFilter.some((filter) => user.relatedTags.includes(filter));
    const hasLocationTag =
      selectedFilter.includes("지역전체") || selectedFilter.some((tag) => user.relatedTags.includes(tag));

    if (selectedFilter.includes("운동전체") && selectedFilter.includes("지역전체")) {
      return true; // 운동전체와 지역전체가 선택된 경우 모든 데이터 표시
    } else if (selectedFilter.includes("운동전체") && hasLocationTag) {
      return true; // 운동전체만 선택하고 지역 필터에 해당하는 데이터 표시
    } else if (selectedFilter.includes("지역전체") && hasExerciseTag) {
      return true; // 지역전체만 선택하고 운동 필터에 해당하는 데이터 표시
    } else {
      // 지역태그와 운동태그를 각각 선택한 경우
      const selectedExerciseTags = selectedFilter.filter((tag) => tag !== "운동전체");
      const selectedLocationTags = selectedFilter.filter((tag) => tag !== "지역전체");
      const exerciseMatch = selectedExerciseTags.every((tag) => user.relatedTags.includes(tag));
      const locationMatch = selectedLocationTags.every((tag) => user.relatedTags.includes(tag));

      return exerciseMatch && locationMatch;
    }
  });

  const hasDataToDisplay = filteredData.length > 0;

  //피드 올리기 버튼
  const handletoFeedForm = () => {
    if (userInfo.userType === "DEFAULT") {
      alert("피드를 등록하기 위해서는 로그인이 필요합니다.");
      navigate("/login");
    } else if (userInfo.userType === "USER") {
      navigate("/feedformind");
    } else if (userInfo.userType === "STORE") {
      navigate("/feedformcor");
    }
  };
  console.log(filteredData, "filteredData");
  return (
    <section className="flex justify-center flex-col items-center ">
      <div>
        <div className="flex justify-center md:justify-end mr-4">
          <button
            onClick={handletoFeedForm}
            className="fixed bottom-0 md:static px-8 py-2 rounded-xl mb-5 bg-feedbtn-color hover:bg-feedbtnhover-color"
          >
            피드 올리기
          </button>
        </div>

        {hasDataToDisplay ? ( // Check if there is data to display
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-24">
            {filteredData.map((feed, idx) => {
              const user = allUserData.find((userData) => userData.nickname === feed.nickname);

              return (
                <article key={idx} className="mb-4 min-w-[250px]">
                  <div className="flex mb-4">
                    <Link to={`/profile/${user?.userId}`}>
                      <img
                        src={feed.profileImageUrl}
                        alt={`ProfileImg of ${feed.feedId}`}
                        className="rounded-full border mr-2 w-10 h-10"
                      />
                    </Link>
                    <div className="ml-2">
                      <p>{feed.nickname}</p>
                      {user?.bio ? (
                        <p className="text-gray-400 max-w-[200px] truncate">{user.bio}</p>
                      ) : (
                        <p className="text-gray-400 max-w-[200px] truncate">바이오 없다</p>
                      )}
                    </div>
                  </div>
                  <Link to={`${currentDetail}/${feed.feedId}`}>
                    <div>
                      <img
                        src={feed.images[0].imageUrl}
                        alt={`FeedImg of ${feed.feedId}`}
                        className="w-[13vw] h-[30vh] object-cover min-w-[250px] border"
                      />
                    </div>
                  </Link>
                </article>
              );
            })}
          </section>
        ) : (
          <img src={noFeed} alt="nofeedImg" />
        )}
      </div>

      <div ref={ref}></div>
    </section>
  );
};

export default Feed;
