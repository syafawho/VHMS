// src/components/GaugeWidget.tsx
import React from "react";
import GaugeChart from "react-gauge-chart";

interface GaugeWidgetProps {
  title: string;
  value: number;
  max: number;
  unit?: string;
}

const GaugeWidget: React.FC<GaugeWidgetProps> = ({ title, value, max, unit }) => {
  return (
    <div
      style={{
        backgroundColor: "#2c2c2c",
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
      <GaugeChart
        id={`gauge-${title}`}
        nrOfLevels={20}
        percent={value / max} // Still used for the gauge needle
        colors={["#00bcd4", "#ff9800", "#ff5722"]}
        arcWidth={0.2}
      />
      <p style={{ fontSize: "18px", margin: "10px 0" }}>
        {value.toFixed(1)} <span style={{ fontSize: "14px" }}>{unit}</span>
      </p>
    </div>
  );
};

export default GaugeWidget;
