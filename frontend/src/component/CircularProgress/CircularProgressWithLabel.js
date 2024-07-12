import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { styled } from "@mui/system";

const CircleSvg = styled('svg')({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
});

const Circle = styled('circle')({
  transition: 'stroke-dashoffset 0.35s',
  transform: 'rotate(-90deg)',
  transformOrigin: '50% 50%',
});

const Card = styled(Box)(({ theme }) => ({
  backgroundColor: "#001D87",
  padding: "16px",
  borderRadius: "8px",
  color: "#FFFFFF",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "150px", // adjust as necessary
}));

const PercentageText = styled(Typography)({
  color: "white",
  fontWeight: 700,
});

const CircularProgressWithLabel = ({ value, title, color = "#0037ff" }) => {
  const circleSize = 60;
  const strokeWidth = 4;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <Tooltip title={title}>
      <Card>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "8px",
          }}
        >
          <CircleSvg width={circleSize} height={circleSize}>
            <Circle
              stroke="#d3d3d3"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={radius}
              cx={circleSize / 2}
              cy={circleSize / 2}
            />
            <Circle
              stroke={color}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              r={radius}
              cx={circleSize / 2}
              cy={circleSize / 2}
            />
          </CircleSvg>
          <Box
            sx={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PercentageText variant="caption">{`${Math.round(value)}%`}</PercentageText>
          </Box>
        </Box>
        <Typography variant="body2" title={title} sx={{ textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
          {title}
        </Typography>
      </Card>
    </Tooltip>
  );
};

export default CircularProgressWithLabel;
