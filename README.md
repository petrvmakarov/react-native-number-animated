# Animated numeric label for React Native

![Image](https://github.com/petrvmakarov/react-native-number-animated/blob/master/readme/demo.gif?raw=true)

## Installation
```
npm i react-native-number-animated
```

## Usage
```
  import NumberAnimated from 'react-native-number-animated';
```
Just place  ```<NumberAnimated value={some_numeric_value} />``` tag, provide a numeric value to the ```value``` prop.
Use ```nullValue``` prop to substitute null value output (default is ```--```) 

```<NumberAnimated value={some_numeric_value} nullValue="--"/>```

### Customize render
Use render function to have desiered output:
```
<NumberAnimated value={value}>
  {(v) => {
    return (
    <Text style={{ fontSize: 40 }}>{v}</Text>
    );
  }}
</NumberAnimated>
```

## Props
 - ```value: numeric``` no default value
 - ```nullValue: string``` default value is ```--```
 - ```children: (value: numeric)``` no default value, provides incrmented numeric value for each animation frame
