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
import PrimitiveValue = powerbi.PrimitiveValue;

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
        try {
            // Initialize formatting settings with default if no dataView
            if (!this.formattingSettings) {
                this.formattingSettings = new VisualFormattingSettingsModel();
            }
            
            if (options.dataViews && options.dataViews.length > 0) {
                this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
                    VisualFormattingSettingsModel,
                    options.dataViews[0]
                );
            }

            console.log('Visual update', options);
            console.log('DataViews:', options.dataViews);
            console.log('Viewport:', options.viewport);

            if (!options.dataViews || options.dataViews.length === 0) {
                console.log('No dataViews available');
                this.renderEmpty("Please add data to the visual");
                return;
            }

            const dataView: DataView = options.dataViews[0];
            console.log('DataView:', dataView);
            console.log('DataView.table:', dataView.table);
            
            if (!dataView.table) {
                console.log('No table in dataView');
                this.renderEmpty("No data table found");
                return;
            }

            const dataPoints = this.parseDataView(dataView);
            console.log('Parsed dataPoints:', dataPoints);
            
            const width = Math.max(options.viewport.width, 200);
            const height = Math.max(options.viewport.height, 200);

            if (width <= 0 || height <= 0) {
                console.log('Invalid viewport dimensions:', width, height);
                this.renderEmpty("Invalid viewport size");
                return;
            }

            const matrixSize = this.formattingSettings?.matrixSettingsCard?.matrixSize?.value || 5;
            const showLegend = this.formattingSettings?.matrixSettingsCard?.showLegend?.value !== false;
            const pointSize = this.formattingSettings?.matrixSettingsCard?.pointSize?.value || 8;
            const defaultColor = this.formattingSettings?.dataPointCard?.defaultColor?.value?.value || "#0078D4";
            const fontSize = this.formattingSettings?.dataPointCard?.fontSize?.value || 12;
            const showGradient = this.formattingSettings?.gradientSettingsCard?.showGradient?.value !== false;
            const firstColor = this.formattingSettings?.gradientSettingsCard?.firstColor?.value?.value || "#90EE90";
            const middleColor = this.formattingSettings?.gradientSettingsCard?.middleColor?.value?.value || "#FFD700";
            const lastColor = this.formattingSettings?.gradientSettingsCard?.lastColor?.value?.value || "#FF4500";

            console.log('Rendering with props:', {
                dataPointsCount: dataPoints.length,
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
                lastColor
            });

            this.renderVisual({
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
                lastColor
            });
        } catch (error) {
            console.error('Error in update:', error);
            this.renderEmpty(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private extractValue(value: PrimitiveValue | any): any {
        // Handle DataViewValue objects (if they exist)
        if (value && typeof value === 'object' && 'value' in value) {
            return value.value;
        }
        return value;
    }

    private parseDataView(dataView: DataView): RiskDataPoint[] {
        try {
            const table: DataViewTable = dataView.table;
            const dataPoints: RiskDataPoint[] = [];

            if (!table) {
                console.log('No table in dataView');
                return dataPoints;
            }

            console.log('Table columns:', table.columns);
            console.log('Table rows count:', table.rows?.length);

            if (!table.rows || table.rows.length === 0) {
                console.log('No rows in table');
                return dataPoints;
            }

            // Find column indices by role
            let titleIndex = -1;
            let likelihoodIndex = -1;
            let impactIndex = -1;

            if (table.columns) {
                for (let i = 0; i < table.columns.length; i++) {
                    const column = table.columns[i];
                    const role = column.roles;
                    
                    console.log(`Column ${i}:`, {
                        displayName: column.displayName,
                        roles: role,
                        isMeasure: column.isMeasure
                    });

                    // Check if this column matches our roles
                    if (role && role.title) {
                        titleIndex = i;
                    }
                    if (role && role.likelihood) {
                        likelihoodIndex = i;
                    }
                    if (role && role.impact) {
                        impactIndex = i;
                    }
                }
            }

            // Fallback: if roles aren't found, assume order: Title (0), Likelihood (1), Impact (2)
            if (titleIndex === -1) titleIndex = 0;
            if (likelihoodIndex === -1) likelihoodIndex = 1;
            if (impactIndex === -1) impactIndex = 2;

            console.log('Column indices:', { titleIndex, likelihoodIndex, impactIndex });

            // Parse rows
            for (let i = 0; i < table.rows.length; i++) {
                const row: DataViewTableRow = table.rows[i];
                
                console.log(`Row ${i}:`, row);
                
                if (!row || row.length < 3) {
                    console.log(`Row ${i} has insufficient columns:`, row?.length);
                    continue;
                }

                // Skip total rows (they usually have empty or special title values)
                const titleValue = this.extractValue(row[titleIndex]);
                if (!titleValue || String(titleValue).trim() === '' || String(titleValue).toLowerCase() === 'total') {
                    console.log(`Skipping row ${i} (total or empty title):`, titleValue);
                    continue;
                }

                // Get title
                let title = "";
                if (titleValue !== null && titleValue !== undefined) {
                    title = String(titleValue).trim();
                }

                // Get likelihood
                const likelihoodValue = this.extractValue(row[likelihoodIndex]);
                let likelihood = 0;
                if (likelihoodValue !== null && likelihoodValue !== undefined) {
                    if (typeof likelihoodValue === 'number') {
                        likelihood = likelihoodValue;
                    } else if (typeof likelihoodValue === 'string') {
                        const parsed = parseFloat(likelihoodValue);
                        if (!isNaN(parsed)) {
                            likelihood = parsed;
                        }
                    } else {
                        const numValue = Number(likelihoodValue);
                        if (!isNaN(numValue)) {
                            likelihood = numValue;
                        }
                    }
                }

                // Get impact
                const impactValue = this.extractValue(row[impactIndex]);
                let impact = 0;
                if (impactValue !== null && impactValue !== undefined) {
                    if (typeof impactValue === 'number') {
                        impact = impactValue;
                    } else if (typeof impactValue === 'string') {
                        const parsed = parseFloat(impactValue);
                        if (!isNaN(parsed)) {
                            impact = parsed;
                        }
                    } else {
                        const numValue = Number(impactValue);
                        if (!isNaN(numValue)) {
                            impact = numValue;
                        }
                    }
                }

                console.log(`Parsed row ${i}:`, { 
                    title, 
                    likelihood, 
                    impact,
                    titleValid: !!title,
                    likelihoodValid: !isNaN(likelihood) && likelihood >= 0,
                    impactValid: !isNaN(impact) && impact >= 0
                });

                // Require valid numbers and non-empty title
                if (title && !isNaN(likelihood) && !isNaN(impact) && likelihood >= 0 && impact >= 0) {
                    dataPoints.push({
                        title,
                        likelihood,
                        impact
                    });
                    console.log(`✓ Added data point ${i}:`, { title, likelihood, impact });
                } else {
                    console.log(`✗ Row ${i} filtered out:`, { title, likelihood, impact });
                }
            }

            console.log('Final dataPoints count:', dataPoints.length);
            console.log('Final dataPoints:', dataPoints);
            return dataPoints;
        } catch (error) {
            console.error('Error parsing dataView:', error);
            return [];
        }
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
        showGradient: boolean;
        firstColor: string;
        middleColor: string;
        lastColor: string;
    }) {
        try {
            if (!this.reactRoot) {
                console.error('React root is null');
                return;
            }

            console.log('Rendering RiskMatrix component with props:', props);
            this.reactRoot.render(
                React.createElement(RiskMatrix, props)
            );
        } catch (error) {
            console.error('Error rendering visual:', error);
            this.renderEmpty(`Render error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private renderEmpty(message: string = "Please add data to the visual") {
        try {
            if (!this.reactRoot) {
                console.error('React root is null in renderEmpty');
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
                        color: "#666",
                        padding: "20px",
                        textAlign: "center"
                    }
                }, message)
            );
        } catch (error) {
            console.error('Error in renderEmpty:', error);
        }
    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
