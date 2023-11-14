import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./Chat.css";

let socket;
export default function Chat() {
  const backEndUrl = "http://localhost:8000";
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    console.log("Hello World");
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const name = params.get("name");
    const room = params.get("room");

    setName(name);
    setRoom(room);

    socket = io(backEndUrl);

    socket.emit("join", { name: name, room: room }, (error) => {
      if (error) {
        alert(error);
      }
    });
    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    setTimeout(() => {
      var objDiv = document.getElementById("chat_body");
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 100);

    socket.on("activeUsers", (active) => {
      setActiveUsers(active);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    socket.emit("sendMsg", msg, (reset) => setMsg(reset));

    setTimeout(() => {
      var objDiv = document.getElementById("chat_body");
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 100);
  };

  return (
    <div className="container mt-4 ">
      <div className="row chat-window" id="chat_window_1">
        <div className="col-xs-4 col-md-4">
          <p>Active Users</p>
          <ul>
            {activeUsers.map((e) => (
              <li key={e.id}>{e.name}</li>
            ))}
          </ul>
        </div>
        <div className="col-xs-8 col-md-8">
          <div className="panel panel-default">
            <div className="panel-heading top-bar">
              <div className="col-md-12 col-xs-8">
                <h3 className="panel-title">
                  <span className="glyphicon glyphicon-comment"></span>
                  {room}
                </h3>
              </div>
            </div>
            <div className="panel-body msg_container_base" id="chat_body">
              {messages.map((e) =>
                e.user === name?.toLowerCase() ? (
                  <>
                    <div key={e.id} className="row msg_container base_receive">
                      <div className="col-xs-10 col-md-10">
                        <div className="messages msg_receive">
                          <p>{e.text}</p>
                          <time>{e.user}</time>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div key={e.id} className="row msg_container base_sent">
                      <div className="col-xs-10 col-md-10">
                        <div className="messages msg_sent">
                          <p>{e.text}</p>
                          <time>{e.user}</time>
                        </div>
                      </div>
                    </div>
                  </>
                )
              )}
            </div>
            <div className="panel-footer">
              <div className="input-group">
                <input
                  id="btn-input"
                  type="text"
                  value={msg}
                  onKeyPress={(event) =>
                    event.key === "Enter" ? sendMessage(event) : null
                  }
                  onChange={(event) => setMsg(event.target.value)}
                  className="form-control input-sm chat_input"
                  placeholder="Write your message here..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
