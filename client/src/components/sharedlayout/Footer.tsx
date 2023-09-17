import React from "react";
import { Link } from "react-router-dom";
import { AiFillGithub } from "react-icons/ai";
import { LuMail } from "react-icons/lu";
import { useLocation } from "react-router-dom";

const members = [
  { name: "손승범", github: "깃허브링크1", mail: "이메일주소1" },
  { name: "민은영", github: "깃허브링크1", mail: "이메일주소1" },
  { name: "김소연", github: "깃허브링크1", mail: "이메일주소1" },
  { name: "염동훈", github: "깃허브링크1", mail: "이메일주소1" },
  { name: "함재형", github: "깃허브링크1", mail: "이메일주소1" },
  { name: "이세은", github: "깃허브링크1", mail: "이메일주소1" },
  { name: "박태영", github: "깃허브링크1", mail: "이메일주소1" },
];

function Footer() {
  //oauthloading에서 제외
  const location = useLocation();
  if (location.pathname === "/oauthloading") {
    return null;
  }

  return (
    <footer className="flex justify-center items-center  bg-slate-200  min-h-[80px] ">
      <Link to={"/"}>
        <div className="hover:cursor-pointer md:mr-4">
          <img src="/asset/fitfolio.svg" alt="logo" />
        </div>
      </Link>
      <div className="flex justify-center text-lg">
        {members.map((member, index) => (
          <div
            key={index}
            className="text-[0.5rem] mr-1 font-bold sm:mr-2 sm:text-sm md:mr-4 md:text-base lg:mr-8 lg:text-lg"
          >
            <p className="">{member.name}</p>
            <div className="flex justify-between ">
              <AiFillGithub size={15} />
              <LuMail size={15} />
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
