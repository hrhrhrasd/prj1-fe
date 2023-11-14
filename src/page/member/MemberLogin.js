import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function MemberLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    // TODO : 로그인후 성공 실패 완료 코드 추가
    axios
      .post("/api/member/login", { id, password })
      .then(() => console.log("ok"))
      .catch(() => console.log("no"))
      .finally(() => console.log("fin"));
  }

  return (
    <Box>
      <h1>로그인</h1>
      <FormControl>
        <FormLabel>아이디</FormLabel>
        <Input value={id} onChange={(e) => setId(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>암호</FormLabel>
        <Input
          type={"password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button colorScheme={"blue"} onClick={handleLogin}>
        로그인
      </Button>
    </Box>
  );
}
