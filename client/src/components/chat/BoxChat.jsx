import { useContext, useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipientUser";
import InputEmoji from "react-input-emoji";
import { AudioRecorder } from "react-audio-voice-recorder";
import { unReadNotificaionFunc } from "../../../utils/unReadNotificationFunc";

const BoxChat = ({ data }) => {
  const { user } = useContext(AuthContext);
  const {
    messages,
    msgLoading,
    currentChat,
    sendMessage,
    sendMessageLoading,
    getOnlineUsers,
    setIsFocused,
  } = useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat, user);
  const [textMessage, setTextMessage] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    sendMessage(currentChat?._id, user?._id, textMessage, setTextMessage);
  };

  if (!recipientUser) {
    return <p>no message</p>;
  }

  if (msgLoading) {
    return <p>Loading chat...</p>;
  }
  return (
    <Stack className="messages-box pe-3 col-6 bg-white p-3 " gap={2}>
      <div className="border-bottom pb-2 d-flex ">
        <div className="col-6 d-flex">
          <div className="image-container">
            <img
              src="https://scontent.fhan4-6.fna.fbcdn.net/v/t39.30808-6/440944050_463968542661651_132215457459583833_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=dZujSjs9cc0Q7kNvgGBVTXu&_nc_zt=23&_nc_ht=scontent.fhan4-6.fna&_nc_gid=A_4f8At1kNObJ7bSa3SrGbr&oh=00_AYATaykrmUZomdwuIRDo6iozZF0ByiSMOmCgSU1AVlNa9Q&oe=6726C3BF"
              alt=""
              className="img-fluid"
            />
            <span
              className={
                getOnlineUsers?.some(
                  (user) => user?.userId === recipientUser?._id
                )
                  ? "user-online"
                  : "user-offline"
              }
            ></span>
          </div>
          <div>
            <span
              style={{
                lineHeight: "50px",
                paddingLeft: "10px",
                fontSize: "24px",
              }}
            >
              {recipientUser?.name}
            </span>
          </div>
        </div>
        <div className="col-6">
          <div className="float-end d-flex">
            <div style={{ lineHeight: "50px" }}>
              <Button className="btn bg-transparent border-0">
                <i
                  class="fa-solid fa-phone fa-xl"
                  style={{ color: "#4399ff" }}
                ></i>
              </Button>
            </div>
            <div style={{ lineHeight: "50px" }}>
              <Button className="btn bg-transparent border-0">
                <i
                  class="fa-solid fa-video fa-xl"
                  style={{ color: "#4399ff" }}
                ></i>
              </Button>
            </div>
            <div style={{ lineHeight: "50px" }}>
              <Button className="btn bg-transparent border-0">
                <i
                  class="fa-solid fa-bell fa-xl"
                  style={{ color: "#4399ff" }}
                ></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="box-chat d-flex flex-column-reverse">
        <div className="clearfix align-self-end">
          <span style={{ fontSize: "12px", color: "#959595" }}>
            {sendMessageLoading ? "Đang gửi" : "Đã gửi"}
          </span>
        </div>
        {messages &&
          messages
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((msg, index) => (
              <div
                className={`${
                  msg?.senderId === user?._id
                    ? "message clearfix align-self-end text-wrap text-break"
                    : "message clearfix align-self-start text-wrap text-break"
                }`}
                key={index}
              >
                {msg?.text}
              </div>
            ))}
      </div>
      <div className="d-flex">
        <div className="col-2 d-flex">
          <div style={{ paddingRight: "10px" }}>
            <Button>
              <i class="fa-solid fa-file"></i>
            </Button>
          </div>
          <div style={{ paddingRight: "10px" }}></div>
        </div>
        <div className="col-9 d-flex">
          <AudioRecorder
            audioTrackConstraints={{
              noiseSuppression: true,
              echoCancellation: true,
            }}
            downloadOnSavePress={true}
            downloadFileExtension="webm"
          />
          <InputEmoji
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            value={textMessage}
            onChange={setTextMessage}
          />
        </div>
        <div className="col-1" style={{ paddingLeft: "10px" }}>
          <Button onClick={() => handleSendMessage()}>
            <i class="fa-solid fa-paper-plane"></i>
          </Button>
        </div>
      </div>
    </Stack>
  );
};

export default BoxChat;
