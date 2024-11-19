"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import UpdateCountrydata from "./updateCountryData";

interface DisplayCountryDataProps {
  userInfo: {
    _id: string;
    assignedCountry: string;
    role: string;
  };
}

export default function DisplayCountryData({
  userInfo,
}: DisplayCountryDataProps) {
  interface CountryData {
    _id: string;
    title: string;
    description: string;
    country: string;
    createdBy: string;
    lastModifiedBy?: string;
    email?: string;
    modifiedBy?: string;
  }

  const [data, setData] = useState<CountryData[] | null>(null);
  const [country, setCountry] = useState<string>("India");
  const [adminCountryData, setAdminCountryData] = useState<
    CountryData[] | null
  >(null);
  const [updateDataModel, setUpdateDataModel] = useState<boolean>(false);
  const [updatingData, setUpdatingData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getCountryData = async () => {
      try {
        setLoading(true);
        setData(null);
        const res = await axios.post("/api/getCountryData", {
          country: userInfo.assignedCountry,
        });
        setData(res.data);
      } catch (error: unknown) {
        console.log("error fetching country data", error);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo.role !== "admin") {
      getCountryData();
    }
  }, [userInfo.assignedCountry, userInfo.role]);

  useEffect(() => {
    const getCountryData = async () => {
      setLoading(true);
      setAdminCountryData(null);
      try {
        const res = await axios.post("/api/getCountryData", {
          country: country,
        });
        const updatedData = await Promise.all(
          res.data.map(async (d: CountryData) => {
            let modifiedBy = "";
            if (d.lastModifiedBy !== undefined) {
              modifiedBy = (await getEmailById(d.lastModifiedBy)) || "none";
            } else {
              modifiedBy = "none";
            }
            const email = await getEmailById(d.createdBy);
            return { ...d, email, modifiedBy };
          })
        );
        setAdminCountryData(updatedData);
      } catch (error: unknown) {
        console.log("error fetching country data", error);
      } finally {
        setLoading(false);
      }
    };
    if (country && userInfo.role === "admin") {
      getCountryData();
    }
  }, [country, userInfo.role]);

  const getEmailById = async (id: string): Promise<string | null> => {
    try {
      const res = await axios.post("/api/getUserById", { id: id });
      return res?.data?.email;
    } catch (error) {
      console.log("error fetching email of data creator", error);
      return null;
    }
  };

  return (
    <div className="bg-sky-300 p-2 rounded-md flex flex-col gap-2 w-full">
      {userInfo.role === "admin" ? (
        <p className="text-red-600">
          As a admin you can now view all countries data and add,edit or delete
          them
        </p>
      ) : (
        <p className="text-red-700">
          (you will be only able to view{" "}
          <span className="font-semibold underline">
            {userInfo.assignedCountry}&apos;s
          </span>{" "}
          data as you were assigned,to change your assigned country go to
          profile )
        </p>
      )}

      {userInfo.role === "admin" ? (
        <select
          className="p-2 bg-white rounded-md w-96"
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
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

      {loading && <p>loading...</p>}
      {userInfo.role !== "admin" &&
        data &&
        data.map((d: CountryData) => {
          return (
            <div className="bg-slate-400 p-2" key={d._id}>
              <p>
                <span className="font-semibold">title:</span> {d.title}
              </p>
              <p>
                <span className="font-semibold">description:</span>{" "}
                {d.description}
              </p>
              <p>
                <span className="font-semibold">country:</span> {d.country}
              </p>
            </div>
          );
        })}

      {userInfo.role === "admin" &&
        adminCountryData &&
        adminCountryData.map((d: CountryData) => {
          return (
            <div className="bg-slate-400 p-2" key={d._id}>
              <div className="flex justify-between">
                <p>
                  <span className="font-semibold">title:</span> {d.title}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      setUpdatingData(d);
                      setUpdateDataModel(true);
                    }}
                    className="cursor-pointer hover:text-green-500 font-semibold scale-[101%] bg-white p-2 rounded-md"
                  >
                    edit
                  </button>
                  <button
                    onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      console.log("delete", d._id);
                      const res = confirm(
                        "are you sure you want to delete this data?"
                      );
                      if (res) {
                        const result = await axios.delete(
                          `/api/deleteData/?id=${d._id}`
                        );
                        if (result.status === 200) {
                          alert("data deleted successfully");
                          setAdminCountryData(
                            adminCountryData.filter(
                              (data) => data._id !== d._id
                            )
                          );
                        }
                      }
                    }}
                    className="cursor-pointer hover:text-red-600 font-semibold scale-[101%] bg-white p-2 rounded-md"
                  >
                    delete
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <p>
                  <span className="font-semibold">description:</span>{" "}
                  {d.description}
                </p>
                <p>
                  <span className="font-semibold">last modified by:</span>{" "}
                  {d.modifiedBy}
                </p>
              </div>
              <div className="flex justify-between">
                <p>
                  <span className="font-semibold">country:</span> {d.country}
                </p>
                <p>
                  <span className="font-semibold">created by:</span>
                  {d.email}
                </p>
              </div>
            </div>
          );
        })}

      {updateDataModel && updatingData && (
        <UpdateCountrydata
          data={updatingData}
          userInfo={userInfo}
          setUpdateDataModel={setUpdateDataModel}
        />
      )}
    </div>
  );
}
