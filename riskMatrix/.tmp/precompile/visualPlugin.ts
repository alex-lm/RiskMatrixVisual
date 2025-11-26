import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var riskMatrix7201B7777AFA42C59E8B4EAB078713F7_DEBUG: IVisualPlugin = {
    name: 'riskMatrix7201B7777AFA42C59E8B4EAB078713F7_DEBUG',
    displayName: 'riskMatrix',
    class: 'Visual',
    apiVersion: '5.3.0',
    create: (options?: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = (<any>globalThis).dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["riskMatrix7201B7777AFA42C59E8B4EAB078713F7_DEBUG"] = riskMatrix7201B7777AFA42C59E8B4EAB078713F7_DEBUG;
}
export default riskMatrix7201B7777AFA42C59E8B4EAB078713F7_DEBUG;