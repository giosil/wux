# WUX - Wrapped User Experience 

A Javascript library to build component based user interface.

## Build

- `git clone https://github.com/giosil/wux.git`
- `npm install typescript -g`
- `tsc --declaration --project ./ts/wux/tsconfig.json`

## Gulp

- `npm install gulp -g`
- `npm install gulp-clean -g`
- `npm install gulp-concat -g`
- `npm install gulp-rename -g`
- `npm install gulp-sourcemaps -g`
- `npm install gulp-typescript -g`
- `npm install gulp-uglify -g`
- `npm install merge-stream -g`
- `npm list -g --depth 0`
- `npm link`
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

- [Tutorial](wux_tutorial.pdf)

## Contributors

* [Giorgio Silvestris](https://github.com/giosil)
