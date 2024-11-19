"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { use, useEffect, useState } from "react";

interface CreateNewDataProps {
  userInfo: any;
  setCreateDataModel: (value: boolean) => void;
}

export default function CreateNewData({
  userInfo,
  setCreateDataModel,
}: CreateNewDataProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    console.log("dataft i got", userInfo);
  }, []);
  return (
    <div className="inset-0 absolute w-full min-h-screen flex items-center justify-center bg-black bg-opacity-60">
      heyy
      <div className="absolute p-2 rounded-md top-1/2 left-1/2 transform -translate-x-1/2 bg-white -translate-y-1/2 w-[50%] h-[50%]">
        <p
          onClick={() => {
            setCreateDataModel(false);
          }}
          className="text-red-600 font-semibold text-lg  text-end p-2 cursor-pointer"
        >
          X
        </p>
        <form className="flex gap-2 flex-col justify-center items-center">
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="border"
            type="text"
            placeholder="title"
          />
          <input
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className="border"
            type="text"
            placeholder="description"
          />
          {userInfo.role === "admin" ? (
            <select
              required
              onChange={(e) => {
                setCountry(e.target.value);
              }}
              className="border"
            >
              <option value="">Select country</option>
              <option value="india">India</option>
              <option value="america">America</option>
              <option value="china">China</option>
              <option value="japan">Japan</option>
              <option value="australia">Australia</option>
              <option value="russia">Russia</option>
            </select>
          ) : null}

          <button
            onClick={async (e) => {
              e.preventDefault();
              try {
                setLoading(true);
                let res = null;
                if (userInfo.role === "admin") {
                  res = await axios.post("/api/createData", {
                    title,
                    description,
                    createdBy: userInfo._id,
                    country: country,
                  });
                } else {
                  res = await axios.post("/api/createData", {
                    title,
                    description,
                    createdBy: userInfo._id,
                    country: userInfo.assignedCountry,
                  });
                }

                console.log("res", res);
              } catch (err) {
                console.log("error", err);
              } finally {
                setLoading(false);
              }
            }}
            className="bg-black text-lg font-semibold text-white p-2 rounded-md w-72"
          >
            {loading ? "creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
