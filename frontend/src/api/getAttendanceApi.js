import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./config";

export default function useGetAttendanceApi() {
    return useQuery({
        queryKey: ["attendance"],
        retry: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await fetch(`${BASE_URL}/api/attendance/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const res = await response.json();

            console.log("Response from getAttendanceApi:", res);
            return res;
        }
    })
}