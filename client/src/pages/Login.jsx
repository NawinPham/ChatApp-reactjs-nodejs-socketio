import { useContext } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { loginInfo, updateLoginInfo, loginUser, loginError, loginLoading } =
    useContext(AuthContext);

  const handleLoginGoogle = () => {
    window.open("http://localhost:8082/api/users/auth/google", "_self");
  };
  return (
    <>
      <Form onSubmit={loginUser}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Login</h2>
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, email: e.target.value })
                }
              />
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, password: e.target.value })
                }
              />
              <Button variant="primary" type="submit">
                {loginLoading ? "Getting you in..." : "Login"}
              </Button>
              {loginError?.error && (
                <Alert>
                  <p>{loginError?.message}</p>
                </Alert>
              )}
              <Button
                className="bg-white border-0 text-dark"
                onClick={handleLoginGoogle}
              >
                Login with google
              </Button>
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Login;
