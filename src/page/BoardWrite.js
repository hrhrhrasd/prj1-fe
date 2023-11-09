import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { logDOM } from "@testing-library/react";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");

  const toast = useToast();

  function handleSubmit() {
    axios
      .post("/api/board/add", {
        title,
        content,
        writer,
      })
      .then(() =>
        toast({
          description: "새 글이 저장되었습니다",
          status: "success",
        }),
      )
      .catch(() =>
        toast({
          description: "저장 실패",
          status: "error",
        }),
      )
      .finally(() => console.log("최종"));
  }

  return (
    <Box>
      <h1>게시물 작성</h1>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>본문</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></Textarea>
        </FormControl>
        <FormControl>
          <FormLabel>작성자</FormLabel>
          <Input value={writer} onChange={(e) => setWriter(e.target.value)} />
        </FormControl>
        <Button colorScheme={"blue"} onClick={handleSubmit}>
          저장
        </Button>
      </Box>
    </Box>
  );
}
