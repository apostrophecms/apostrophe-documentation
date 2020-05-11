# `color`

A `color` field provides a colorpicker interface to the editor for choosing/inserting a color. Colors are saved as strings with a preferred format set in the optional `spectrumOptions` configuration object. The default is hex.

Valid formats include `name`, `hex`, `hex8`, `rgb`, `hsl`, and `hsv`.

The colorpicker interface is powered by Spectrum and you can provide a custom configuration passing a `spectrumOptions` object as part of the field. [Options and documentation for Spectrum here.](https://bgrins.github.io/spectrum/#options)

## Example

```javascript
{
  type: 'color',
  name: 'bgColor',
  label: 'Background Color',
  spectrumOptions: {
    showPaletteOnly: true,
    showPalette:true,
    allowEmpty:true,
    palette: [
        ['black', 'white', 'blanchedalmond',
        'rgb(255, 128, 0);', 'hsv 100 70 50'],
        ['red', 'yellow', 'green', 'blue', 'violet']
    ]
  }
}
```
## Settings

|  Property | Type   | Default | Description |
|---|---|---|---|
|name | `string` | | Sets the name of the field in the database |
|label | `string` | | Sets the label of the field that the user sees |
|spectrumOptions | `object` | | Provide custom configuration to the colorpicker interface |
|required | `boolean` | false | If true, the field is mandatory |
|contextual | `boolean` | false | If true, it will prevent the field from appearing in a dialog box |
|type | `string` | | Specifies the field type |
|readOnly | `boolean` | false | If true, prevents the user from editing the field |
|help | `string` | | Help text for the field that will appear with the field's label |
|htmlHelp | `string` | | Help text with support for HTML markup |