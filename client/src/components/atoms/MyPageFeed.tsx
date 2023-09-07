import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface UserData {
  proFileImg: string;
  userId: string;
  feedImg: string;
  userInfo: string;
  tags: string;
  location: string;
}

const MyPageFeed = () => {
  const tempDataString = localStorage.getItem("tempData");
  const tempData = tempDataString ? JSON.parse(tempDataString) : [];

  const [page, setPage] = useState(3);

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);
  const PAGE_SIZE = 4;
  const startIndex = (page - 1) * PAGE_SIZE;
  const chunkData = tempData.slice(0, startIndex + PAGE_SIZE);

  const IntroductionCss =
    " border border-gray-400 rounded-xl  p-10 h-full min-h-[200px] m-8";

  const MainBodyCss = " flex justify-center mt-10 ";
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // 윈도우 크기가 변경될 때 실행
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  return (
    <section>
      <div
        className={`flex w-max-xl ${
          windowWidth < 768 ? "flex-col" : "flex-row"
        }  ${MainBodyCss} `}
      >
        <aside
          className={` ${
            windowWidth < 768 ? "" : " sticky top-24"
          } md:${IntroductionCss}`}
        >
          <div className="flex items-center flex-col mb-10">
            <img
              src={tempData[8].proFileImg}
              alt="myimg"
              className="mb-5 w-[10vw] border rounded-full "
            />
            <div className="font-bold text-xl">{tempData[8].userId}</div>
          </div>
          <div className="text-gray-500 flex flex-col">
            <div className="mb-5">
              키<div>20cm</div>
            </div>
            <div className="mb-5">
              몸무게
              <div>3kg</div>
            </div>
            <div className="mb-5">
              자기소개
              <div className="max-w-[200]">안녕하세요</div>
            </div>
          </div>
        </aside>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-full mb-24">
          {chunkData.map((user: UserData, idx: number) => (
            <article key={idx} className="flex justify-center items-center">
              <img
                src={user.feedImg}
                alt={`ProfileImg of ${user.userId}`}
                className="w-[80vw] h-[80vw] object-cover md:w-[25vw] md:h-[25vw] lg:w-[15vw] lg:h-[15vw]"
              ></img>
            </article>
          ))}
        </section>
      </div>
      <div ref={ref}></div>
    </section>
  );
};

export default MyPageFeed;
