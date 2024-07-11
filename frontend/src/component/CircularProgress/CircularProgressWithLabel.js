import React from "react";

const CircularProgressWithLabel = ({ value, title, color = "#0037ff" }) => {
  const circleSize = 60;
  const strokeWidth = 4;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={styles.card}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "8px",
        }}
      >
        <svg width={circleSize} height={circleSize}>
          <circle
            stroke="#d3d3d3"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={circleSize / 2}
            cy={circleSize / 2}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            r={radius}
            cx={circleSize / 2}
            cy={circleSize / 2}
            style={{
              transition: "stroke-dashoffset 0.35s",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={styles.percentageText}>{`${Math.round(value)}%`}</span>
        </div>
      </div>
      <span style={styles.title} title={title}>
        {title}
      </span>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#001D87",
    padding: "16px",
    borderRadius: "8px",
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "150px", // adjust as necessary
  },
  percentageText: {
    color: "white",
    fontWeight: 700,
  },
  title: {
    color: "white",
    fontWeight: 700,
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },
};

export default CircularProgressWithLabel;
