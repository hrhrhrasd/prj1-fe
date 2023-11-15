import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Spinner,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button isDisabled={isSubmitting} onClick={handleSubmit}>
        쓰기
      </Button>
    </Box>
  );
}

function CommentList({ commentList }) {
  const toast = useToast();
  if (commentList == null) {
    return <Spinner />;
  }

  function handleCommentDelete(comment) {
    axios.delete("/api/comment/delete?" + comment.id).then(() => {
      toast({
        description: "삭제 완료",
        status: "success",
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <Heading size={"md"}>댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={"4"}>
          {commentList.map((comment) => (
            <Box key={comment.id}>
              <Flex justifyContent={"space-between"}>
                <Heading size={"xs"}>{comment.memberId}</Heading>
                <Text fontSize={"xs"}>{comment.inserted}</Text>
              </Flex>
              {/* sx : 줄바꿈 적용하기 */}
              <Flex justifyContent={"space-between"}>
                <Text sx={{ whiteSpace: "pre-wrap" }} pt={"2"} fontSize={"sm"}>
                  {comment.comment}
                </Text>
                <Button onClick={() => handleCommentDelete(comment)}>
                  삭제
                </Button>
              </Flex>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentList, setCommentList] = useState([]);
  function handleSubmit(comment) {
    setIsSubmitting(true);
    axios
      .post("/api/comment/add", comment)
      .finally(() => setIsSubmitting(false));
  }

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);
      axios
        .get("/api/comment/list?" + params)
        .then(({ data }) => setCommentList(data));
    }
  }, [isSubmitting]);
  return (
    <Box>
      <CommentForm
        boardId={boardId}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <CommentList boardId={boardId} commentList={commentList} />
    </Box>
  );
}
