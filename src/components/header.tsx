import Image from "next/image";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setNavbarOpen(false);
    router.push(`/${e.currentTarget.name}`);
  };
  const handleSignOut = (e: MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.innerText = "Logging out...";
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0">
      <nav className="flex items-center justify-between flex-wrap bg-primary p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          {/* <Image src="" alt="" /> */}
          <button
            name=""
            className="font-semibold text-xl tracking-tight"
            onClick={handleClick}
          >
            BUlletin
          </button>
        </div>
        <div className="block lg:hidden">
          <button
            className="flex items-center px-3 py-2 border rounded text-white hover:text-white hover:border-white"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div
          className={
            "w-full flex-grow lg:flex lg:items-center lg:w-auto" +
            (navbarOpen ? " block" : " hidden")
          }
        >
          <div className="text-m lg:flex-grow">
            <button
              name="stack"
              onClick={handleClick} // View T3 stack
              className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4"
            >
              Stack
            </button>
            <button
              onClick={() =>
                (window.location.href =
                  "https://github.com/aaron-ang/my-t3-app")
              } // Github repo
              className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4"
            >
              Github
            </button>
            <button
              name="contact"
              onClick={handleClick} // Feedback page
              className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4"
            >
              Contact
            </button>
            {user && (
              <button
                name="dashboard"
                onClick={handleClick} // Dashboard page
                className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4"
              >
                Dashboard
              </button>
            )}
          </div>
          <div>
            {user ? (
              <button
                onClick={handleSignOut} // Log out
                className="inline-block text-m px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-primary hover:bg-white mt-4 lg:mt-0"
              >
                Log out
              </button>
            ) : (
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })} // Log in
                className="inline-block text-m px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-primary hover:bg-white mt-4 lg:mt-0"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
