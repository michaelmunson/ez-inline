"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EZInline = void 0;
function dashToCamel(dashString) {
    return dashString.replace(/-([a-z])/g, function (match, char) {
        return char.toUpperCase();
    });
}
function toNumberIfNumber(str) {
    if (isNaN(str))
        return str;
    if (str.includes("."))
        return parseFloat(str);
    else
        return parseInt(str);
}
var EZInline;
(function (EZInline) {
    class StylerError extends Error {
        constructor(message) {
            super(message);
            this.name = "$tyleError";
        }
    }
    let Config;
    (function (Config) {
        const defaultConfigOptions = {
            merge: true
        };
        function toPosAlias(aliasObject) {
            let aliases = {};
            for (const alias in aliasObject) {
                const full = aliasObject[alias];
                aliases = Object.assign(Object.assign({}, aliases), {
                    [alias]: full,
                    [alias + "l"]: full + "-left",
                    [alias + "b"]: full + "-bottom",
                    [alias + "t"]: full + "-top",
                    [alias + "r"]: full + "-right",
                    [alias + "x"]: (value) => `${full}l-${value} ${full}r-${value}`,
                    [alias + "y"]: (value) => `${full}t-${value} ${full}b-${value}`
                });
            }
            return aliases;
        }
        ;
        Config.config = {
            "properties": Object.assign({ "col": "display-flex flex-direction-column", "row": "display-flex flex-direction-row", "grow": "flex-grow" }, toPosAlias({
                m: "margin",
                p: "padding",
            })),
            "unit": "px",
            "multiple": 5
        };
        function hasProperty(property) {
            return property in Config.config.properties;
        }
        Config.hasProperty = hasProperty;
        function getProperty(property) {
            return Config.config.properties[property];
        }
        Config.getProperty = getProperty;
        function setProperty(name, value, options) {
            if (typeof value === "string") {
                const prop = (options === null || options === void 0 ? void 0 : options.isPositional) ? (Object.assign({}, toPosAlias({ [name]: value }))) : ({ [name]: value });
                Config.config.properties = Object.assign(Object.assign({}, Config.config.properties), prop);
            }
            else {
                const prop = { [name]: value };
                Config.config.properties = Object.assign(Object.assign({}, Config.config.properties), prop);
            }
            return Config;
        }
        Config.setProperty = setProperty;
        function setProperties(properties, options) {
            Object.entries(properties).forEach(([alias, value]) => {
                setProperty(alias, value, options);
            });
            return Config;
        }
        Config.setProperties = setProperties;
        function configure(configuration, options) {
            options = Object.assign(Object.assign({}, defaultConfigOptions), options);
            if (options.merge) {
                const props = Object.assign(Object.assign({}, Config.config.properties), configuration.properties);
                Object.assign(Config.config, Object.assign(Object.assign({}, configuration), props));
            }
            else {
                Object.assign(Config.config, configuration);
            }
        }
        Config.configure = configure;
    })(Config = EZInline.Config || (EZInline.Config = {}));
    let Parser;
    (function (Parser) {
        class Style {
            constructor(property, value, isShorthand = true) {
                this.property = property;
                this.value = Style.parseValue(value);
                this.formatValue(isShorthand);
            }
            get camelProperty() {
                return dashToCamel(this.property);
            }
            get isValid() {
                const value = Array.isArray(this.value) ? this.value.join(" ") : this.value;
                const cssString = `${this.property}:${this.value}`;
                try {
                    return CSS.supports(cssString);
                }
                finally {
                    return false;
                }
            }
            toString() {
                return this.property + ":" + this.value;
            }
            toObject() {
                return { [this.camelProperty]: this.value };
            }
            formatValue(isShorthand) {
                if (!this.isValid) {
                    if (Array.isArray(this.value)) {
                        this.value = this.value.map(v => {
                            if (typeof v === "number") {
                                if (isShorthand) {
                                    return (v * Config.config.multiple) + Config.config.unit;
                                }
                                else {
                                    return v + Config.config.unit;
                                }
                            }
                            return v;
                        }).join(" ");
                    }
                    else {
                        if (typeof this.value === "number") {
                            if (isShorthand)
                                this.value = (this.value * Config.config.multiple) + Config.config.unit;
                            else
                                this.value = (this.value + Config.config.unit);
                        }
                    }
                }
                return this.value;
            }
            static parseValue(value) {
                const rawValue = value;
                if (rawValue.includes(" ")) {
                    const extracted = [];
                    let stackBool = false;
                    let currentString = "";
                    for (const char of rawValue) {
                        if (char === ' ' && !stackBool) {
                            extracted.push(currentString);
                            currentString = "";
                        }
                        else {
                            if (char === '"')
                                stackBool = !stackBool;
                            currentString += char;
                        }
                    }
                    extracted.push(currentString);
                    return extracted.filter(x => !!x).map(s => toNumberIfNumber(s));
                }
                return toNumberIfNumber(rawValue);
            }
            static parseRaw(style) {
                if (style.includes("(")) {
                    const property = style.slice(0, style.indexOf("("));
                    const rawValue = style.slice(style.indexOf("(") + 1, style.lastIndexOf(")"));
                    return { property, value: rawValue, isShorthand: false };
                }
                else if (style.includes("-")) {
                    const arr = style.split("-");
                    const property = arr.slice(0, arr.length - 1).join("-");
                    const value = arr[arr.length - 1];
                    return { property, value, isShorthand: true };
                }
                else {
                    return { property: style, value: "", isShorthand: false };
                }
            }
        }
        class Styles extends Array {
            constructor(...inputs) {
                super(...inputs);
            }
            toObject() {
                return this.reduce((acc, curr) => {
                    return Object.assign(Object.assign({}, acc), curr.toObject());
                }, {});
            }
            toString() {
                return this.map(s => s.toString()).join(";");
            }
            static extractRaw(styles) {
                const styleStrings = [];
                const fullString = styles;
                let stackIter = 0;
                let currentString = "";
                for (const char of fullString) {
                    if (char === " " && stackIter === 0) {
                        styleStrings.push(currentString);
                        currentString = "";
                    }
                    else {
                        if (char === "(")
                            stackIter++;
                        if (char === ")")
                            stackIter--;
                        currentString += char;
                    }
                }
                styleStrings.push(currentString);
                return styleStrings.filter(x => !!x);
            }
            static fromString(styles) {
                const styleArray = [];
                const extracted = Styles.extractRaw(styles);
                for (const style of extracted) {
                    const { property, value, isShorthand } = Style.parseRaw(style);
                    if (Config.hasProperty(property)) {
                        const configProp = Config.getProperty(property);
                        if (typeof configProp === "string") {
                            styleArray.push(...Styles.fromString(style.replace(property, configProp)));
                        }
                        else {
                            styleArray.push(...Styles.fromString(configProp(value)));
                        }
                    }
                    else {
                        styleArray.push(new Style(property, value, isShorthand));
                    }
                }
                return new Styles(...styleArray);
            }
        }
        Parser.Styles = Styles;
    })(Parser || (Parser = {}));
    function $(templateArray, ...values) {
        const fullString = templateArray.reduce((acc, curr, index) => { var _a; return acc + curr + ((_a = values[index]) !== null && _a !== void 0 ? _a : ""); }, "");
        return Parser.Styles.fromString(fullString).toObject();
    }
    EZInline.$ = $;
})(EZInline || (exports.EZInline = EZInline = {}));
const $ = EZInline.$;
exports.default = $;
