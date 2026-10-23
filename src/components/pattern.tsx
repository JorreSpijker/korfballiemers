export function Pattern() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgb(230 236 234 / 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgb(230 236 234 / 0.05) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
      }}
    />
  );
}
