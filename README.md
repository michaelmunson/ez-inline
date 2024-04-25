# ez-inline
An easy way to add inline styling to your react apps

**This is for use in the browser and *requires* `CSS.supports` to function properly**

## Installation
```bash
npm install ez-inline
```

## Usage
*index.tsx*
```typescript 
import $, { EZInline } from "..";
import { Test, Tests } from "./utils";

EZInline.Config.setProperties({
    brad: 'border-radius',
    light: (color:string) => `color-light${color}`
});
```

*component.tsx*
```tsx
import $ from "ez-inline";

export default function MyComponent() {
    return (
        <div style={$`brad-1 light-gray`}> {/* {borderRadius:'5px', color:'lightgray'} */}
            Hello World!
        </div>
    )
}
```
### Other usage
```typescript
$`text-transform-uppercase` // {textTransform:'uppercase'}

$`white-space-nowrap` // {whiteSpace: 'nowrap'}
```