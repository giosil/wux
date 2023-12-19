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
<script type="text/javascript">
  WuxDOM.render(new HelloWorld(), 'view-root');
</script>
```

## Documentation

- [Tutorial (English)](wux_tutorial-en.pdf)
- [Tutorial (Italiano)](wux_tutorial-it.pdf)

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
