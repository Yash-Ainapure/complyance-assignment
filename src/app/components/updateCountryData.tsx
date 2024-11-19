"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface UpdateCountrydataProps {
  userInfo: any;
  setUpdateDataModel: (value: boolean) => void;
  data: any;
}

export default function UpdateCountrydata({
  userInfo,
  setUpdateDataModel,
  data,
}: UpdateCountrydataProps) {
  const [newdata, setNewData] = useState<any>(null);
  useEffect(() => {
    setNewData(data);
  }, []);
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <div className="inset-0 absolute w-full min-h-screen flex items-center justify-center bg-black bg-opacity-60">
      heyy
      <div className="absolute p-2 rounded-md top-1/2 left-1/2 transform -translate-x-1/2 bg-white -translate-y-1/2 w-[50%] h-[50%]">
        <p
          onClick={() => {
            setUpdateDataModel(false);
          }}
          className="text-red-600 font-semibold text-lg  text-end p-2 cursor-pointer"
        >
          X
        </p>
        <form className="flex gap-2 flex-col justify-center items-center">
          <input
            value={newdata?.title}
            required
            onChange={(e) => {
              setNewData({ ...newdata, title: e.target.value });
            }}
            className="border"
            type="text"
            placeholder="title"
          />
          <input
            value={newdata?.description}
            required
            onChange={(e) => {
              setNewData({ ...newdata, description: e.target.value });
            }}
            className="border"
            type="text"
            placeholder="description"
          />
          <select
            value={newdata?.country || ""}
            onChange={(e) => {
              setNewData({ ...newdata, country: e.target.value });
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
          <button
            onClick={async (e) => {
              e.preventDefault();
              try {
                setLoading(true);
                const res = await axios.put("/api/updateData", {
                  id: newdata._id,
                  title: newdata.title,
                  description: newdata.description,
                  country: newdata.country,
                  updatingUser: userInfo._id,
                });
              } catch (err) {
                console.log("error", err);
              } finally {
                setLoading(false);
              }
            }}
            className="bg-black text-lg font-semibold text-white p-2 rounded-md w-72"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}
