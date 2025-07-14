"use client";

import React from "react";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import DashboardBtn from "./DashboardBtn";

const Navbar = () => {
  const { data: session, status } = useSession();
  console.log("Nav Status : ", status);

  return (
    <nav className="border-b items-center flex flex-col justify-center">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* Left side logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
        >
          <Image src="/icons/logo.svg" alt="logo" width={52} height={52} />
          <span className="text-clip bg-clip-text text-transparent bg-gradient-to-tr from-blue-600 via-blue-400 to-emerald-600">
            Recruv
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center space-x-4 ml-auto">
          {status === "authenticated" ? (
            <>
              <DashboardBtn />
              <ModeToggle />
              <button
                onClick={() => signOut()}
                className="text-sm px-3 py-1.5 bg-gray-200 dark:bg-red-700 rounded hover:opacity-80 transition"
              >
                Sign Out
              </button>
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
            </>
          ) : (
            <>
              <ModeToggle />
              <button
                onClick={() => signIn()}
                className="text-sm px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
