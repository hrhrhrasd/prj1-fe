import { Box, Button, Input, Spinner, Textarea } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

function CommentForm({ boardId }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    axios.post("/api/comment/add", {
      boardId,
      comment,
    });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button onClick={handleSubmit}>쓰기</Button>
    </Box>
  );
}

function CommentList({ boardId }) {
  const [commentList, setCommentList] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("id", boardId);
    axios
      .get("/api/comment/list?" + params)
      .then(({ data }) => setCommentList(data))
      .finally(() => console.log(commentList));
  }, []);

  if (commentList === null) {
    return <Spinner />;
  }

  return (
    <Box>
      {commentList
        .slice(0)
        .reverse()
        .map((comment) => (
          <Box key={comment.id}>
            <Box>작성자 : {comment.memberId}</Box>
            <Box>내용 : {comment.comment}</Box>
            <Box>작성일 : {comment.inserted}</Box>
          </Box>
        ))}
    </Box>
  );
}

export function CommentContainer({ boardId }) {
  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList boardId={boardId} />
    </Box>
  );
}
