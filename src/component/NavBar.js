import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { LoginContext } from "./LoginProvider";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function NavBar() {
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);
  const toast = useToast();

  const navigate = useNavigate();

  const urlParams = new URLSearchParams();

  const location = useLocation();

  useEffect(() => {
    fetchLogin();
  }, [location]);

  if (login !== "") {
    urlParams.set("id", login.id);
  }

  function handleLogout() {
    axios.post("/api/member/logout").then(() => {
      toast({
        description: "로그아웃 되었습니다",
        status: "info",
      });
      navigate("/");
    });
  }

  return (
    <Flex justifyContent={"space-between"}>
      <Flex>
        <Button onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHouse} />
          <span style={{ paddingLeft: "5px" }}>home</span>
        </Button>
        {isAuthenticated() && (
          <Button onClick={() => navigate("/write")}>write</Button>
        )}
        {isAuthenticated() || (
          <Button onClick={() => navigate("/signup")}>signup</Button>
        )}
        {isAdmin() && (
          <Button onClick={() => navigate("/member/list")}>회원목록</Button>
        )}
        {isAuthenticated() && (
          <Button
            onClick={() => {
              navigate("/member?" + urlParams.toString());
            }}
          >
            내정보
          </Button>
        )}
        {isAuthenticated() || (
          <Button onClick={() => navigate("/login")}>로그인</Button>
        )}
        {isAuthenticated() && <Button onClick={handleLogout}>로그아웃</Button>}
      </Flex>
      <Box>{login.nickName}님</Box>
    </Flex>
  );
}
