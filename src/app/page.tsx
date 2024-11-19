"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import CreateNewData from "./components/createNewdata";
import DisplayCountryData from "./components/displayCountryData";
import UserProfile from "./components/userProfile";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();
  const [createDataModel, setCreateDataModel] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<{
    assignedCountry?: string;
    role?: string;
  } | null>(null);
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
        <p>hello please signin to view webapp</p>
      </SignedOut>

      <SignedIn>
        <p>{user?.id}</p>
        <p>{user?.primaryEmailAddress?.emailAddress}</p>
        <p>assigned country: {userInfo?.assignedCountry}</p>
        <p>role: {userInfo?.role}</p>
        <button
          className="bg-black p-2 rounded-md text-white font-semibold"
          onClick={() => {
            console.log("user", user);
            console.log("userInfo", userInfo);
          }}
        >
          get info
        </button>
        <button
          className="bg-black p-2 rounded-md text-white font-semibold"
          onClick={() => {
            setCreateDataModel(true);
          }}
        >
          Create new Data
        </button>
        {createDataModel && (
          <CreateNewData
            userInfo={userInfo}
            setCreateDataModel={setCreateDataModel}
          />
        )}
        {userInfo && <DisplayCountryData userInfo={userInfo} />}
        <UserProfile userInfo={userInfo} />
      </SignedIn>
    </div>
  );
}
