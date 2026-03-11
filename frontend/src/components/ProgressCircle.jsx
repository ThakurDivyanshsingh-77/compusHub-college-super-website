import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ProgressCircle({ value, label }) {
  return (
    <div className="card p-5 flex flex-col items-center justify-center gap-4 text-center h-full">
      <div className="w-24 h-24 relative">
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            textColor: "#0f172a",
            pathColor: "#f97316", // primary
            trailColor: "#f1f5f9", // slate-100
            textSize: '22px',
            pathTransitionDuration: 1,
            strokeLinecap: 'round',
          })}
        />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] pointer-events-none"></div>
      </div>
      <div>
        <div className="text-sm font-medium text-slate-500 mb-1">{label}</div>
      </div>
    </div>
  );
}
