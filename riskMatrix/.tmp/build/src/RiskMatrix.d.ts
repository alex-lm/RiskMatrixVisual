import * as React from "react";
export interface RiskDataPoint {
    title: string;
    likelihood: number;
    impact: number;
    selectionId?: any;
}
export interface RiskMatrixProps {
    dataPoints: RiskDataPoint[];
    xAxisSize: number;
    yAxisSize: number;
    selectionManager?: any;
    showLegend: boolean;
    legendPosition: string;
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
export declare const RiskMatrix: React.FC<RiskMatrixProps>;
