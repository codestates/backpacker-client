import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "../css/UserInfo.scss";
function UserInfo() {
  let token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    const getData = async () => {
      await axios
        .get("https://localhost:4000/mypage/userInfo", {
          headers: {
            authorization: `bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          setUserData(res.data.userFind);
        });
    };
    getData();
  }, []);

  return (
    <>
      <div className="userInfoSection">
        <div className="userInfoCard">
          <div className="userInfoName">
            <span>이름</span>
            <div>{userData?.name}</div>
          </div>
          <div className="userInfoNickName">
            <span>닉네임</span>
            <div>{userData?.nickname}</div>
          </div>
          <div className="userInfoEmail">
            <span>이메일</span>
            <div>{userData?.email}</div>
          </div>
          <div className="userInfoPhone">
            <span>휴대폰 번호</span>
            <div>{userData?.phone}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
