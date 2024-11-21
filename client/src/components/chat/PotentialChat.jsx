import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const PotentialChat = () => {
  const { potentialChat, createChat } = useContext(ChatContext);
  console.log(potentialChat);

  return <h2>potentailChats</h2>;
};

export default PotentialChat;
