"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import CreateNewData from "./components/createNewdata";
import DisplayCountryData from "./components/displayCountryData";
import UserProfile from "./components/userProfile";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();
  const [createDataModel, setCreateDataModel] = useState<boolean>(false);

  const [userInfo, setUserInfo] = useState<{
    _id: string;
    assignedCountry: string;
    role: string;
    email: string;
  }>({
    _id: "",
    assignedCountry: "",
    role: "",
    email: "",
  });

  const { signOut } = useClerk();
  useEffect(() => {
    // console.log("user", user);
    const getUserInfo = async () => {
      const res = await axios.post("/api/getUserInfo", { id: user?.id });
      if (res.status !== 200) {
        console.log("error", res);
        return;
      }
      setUserInfo(res.data[0]);
    };
    if (user) {
      getUserInfo();
    }
  }, [user]);
  return (
    <div>
      <SignedOut>
        <div className="bg-red-300 font-semibold min-h-screen flex flex-col justify-center items-center">
          <p className="text-lg">Welcome to my compylance assignment</p>
          <p className="pb-10">hello please signin to view my webapp</p>
          <button className="bg-black text-white rounded-md p-1">
            <SignInButton />
          </button>
          <p className="pt-10">
            register yourself as a admin or a viewer ,there is a onboarding page
            next to set this preferences while creating a new account
          </p>
          <p className="text-xl">
            Don&apos;t forget to Signup first before Sign in{" "}
          </p>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="p-4 flex flex-col gap-4 items-start">
          <button
            className="bg-black p-2 rounded-md text-white font-semibold w-fit"
            onClick={() => {
              signOut();
            }}
          >
            signout
          </button>
          <div className="border p-2 w-fit rounded-sm">
            <p className="font-semibold underline">Logged in user Data:</p>
            {/* <p>{user?.id}</p> */}
            <p>
              <span className="font-semibold">Your email:</span>{" "}
              {user?.primaryEmailAddress?.emailAddress}
            </p>
            <p>
              <span className="font-semibold">Your assigned country:</span>{" "}
              {userInfo?.assignedCountry}
            </p>
            <p>
              <span className="font-semibold">Your role:</span> {userInfo?.role}
            </p>
          </div>
          <div className="flex gap-2 justify-start items-center">
            <button
              className="bg-black p-2 rounded-md text-white font-semibold w-fit"
              onClick={() => {
                setCreateDataModel(true);
              }}
            >
              Create new Data
            </button>
            {userInfo?.role === "admin" ? (
              <p></p>
            ) : (
              <p className="text-red-500">
                ( As a {userInfo.role} you have 2 operations to do: 1.Create new
                data under your assigned country 2.View data)
                <p>
                  create a admin role account to: 1.view other users,2.view,edit
                  & delete all data of all countries
                </p>
              </p>
            )}
          </div>
          {createDataModel && userInfo && (
            <CreateNewData
              userInfo={userInfo}
              setCreateDataModel={setCreateDataModel}
            />
          )}
          {userInfo && <DisplayCountryData userInfo={userInfo} />}
          <UserProfile userInfo={userInfo} />
        </div>
      </SignedIn>
    </div>
  );
}
