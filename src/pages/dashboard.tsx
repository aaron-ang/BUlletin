import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

const Dashboard = () => {
  // const { isLoading, data } = trpc.useQuery(["user.getSession"]);
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });
  const user = session?.user;

  return (
    <>
      <h1>Dashboard</h1>
      <div>{status === "loading" ? "Loading..." : user?.name}</div>
    </>
  );
};

export default Dashboard;
