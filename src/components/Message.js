import React, { useState } from "react";
import { dbService, storageService } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Message = ({ message, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(message.message);

  const onDeleteClick = async () => {
    const ok = window.confirm("메세지를 삭제할까요?");
    if (ok) {
      await dbService.doc(`message/${message.id}`).delete();
      await storageService.refFromURL(message.pictureUrl).delete();
    }
  };
  const onEditClick = () => {
    setEditing((prev) => !prev);
  };
  const onUpdateClick = (event) => {
    event.preventDefault();
    dbService.doc(`message/${message.id}`).update({ text: editMessage });
    setEditing((prev) => !prev);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setEditMessage(value);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onUpdateClick} className="container nweetEdit">
            <br></br>
            <input onChange={onChange} type="text" placeholder={message.text} />
            <input type="submit" value="Update" className="formBtn" />
          </form>
          <span onClick={onEditClick} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <div>
          {message.pictureUrl ? (
            <div style={{ marginLeft: "60px", marginTop: "15px" }}>
              <h4>{message.text}</h4>
            </div>
          ) : (
            <h4>{message.text}</h4>
          )}
          <br />

          {message.pictureUrl && <img alt="" src={message.pictureUrl} />}

          <br />
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={onEditClick}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
          <br />
        </div>
      )}
    </div>
  );
};

export default Message;
