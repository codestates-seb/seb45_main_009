import { useEffect, useState } from "react";
import profileImg from "../assets/images/profileDefault.png";

function DmPage() {
  const [dmData, setDmData] = useState<DmData[]>([]);
  useEffect(() => setDmData(mock), []);
  useEffect(() => console.log(dmData), [dmData]);

  return (
    <div className="flex  justify-center items-center w-screen mt-10">
      <div className="flex flex-col w-[320px] border rounded-md">
        <div className="flex w-full h-[80px] border-b">리스트</div>
        <div className="flex flex-col w-full h-[420px] ">
          <ul className="h-[320px]">
            출력
            {dmData.map((data) => (
              <li key={data.messageId} className=""></li>
            ))}
          </ul>
          <div className="h-[100px]">입력</div>
        </div>
      </div>
    </div>
  );
}

export default DmPage;

interface DmData {
  userId: number;
  userNickname: string;
  messageId: number;
  content: string;
  createdAt: string;
}

const mock: DmData[] = [
  {
    userId: 1,
    userNickname: "Alice",
    messageId: 1001,
    content: "Hello, how are you?",
    createdAt: "2023-09-20T10:00:00Z",
  },
  {
    userId: 2,
    userNickname: "Bob",
    messageId: 1002,
    content: "I'm good, thanks! And you?",
    createdAt: "2023-09-20T10:05:00Z",
  },
  {
    userId: 1,
    userNickname: "Alice",
    messageId: 1003,
    content: "I'm doing great! Thanks for asking.",
    createdAt: "2023-09-20T10:07:00Z",
  },
  {
    userId: 2,
    userNickname: "Bob",
    messageId: 1004,
    content: "Good to hear! Are you free this weekend?",
    createdAt: "2023-09-20T10:10:00Z",
  },
  {
    userId: 1,
    userNickname: "Alice",
    messageId: 1005,
    content: "Yes, I am. Let's meet up!",
    createdAt: "2023-09-20T10:15:00Z",
  },
  {
    userId: 2,
    userNickname: "Bob",
    messageId: 1006,
    content: "Sounds great! How about Saturday?",
    createdAt: "2023-09-20T10:20:00Z",
  },
  {
    userId: 1,
    userNickname: "Alice",
    messageId: 1007,
    content: "Saturday works for me.",
    createdAt: "2023-09-20T10:25:00Z",
  },
  {
    userId: 2,
    userNickname: "Bob",
    messageId: 1008,
    content: "Perfect. Let's meet at 3 pm.",
    createdAt: "2023-09-20T10:30:00Z",
  },
  {
    userId: 1,
    userNickname: "Alice",
    messageId: 1009,
    content: "3 pm is perfect. See you then!",
    createdAt: "2023-09-20T10:35:00Z",
  },
  {
    userId: 2,
    userNickname: "Bob",
    messageId: 1010,
    content: "See you! Looking forward to it.",
    createdAt: "2023-09-20T10:40:00Z",
  },
];
