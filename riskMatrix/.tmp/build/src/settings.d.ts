import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
/**
 * Matrix Settings Card
 */
declare class MatrixSettingsCard extends FormattingSettingsCard {
    matrixSize: formattingSettings.NumUpDown;
    showLegend: formattingSettings.ToggleSwitch;
    pointSize: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Gradient Settings Card
 */
declare class GradientSettingsCard extends FormattingSettingsCard {
    firstColor: formattingSettings.ColorPicker;
    middleColor: formattingSettings.ColorPicker;
    lastColor: formattingSettings.ColorPicker;
    showGradient: formattingSettings.ToggleSwitch;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Data Point Formatting Card
 */
declare class DataPointCardSettings extends FormattingSettingsCard {
    defaultColor: formattingSettings.ColorPicker;
    fontSize: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
* visual settings model class
*
*/
export declare class VisualFormattingSettingsModel extends FormattingSettingsModel {
    matrixSettingsCard: MatrixSettingsCard;
    gradientSettingsCard: GradientSettingsCard;
    dataPointCard: DataPointCardSettings;
    cards: (MatrixSettingsCard | GradientSettingsCard | DataPointCardSettings)[];
}
export {};
