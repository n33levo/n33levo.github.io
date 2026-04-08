import { useEffect } from "react";

const WebringWidget = () => {
  useEffect(() => {
    const SCRIPT_ID = "webring-ca-embed";

    // Remove any existing script so the IIFE re-runs against the freshly mounted div
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://webring.ca/embed.js";
    document.body.appendChild(script);

    return () => {
      // Remove on unmount so re-mounting (e.g. route changes) re-initialises the widget
      const s = document.getElementById(SCRIPT_ID);
      if (s) s.remove();
    };
  }, []);

  return (
    <div
      data-webring="ca"
      data-member="neel-sarkar"
      style={
        {
          "--webring-color": "inherit",
          "--webring-accent": "#f97316",
          "--webring-size": "0.85rem",
        } as React.CSSProperties
      }
    />
  );
};

export default WebringWidget;
