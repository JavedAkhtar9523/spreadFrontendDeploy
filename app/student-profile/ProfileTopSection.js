"use client";
import React, { useRef, useState } from "react";
import { RiCameraAiLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, updateUserById } from "../store/userSlice";
import { Buttonborder } from "../components/Button";
import ContactInfoModal from "./ContactInfoModal";
import { Camera } from "lucide-react";
import { AddAPhoto, Photo } from "@mui/icons-material";
import { Button2 } from "../components/button/Button2";

export default function ProfileTopSection({ user }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.users.currentUser);

  const isOwner = currentUser?.id === user?.id;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);

    if (isOwner) {
      dispatch(updateUser({ [type]: url }));
    }
  };

  const handleRemoveCover = () => {
    if (isOwner) {
      dispatch(updateUser({ cover: null }));
    }
  };

  const handleRemoveAvatar = () => {
    if (isOwner) {
      dispatch(updateUser({ avatar: null }));
    }
  };

  return (
    <div className="relative">
      {/* Cover */}
      <div className="relative overflow-hidden w-full h-32 md:h-[170px] rounded-xl border border-gray-200 bg-[#fafafa] group">
        {/* COVER IMAGE */}
        {currentUser?.cover ? (
          <img
            src={currentUser.cover}
            alt="Cover"
            className="h-full w-full object-cover rounded-xl"
          />
        ) : (
          <div className="h-full w-full bg-[#f0f0f6e3] rounded-xl" />
        )}

        {/* UPLOAD BUTTON */}
        {isOwner && (
          <>
            {/* Camera icon – show only on hover when cover exists OR permanently centered if none */}
            <div
              className={`absolute transition-opacity duration-200
          ${currentUser?.cover ? "opacity-0 group-hover:opacity-100 top-3 right-3" :
                  "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100"}
        `}
            >
              <button
                onClick={() => coverInputRef.current?.click()}
                className="bg-white/90 p-2 rounded-full cursor-pointer shadow hover:scale-105 transition"
              >
                <Camera className="text-gray-600 text-xl" />
              </button>
            </div>

            {/* Hidden input to upload image */}
            <input
              type="file"
              accept="image/*"
              ref={coverInputRef}
              onChange={(e) => handleFileChange(e, "cover")}
              className="hidden"
            />

            {/* REMOVE COVER BUTTON – visible only if cover exists */}
            {currentUser?.cover && (
              <button
                onClick={handleRemoveCover}
                className="absolute top-3 right-14 opacity-0 group-hover:opacity-100 text-sm px-3 py-1 rounded-md shadow hover:border-gray-300 transition"
              >
                Remove Cover
              </button>
            )}
          </>
        )}
      </div>


      {/* Avatar */}
      <div className="absolute -bottom-12 left-8 md:left-10 w-20 h-20 md:w-[100px] md:h-[100px] rounded-xl border border-gray-200 bg-[#fafbff] overflow-hidden">
        {
          currentUser?.avatar ? (
            <img
              src={currentUser?.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="h-full w-full bg-[#f0f0f5] rounded-xl" />
          )
        }

        {isOwner && !currentUser?.avatar && (
          <div
            className="absolute inset-0 flex justify-center items-center cursor-pointer"
            onClick={() => avatarInputRef.current?.click()}
          >
            <div className="bg-white p-2 rounded-full hover:scale-105 transition">
              <PlusCircle className="text-gray-600 text-xl" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              onChange={(e) => handleFileChange(e, "avatar")}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Edit Button */}
      {isOwner && (
        <div className="flex text-end mt-5 absolute right-2">
          <Button2
            onClick={() => setIsModalOpen(true)}
            name="Edit"
            classNameborder="!text-sm w-20 h-8 !px-4 !py-2"
          />
        </div>
      )}

      {/* Contact Info Modal */}
      <ContactInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={currentUser}
        onSave={(updatedInfo) => {
          dispatch(updateUser({ ...updatedInfo }));
          setIsModalOpen(false);
        }}

      />
    </div>
  );
}