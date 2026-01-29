export default function BackendWakeupOverlay({ status, attempts }) {
  if (status === "online") return null;

  return (
    <div style={overlay}>
      <div style={box}>
        <h3>⏳ Please wait</h3>
        <p style={{ marginTop: "8px" }}>
          Backend is currently hosted on <b>Render Free-tier</b> and may take a
          moment to start after inactivity.
        </p>
        <small>Attempt #{attempts} · Usually takes 2-3 minutes. </small> 
       <p>      Refresh the page onces</p>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 99999,
};
const box = {
  background: "#0f172a",
  color: "#fff",
  padding: "24px",
  borderRadius: "14px",
  textAlign: "center",
  maxWidth: "320px",
};
