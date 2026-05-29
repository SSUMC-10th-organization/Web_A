const MyPage = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1 className="text-3xl font-bold mb-4">마이 페이지</h1>
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg w-80 text-center">
        <p className="text-gray-300">반갑습니다, 영찬님!</p>
        <p className="text-sm text-gray-500 mt-2">회원 정보 관리 페이지입니다.</p>
      </div>
    </div>
  );
};

export default MyPage;