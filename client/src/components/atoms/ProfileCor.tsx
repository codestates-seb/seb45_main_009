

  let userData = [
    {
      username: '버퍼짐 휘트니스',
      useremail: '@gmail.com',
      pw: '1234',
      userheight : 170,
      userweight : 60,
      userphoto : 'img.png'
    }
  ];

function ProfileCor() {
  return(
    <div>
        <div className="font-bold text-2xl">{userData[0].username}</div>
        <div className="flex space-x-4 font-bold text-gray-400 text-sm ">
        </div>
    </div>

  ) 
}

export default ProfileCor;