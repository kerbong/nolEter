import React, { useState } from "react";
import { storageService, dbService } from "../firebase";
import { v4 as uuidv4 } from "uuid";

const MessageForm = ({ user }) => {
  const [message, setMessage] = useState("");
  const [picture, setPicture] = useState();

  const onSubmit = async (event) => {
    event.preventDefault();
    let pictureUrl = "";
    if (picture) {
      const pictureRef = storageService.ref().child(`${user.uid}/${uuidv4()}`);
      const pictureUpload = await pictureRef.putString(picture, "data_url");
      pictureUrl = await pictureUpload.ref.getDownloadURL();
    }
    await dbService.collection("message").add({
      text: message,
      created_at: Date.now(),
      //   writer: user.email,
      writer_id: user.uid,
      pictureUrl: pictureUrl,
    });
    setMessage("");
    setPicture("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (event) => {
      const {
        target: { result },
      } = event;
      setPicture(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onPictureClick = () => {
    setPicture(null);
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        onChange={onChange}
        value={message}
        type="text"
        placeholder="지금 내 마음은...?"
        maxLength={120}
      />
      <input onChange={onFileChange} type="file" accept="image/*" />
      {picture && (
        <div>
          <img alt="" width="80px" height="80px" src={picture} />
          <button onClick={onPictureClick}>지우기</button>
        </div>
      )}

      <input type="submit" value="올려줘" />
    </form>
  );
};

export default MessageForm;
