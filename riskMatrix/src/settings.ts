/*
 *  Power BI Visualizations
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

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Matrix Settings Card
 */
class MatrixSettingsCard extends FormattingSettingsCard {
    xAxisSize = new formattingSettings.NumUpDown({
        name: "xAxisSize",
        displayName: "X Axis Size (Impact)",
        value: 5
    });

    yAxisSize = new formattingSettings.NumUpDown({
        name: "yAxisSize",
        displayName: "Y Axis Size (Likelihood)",
        value: 5
    });

    showLegend = new formattingSettings.ToggleSwitch({
        name: "showLegend",
        displayName: "Show Legend",
        value: true
    });

    pointSize = new formattingSettings.NumUpDown({
        name: "pointSize",
        displayName: "Point Size",
        value: 8
    });

    name: string = "matrixSettings";
    displayName: string = "Matrix Settings";
    slices: Array<FormattingSettingsSlice> = [this.xAxisSize, this.yAxisSize, this.showLegend, this.pointSize];
}
/**
 * Gradient Settings Card
 */
class GradientSettingsCard extends FormattingSettingsCard {
    firstColor = new formattingSettings.ColorPicker({
        name: "firstColor",
        displayName: "First Color (Low Risk)",
        value: { value: "#90EE90" } // Light green
    });

    middleColor = new formattingSettings.ColorPicker({
        name: "middleColor",
        displayName: "Middle Color (Medium Risk)",
        value: { value: "#FFD700" } // Gold/Yellow
    });

    lastColor = new formattingSettings.ColorPicker({
        name: "lastColor",
        displayName: "Last Color (High Risk)",
        value: { value: "#FF4500" } // Orange red
    });

    showGradient = new formattingSettings.ToggleSwitch({
        name: "showGradient",
        displayName: "Show Gradient Background",
        value: true
    });

    name: string = "gradientSettings";
    displayName: string = "Gradient Colors";
    slices: Array<FormattingSettingsSlice> = [this.showGradient, this.firstColor, this.middleColor, this.lastColor];
}

/**
 * Data Point Formatting Card
 */
class DataPointCardSettings extends FormattingSettingsCard {
    defaultColor = new formattingSettings.ColorPicker({
        name: "defaultColor",
        displayName: "Default color",
        value: { value: "#0078D4" }
    });

    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Text Size",
        value: 12
    });

    name: string = "dataPoint";
    displayName: string = "Data colors";
    slices: Array<FormattingSettingsSlice> = [this.defaultColor, this.fontSize];
}

/**
 * Axis Labels Settings Card
 */
class AxisLabelsCard extends FormattingSettingsCard {
    xAxisLabel = new formattingSettings.TextInput({
        name: "xAxisLabel",
        displayName: "X-Axis Label",
        value: "Impact",
        placeholder: "Impact"
    });

    xAxisLabelFontSize = new formattingSettings.NumUpDown({
        name: "xAxisLabelFontSize",
        displayName: "Font Size",
        value: 12
    });

    xAxisLabelFontFamily = new formattingSettings.FontPicker({
        name: "xAxisLabelFontFamily",
        displayName: "Font Family",
        value: "Segoe UI"
    });

    xAxisLabelColor = new formattingSettings.ColorPicker({
        name: "xAxisLabelColor",
        displayName: "Color",
        value: { value: "#333333" }
    });

    yAxisLabel = new formattingSettings.TextInput({
        name: "yAxisLabel",
        displayName: "Y-Axis Label",
        value: "Likelihood",
        placeholder: "Likelihood"
    });

    yAxisLabelFontSize = new formattingSettings.NumUpDown({
        name: "yAxisLabelFontSize",
        displayName: "Font Size",
        value: 12
    });

    yAxisLabelFontFamily = new formattingSettings.FontPicker({
        name: "yAxisLabelFontFamily",
        displayName: "Font Family",
        value: "Segoe UI"
    });

    yAxisLabelColor = new formattingSettings.ColorPicker({
        name: "yAxisLabelColor",
        displayName: "Color",
        value: { value: "#333333" }
    });

    name: string = "axisLabels";
    displayName: string = "Axis Labels";
    slices: Array<FormattingSettingsSlice> = [
        this.xAxisLabel,
        this.xAxisLabelFontSize,
        this.xAxisLabelFontFamily,
        this.xAxisLabelColor,
        this.yAxisLabel,
        this.yAxisLabelFontSize,
        this.yAxisLabelFontFamily,
        this.yAxisLabelColor
    ];
}

/**
* visual settings model class
*
*/
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    matrixSettingsCard = new MatrixSettingsCard();
    gradientSettingsCard = new GradientSettingsCard();
    dataPointCard = new DataPointCardSettings();
    axisLabelsCard = new AxisLabelsCard();

    cards = [this.matrixSettingsCard, this.gradientSettingsCard, this.dataPointCard, this.axisLabelsCard];
}
