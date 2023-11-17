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
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import * as PropTypes from "prop-types";

function Pagination({ pageInfo }) {
  const pageNumbers = [];

  const navigate = useNavigate();

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      {pageInfo.prevPageNumber && (
        <Button variant={"ghost"} onClick={() => navigate("/?p=" + 1)}>
          <ArrowLeftIcon boxSize={3} />
        </Button>
      )}
      {pageInfo.prevPageNumber && (
        <Button
          variant={"ghost"}
          onClick={() => navigate("/?p=" + pageInfo.prevPageNumber)}
        >
          <ChevronLeftIcon boxSize={6} />
        </Button>
      )}
      {pageNumbers.map((pageNumber) => (
        <Button
          variant={
            pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
          }
          key={pageNumber}
          onClick={() => navigate("/?p=" + pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}
      {pageInfo.nextPageNumber && (
        <Button
          variant={"ghost"}
          onClick={() => navigate("/?p=" + pageInfo.nextPageNumber)}
        >
          <ChevronRightIcon boxSize={6} />
        </Button>
      )}
      {pageInfo.nextPageNumber && (
        <Button
          variant={"ghost"}
          onClick={() => navigate("/?p=" + pageInfo.lastPageNumber)}
        >
          <ArrowRightIcon boxSize={3} />
        </Button>
      )}
    </Box>
  );
}

Pagination.propTypes = { pageInfo: PropTypes.any };

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
      <Pagination pageInfo={pageInfo} />
    </Box>
  );
}
