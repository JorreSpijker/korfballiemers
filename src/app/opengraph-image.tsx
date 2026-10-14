import { ImageResponse } from "next/og";

export const alt = "WK Korfbal 2027 in de Liemers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Standaard deelafbeelding (WhatsApp, Facebook, LinkedIn) in huisstijl
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0F0E",
          color: "#FFFFFF",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#3CCB68" }}>
          LiemersCity Korfbal
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>
            WK Korfbal 2027
          </div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1, color: "#3CCB68", letterSpacing: -2 }}>
            in de Liemers
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "rgba(230,236,234,0.8)", marginTop: 12 }}>
            15 t/m 17 oktober 2027 · Doesburg · Duiven · Westervoort · Zevenaar
          </div>
        </div>
        <div style={{ display: "flex", height: 12, width: "100%" }}>
          <div style={{ flex: 1, background: "#22B24C" }} />
          <div style={{ flex: 1, background: "#1D5BF0" }} />
        </div>
      </div>
    ),
    size
  );
}
