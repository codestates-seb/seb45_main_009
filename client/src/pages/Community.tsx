import React from "react";
import under from "../assets/images/under.png";

const Community = () => {
  return (
    <div className="flex justify-center items-center flex-col    ">
      <img src={under} alt="under construction" className="w-1/4" />
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="/"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Go back home
        </a>
      </div>
    </div>
  );
};

export default Community;
