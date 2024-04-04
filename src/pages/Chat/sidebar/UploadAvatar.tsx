import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../utils/getCroppedImg";
import { AuthContext } from "../../../context/AuthProvider";
import FocusLock from "react-focus-lock";

type Area = {
  x: number;
  y: number;
  width: number;
  height: number;
};

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
      // TODO:TYPESCRIPT + something more meaningful
      console.error("Error:", error);
      setUploadStatus("Upload failed.");
    }
  };

  return (
    // TODO:CSS move this margin up

    <div className="space-y-4">
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
      {imageSrc && (
        <FocusLock>
          <>
            <div className="crop-container relative w-full h-64">
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
            <div className="controls bg-slate-700 flex justify-around p-4 rounded">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="zoom-slider"
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleUpload}
              >
                Upload Image
              </button>
            </div>
          </>
        </FocusLock>
      )}
      {uploadStatus && <div className="text-center">{uploadStatus}</div>}
    </div>
  );
}

export default UploadAndCropAvatar;
