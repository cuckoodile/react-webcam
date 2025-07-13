import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import paimon from "./assets/capture-sound.mp3";
import useGetAttendanceApi from "./api/getAttendanceApi";
import usePostAttendanceApi from "./api/postAttendanceApi";

const App = () => {
  const { data, isLoading, isError } = useGetAttendanceApi();
  const sampleMutation = usePostAttendanceApi();

  const webcamRef = useRef(null);
  const audioRef = useRef(new Audio(paimon));
  const [captures, setCaptures] = useState([]);
  const [isCooldown, setIsCooldown] = useState(false);
  // Camera settings state
  const [facingMode, setFacingMode] = useState("user"); // user = front, environment = back
  const [isMirrored, setIsMirrored] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotate, setRotate] = useState(0); // 0, 90, 180, 270

  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  }

  const captureImage = () => {
    if (isCooldown) return;
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      audioRef.current.play();
      // Apply transformations to the captured image using a canvas
      if (imageSrc) {
        const img = new window.Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          // For 90/270 rotation, swap width/height
          const rotateRad = (rotate * Math.PI) / 180;
          let drawWidth = img.width;
          let drawHeight = img.height;
          if (rotate % 180 !== 0) {
            canvas.width = img.height;
            canvas.height = img.width;
          } else {
            canvas.width = img.width;
            canvas.height = img.height;
          }
          const ctx = canvas.getContext('2d');
          // Move to center for rotation
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(rotateRad);
          ctx.scale(
            isMirrored ? -1 : 1,
            isFlipped ? -1 : 1
          );
          // Draw image centered
          ctx.drawImage(
            img,
            -img.width / 2,
            -img.height / 2,
            img.width,
            img.height
          );
          ctx.restore();
          const transformedDataUrl = canvas.toDataURL('image/jpeg');
          setCaptures((prev) => [transformedDataUrl, ...prev].slice(0, 5));
          const blob = dataURLtoBlob(transformedDataUrl);
          const formData = new FormData();
          formData.append("img", blob, "capture.jpg");
          console.log("Image captured: ", transformedDataUrl);
          sampleMutation.mutate(formData);
        };
        img.src = imageSrc;
      }
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 3000);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="font-sans flex flex-col items-center w-screen h-screen bg-blue-200 overflow-hidden">
      <h2 className="text-red-600">📷 Webcam Capture Demo</h2>

      {/* Camera Settings Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          className={`px-3 py-1 rounded ${facingMode === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFacingMode('user')}
        >Front</button>
        <button
          className={`px-3 py-1 rounded ${facingMode === 'environment' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setFacingMode('environment')}
        >Back</button>
        <button
          className={`px-3 py-1 rounded ${isMirrored ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setIsMirrored((m) => !m)}
        >Mirror</button>
        <button
          className={`px-3 py-1 rounded ${isFlipped ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setIsFlipped((f) => !f)}
        >Flip Vertically</button>
        <button
          className="px-3 py-1 rounded bg-gray-200"
          onClick={() => setRotate((r) => (r + 90) % 360)}
        >Rotate</button>
        <span className="px-2">Rotation: {rotate}°</span>
      </div>

      {/* Webcam View */}
      <div className="w-full max-w-[600px] my-20 flex justify-center">
        <div
          style={{
            transform: `
              scaleX(${isMirrored ? -1 : 1})
              scaleY(${isFlipped ? -1 : 1})
              rotate(${rotate}deg)
            `,
            transition: 'transform 0.3s',
            width: '100%',
          }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full rounded-lg border-2 border-[#333]"
            videoConstraints={{ facingMode }}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Capture Button */}
      <button
        onClick={captureImage}
        className={`px-5 py-2 text-lg rounded-md mb-5 text-white transition-opacity ${
          isCooldown
            ? "bg-gray-400 cursor-not-allowed opacity-60"
            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
        }`}
        disabled={isCooldown}
      >
        {isCooldown ? "Cooldown..." : "Capture 📸"}
      </button>

      {/* Display Latest Captures from Data */}
      <div className="w-full max-w-[600px] overflow-x-auto">
        <div className="flex gap-4 p-2">
          {data?.map((item, index) => (
            <div
              key={index}
              className="min-w-[120px] h-[120px] bg-white rounded shadow flex items-center justify-center"
            >
              {/* Replace with actual content */}
              <img
                src={item?.img}
                alt={`Capture ${index}`}
                className="w-full h-full object-cover rounded"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
