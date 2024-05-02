import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const CircularWebcam = ({ endpointUrl, numImages, onResponse, buttonLabel = "detect emotion" }) => {
  const webcamRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const captureAndSendImages = async () => {
    setIsLoading(true);
    let images = [];
    for (let i = 0; i < numImages; i++) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay for clear image capture
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const blob = await dataURLtoJPEGBlob(imageSrc);
        images.push(blob);
      }
    }

    if (images.length === numImages) {
      const responses = await Promise.all(
        images.map(imageBlob => {
          const formData = new FormData();
          formData.append('file', imageBlob);
          return axios.post(endpointUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          }).catch(error => {
            console.error('Backend Error:', error.response?.data?.error); // Log backend error message
            return { error: true, message: error.response?.data?.error }; // Return an error object
          });
        })
      );

      onResponse(responses.map(response => {
        return response.error ? { error: response.message } : response.data;
      }));
    } else {
      console.error("Failed to capture enough images");
    }
    setIsLoading(false);
  };


  const dataURLtoJPEGBlob = async (dataURL) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
          resolve(blob);
        }, 'image/jpeg', 0.95);
      };
      img.onerror = reject;
      img.src = dataURL;
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: '300px', height: '300px', borderWidth: "2px", borderColor: "grey", overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ width: 640, height: 680 }}
          style={{ width: "640px", height: "680px" }}
        />
      </div>
      {!isLoading && (
        <button
          onClick={captureAndSendImages}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          {buttonLabel}
        </button>
      )}
      {isLoading && (
        <div className="mt-6 text-xl font-semibold text-green-500">Processing, please wait...</div>
      )}
    </div>
  );
};

export default CircularWebcam;
