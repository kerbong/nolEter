import React, { useEffect, useState } from "react";
import { dbService } from "../firebase";
import Message from "../components/Message";
import MessageForm from "../components/MessageForm";

const Home = ({ user }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    dbService.collection("message").onSnapshot((snapshot) => {
      const gotMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(gotMessages);
    });
  }, []);

  return (
    <div className="container">
      <MessageForm user={user} />
      <div style={{ marginTop: 30 }}>
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            isOwner={user.uid === message.writer_id}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
