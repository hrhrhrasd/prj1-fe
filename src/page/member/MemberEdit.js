import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

export function MemberEdit() {
  const toast = useToast();
  const [params] = useSearchParams();
  const [member, setMember] = useState(null);
  const [nickName, setNickName] = useState("");
  const [nickNameAvailable, setNickNameAvailable] = useState(false);
  const [email, setEmail] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/member?" + params.toString()).then(({ data }) => {
      setMember(data);
      setEmail(data.email);
      setNickName(data.nickName);
    });
  }, []);

  const id = params.get("id");

  let sameOriginNickName = false;
  if (member !== null) {
    sameOriginNickName = member.nickName === nickName;
  }

  // 기존 이메일과 같은지?
  let sameOriginEmail = false;
  if (member !== null) {
    sameOriginEmail = member.email === email;
  }

  let nickChecked = sameOriginNickName || nickNameAvailable;

  // TODO : 기존 이메일과 같거나, 중복확인을 했거나
  let emailChecked = sameOriginEmail || emailAvailable;
  let passwordChecked = false;

  if (passwordCheck === password) {
    passwordChecked = true;
  }

  if (member === null) {
    return <Spinner />;
  }

  function handleNickNameCheck() {
    const params = new URLSearchParams();
    params.set("nickName", nickName);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setNickNameAvailable(false);
        toast({
          description: "이미 사용 중인 nickName입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setNickNameAvailable(true);
          toast({
            description: "사용 가능한 nickName입니다.",
            status: "success",
          });
        }
      });
  }

  function handleEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setEmailAvailable(false);
        toast({
          description: "이미 사용 중인 email입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailAvailable(true);
          toast({
            description: "사용 가능한 email입니다.",
            status: "success",
          });
        }
      });
  }

  function handleSubmit() {
    // put /api/member/edit {id,password,email}
    axios
      .put("/api/member/edit", { id: member.id, nickName, password, email })
      .then(() => {
        toast({
          description: "회원 정보가 수정되었습니다",
          status: "success",
        });
        navigate("/member?" + params.toString());
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "수정 권한이 없습니다",
            status: "error",
          });
        } else {
          toast({
            description: "수정중 문제 발생 했습니다",
            status: "error",
          });
        }
      });
  }

  return (
    <Box>
      <h1>{id}님 정보 수정</h1>
      <FormControl>
        <FormLabel>nickName</FormLabel>
        <Flex>
          <Input
            type={"text"}
            value={nickName}
            onChange={(e) => {
              setNickName(e.target.value);
              setNickNameAvailable(false);
            }}
          />
          <Button isDisabled={nickChecked} onClick={handleNickNameCheck}>
            중복 확인
          </Button>
        </Flex>
      </FormControl>

      {/* 암호가 없으면 기존 암호 */}
      {/* 암호를 작성하면 새 암호, 암호확인 체크 */}
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input
          type={"text"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormHelperText>미작성시 기존암호를 저장합니다</FormHelperText>
      </FormControl>
      {password.length > 0 && (
        <FormControl>
          <FormLabel>password확인</FormLabel>
          <Input
            type={"text"}
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </FormControl>
      )}

      {/* email을 변경하면(작성시작) 중복확인 다시 하기 */}
      {/* 기존 email과 같으면 안해도 됨 */}
      <FormControl>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input
            type={"text"}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailAvailable(false);
            }}
          />
          <Button isDisabled={emailChecked} onClick={handleEmailCheck}>
            중복 확인
          </Button>
        </Flex>
      </FormControl>
      <Button isDisabled={!emailChecked || !passwordChecked} onClick={onOpen}>
        수정
      </Button>

      {/* 수정 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>수정 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleSubmit} colorScheme="red">
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
