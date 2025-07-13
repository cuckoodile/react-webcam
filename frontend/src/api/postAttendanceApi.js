import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./config";

export default function usePostAttendanceApi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["attendance"],
    mutationFn: async (formData) => {
      const response = await fetch(`${BASE_URL}/api/attendance/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to post attendance");
      }

      const res = await response.json();
      console.log("Response from postAttendanceApi:", res);
      return res;
    },
    onSuccess: (data) => {
      console.log("Attendance posted successfully:", data);
      // Invalidate and refetch the attendance data
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
