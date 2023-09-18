import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiFillGithub } from "react-icons/ai";
import { LuMail } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import Contact from "../../Contact/Contact";

const members = [
  {
    name: "손승범",
    github: "https://github.com/Beomda",
    mail: "ssb1pro@gmail.com",
  },
  {
    name: "민은영",
    github: "https://github.com/minkawoo",
    mail: "minkawoo@gmail.com",
  },
  {
    name: "김소연",
    github: "https://github.com/bonbon0808",
    mail: "d0624576@gmail.com",
  },
  {
    name: "염동훈",
    github: "https://github.com/donghoonyeom",
    mail: "dua541541@gmail.com",
  },
  {
    name: "함재형",
    github: "https://github.com/hamjaehyeong",
    mail: "ham6729@gmail.com",
  },
  { name: "이세은", github: "https://github.com/lse0522", mail: "이메일주소1" },
  {
    name: "박태영",
    github: "https://github.com/TaeYoungPar",
    mail: "dhfak1@gmail.com",
  },
];

function Footer() {
  const location = useLocation();
  const [isContactVisible, setContactVisible] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string>("");

  if (location.pathname === "/oauthloading") {
    return null;
  }

  // Function to toggle the visibility of the Contact component
  const toggleContact = (email: string) => {
    setContactVisible(!isContactVisible);
    setSelectedEmail(email);
  };

  // Function to close the modal when clicking outside the modal content
  const closeOnOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.classList.contains("modal-overlay")) {
      setContactVisible(false);
    }
  };

  return (
    <footer className="flex justify-center items-center bg-slate-200 min-h-[80px]">
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
            <div className="flex justify-between">
              <Link to={member.github}>
                <AiFillGithub size={15} />
              </Link>
              <LuMail
                size={15}
                onClick={() => toggleContact(member.name)}
                className="hover:cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
      {/* Render the Contact component as a modal */}
      {isContactVisible && (
        <div
          className="modal-overlay fixed inset-0 flex items-center justify-center z-50 opacity-95 "
          onClick={closeOnOutsideClick}
        >
          <div className="modal p-8 rounded-lg shadow-lg bg-white">
            <Contact selectedEmail={selectedEmail} />
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
