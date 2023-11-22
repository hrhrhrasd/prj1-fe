import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LogInProvider";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  const { fetchLogin } = useContext(LoginContext);

  function handleLogin() {
    axios
      .post("/api/member/login", { id, password })
      .then(() => {
        toast({
          description: "로그인 되었습니다.",
          status: "info",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "아이디와 암호를 다시 확인해주세요.",
          status: "warning",
        });
      });
  }

  return (
    <Center>
      <Card w={"md"}>
        <CardHeader>
          <Heading>로그인</Heading>
        </CardHeader>
        <CardBody>
          <FormControl mb={5}>
            <FormLabel>아이디</FormLabel>
            <Input value={id} onChange={(e) => setId(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>암호</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </CardBody>
        <CardFooter>
          <Button colorScheme="blue" onClick={handleLogin}>
            로그인
          </Button>
        </CardFooter>
      </Card>
    </Center>
  );
}
