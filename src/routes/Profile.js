import React, { useEffect, useState } from "react";
import { authService, dbService } from "../firebase";
import { useHistory } from "react-router-dom";
import Message from "../components/Message";

const Profile = ({ refreshUser, user }) => {
  const [messages, setMessages] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(
    user.displayName ? user.displayName : ""
  );

  let history = useHistory();

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const getMyMessages = async (user) => {
    const myMessages = await dbService
      .collection("message")
      .where("writer_id", "==", user.uid)
      .orderBy("created_at")
      .get();
    setMessages(myMessages.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    getMyMessages();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    // 유저 프로필 디스플레이 네임 업데이트 추가하기
    if (user.displayName !== newDisplayName) {
      await user.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  return (
    <div className="container">
      <div style={{ marginBottom: "20px" }}>
        {user.displayName ? user.displayName : user.email}님 닉네임
        변경하실래요?
      </div>
      <form onSubmit={onSubmit} className="profileForm">
        <input
          value={newDisplayName}
          onChange={onChange}
          type="text"
          autoFocus
          className="formInput"
          placeholder="닉네임을 입력해주세요."
        />
        <input
          type="submit"
          value="업데이트"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      {messages.map((message) => (
        <Message key={message.id} message={message} isOwner={true} />
      ))}
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
