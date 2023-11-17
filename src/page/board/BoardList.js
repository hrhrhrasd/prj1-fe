import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChatIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/board/list?" + params).then((response) => {
      setBoardList(response.data.boardList);
      setPageInfo(response.data.pageInfo);
    });
  }, [location]);

  console.log(pageInfo);
  // console.log(pageInfo.endPageNumber);

  let btnArr = [];
  for (let i = 1; i <= 10; i++) {
    btnArr.push(i);
  }

  if (boardList === null || pageInfo === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>게시물 목록</h1>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>title</Th>
              <Th>like</Th>
              <Th>by</Th>
              <Th>at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList.map((board) => (
              <Tr
                _hover={{
                  cursor: "pointer",
                }}
                key={board.id}
                onClick={() => navigate("/board/" + board.id)}
              >
                <Td>{board.id}</Td>
                <Td>
                  {board.title}
                  {board.countComment > 0 && (
                    <Badge>
                      <ChatIcon />({board.countComment})
                    </Badge>
                  )}
                </Td>
                <Td>{board.countLike}</Td>
                <Td>{board.nickName}</Td>
                <Td>{board.ago}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Flex>
        <Button>
          <ChevronLeftIcon />
        </Button>
        {btnArr.map((btn, index) => (
          <Button key={index} onClick={() => navigate("?p=" + btn)}>
            {btn}
          </Button>
        ))}
        <Button>
          <ChevronRightIcon />
        </Button>
      </Flex>
    </Box>
  );
}
