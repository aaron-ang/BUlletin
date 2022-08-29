import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { useQueryClient } from "react-query";
import { useState } from "react";

const Dashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const { isLoading: isCourseLoading, data: userData } = trpc.useQuery([
    "user.getUser",
  ]);
  const queryClient = useQueryClient();
  const mutation = trpc.useMutation(["user.updateUserCourse"], {
    onSuccess: () => {
      queryClient.invalidateQueries(["user.getUser"]);
    },
  });

  const [editing, setEditing] = useState(false);
  const [courseInput, setCourseInput] = useState("");

  const user = session?.user;
  const course = userData?.course;
  let courseFormatted = "";
  if (course) {
    courseFormatted = `${course?.college} ${
      course?.department + course?.courseNumber
    } ${course?.section}`;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseInput(e.target.value.toUpperCase());
  };

  const cancelEdit = () => {
    setEditing(false);
    setCourseInput("");
  };

  const updateCourse = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const payload = formatInput(courseInput);
    if (payload) {
      setEditing(false);
      mutation.mutate(payload);
    } else {
      setCourseInput("");
      alert("Invalid course input. Please try again.");
    }
  };

  const formatInput = (input: string) => {
    const split = input
      .replace(/\s+/g, "")
      .match(/^([A-Z]{3})([A-Z]{2})([0-9]{3})([A-Z1-9]{2})$/);
    return split
      ? {
          college: split[1] as string,
          department: split[2] as string,
          courseNumber: split[3] as string,
          section: split[4] as string,
        }
      : null;
  };

  return (
    <div className="dark:text-gray-200">
      <h1>Dashboard</h1>
      <div>
        {status === "loading" ? "Loading..." : `Welcome, ${user?.name}!`}
      </div>
      <div>Your selected course is:</div>
      <div>
        <input
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled={!editing}
          value={courseInput}
          placeholder={isCourseLoading ? "Loading..." : `${courseFormatted}`}
          onChange={handleChange}
        ></input>
      </div>
      {editing ? (
        <>
          <button
            onClick={updateCourse}
            className="bg-primary hover:bg-red-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update
          </button>
          <button
            onClick={cancelEdit}
            className="bg-primary hover:bg-red-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="bg-primary hover:bg-red-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {mutation.isLoading ? "Updating..." : "Edit"}
        </button>
      )}
    </div>
  );
};

export default Dashboard;
