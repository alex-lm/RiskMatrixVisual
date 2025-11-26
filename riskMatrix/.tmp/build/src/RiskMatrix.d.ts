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
export declare const RiskMatrix: React.FC<RiskMatrixProps>;
