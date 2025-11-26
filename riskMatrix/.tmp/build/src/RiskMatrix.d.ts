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
}
export declare const RiskMatrix: React.FC<RiskMatrixProps>;
