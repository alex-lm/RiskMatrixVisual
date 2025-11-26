/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { RiskMatrix, RiskDataPoint } from "./RiskMatrix";
import { VisualFormattingSettingsModel } from "./settings";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import DataViewTable = powerbi.DataViewTable;
import DataViewTableRow = powerbi.DataViewTableRow;

export class Visual implements IVisual {
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private reactRoot: Root | null = null;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        
        // Create a container div for React
        const container = document.createElement("div");
        container.style.width = "100%";
        container.style.height = "100%";
        this.target.appendChild(container);
        
        // Initialize React root
        this.reactRoot = createRoot(container);
    }

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
            VisualFormattingSettingsModel,
            options.dataViews?.[0]
        );

        console.log('Visual update', options);

        if (!options.dataViews || options.dataViews.length === 0) {
            this.renderEmpty();
            return;
        }

        const dataView: DataView = options.dataViews[0];
        
        if (!dataView.table) {
            this.renderEmpty();
            return;
        }

        const dataPoints = this.parseDataView(dataView);
        const width = options.viewport.width;
        const height = options.viewport.height;

        const matrixSize = this.formattingSettings.matrixSettingsCard.matrixSize.value || 5;
        const showLegend = this.formattingSettings.matrixSettingsCard.showLegend.value !== false;
        const pointSize = this.formattingSettings.matrixSettingsCard.pointSize.value || 8;
        const defaultColor = this.formattingSettings.dataPointCard.defaultColor.value.value || "#0078D4";
        const fontSize = this.formattingSettings.dataPointCard.fontSize.value || 12;

        this.renderVisual({
            dataPoints,
            matrixSize,
            showLegend,
            pointSize,
            defaultColor,
            fontSize,
            width,
            height
        });
    }

    private parseDataView(dataView: DataView): RiskDataPoint[] {
        const table: DataViewTable = dataView.table;
        const dataPoints: RiskDataPoint[] = [];

        if (!table || !table.rows || table.rows.length === 0) {
            return dataPoints;
        }

        // Expected columns: Title, Likelihood, Impact
        for (let i = 0; i < table.rows.length; i++) {
            const row: DataViewTableRow = table.rows[i];
            
            if (row.length < 3) {
                continue;
            }

            // Get title (first column - grouping)
            const titleValue = row[0];
            let title = "";
            if (titleValue !== null && titleValue !== undefined) {
                title = String(titleValue);
            }

            // Get likelihood (second column - measure)
            const likelihoodValue = row[1];
            let likelihood = 0;
            if (likelihoodValue !== null && likelihoodValue !== undefined) {
                likelihood = Number(likelihoodValue);
            }

            // Get impact (third column - measure)
            const impactValue = row[2];
            let impact = 0;
            if (impactValue !== null && impactValue !== undefined) {
                impact = Number(impactValue);
            }

            if (title && !isNaN(likelihood) && !isNaN(impact)) {
                dataPoints.push({
                    title,
                    likelihood,
                    impact
                });
            }
        }

        return dataPoints;
    }

    private renderVisual(props: {
        dataPoints: RiskDataPoint[];
        matrixSize: number;
        showLegend: boolean;
        pointSize: number;
        defaultColor: string;
        fontSize: number;
        width: number;
        height: number;
    }) {
        if (!this.reactRoot) {
            return;
        }

        this.reactRoot.render(
            React.createElement(RiskMatrix, props)
        );
    }

    private renderEmpty() {
        if (!this.reactRoot) {
            return;
        }

        this.reactRoot.render(
            React.createElement("div", {
                style: {
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    color: "#666"
                }
            }, "Please add data to the visual")
        );
    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
