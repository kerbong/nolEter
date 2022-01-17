import React, { useState } from "react";
import { dbService, storageService } from "../firebase";

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
    <>
      {editing ? (
        <>
          <br></br>
          <input onChange={onChange} type="text" placeholder={message.text} />
          <input type="submit" value="Update" onClick={onUpdateClick} />
          <button onClick={onEditClick}>Cancel</button>
        </>
      ) : (
        <div>
          <br />
          {message.pictureUrl && (
            <img alt="" src={message.pictureUrl} height="50px" width="50px" />
          )}
          <span>{message.text}</span>
          <span> by {message.writer}</span>
          <br />
          {isOwner && (
            <>
              <button onClick={onEditClick}>✒ Edit</button>
              <button onClick={onDeleteClick}>❌ Delete</button>
            </>
          )}
          <br />
        </div>
      )}
    </>
  );
};

export default Message;
