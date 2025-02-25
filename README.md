# WUX - Wrapped User Experience ver. 2.0.0

A Javascript library to build component based user interface.

## Build

- `git clone https://github.com/giosil/wux.git`
- `npm install typescript -g`
- `npm run build`

## Example

```typescript
namespace APP {

    export class Main extends WUX.WComponent {
        protected render() {
            return '<div>Hello World!</div>';
        }
    }

}
```

```html
<!DOCTYPE html>
<html>
  <head>
    <title>WUX ver. 2.0.0</title>
  </head>
  <body>
    <div id="view-root"></div>

    <script src="dist/wux.min.js"></script>
    <script src="dist/app.min.js"></script>
    <script type="text/javascript">
        WuxDOM.render(new APP.Main(), 'view-root');
    </script>
  </body>
</html>
```

## SVG Logo

```xml
<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="0 0 82 72" xmlns="http://www.w3.org/2000/svg">
  <text style="fill: rgb(0, 0, 0); font-family: Consolas; font-size: 50px;" x="0" y="40">{&#x00B5;}</text>
  <text style="fill: rgb(0, 0, 0); font-family: Consolas; font-size: 14px;" x="7" y="65">micro-wux</text>
</svg>
```

<table>
  <tr>
    <td><img src="wux-black.svg" width="300" height="300"></td>
    <td><img src="wux-white.svg" width="300" height="300"></td>
  </tr>
</table>

## License

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Contributors

* [Giorgio Silvestris](https://github.com/giosil)
