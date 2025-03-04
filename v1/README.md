# WUX - Wrapped User Experience ver. 1.0.0

A Javascript library to build component based user interface.

This first version used was based on JQuery. In the new version JQuery is not required, but is supported.

## Build

- `git clone https://github.com/giosil/wux.git`
- `npm install typescript -g`
- `npm install uglify-js -g`
- `cd v1`
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
    <title>WUX ver. 1.0.0</title>
  </head>
  <body>
    <div id="view-root"></div>

    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js"></script>
    <script src="dist/wux.min.js"></script>
    <script src="dist/app.min.js"></script>
    <script type="text/javascript">
        WuxDOM.render(new APP.Main(), 'view-root');
    </script>
  </body>
</html>
```

## License

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Contributors

* [Giorgio Silvestris](https://github.com/giosil)
