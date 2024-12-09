// src/components/Widget.tsx
import React from "react";

// Define the WidgetProps interface
interface WidgetProps {
  title: string; // The title of the widget
  value: string | number; // The value displayed in the widget
  unit?: string; // The unit of the value (optional)
  backgroundColor?: string; // The background color of the widget (optional)
}

const Widget: React.FC<WidgetProps> = ({ title, value, unit, backgroundColor }) => {
  return (
    <div
      style={{
        backgroundColor: backgroundColor || "#2c2c2c",
        color: "#fff",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        flex: "1",
        margin: "10px",
      }}
    >
      <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>{title}</h3>
      <p style={{ fontSize: "24px", margin: "0" }}>
        {value} <span style={{ fontSize: "16px" }}>{unit}</span>
      </p>
    </div>
  );
};

export default Widget;
