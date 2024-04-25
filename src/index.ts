import { Properties as CSSProperties } from "csstype";


function dashToCamel(dashString: string) {
    return dashString.replace(/-([a-z])/g, function (match, char) {
        return char.toUpperCase();
    });
}

function toNumberIfNumber(str:string){
    if (isNaN(str as any)) return str;
    if (str.includes(".")) return parseFloat(str);
    else return parseInt(str);
}

export namespace EZInline {
    class StylerError extends Error {
        constructor(message:string){
            super(message);
            this.name = "$tyleError"
        }
    }

    export namespace Config {
        type SetPropertyOptions = {
            isPositional?: boolean
        }
        type ConfigurationOptions = {
            merge?:boolean
        }
        type Configuration = {
            properties: Record<string, string | ((value:string) => string)>
            unit:string
            multiple:number
        }
        const defaultConfigOptions:ConfigurationOptions = {
            merge: true
        }
        function toPosAlias(aliasObject: Record<string, string>) {
            let aliases = {};
            for (const alias in aliasObject) {
                const full = aliasObject[alias]
                aliases = {
                    ...aliases,
                    ...{
                        [alias]: full,
                        [alias + "l"]: full + "-left",
                        [alias + "b"]: full + "-bottom",
                        [alias + "t"]: full + "-top",
                        [alias + "r"]: full + "-right",
                        [alias + "x"]: (value:string) => `${full}l-${value} ${full}r-${value}`,
                        [alias + "y"]: (value:string) => `${full}t-${value} ${full}b-${value}`
                    }
                }
            }
            return aliases;
        };
        export const config = {
            "properties": {
                "col": "display-flex flex-direction-column",
                "row": "display-flex flex-direction-row",
                "grow": "flex-grow",
                ...toPosAlias({
                    m: "margin",
                    p: "padding",
                })
            } as Record<string, string|((value:string) => string)>,
            "unit": "px" as string,
            "multiple": 5 as number
        } as Configuration;

        export function hasProperty(property:string){
            return property in config.properties;
        }

        export function getProperty(property:string){
            return config.properties[property];
        }

        export function setProperty(name:string, value:Configuration['properties'][string], options?:SetPropertyOptions){
            if (typeof value === "string"){
                const prop = options?.isPositional ? (
                    {...toPosAlias({[name]: value})}
                ) : (
                    {[name] : value}
                );
                config.properties = {...config.properties, ...prop}
            } else {
                const prop = {[name] : value}
                config.properties = {...config.properties, ...prop}
            }
            return Config;
        }

        export function setProperties(properties:Configuration['properties'], options?:SetPropertyOptions){
            Object.entries(properties).forEach(([alias,value]) => {
                setProperty(alias, value, options)
            })
            return Config;
        }
        
        export function configure(configuration:Partial<Configuration>, options?:ConfigurationOptions){
            options = {...defaultConfigOptions, ...options}
            if (options.merge){
                const props = {...config.properties, ...configuration.properties};
                Object.assign(config, {...configuration, ...props})
            } else {
                Object.assign(config, configuration)
            }
        }
    }

    namespace Parser {
        class Style {
            property: string
            value: string | number | Array<string | number>
            constructor(property: string, value: string, isShorthand=true) {
                this.property = property;
                this.value = Style.parseValue(value);
                this.formatValue(isShorthand);
            }
            get camelProperty(){
                return dashToCamel(this.property)
            }

            get isValid(){
                const value = Array.isArray(this.value) ? this.value.join(" ") : this.value;
                const cssString = `${this.property}:${this.value}`;
                try {
                    return CSS.supports(cssString);
                } finally {
                    return false
                }
            }

            toString(){
                return this.property + ":" + this.value
            }

            toObject(){
                return {[this.camelProperty]:this.value}
            }

            private formatValue(isShorthand:boolean){
                if (!this.isValid){
                    if (Array.isArray(this.value)){
                        this.value = this.value.map(v => {
                            if (typeof v === "number"){
                                if (isShorthand){
                                    return (v*Config.config.multiple) + Config.config.unit
                                } else {
                                    return v + Config.config.unit
                                }
                            }
                            return v;
                        }).join(" ");
                    } else {
                        if (typeof this.value === "number"){
                            if (isShorthand) this.value = (this.value * Config.config.multiple) + Config.config.unit
                            else this.value = (this.value + Config.config.unit)
                        }
                    }
                }
                return this.value;
            }

            static parseValue(value: string) {
                const rawValue = value;
                if (rawValue.includes(" ")) {
                    const extracted: string[] = []
                    let stackBool = false;
                    let currentString = ""
                    for (const char of rawValue) {
                        if (char === ' ' && !stackBool) {
                            extracted.push(currentString);
                            currentString = ""
                        } else {
                            if (char === '"') stackBool = !stackBool;
                            currentString += char;
                        }
                    }
                    extracted.push(currentString)
                    return extracted.filter(x => !!x).map(s => toNumberIfNumber(s));
                }
                return toNumberIfNumber(rawValue);
            }

            static parseRaw(style:string){
                if (style.includes("(")) {
                    const property = style.slice(0, style.indexOf("("));
                    const rawValue = style.slice(style.indexOf("(") + 1, style.lastIndexOf(")"));
                    return {property, value:rawValue, isShorthand:false}
                }
                else if (style.includes("-")) {
                    const arr = style.split("-");
                    const property = arr.slice(0, arr.length - 1).join("-");
                    const value = arr[arr.length - 1];
                    return {property, value, isShorthand:true}
                } else {
                    return {property:style, value:"", isShorthand:false}
                }
            }
        }
        export class Styles extends Array<Style> {
            constructor(...inputs:Style[]){
                super(...inputs);
            }
            toObject(){
                return this.reduce((acc,curr) => {
                    return {...acc, ...curr.toObject()}
                }, {})
            }
            toString(){
                return this.map(s => s.toString()).join(";")
            }
            private static extractRaw(styles:string){
                const styleStrings: string[] = []
                const fullString = styles;
                let stackIter = 0;
                let currentString = ""
                for (const char of fullString) {
                    if (char === " " && stackIter === 0) {
                        styleStrings.push(currentString);
                        currentString = ""
                    } else {
                        if (char === "(") stackIter++;
                        if (char === ")") stackIter--;
                        currentString += char;
                    }
                }
                styleStrings.push(currentString)
                return styleStrings.filter(x => !!x);
            }
            static fromString(styles:string){
                const styleArray:Style[] = [];
                const extracted = Styles.extractRaw(styles);
                for (const style of extracted){
                    const {property, value, isShorthand} = Style.parseRaw(style);
                    if (Config.hasProperty(property)){
                        const configProp = Config.getProperty(property);
                        if (typeof configProp === "string"){
                            styleArray.push(
                                ...Styles.fromString(
                                    style.replace(property, configProp)
                                )
                            );
                        } else {
                            styleArray.push(
                                ...Styles.fromString(
                                    configProp(value)
                                )
                            )
                        }
                    } else {
                        styleArray.push(
                            new Style(property, value, isShorthand)
                        )
                    }
                }
                return new Styles(...styleArray);
            }

        }
    }

    export function $(templateArray: TemplateStringsArray, ...values: any[]) {
        const fullString = templateArray.reduce((acc, curr, index) => acc + curr + (values[index] ?? ""), "");
        return Parser.Styles.fromString(fullString).toObject() as CSSProperties;
    }
}

const $ = EZInline.$;

export default $;