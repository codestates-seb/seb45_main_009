import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import globalAxios from "../../data/data";

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
  feedId: number;
  userNickname: string;
  profileImageUrl: string;
  content: string;
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
  const [allFeedData, setAllFeedData] = useState<FeedData[]>([]);
  const [allUserData, setAllUserData] = useState<UserData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [ref, inView] = useInView();

  const location = useLocation();
  const currentFeed =
    location.pathname === "/" ? "/feedformind" : "/feedformcor";
  const currentDetail =
    location.pathname === "/" ? "/feeddetailind" : "/feeddetailcor";
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

      console.log(getData);

      if (getData.length === 0) {
        // 더 이상 데이터가 없는 경우
        setHasMore(false);
      } else {
        // 이전 데이터와 새로운 데이터 합치기
        setAllFeedData((prevData) => [...prevData, ...getData]);
        setPage((prevPage) => prevPage + 1);
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
      setAllUserData(getData);
    } catch (err) {
      console.log("Error >>", err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (inView && !loading && hasMore) {
      getMainListData();
    }
  }, [inView, loading, hasMore]);

  return (
    <section className="flex justify-center flex-col items-center ">
      <div>
        <div className="flex justify-center md:justify-end mr-4">
          <Link
            to={currentFeed}
            className="fixed bottom-0 md:static px-8 py-2 rounded-xl mb-5 bg-feedbtn-color hover:bg-feedbtnhover-color"
          >
            피드 올리기
          </Link>
        </div>

        <section className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  mb-24">
          {allFeedData.map((feed, idx) => (
            <article key={idx} className="  mb-4 min-w-[250px]">
              <div className="flex mb-4">
                <img
                  src={feed.profileImageUrl}
                  alt={`ProfileImg of ${feed.feedId}`}
                  className="rounded-full border mr-2 w-10 h-10"
                />
                <div className="ml-2">
                  <p>{feed.userNickname}</p>
                  <p className="text-gray-400">{feed.content}</p>
                </div>
              </div>
              <Link to={`/feeddetailind/${feed.feedId}`}>
                <div>
                  <img
                    src={feed.images[0].imageUrl}
                    alt={`FeedImg of ${feed.feedId}`}
                    className="w-[13vw] h-[30vh] object-cover min-w-[250px] border"
                  />
                </div>
              </Link>
            </article>
          ))}
        </section>
      </div>

      <div ref={ref}></div>
    </section>
  );
};

export default Feed;
