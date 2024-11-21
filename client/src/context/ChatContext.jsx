import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../../utils/services";
import { io } from "socket.io-client";
import messageSound from "../assets/sounds/warning-notification-call-184996.mp3";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [userChatError, setUserChatError] = useState(null);
  const [userChatLoading, setUserChatLoading] = useState(false);
  const [potentailChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgError, setMsgError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [getOnlineUsers, setGetOnlineUsers] = useState([]);
  const [notification, setNotification] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [isFocused, setIsFocused] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  //connect socket
  useEffect(() => {
    const newSocket = io("http://localhost:8083");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // gets online user
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setGetOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  //send message to socket
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  //receive message
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      const audio = new Audio(messageSound);
      audio.play();

      if (isChatOpen) {
        setNotification((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotification((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  //Potential chat and get all user
  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users/`);
      if (!user || !user?._id) return console.log("not user");

      if (response.error) return console.log("Error fetching users", response);

      const pChat = response.filter((u) => {
        let isChatCreated = false;

        if (user?._id === u._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }

        return !isChatCreated;
      });

      setAllUsers(response);
      setPotentialChats(pChat);
    };

    getUsers();
  }, [userChats, user]);

  //get user chat
  useEffect(() => {
    const getUserChat = async () => {
      if (user?._id) {
        setUserChatLoading(true);
        setUserChatError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        setUserChatLoading(false);

        if (response.error) {
          return setUserChatError(response);
        }

        setUserChats(response);
      }
    };

    getUserChat();
  }, [user, notification]);

  //get messaage
  useEffect(() => {
    const getMessages = async () => {
      setMsgLoading(true);
      setMsgError(null);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );

      setMsgLoading(false);

      if (response.error) {
        return setMsgError(response);
      }

      setMessages(response);
    };

    getMessages();
  }, [currentChat]);

  //focus input typing
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members.find((id) => id !== user?._id);

    if (isFocused && socket) {
      socket.emit("typing", { senderId: user?._id, recipientId: recipientId });
    } else if (socket) {
      socket.emit("stopTyping", { recipientId });
    }
  }, [isFocused, user, socket]);

  //typing user
  useEffect(() => {
    if (socket === null) return;

    socket.on("displayTyping", (res) => {
      if (res.typing) {
        setTypingUser(res.senderId);
      } else {
        setTypingUser("");
      }
    });

    return () => {
      socket.off("displayTyping");
    };
  }, [socket]);

  //update current chat
  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  //create chat
  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats/create`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.error) return console.log("error creating chat...", response);

    setUserChats((prev) => [...prev, response]);
  }, []);

  //send message
  const sendMessage = useCallback(
    async (chatId, senderId, text, setTextMessage) => {
      setSendMessageLoading(true);
      if (!text) return console.log("your must type something...");

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({ chatId, senderId, text })
      );

      setSendMessageLoading(false);

      if (response.error)
        return console.log("error send message chat...", response);

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    []
  );

  const markAllNotificationAsRead = useCallback((notifications) => {
    const mNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });

    setNotification(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      //find chat to open
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user?._id, n.senderId];
        const isDesireChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });

        return isDesireChat;
      });

      //mark notification as read
      const mNotifications = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });

      updateCurrentChat(desiredChat);
      setNotification(mNotifications);
    },
    []
  );

  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      //mark notification ad read
      const mNotifications = notifications.map((el) => {
        let notification;

        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });

        return notification;
      });

      setNotification(mNotifications);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        userChatError,
        userChatLoading,

        currentChat,
        potentailChats,
        createChat,
        updateCurrentChat,

        messages,
        msgLoading,
        msgError,

        sendMessage,
        sendMessageLoading,
        newMessage,
        setNewMessage,

        getOnlineUsers,
        notification,
        allUsers,

        markAllNotificationAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead,

        setIsFocused,
        typingUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
