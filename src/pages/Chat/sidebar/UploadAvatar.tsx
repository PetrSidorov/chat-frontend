// import { useEffect, useState } from "react";
// export default function UploadAvatar() {
//   const [image, setImage] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!image) {
//       alert("Please select an image first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("avatar", image);

//     try {
//       const response = await fetch("http://localhost:3007/api/user-avatar/", {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       const data = await response.json();

//       console.log("Success:", data);
//       setUploadStatus("Upload successful!");
//     } catch (error) {
//       console.error("Error:", error);
//       setUploadStatus("Upload failed.");
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input type="file" onChange={handleImageChange} accept="image/*" />
//         <button type="submit">Upload Image</button>
//       </form>
//       {uploadStatus && <div>{uploadStatus}</div>}
//     </div>
//   );
// }
import React, { useState } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-easy-crop";
// import "./styles.css";

export default function App1() {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels);
  };
  return (
    <div className="App1">
      <div className="crop-container">
        <Cropper
          image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="controls">
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => {
            setZoom(e.target.value);
          }}
          className="zoom-range"
        />
      </div>
    </div>
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
