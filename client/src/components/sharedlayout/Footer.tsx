import React from "react";
import { Link } from "react-router-dom";

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
  return (
    <div className="flex justify-center items-center  bg-slate-200">
      <Link to={"/"}>
        <div className=" mr-44 hover:cursor-pointer">
          <img src="/asset/fitfolio.png" alt="logo" />
        </div>
      </Link>
      <div className="flex justify-center">
        {members.map((member, index) => (
          <div key={index} className="mx-9">
            <p>{member.name}</p>
            <div className="flex">
              <img className="mr-2" src="asset/github.png" alt="githubimg" />
              <img src="asset/mail.png" alt="mailimg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Footer;
