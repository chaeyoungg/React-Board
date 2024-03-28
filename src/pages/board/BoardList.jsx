import Button from "@components/Button";
import Pagination from "@components/Pagination";
import Search from "@components/Search";
import useCustomAxios from "@hooks/useCustomAxios.mjs";
import BoardListItem from "@pages/board/BoardListItem";
import { memberState } from "@recoil/user/atoms.mjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
// import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

function BoardList(){
  const axios = useCustomAxios();
  // /posts?page=3
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  // const [data, setData] = useState(null);

  // const fetchBoardList = async () => {
  //   const response = await axios.get('/posts');
  //   setData(response.data);
  // };
  

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: () => axios.get('/posts', { params: {page: searchParams.get('page'), limit: 10, keyword: searchParams.get('keyword')} }),
    select: response => response.data,
    // staleTime: 1000*100, // 쿼리 실행 후 캐시가 유지되는 시간(기본, 0)
    suspense: true,
  });


  useEffect(() => { //refetch가 선언된 후 렌더링해야 정상으로 작동
    // console.log(searchParams.toString());
    refetch();
  }, [searchParams.toString()]);


  //검색 요청 시 주소의 query strng 수정
  const handleSearch = (keyword) => { // 이 keyword는 어디서 받아오는 걸까 ? 
    console.log(keyword);
    searchParams.set('keyword', keyword);
    setSearchParams(searchParams);
  }

  //로그인 여부 확인
  const user = useRecoilValue(memberState);
  const handleNewPost = () => {
    if(!user){
      const gotoLogin = confirm('로그인 후 이용 가능합니다. 로그인 페이지로 이동하시겠습니까?');
      gotoLogin && navigate('/users/login');
    }else{
      navigate(`/boards/new`);
    }
  }

  const itemList = data?.item?.map(item => <BoardListItem key={ item._id } item={ item } />);

  return (
    <div className="min-w-80 p-4 dark:bg-gray-600 transition duration-300 ease-in-out">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">게시물 목록 조회</h2>
      </div >
      <div className="flex justify-end mr-4">
        <Search onClick={handleSearch} />
        <Button onClick={handleNewPost}> 글쓰기 </Button>
      </div>
      <section className="p-4">
        <table className="border-collapse w-full table-fixed">
        <colgroup>
            <col className="w-[10%] sm:w-[10%]" />
            <col className="w-[60%] sm:w-[40%]" />
            <col className="w-[30%] sm:w-[15%]" />
            <col className="w-0 sm:w-[10%]" />
            <col className="w-0 sm:w-[25%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-solid border-gray-200 dark:text-gray-200">
              <th className="p-2 whitespace-nowrap">번호</th>
              <th className="p-2 whitespace-nowrap">제목</th>
              <th className="p-2 whitespace-nowrap">글쓴이</th>
              <th className="p-2 whitespace-nowrap hidden sm:table-cell">조회</th>
              <th className="p-2 whitespace-nowrap hidden sm:table-cell">작성일</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td>로딩중...</td></tr>
            )}
            {error && (
              <tr><td>{error.message}</td></tr>
            )}
            { itemList }
          </tbody>
        </table>
        <hr/>
        <Pagination totalPage={ data?.pagination.totalPages } current={ data?.pagination.page } />
      </section>
    </div>
  );
}

export default BoardList;