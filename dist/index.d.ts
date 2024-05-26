import { Properties as CSSProperties } from "csstype";
export declare namespace EZInline {
    namespace Config {
        type SetPropertyOptions = {
            isPositional?: boolean;
        };
        type ConfigurationOptions = {
            merge?: boolean;
        };
        type Configuration = {
            variables: Record<string, string>;
            properties: Record<string, string | ((value: string) => string)>;
            unit: string;
            multiple: number;
        };
        export const config: Configuration;
        export function hasProperty(property: string): boolean;
        export function getProperty(property: string): string | ((value: string) => string);
        export function setProperty(name: string, value: Configuration['properties'][string], options?: SetPropertyOptions): typeof Config;
        export function setProperties(properties: Configuration['properties'], options?: SetPropertyOptions): typeof Config;
        export function setVariable(variable: string, value: string): typeof Config;
        export function setVariables(variables: Record<string, string>): typeof Config;
        export function configure(configuration: Partial<Configuration>, options?: ConfigurationOptions): void;
        export {};
    }
    function $(templateArray: TemplateStringsArray, ...values: any[]): CSSProperties<0 | (string & {}), string & {}>;
}
declare const $: typeof EZInline.$;
export default $;
