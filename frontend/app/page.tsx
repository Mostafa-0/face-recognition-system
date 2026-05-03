"use client";

import { useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraOn(true);
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const captureAndSend = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setLoading(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx?.drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/jpeg", 0.7);

    const res = await fetch("http://localhost:8000/recognize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const systemOnline = true; // later you can tie this to backend health

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-wide">ACCESS CONTROL</h1>
        <p className="text-gray-400 mt-1">Face Recognition System</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-105 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5">
        {/* Camera */}
        <div className="h-65 bg-black rounded-xl border border-neutral-800 flex items-center justify-center relative overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${!cameraOn ? "hidden" : ""}`}
          />

          {/* Activate Camera inside view */}
          {!cameraOn && (
            <button
              onClick={startCamera}
              className="absolute px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-sm cursor-pointer"
            >
              Activate Camera
            </button>
          )}

          {/* Result overlay */}
          {result && !loading && (
            <div className="absolute bottom-2 left-2 right-2 bg-black/70 border border-neutral-800 rounded-lg px-3 py-2 text-sm flex justify-between">
              <span>{result.name || "Unknown"}</span>
              <span
                className={`font-semibold ${
                  result.status === "granted"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {result.status === "granted" ? "GRANTED" : "DENIED"}
              </span>
            </div>
          )}
        </div>

        {/* Sign In button */}
        <button
          onClick={captureAndSend}
          disabled={!cameraOn || loading}
          className="w-full h-10 rounded-xl py-2 border transition bg-neutral-800 hover:bg-neutral-700 border-neutral-700 cursor-pointer disabled:bg-neutral-900 disabled:border-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <div className="size-4 m-auto border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Status */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm space-y-2">
          <div className="flex justify-between items-center text-neutral-500">
            <span>System</span>

            <div className="flex items-center gap-1.5">
              {/* Dot FIRST */}
              <span
                className={`size-2.5 rounded-full ${
                  systemOnline ? "bg-green-400 animate-pulse" : "bg-red-500"
                }`}
              ></span>

              <span
                className={systemOnline ? "text-green-400" : "text-red-400"}
              >
                {systemOnline ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <span>Last Scan</span>
            <span>
              {result
                ? result.status === "granted"
                  ? "Authorized"
                  : "Denied"
                : "—"}
            </span>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
