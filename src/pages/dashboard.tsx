import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { useQueryClient } from "react-query";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { isLoading: isCourseLoading, data: userData } = trpc.useQuery([
    "user.getUser",
  ]);
  const mutation = trpc.useMutation(["user.updateUserCourse"], {
    onSuccess: () => {
      queryClient.invalidateQueries(["user.getUser"]);
    },
  });
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });
  const user = session?.user;
  const course = userData?.course;
  let courseFormatted = "";
  if (course) {
    courseFormatted = `${course?.college} ${
      course?.department + course?.courseNumber
    } ${course?.section}`;
  }

  const updateCourse = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutation.mutate({
      college: "CAS",
      department: "CS",
      courseNumber: "210",
      section: "A1",
    });
  };

  return (
    <div className="dark:text-gray-200">
      <h1>Dashboard</h1>
      <div>
        {status === "loading" ? "Loading..." : `Welcome, ${user?.name}!`}
      </div>
      <div>
        {isCourseLoading ? "Loading..." : `Your course is ${courseFormatted}`}
      </div>
      {/* <input></input> */}
      <button onClick={updateCourse}>
        {mutation.isLoading ? "Updating..." : "Update"}
      </button>
    </div>
  );
};

export default Dashboard;
