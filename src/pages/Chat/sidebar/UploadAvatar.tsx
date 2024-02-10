import { useEffect, useState } from "react";
// import useFetchDB from "../../../hooks/useFetchDB";
export default function UploadAvatar() {
  //   const { loading, data, error, setFetchData } = useFetchDB<any>();

  const [image, setImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  //   useEffect(() => {
  //     if (!user) {
  //       setFetchData({
  //         url: "http://localhost:3007/api/user-data",
  //         method: "GET",
  //       });
  //     }
  //   }, []);

  //   useEffect(() => {
  //     setImage(data);
  //   }, [data]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", image);

    try {
      const response = await fetch("http://localhost:3007/api/user-avatar/", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      console.log("Success:", data);
      setUploadStatus("Upload successful!");
    } catch (error) {
      console.error("Error:", error);
      setUploadStatus("Upload failed.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <button type="submit">Upload Image</button>
      </form>
      {uploadStatus && <div>{uploadStatus}</div>}
    </div>
  );
}
