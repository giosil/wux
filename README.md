# WUX - Wrapped User Experience 

A Javascript library to build component based user interface.

## Build

- `git clone https://github.com/giosil/wux.git`
- `npm install typescript -g`
- `tsc --declaration --project ./ts/wux/tsconfig.json`

## Gulp

### Gulp global installation

- `npm install gulp -g`
- `npm install gulp-debug -g`
- `npm install gulp-rename -g`
- `npm install gulp-sourcemaps -g`
- `npm install gulp-typescript -g`
- `npm install gulp-uglify -g`
- `npm install merge-stream -g`
- `npm list -g --depth 0`

### Gulp local installation

- `npm link gulp`
- `npm link gulp-debug`
- `npm link gulp-rename`
- `npm link gulp-sourcemaps`
- `npm link gulp-typescript`
- `npm link gulp-uglify`
- `npm link merge-stream`
- `npm link typescript`
- `npm list --depth 0`
- `gulp --verify`

### Gulp build

- `gulp`

## Example

```typescript
class HelloWorld extends WUX.WComponent {
  protected render() {
    return '<h1>Hello world</h1>';
  }
}
```

```html
<!DOCTYPE html>
<html>
 <head>
  ...
 </head>
 <body>
  <div id="view-root"></div>
  <script type="text/javascript">
   WuxDOM.render(new HelloWorld(), 'view-root');
  </script>
 </body>
</html>
```

## Documentation

- [Tutorial (English)](wux_tutorial-en.pdf)
- [Tutorial (Italiano)](wux_tutorial-it.pdf)

## License

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Contributors

* [Giorgio Silvestris](https://github.com/giosil)
