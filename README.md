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
import { EZInline } from "ez-inline";

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
* As seen in the above example, adding only a number as value will result in the number being multiplied by 5 and adding "px" to the end.
* However, adding the unit at the end will override this behavior
```typescript
import $ from "ez-inline";

const margin20 = $`margin-4` // {margin: '20px'}

const margin4  = $`margin-4px` // {margin: '4px'}
```

### Handling Multiple or Dashed CSS Values
* Wrap the values in paranthesis
```typescript
import $ from "ez-inline";

const flexStyle = $`align-items(space-between)` // {alignItems: "space-between"}

const borderStyle = $`border(1px solid black)` // {border: "1px solid black"}
```

### Variables
* Configure variables using the `setVariables` method.
* Use a `$` within a string to denote a variable.

```typescript
import $, { EZInline } from "ez-inline";

EZInline.Config.setVariables({
    theme: 'red',
});

const myStyles = $`color-$theme border(1px solid $theme)`
// {color:"red", border:"1px solid red"}
```

### Positional Properties
* Positional Properties add all "positions" to a property in the form of "t", "b", "r", and "l"
```typescript
import $, { EZInline } from "ez-inline";

EZInline.Config.setProperties({
    m: 'margin',
    p: 'padding',
} ,{isPositional: true});

const sideMargin = `ml-2 mr-2 mt-1 mb-3` 
// {marginLeft: '10px', marginRight:'10px', marginTop: '5px', marginBottom: '15px'}
```

* EZInline by default has "m" and "p" as positional properties corresponding to margin and padding, respectively