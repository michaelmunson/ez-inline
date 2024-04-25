import $, { EZInline } from "..";
import { Test, Tests } from "./utils";

EZInline.Config.setProperties({
    brad: 'border-radius'
}, true)

new Tests([
    new Test('1', () => $`brad-2`, {borderRadius:'10px'}),
    new Test('2', () => $`m-2 p-1 brad-2`, {margin:'10px', padding:'5px', borderRadius:'10px'})
]).run();
