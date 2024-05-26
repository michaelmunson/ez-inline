import $, { EZInline } from "../src";
import { Test, Tests } from "./utils";

EZInline.Config.setProperties({
    brad: 'border-radius'
}, {
    isPositional: true
}).setProperties({
    light: (color:string) => `color-light${color}`
}).setVariables({
    theme: 'red',
    bg_theme: 'blue'
})

new Tests([
    new Test('1', () => $`brad-2`, {borderRadius:'10px'}),
    new Test('2', () => $`m-2 p-1 brad-2`, {margin:'10px', padding:'5px', borderRadius:'10px'}),
    new Test('3', () => $`light-gray`, {color:'lightgray'}),
    new Test('4', () => $`m-2 p-1 brad-2 color-$theme background-$bg_theme`, {margin:'10px', padding:'5px', borderRadius:'10px', color:'red', background:'blue'}),
    new Test('5', () => $`m-2 p-1 brad-2 color-$theme background($bg_theme)`, {margin:'10px', padding:'5px', borderRadius:'10px', color:'red', background:'blue'}),
    new Test('6', () => $`border(1px solid $theme)`, {border: '1px solid red'})
]).run();
