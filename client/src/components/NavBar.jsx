import { useContext } from "react";
import { Container, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./chat/Notification";

const NavBarApp = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <Navbar bg="dark">
      <Container gap={0}>
        <div className="col-3">
          <img
            src={user?.image}
            alt=""
            style={{ width: "60px", borderRadius: "60px" }}
          />
          {user ? <span> Hi {user?.name} !</span> : <span>Welcome!</span>}
        </div>

        <div className="col-6">
          <h2 className="text-center">
            <Link to={"/"} className="link-light text-decoration-none">
              ChatApp
            </Link>
          </h2>
        </div>

        <Notification />

        <div className="">
          <Stack direction="horizontal" gap={3} className="float-end">
            {user ? (
              <Link
                className="link-light text-decoration-none "
                onClick={() => logoutUser()}
                to={"/login"}
              >
                Logout
              </Link>
            ) : (
              <>
                <Link to={"login"} className="link-light text-decoration-none">
                  Login
                </Link>
                <Link
                  to={"Register"}
                  className="link-light text-decoration-none"
                >
                  Register
                </Link>
              </>
            )}
          </Stack>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBarApp;
