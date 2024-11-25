import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unReadNotificaionFunc } from "../../../utils/unReadNotificationFunc";
import moment from "moment";
import { AuthContext } from "../../context/AuthContext";

const Notification = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const {
    userChats,
    notification,
    allUsers,
    markAllNotificationAsRead,
    markNotificationAsRead,
  } = useContext(ChatContext);

  const unReadNotifications = unReadNotificaionFunc(notification);
  const modifyNotifications = notification.map((n) => {
    const sender = allUsers.find((user) => user?._id === n?.senderId);

    return {
      ...n,
      senderName: sender?.name,
    };
  });

  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-bell-fill"
          viewBox="0 0 16 16"
        >
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
        </svg>
        {unReadNotifications.length === 0 ? null : (
          <span className="notification-count">
            {unReadNotifications.length}
          </span>
        )}
      </div>
      {isOpen ? (
        <div className="notifications-box">
          <div className="notifications-header">
            <span>Notifications</span>
            <div
              className="mark-as-read"
              onClick={() => markAllNotificationAsRead(notification)}
            >
              <span>mark all as read</span>
            </div>
          </div>
          {modifyNotifications.length === 0 ? (
            <span className="notification">No notification yet...</span>
          ) : null}
          {modifyNotifications &&
            modifyNotifications.map((n, index) => (
              <div
                key={index}
                className={n?.isRead ? "notification" : "notification not-read"}
                onClick={() => {
                  markNotificationAsRead(n, userChats, user, notification);
                  setIsOpen(false);
                }}
              >
                <span>{n?.senderName}</span>
                <span className="notification-time">
                  {moment(n.date).calendar()}
                </span>
              </div>
            ))}
        </div>
      ) : null}
    </div>
  );
};

export default Notification;
