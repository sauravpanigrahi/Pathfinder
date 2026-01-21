import React from "react";

export default function ATSCircleScore({
  score = 0,
  size = 100,
  strokeWidth = 10,
  label = "ATS Score",
}) {
  const safe = Math.max(0, Math.min(100, Number(score) || 0));

  // Define colors by score range
  const color =
    safe < 50 ? "#ef4444" : safe < 75 ? "#f59e0b" : "#22c55e";

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safe / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
        <p className="text-sm text-gray-500">{label}</p>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        aria-label={label}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Score in the center */}
      <div className="absolute flex flex-col items-center justify-center ">
        <p
          className="text-xl font-bold  "
          style={{ color }}
        >
          {safe}%
        </p>
        
      </div>

      {/* Feedback below */}
      <p className="mt-2 text-xs text-gray-600 text-center">
        {safe < 50
          ? "Low match — add missing keywords."
          : safe < 75
          ? "Good — polish achievements and phrasing."
          : "Excellent — strong match with the JD!"}
      </p>
    </div>
  );
}
