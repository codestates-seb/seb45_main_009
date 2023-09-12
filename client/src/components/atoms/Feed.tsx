import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import globalAxios from "../../data/data";

interface UserData {
  profileimg: string;
  feedId: string;
  images: {
    imageId: number;
    imageUrl: string;
    imageTags: string[];
  }[];
  userInfo: string;
  relatedTags: string[];
  location: string;
}

interface FeedProps {
  selectedFilter: string[];
}

const Feed = ({ selectedFilter }: FeedProps) => {
  const [allData, setAllData] = useState<UserData[]>([]);
  const [allProfileData, setAllProfileData] = useState<UserData[]>([]);
  const [page, setPage] = useState(2);

  const [ref, inView] = useInView();

  const location = useLocation();
  const currentFeed =
    location.pathname === "/" ? "/feedformind" : "/feedformcor";
  const currentDetail =
    location.pathname === "/" ? "/feeddetailind" : "/feeddetailcor";
  const currentPage = location.pathname === "/" ? "/" : "/store";

  const getMainListData = async () => {
    try {
      const response = await globalAxios.get(currentPage);
      const getData = response.data;
      setAllData(getData);
      console.log("response MainList >>", getData);
    } catch (err) {
      console.log("Error >>", err);
    }
  };

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);
  const PAGE_SIZE = 4;
  const startIndex = (page - 1) * PAGE_SIZE;
  const chunkData = allData.slice(0, startIndex + PAGE_SIZE);

  const filteredData = chunkData.filter((user) => {
    const hasExerciseTag =
      selectedFilter.includes("운동전체") ||
      selectedFilter.some((filter) => user.relatedTags.includes(filter));
    const hasLocationTag =
      selectedFilter.includes("지역전체") ||
      selectedFilter.some((tag) => user.relatedTags.includes(tag));

    return hasExerciseTag && hasLocationTag;
  });
  console.log(selectedFilter, "여기랍니다");
  useEffect(() => {
    getMainListData();
  }, []);

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
          {filteredData.map((user, idx) => (
            <article key={idx} className="  mb-4 min-w-[250px]">
              <div className="flex mb-4">
                <img
                  src={user.profileimg}
                  alt={`ProfileImg of ${user.feedId}`}
                  className="rounded-full border mr-2 w-10 h-10"
                />
                <div className="ml-2">
                  <p>{user.feedId}</p>
                  <p className="text-gray-400">{user.userInfo}</p>
                </div>
              </div>
              <Link to={currentDetail}>
                <div>
                  <img
                    src={user.images[0].imageUrl}
                    alt={`FeedImg of ${user.feedId}`}
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
