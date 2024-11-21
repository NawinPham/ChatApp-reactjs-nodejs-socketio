import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import BoxChat from "../components/chat/BoxChat";
import PotentialChat from "../components/chat/PotentialChat";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, userChatError, userChatLoading, updateCurrentChat } =
    useContext(ChatContext);

  return (
    <Container>
      <Stack
        direction="horizontal"
        gap={0}
        className="align-items-start bg-light text-dark rounded-3 shadow-lg "
      >
        <Stack
          className="messages-box flex-grow-0 pe-3 col-3 p-3 overflow-y-auto"
          gap={2}
        >
          <div className="border-bottom pb-3">
            <input
              type="text"
              className="w-100 border-0 p-2 rounded-3 shadow-lg form-control"
              placeholder="Tìm kiếm"
            />
          </div>

          {userChats?.map((chat, index) => (
            <div key={index} onClick={() => updateCurrentChat(chat)}>
              <UserChat chat={chat} user={user} />
            </div>
          ))}
        </Stack>

        <BoxChat />

        <Stack className="messages-box flex-grow-0 pe-3 col-3 p-3" gap={2}>
          <div>
            <h2>fdf</h2>
          </div>
          <div>
            <h2>fdf</h2>
          </div>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Chat;
