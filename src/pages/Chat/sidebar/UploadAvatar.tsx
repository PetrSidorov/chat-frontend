type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../utils/getCroppedImg";
import { AuthContext } from "../../../context/AuthProvider";

function UploadAndCropAvatar() {
  const { user, setUser } = useContext(AuthContext);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result === "string") {
          setImageSrc(reader.result);
        }
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  function resetToInitials() {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setUploadStatus("");
  }

  function handleCropCancel(keyboardEvent: KeyboardEvent) {
    if (keyboardEvent.key == "Escape") {
      resetToInitials();
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleCropCancel);

    return () => window.removeEventListener("keydown", handleCropCancel);
  }, []);

  const handleUpload = async () => {
    if (!croppedAreaPixels) {
      alert("Please select and crop an image first.");
      return;
    }

    try {
      if (!imageSrc) return;
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("avatar", croppedImageBlob, `${crypto.randomUUID()}.jpg`);

      const response = await fetch("http://localhost:3007/api/user-avatar/", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser((userInfo) => {
          console.log(userInfo);
          if (userInfo) {
            return { ...userInfo, avatarUrl: data.url };
          }
          return userInfo;
        });
        setUploadStatus("Upload successful!");
        resetToInitials();
      } else {
        throw new Error("Upload failed with status: " + response.status);
      }
    } catch (error) {
      console.error("Error:", error);
      setUploadStatus("Upload failed.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      {imageSrc && (
        <>
          <div className="crop-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="controls bg-slate-700 flex justify-around p-10">
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleUpload}
            >
              Upload Image
            </button>
          </div>
        </>
      )}
      {uploadStatus && <div>{uploadStatus}</div>}
    </div>
  );
}

export default UploadAndCropAvatar;
