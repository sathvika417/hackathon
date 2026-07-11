import React from "react";

/** Animated background orbs (blurred glowing blobs) for extra depth */
const AmbientOrbs = () => (
  <>
    <div
      className="orb"
      style={{
        top: "10%", left: "8%", width: 380, height: 380,
        background: "radial-gradient(circle, rgba(37,99,235,0.7), transparent 70%)",
      }}
    />
    <div
      className="orb"
      style={{
        top: "40%", right: "5%", width: 420, height: 420,
        background: "radial-gradient(circle, rgba(139,92,246,0.55), transparent 70%)",
        animationDelay: "3s",
      }}
    />
    <div
      className="orb"
      style={{
        bottom: "5%", left: "35%", width: 500, height: 500,
        background: "radial-gradient(circle, rgba(6,182,212,0.5), transparent 70%)",
        animationDelay: "6s",
      }}
    />
    <div className="grain" />
  </>
);

export default AmbientOrbs;
