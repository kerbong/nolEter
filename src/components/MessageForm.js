import React, { useState } from "react";
import { storageService, dbService } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const MessageForm = ({ user }) => {
  const [message, setMessage] = useState("");
  const [picture, setPicture] = useState();

  const onSubmit = async (event) => {
    if (message === "") {
      return;
    }
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
    setPicture("");
  };

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          onChange={onChange}
          value={message}
          type="text"
          placeholder="지금 내가 하고 싶은 말은...?"
          maxLength={120}
          autoFocus
          style={{ marginLeft: "30px", color: "gray" }}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        onChange={onFileChange}
        type="file"
        accept="image/*"
        style={{
          opacity: 0,
        }}
      />
      {picture && (
        <div className="factoryForm__attachment">
          <img
            alt=""
            src={picture}
            style={{
              backgroundImage: picture,
            }}
          />
          <div className="factoryForm__clear" onClick={onPictureClick}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default MessageForm;
