"use client";

interface UserProfileProps {
  userInfo: {
    _id: string;
    assignedCountry: string;
    role: string;
    email: string;
  };
}

import axios from "axios";
import { useState } from "react";

function Modal({
  userInfo,
  onClose,
}: {
  userInfo: {
    _id: string;
    assignedCountry: string;
    role: string;
    email: string;
  };
  onClose: () => void;
}) {
  const [changeCountry, setChangeCountry] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded shadow-lg relative">
        <div>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 hover:text-red-600"
          >
            Close
          </button>
          <div>
            <p>
              <span className="font-semibold">User id: </span>
              {userInfo?._id}
            </p>
            <p>
              <span className="font-semibold">Email: </span>
              {userInfo?.email}
            </p>
            <p>
              <span className="font-semibold">Role: </span>
              {userInfo?.role}
            </p>

            {userInfo?.role !== "admin" && (
              <p>
                <span className="font-semibold">
                  Assigned country: {userInfo?.assignedCountry}
                </span>
              </p>
            )}
          </div>
        </div>
        {!changeCountry ? (
          <div>
            {userInfo?.role === "admin" ? (
              <p>
                (users with viewer role has opation to change country,A admin
                doesn&apos;t need it)
              </p>
            ) : (
              <p>
                <p>want to change country?</p>{" "}
                <button
                  onClick={() => {
                    setChangeCountry(true);
                  }}
                  className="bg-black text-white p-1 rounded-md"
                >
                  {" "}
                  Yes
                </button>
              </p>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <select
              onChange={(e) => {
                setSelectedCountry(e.target.value);
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
              onClick={async () => {
                try {
                  setLoading(true);
                  if (selectedCountry) {
                    console.log("change country to", selectedCountry);
                    const res = await axios.put("/api/updateAssignedCountry", {
                      id: userInfo._id,
                      assignedCountry: selectedCountry,
                    });
                    if (res.status === 200) {
                      setTimeout(() => {
                        onClose();
                      }, 2000);
                    }
                  }
                } catch (error) {
                  console.log("error", error);
                } finally {
                  setLoading(false);
                }
              }}
              className="bg-black text-white p-1 rounded-md"
            >
              {loading ? "Changing..." : "Change country"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UserProfile({ userInfo }: UserProfileProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div
        className="p-2 bg-black font-semibold text-white rounded-full w-16 h-14 flex items-center cursor-pointer absolute top-4 right-4"
        onClick={handleOpenModal}
      >
        profile
      </div>
      {isModalOpen && <Modal userInfo={userInfo} onClose={handleCloseModal} />}
    </div>
  );
}
