declare module "csstype" {
    interface Properties {
        [key: string]: any;
    }
}

declare namespace EZInline {
    export namespace Config {
        type SetPropertyOptions = {
            isPositional?: boolean;
        };
        type ConfigurationOptions = {
            merge?: boolean;
        };
        type Configuration = {
            properties: Record<string, string | ((value: string) => string)>;
            unit: string;
            multiple: number;
        };
        export const config: Configuration;
        export function hasProperty(property: string): boolean;
        export function getProperty(property: string): string | ((value: string) => string) | undefined;
        export function setProperty(name: string, value: Configuration['properties'][string], options?: SetPropertyOptions): typeof Config;
        export function setProperties(properties: Configuration['properties'], options?: SetPropertyOptions): typeof Config;
        export function configure(configuration: Partial<Configuration>, options?: ConfigurationOptions): void;
    }

    namespace Parser {
        class Style {
            property: string;
            value: string | number | Array<string | number>;
            constructor(property: string, value: string, isShorthand?: boolean);
            get camelProperty(): string;
            get isValid(): boolean;
            toString(): string;
            toObject(): {
                [key: string]: string | number | Array<string | number>;
            };
            private formatValue;
            static parseValue(value: string): string | number | Array<string | number>;
            static parseRaw(style: string): {
                property: string;
                value: string;
                isShorthand: boolean;
            };
        }
        export class Styles extends Array<Style> {
            constructor(...inputs: Style[]);
            toObject(): {
                [key: string]: string | number | Array<string | number>;
            };
            toString(): string;
            private static extractRaw;
            static fromString(styles: string): Styles;
        }
    }

    export function $(templateArray: TemplateStringsArray, ...values: any[]): import("csstype").Properties;
}

