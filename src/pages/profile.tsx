import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

const Profile = () => {
  const { isLoading, data } = trpc.useQuery(["user.getSession"]);
  const router = useRouter();
  return (
    <>
      <h1>Profile</h1>
      <div>
        {isLoading ? (
          "Loading..."
        ) : data ? (
          data.user.name
        ) : (
          <>
            <div>You are not signed in</div>
            <button onClick={() => router.push("/")}>Return Home</button>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
