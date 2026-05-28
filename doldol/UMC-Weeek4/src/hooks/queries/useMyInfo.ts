import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";
import { QUERY_KEY } from "../../constants/key";

function useMyInfo() {
	const { accessToken } = useAuth();
	return useQuery({
		queryKey: [QUERY_KEY.myInfo],
		queryFn: getMyInfo,
		enabled: !!accessToken,
		staleTime: 1000 * 60 * 5,
		select: (res) => res.data,
	});
}

export default useMyInfo;
