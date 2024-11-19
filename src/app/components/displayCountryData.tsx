"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import UpdateCountrydata from "./updateCountryData";

interface DisplayCountryDataProps {
  userInfo: any;
}

export default function DisplayCountryData({
  userInfo,
}: DisplayCountryDataProps) {
  const [data, setData] = useState<any>(null);
  const [country, setCountry] = useState<string>("India");
  const [adminCountryData, setAdminCountryData] = useState<any>(null);
  const [updateDataModel, setUpdateDataModel] = useState<boolean>(false);
  const [updatingData, setUpdatingData] = useState<any>(null);
  useEffect(() => {
    const getCountryData = async () => {
      const res = await axios.post("/api/getCountryData", {
        country: userInfo.assignedCountry,
      });
      setData(res.data);
    };
    if (userInfo.role !== "admin") {
      getCountryData();
    }
  }, []);

  useEffect(() => {
    const getCountryData = async () => {
      const res = await axios.post("/api/getCountryData", {
        country: country,
      });

      const updatedData = await Promise.all(
        res.data.map(async (d: any) => {
          let modifiedBy = "";
          if (d.lastModifiedBy != undefined) {
            modifiedBy = await getEmailById(d.lastModifiedBy);
          } else {
            modifiedBy = "none";
          }
          const email = await getEmailById(d.createdBy);
          return { ...d, email, modifiedBy };
        })
      );
      setAdminCountryData(updatedData);
    };
    if (country && userInfo.role === "admin") {
      getCountryData();
    }
  }, [country]);

  const getEmailById = async (id: any) => {
    try {
      const res = await axios.post("/api/getUserById", { id: id });
      return res?.data?.email;
    } catch (error) {
      console.log("error fetching email of data creator", error);
      return null;
    }
  };

  return (
    <div className="bg-red-400 p-2 rounded-md flex flex-col gap-2">
      {userInfo.role === "admin" ? (
        <select
          onChange={(event) => {
            event.preventDefault();
            setCountry(event.target.value);
          }}
          name=""
          id=""
        >
          <option value=""> select country</option>
          <option value="india">India</option>
          <option value="america">America</option>
          <option value="china">China</option>
          <option value="japan">Japan</option>
          <option value="australia">Australia</option>
          <option value="russia">Russia</option>
        </select>
      ) : null}

      {userInfo.role !== "admin" &&
        data &&
        data.map((d: any) => {
          return (
            <div className="bg-slate-400 p-2" key={d.id}>
              <p>{d.id}</p>
              <p>title: {d.title}</p>
              <p>description: {d.description}</p>
              <p>country: {d.country}</p>
            </div>
          );
        })}

      {userInfo.role === "admin" &&
        adminCountryData &&
        adminCountryData.map((d: any) => {
          return (
            <div className="bg-slate-400 p-2" key={d.id}>
              <div className="flex justify-between">
                <p>title: {d.title}</p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setUpdatingData(d);
                      setUpdateDataModel(true);
                    }}
                    className="cursor-pointer hover:text-green-500 font-semibold scale-[101%] bg-white p-2 rounded-md"
                  >
                    edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setUpdatingData(d);
                      setUpdateDataModel(true);
                    }}
                    className="cursor-pointer hover:text-red-600 font-semibold scale-[101%] bg-white p-2 rounded-md"
                  >
                    delete
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <p>description: {d.description}</p>
                <p>last modified by: {d.modifiedBy}</p>
              </div>
              <div className="flex justify-between">
                <p>country: {d.country}</p>
                <p>created by:{d.email}</p>
              </div>
            </div>
          );
        })}

      {updateDataModel && (
        <UpdateCountrydata
          data={updatingData}
          userInfo={userInfo}
          setUpdateDataModel={setUpdateDataModel}
        />
      )}
    </div>
  );
}
