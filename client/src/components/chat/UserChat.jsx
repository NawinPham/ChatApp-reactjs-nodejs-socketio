import { Link } from "react-router-dom";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipientUser";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unReadNotificaionFunc } from "../../../utils/unReadNotificationFunc";
import { useFetchLatesMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const {
    getOnlineUsers,
    notification,
    markThisUserNotificationsAsRead,
    typingUser,
  } = useContext(ChatContext);

  const { latestMessage } = useFetchLatesMessage(chat);

  const unReadNotifications = unReadNotificaionFunc(notification);
  const thisUserNotifications = unReadNotifications.filter(
    (n) => n.senderId === recipientUser?._id
  );

  const isOnline = getOnlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  return (
    <Link
      className="d-flex text-dark"
      to={`/${recipientUser?._id}`}
      onClick={() => {
        if (thisUserNotifications?.length !== 0) {
          markThisUserNotificationsAsRead(thisUserNotifications, notification);
        }
      }}
    >
      <div className="image-container">
        <img
          src="https://scontent.fhan4-6.fna.fbcdn.net/v/t39.30808-6/440944050_463968542661651_132215457459583833_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=dZujSjs9cc0Q7kNvgGBVTXu&_nc_zt=23&_nc_ht=scontent.fhan4-6.fna&_nc_gid=A_4f8At1kNObJ7bSa3SrGbr&oh=00_AYATaykrmUZomdwuIRDo6iozZF0ByiSMOmCgSU1AVlNa9Q&oe=6726C3BF"
          alt=""
          className="img-fluid"
        />
        <span className={isOnline ? "user-online" : ""}></span>
      </div>

      <div className="col-6 overflow-hidden " style={{ paddingLeft: "10px" }}>
        <span>{recipientUser?.name}</span>
        <br />
        <span style={{ fontSize: "12px", color: "#959595" }}>
          {typingUser === recipientUser?._id
            ? "Đang nhập..."
            : latestMessage?.text}
        </span>
      </div>
      <div className="col-3">
        <span
          className="float-end"
          style={{ fontSize: "8px", color: "#959595" }}
        >
          {moment(latestMessage?.CreatedAt).calendar()}
        </span>
        <br />
        <div
          className={
            thisUserNotifications.length > 0 ? "this-user-notifications" : ""
          }
        >
          {thisUserNotifications.length > 0 ? thisUserNotifications.length : ""}
        </div>
      </div>
    </Link>
  );
};

export default UserChat;
