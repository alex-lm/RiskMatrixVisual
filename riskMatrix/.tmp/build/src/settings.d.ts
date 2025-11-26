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
    dataPointCard: DataPointCardSettings;
    cards: (MatrixSettingsCard | DataPointCardSettings)[];
}
export {};
