import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DeleteIcon, EditIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { LoginContext } from "./LoginProvider";

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

function CommentItem({
  comment,
  onDeleteModalOpen,
  setIsSubmitting,
  isSubmitting,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [commentEdited, setCommentEdited] = useState(comment.comment);

  const { hasAccess } = useContext(LoginContext);

  const toast = useToast();

  function handleSubmit() {
    // TODO: 댓글 list refresh
    // TODO: textarea 닫기
    // TODO: 응답 코드에 따른 기능들
    setIsSubmitting(true);
    setIsEditing(false);

    axios
      .put("/api/comment/edit", {
        id: comment.id,
        comment: commentEdited,
      })
      .then(({ data }) => {
        toast({
          description: "댓글이 수정 되었습니다",
          status: "success",
        });
      })
      .catch((error) => {
        if (error.response.status == 401 || error.response.status == 403) {
          toast({
            description: "권한이 없습니다",
            status: "warning",
          });
        }

        if (error.response.status == 400) {
          toast({
            description: "입력값을 확인해주세요",
            status: "warning",
          });
        }
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <Box>
      <Flex justifyContent={"space-between"}>
        <Heading size={"xs"}>{comment.memberNickName}</Heading>
        <Text fontSize={"xs"}>{comment.inserted}</Text>
      </Flex>
      {/* sx : 줄바꿈 적용하기 */}
      <Flex justifyContent={"space-between"}>
        <Box flex={1}>
          <Text sx={{ whiteSpace: "pre-wrap" }} pt={"2"} fontSize={"sm"}>
            {comment.comment}
          </Text>
          {isEditing && (
            <Box>
              <Textarea
                value={commentEdited}
                onChange={(e) => setCommentEdited(e.target.value)}
              />
              <Button onClick={handleSubmit}>저장</Button>
            </Box>
          )}
        </Box>

        {hasAccess(comment.memberId) && (
          <Box>
            {isEditing || (
              <Box>
                <Button size={"xs"} onClick={() => setIsEditing(true)}>
                  <EditIcon />
                </Button>
                <Button
                  size={"xs"}
                  onClick={() => onDeleteModalOpen(comment.id)}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            )}
            {isEditing && (
              <Button size={"xs"} onClick={() => setIsEditing(false)}>
                <NotAllowedIcon />
              </Button>
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
}

function CommentList({
  commentList,
  onDeleteModalOpen,
  isSubmitting,
  setIsSubmitting,
}) {
  if (commentList == null) {
    return <Spinner />;
  }

  return (
    <Card>
      <CardHeader>
        <Heading size={"md"}>댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={"4"}>
          {commentList.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDeleteModalOpen={onDeleteModalOpen}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentList, setCommentList] = useState([]);
  // const [id, setId] = useState(0);
  const commentIdRef = useRef(0);

  const toast = useToast();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { isAuthenticated } = useContext(LoginContext);

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);
      axios
        .get("/api/comment/list?" + params)
        .then(({ data }) => setCommentList(data));
    }
  }, [isSubmitting]);

  function handleSubmit(comment) {
    setIsSubmitting(true);
    axios
      .post("/api/comment/add", comment)
      .then(() => {
        toast({
          description: "댓글이 등록 되었습니다.",
          status: "success",
        });
      })
      .catch(() => {
        toast({
          description: "댓글 등록 실패",
          status: "error",
        });
      })
      .finally(() => setIsSubmitting(false));
  }
  function handleDelete() {
    setIsSubmitting(true);
    axios
      .delete("/api/comment/" + commentIdRef.current)
      .then(() => {
        toast({
          description: "삭제 되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "삭제중 오류 발생",
            status: "error",
          });
        }
      })
      .finally(() => {
        onClose();
        setIsSubmitting(false);
      });
  }
  function handleDeleteModalOpen(id) {
    // id 저장
    commentIdRef.current = id;
    // 모달 열기
    onOpen();
  }
  return (
    <Box>
      {isAuthenticated() && (
        <CommentForm
          boardId={boardId}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      )}
      <CommentList
        boardId={boardId}
        commentList={commentList}
        setIsSubmitting={setIsSubmitting}
        isSubmitting={isSubmitting}
        onDeleteModalOpen={handleDeleteModalOpen}
      />

      {/* 삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="red"
            >
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
