import $, { EZInline } from "..";
import { Test, Tests } from "./utils";

EZInline.Config.setProperties({
    brad: 'border-radius'
}, {
    isPositional: true
});

EZInline.Config.setProperties({
    light: (color:string) => `color-light${color}`
})

new Tests([
    new Test('1', () => $`brad-2`, {borderRadius:'10px'}),
    new Test('2', () => $`m-2 p-1 brad-2`, {margin:'10px', padding:'5px', borderRadius:'10px'}),
    new Test('3', () => $`light-gray`, {color:'lightgray'})
]).run();
