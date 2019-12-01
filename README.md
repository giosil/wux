# WUX - Wrapped User Experience 

A Javascript library to build component based user interface.

## Build

- `git clone https://github.com/giosil/wux.git` 
- `tsc --declaration --project ./ts/wux/tsconfig.json`

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
