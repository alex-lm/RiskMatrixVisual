import * as React from "react";

export interface RiskDataPoint {
  title: string;
  likelihood: number;
  impact: number;
}

export interface RiskMatrixProps {
  dataPoints: RiskDataPoint[];
  matrixSize: number;
  showLegend: boolean;
  pointSize: number;
  defaultColor: string;
  fontSize: number;
  width: number;
  height: number;
  showGradient: boolean;
  firstColor: string;
  middleColor: string;
  lastColor: string;
  xAxisLabel: string;
  yAxisLabel: string;
  xAxisLabelFontSize: number;
  xAxisLabelFontFamily: string;
  xAxisLabelColor: string;
  yAxisLabelFontSize: number;
  yAxisLabelFontFamily: string;
  yAxisLabelColor: string;
}

export const RiskMatrix: React.FC<RiskMatrixProps> = ({
  dataPoints,
  matrixSize,
  showLegend,
  pointSize,
  defaultColor,
  fontSize,
  width,
  height,
  showGradient,
  firstColor,
  middleColor,
  lastColor,
  xAxisLabel,
  yAxisLabel,
  xAxisLabelFontSize,
  xAxisLabelFontFamily,
  xAxisLabelColor,
  yAxisLabelFontSize,
  yAxisLabelFontFamily,
  yAxisLabelColor,
}) => {
  console.log("RiskMatrix render:", {
    dataPointsCount: dataPoints?.length || 0,
    dataPoints: dataPoints,
    matrixSize,
    width,
    height,
  });
  // Validate inputs
  if (!width || !height || width <= 0 || height <= 0) {
    return (
      <div style={{ padding: "20px", color: "#666" }}>
        Invalid dimensions: {width} x {height}
      </div>
    );
  }

  if (!matrixSize || matrixSize <= 0) {
    return (
      <div style={{ padding: "20px", color: "#666" }}>
        Invalid matrix size: {matrixSize}
      </div>
    );
  }

  const padding = 60;
  const legendWidth = showLegend ? 200 : 0;
  const matrixWidth = Math.max(0, width - padding * 2 - legendWidth);
  const matrixHeight = Math.max(0, height - padding * 2);
  const cellWidth = matrixWidth / matrixSize;
  const cellHeight = matrixHeight / matrixSize;

  if (cellWidth <= 0 || cellHeight <= 0) {
    return (
      <div style={{ padding: "20px", color: "#666" }}>
        Matrix too small for current dimensions
      </div>
    );
  }

  // Calculate risk level based on position in matrix
  const getRiskLevel = (likelihood: number, impact: number): string => {
    const riskScore = likelihood * impact;
    const maxRisk = matrixSize * matrixSize;

    if (riskScore >= maxRisk * 0.7) return "High";
    if (riskScore >= maxRisk * 0.4) return "Medium";
    return "Low";
  };

  // Predefined color palette for unique point colors
  const colorPalette = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#FFA07A", // Light Salmon
    "#98D8C8", // Mint
    "#F7DC6F", // Yellow
    "#BB8FCE", // Purple
    "#85C1E2", // Sky Blue
    "#F8B739", // Orange
    "#52BE80", // Green
    "#EC7063", // Coral
    "#5DADE2", // Light Blue
    "#F4D03F", // Gold
    "#A569BD", // Medium Purple
    "#48C9B0", // Turquoise
  ];

  // Assign unique color to each data point
  const getPointColor = (index: number): string => {
    return colorPalette[index % colorPalette.length];
  };

  // Convert hex color to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = Math.round(x).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  // Interpolate between two colors
  const interpolateColor = (
    color1: string,
    color2: string,
    factor: number
  ): string => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const r = rgb1.r + (rgb2.r - rgb1.r) * factor;
    const g = rgb1.g + (rgb2.g - rgb1.g) * factor;
    const b = rgb1.b + (rgb2.b - rgb1.b) * factor;
    return rgbToHex(r, g, b);
  };

  // Get cell color based on risk score (likelihood * impact)
  const getCellColor = (likelihood: number, impact: number): string => {
    if (!showGradient) {
      return "#FFFFFF"; // White if gradient is disabled
    }

    const riskScore = likelihood * impact;
    const minRisk = 1;
    const maxRisk = matrixSize * matrixSize;
    const normalizedScore = (riskScore - minRisk) / (maxRisk - minRisk); // 0 to 1

    // Interpolate: first -> middle -> last
    if (normalizedScore <= 0.5) {
      // Interpolate between first and middle
      const factor = normalizedScore * 2; // 0 to 1
      return interpolateColor(firstColor, middleColor, factor);
    } else {
      // Interpolate between middle and last
      const factor = (normalizedScore - 0.5) * 2; // 0 to 1
      return interpolateColor(middleColor, lastColor, factor);
    }
  };

  // Convert likelihood and impact to matrix coordinates
  const getCoordinates = (likelihood: number, impact: number) => {
    // Clamp values to matrix bounds (ensure they're within 1 to matrixSize)
    const clampedLikelihood = Math.max(
      1,
      Math.min(matrixSize, Math.round(likelihood))
    );
    const clampedImpact = Math.max(1, Math.min(matrixSize, Math.round(impact)));

    // Convert to pixel coordinates
    // X-axis: Impact (left to right: 1 to matrixSize)
    // Y-axis: Likelihood (bottom to top: 1 to matrixSize, so we invert)
    const x = padding + (clampedImpact - 1) * cellWidth + cellWidth / 2;
    const y =
      padding + (matrixSize - clampedLikelihood) * cellHeight + cellHeight / 2;

    return { x, y, clampedLikelihood, clampedImpact };
  };

  // Group data points by their position for legend
  const legendData =
    showLegend && dataPoints
      ? dataPoints.map((point, index) => ({
          ...point,
          color: getPointColor(index),
          riskLevel: getRiskLevel(point.likelihood, point.impact),
          index,
        }))
      : [];

  // If no data points, show empty state
  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          color: "#666",
        }}
      >
        No data points to display
      </div>
    );
  }

  return (
    <svg width={width} height={height} style={{ border: "1px solid #ccc" }}>
      {/* Draw gradient cells - rendered first so they appear behind grid */}
      {showGradient &&
        Array.from({ length: matrixSize }).flatMap((_, rowIndex) =>
          Array.from({ length: matrixSize }).map((_, colIndex) => {
            const likelihood = matrixSize - rowIndex; // Y-axis: 5 at top, 1 at bottom
            const impact = colIndex + 1; // X-axis: 1 at left, 5 at right
            const cellColor = getCellColor(likelihood, impact);
            const x = padding + colIndex * cellWidth;
            const y = padding + rowIndex * cellHeight;

            return (
              <rect
                key={`cell-${rowIndex}-${colIndex}`}
                x={x}
                y={y}
                width={cellWidth}
                height={cellHeight}
                fill={cellColor}
                stroke="none"
              />
            );
          })
        )}

      {/* Draw grid */}
      {Array.from({ length: matrixSize + 1 }).map((_, i) => (
        <React.Fragment key={`grid-${i}`}>
          {/* Vertical lines */}
          <line
            x1={padding + i * cellWidth}
            y1={padding}
            x2={padding + i * cellWidth}
            y2={padding + matrixHeight}
            stroke="#ddd"
            strokeWidth={1}
          />
          {/* Horizontal lines */}
          <line
            x1={padding}
            y1={padding + i * cellHeight}
            x2={padding + matrixWidth}
            y2={padding + i * cellHeight}
            stroke="#ddd"
            strokeWidth={1}
          />
        </React.Fragment>
      ))}

      {/* Draw axis labels */}
      {/* X-axis (Impact) */}
      {Array.from({ length: matrixSize }).map((_, i) => (
        <text
          key={`x-label-${i}`}
          x={padding + i * cellWidth + cellWidth / 2}
          y={padding - 10}
          textAnchor="middle"
          fontSize={fontSize - 2}
          fill="#333"
        >
          {i + 1}
        </text>
      ))}

      {/* Y-axis (Likelihood) */}
      {Array.from({ length: matrixSize }).map((_, i) => (
        <text
          key={`y-label-${i}`}
          x={padding - 10}
          y={padding + i * cellHeight + cellHeight / 2}
          textAnchor="end"
          fontSize={fontSize - 2}
          fill="#333"
          dominantBaseline="middle"
        >
          {matrixSize - i}
        </text>
      ))}

      {/* Axis titles */}
      <text
        x={padding + matrixWidth / 2}
        y={padding - 25}
        textAnchor="middle"
        fontSize={xAxisLabelFontSize}
        fontFamily={xAxisLabelFontFamily}
        fontWeight="bold"
        fill={xAxisLabelColor}
      >
        {xAxisLabel}
      </text>
      <text
        x={20}
        y={padding + matrixHeight / 2}
        textAnchor="middle"
        fontSize={yAxisLabelFontSize}
        fontFamily={yAxisLabelFontFamily}
        fontWeight="bold"
        fill={yAxisLabelColor}
        transform={`rotate(-90, 20, ${padding + matrixHeight / 2})`}
      >
        {yAxisLabel}
      </text>

      {/* Draw data points */}
      {dataPoints.map((point, index) => {
        const { x, y, clampedLikelihood, clampedImpact } = getCoordinates(
          point.likelihood,
          point.impact
        );
        const color = getPointColor(index);

        console.log(`Rendering point ${index}:`, {
          title: point.title,
          likelihood: point.likelihood,
          impact: point.impact,
          clampedLikelihood,
          clampedImpact,
          x,
          y,
          color,
        });

        return (
          <g key={`point-${index}`}>
            <circle
              cx={x}
              cy={y}
              r={pointSize}
              fill={color}
              stroke="#333"
              strokeWidth={2}
              opacity={0.9}
            />
            <title>{`${point.title}\nLikelihood: ${point.likelihood}\nImpact: ${point.impact}`}</title>
          </g>
        );
      })}

      {/* Legend */}
      {showLegend && legendData.length > 0 && (
        <g transform={`translate(${width - legendWidth + 20}, ${padding})`}>
          <text x={0} y={0} fontSize={fontSize} fontWeight="bold" fill="#333">
            Legend
          </text>
          {legendData.map((item, index) => (
            <g
              key={`legend-${index}`}
              transform={`translate(0, ${25 + index * 30})`}
            >
              <circle
                cx={0}
                cy={0}
                r={pointSize / 2 + 1}
                fill={item.color}
                stroke="#333"
                strokeWidth={2}
              />
              <text
                x={20}
                y={0}
                fontSize={fontSize - 2}
                fill="#333"
                dominantBaseline="middle"
                fontWeight="500"
              >
                {item.title}
              </text>
              <text
                x={20}
                y={14}
                fontSize={fontSize - 3}
                fill="#666"
                dominantBaseline="middle"
              >
                L: {item.likelihood.toFixed(1)} | I: {item.impact.toFixed(1)}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
};
