import React, { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../utils/getCroppedImg";

function UploadAndCropAvatar() {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImageSrc(reader.result.toString())
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
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
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("avatar", croppedImageBlob, "avatar.jpg");

      const response = await fetch("http://localhost:3007/api/user-avatar/", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
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
