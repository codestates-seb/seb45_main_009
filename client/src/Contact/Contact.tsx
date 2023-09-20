import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { GrFormClose } from "react-icons/gr";
interface ContactProps {
  selectedName: string;
  members: {
    name: string;
    github: string;
    mail: string;
    serviceKey: string;
    templateKey: string;
    accountKey: string;
  }[];
  handleModalClose: () => void;
}

const Contact = ({ selectedName, members, handleModalClose }: ContactProps) => {
  const form = useRef<HTMLFormElement | null>(null);
  console.log(selectedName, "selectedEmail");
  const [done, setDone] = useState(false);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.current) {
      const selectedMember = members.find((member) => member.name === selectedName);
      if (selectedMember) {
        const { serviceKey, templateKey, accountKey } = selectedMember;

        emailjs
          .sendForm(serviceKey, templateKey, form.current, accountKey)

          .then(
            (result) => {
              console.log(result.text);
              setDone(true);
              if (form.current) {
                form.current.reset();
              }
            },
            (error) => {
              console.log(error.text);
            }
          );
      }
    }
    console.log(form.current);
  };

  return (
    <div className="flex p-8 max-mobile:p-6 relative">
      <div onClick={handleModalClose}>
        <GrFormClose className="absolute top-2 right-2 h-6 w-6 hover:cursor-pointer"></GrFormClose>
      </div>
      <div className="flex-1 flex justify-center relative">
        <form ref={form} className="flex flex-col gap-4 items-center" onSubmit={sendEmail}>
          <div className="flex flex-col gap-1">
            <label htmlFor="user_name" className="text-lg font-bold text-gray-800">
              이름
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              className="w-64 h-8 p-1 outline-none border-2 border-orange-500 rounded-lg text-base"
              placeholder="이름"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="user_email" className="text-lg font-bold text-gray-800">
              이메일
            </label>
            <input
              type="email"
              id="user_email"
              name="user_email"
              className="w-64 h-8 p-1 outline-none border-2 border-orange-500 rounded-lg text-base"
              placeholder="이메일"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="message" className="text-lg font-bold text-gray-800">
              메시지
            </label>
            <textarea
              id="message"
              name="message"
              className="w-64 h-64 p-1 outline-none border-2 border-orange-500 rounded-lg text-base mb-2"
              placeholder="메시지"
            />
          </div>
          <input
            type="submit"
            value="보내기"
            className="w-64 h-8 bg-blue-500 text-white rounded-lg text-base hover:cursor-pointer"
          />
          {done && <span className="text-sm">문의해 주셔서 감사합니다!</span>}
        </form>
      </div>
    </div>
  );
};

export default Contact;
