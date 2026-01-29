import { useEffect, useState } from "react";
// const BACKEND_URL = "https://pathfinder-maob.onrender.com";
const BACKEND_URL = "https://pathfinder-maob.onrender.com";

export function useBackendWakeup(enabled = true) {
  const [status, setStatus] = useState("idle");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let interval;
    const check = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/health`, {
          cache: "no-store",
        });
        if (res.ok) {
          setStatus("online");
          clearInterval(interval);
        }
      } catch {
        setStatus("starting");
        setAttempts((a) => a + 1);
      }
    };
    setStatus("checking");
    check();
    interval = setInterval(check, 10000);

    return () => clearInterval(interval);
  }, [enabled]);

  return { status, attempts };
}