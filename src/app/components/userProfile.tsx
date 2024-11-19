"use client";

interface UserProfileProps {
  userInfo: any;
}

import { useEffect, useState } from "react";

function Modal({ userInfo, onClose }: { userInfo: any; onClose: () => void }) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white p-4 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 hover:text-red-600"
        >
          Close
        </button>
        <pre>{JSON.stringify(userInfo, null, 2)}</pre>
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
