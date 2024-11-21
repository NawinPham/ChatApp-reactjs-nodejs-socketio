import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Kiểm tra URL cho dữ liệu người dùng từ Google OAuth callback
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      localStorage.setItem("User", JSON.stringify(parsedUser));
      setUser(parsedUser);

      // Xóa query string khỏi URL sau khi lưu vào sessionStorage
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("User");

    setUser(JSON.parse(storedUser));
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();

      setRegisterLoading(true);
      setRegisterError(null);

      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );

      setRegisterLoading(false);

      if (response.error) {
        return setRegisterError(response);
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();

      setLoginLoading(true);

      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );

      setLoginLoading(false);

      if (response.error) {
        return setLoginError(response);
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        registerLoading,

        loginInfo,
        updateLoginInfo,
        loginUser,
        loginError,
        loginLoading,

        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
