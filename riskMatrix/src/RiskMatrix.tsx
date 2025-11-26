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
}

export const RiskMatrix: React.FC<RiskMatrixProps> = ({
    dataPoints,
    matrixSize,
    showLegend,
    pointSize,
    defaultColor,
    fontSize,
    width,
    height
}) => {
    console.log('RiskMatrix render:', {
        dataPointsCount: dataPoints?.length || 0,
        dataPoints: dataPoints,
        matrixSize,
        width,
        height
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

    // Get color based on risk level
    const getRiskColor = (likelihood: number, impact: number): string => {
        const riskScore = likelihood * impact;
        const maxRisk = matrixSize * matrixSize;
        
        if (riskScore >= maxRisk * 0.7) return "#FF0000"; // Red for high risk
        if (riskScore >= maxRisk * 0.4) return "#FFA500"; // Orange for medium risk
        return "#FFFF00"; // Yellow for low risk
    };

    // Convert likelihood and impact to matrix coordinates
    const getCoordinates = (likelihood: number, impact: number) => {
        // Clamp values to matrix bounds (ensure they're within 1 to matrixSize)
        const clampedLikelihood = Math.max(1, Math.min(matrixSize, Math.round(likelihood)));
        const clampedImpact = Math.max(1, Math.min(matrixSize, Math.round(impact)));
        
        // Convert to pixel coordinates
        // X-axis: Impact (left to right: 1 to matrixSize)
        // Y-axis: Likelihood (bottom to top: 1 to matrixSize, so we invert)
        const x = padding + (clampedImpact - 1) * cellWidth + cellWidth / 2;
        const y = padding + (matrixSize - clampedLikelihood) * cellHeight + cellHeight / 2;
        
        return { x, y, clampedLikelihood, clampedImpact };
    };

    // Group data points by their position for legend
    const legendData = showLegend && dataPoints
        ? dataPoints.map((point, index) => ({
              ...point,
              color: getRiskColor(point.likelihood, point.impact),
              riskLevel: getRiskLevel(point.likelihood, point.impact),
              index
          }))
        : [];

    // If no data points, show empty state
    if (!dataPoints || dataPoints.length === 0) {
        return (
            <div style={{ 
                width: "100%", 
                height: "100%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                fontSize: "14px",
                color: "#666"
            }}>
                No data points to display
            </div>
        );
    }

    return (
        <svg width={width} height={height} style={{ border: "1px solid #ccc" }}>
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
                fontSize={fontSize}
                fontWeight="bold"
                fill="#333"
            >
                Impact
            </text>
            <text
                x={20}
                y={padding + matrixHeight / 2}
                textAnchor="middle"
                fontSize={fontSize}
                fontWeight="bold"
                fill="#333"
                transform={`rotate(-90, 20, ${padding + matrixHeight / 2})`}
            >
                Likelihood
            </text>

            {/* Draw data points */}
            {dataPoints.map((point, index) => {
                const { x, y, clampedLikelihood, clampedImpact } = getCoordinates(point.likelihood, point.impact);
                const color = getRiskColor(point.likelihood, point.impact);
                
                console.log(`Rendering point ${index}:`, {
                    title: point.title,
                    likelihood: point.likelihood,
                    impact: point.impact,
                    clampedLikelihood,
                    clampedImpact,
                    x,
                    y,
                    color
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
                    <text
                        x={0}
                        y={0}
                        fontSize={fontSize}
                        fontWeight="bold"
                        fill="#333"
                    >
                        Legend
                    </text>
                    {legendData.map((item, index) => (
                        <g key={`legend-${index}`} transform={`translate(0, ${25 + index * 25})`}>
                            <circle
                                cx={0}
                                cy={0}
                                r={pointSize / 2}
                                fill={item.color}
                                stroke="#333"
                                strokeWidth={1}
                            />
                            <text
                                x={15}
                                y={0}
                                fontSize={fontSize - 2}
                                fill="#333"
                                dominantBaseline="middle"
                            >
                                {item.title}
                            </text>
                            <text
                                x={15}
                                y={12}
                                fontSize={fontSize - 4}
                                fill="#666"
                                dominantBaseline="middle"
                            >
                                L:{item.likelihood} I:{item.impact}
                            </text>
                        </g>
                    ))}
                </g>
            )}
        </svg>
    );
};

