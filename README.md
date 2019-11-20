# WUX - Wrapped User Experience 

A simple Javascript library to build component based user interface.

## Build

- `git clone https://github.com/giosil/wux.git` 
- `tsc --declaration --project ./ts/wux/tsconfig.json`

## Example

```typescript
class HelloWord extends WUX.WComponent {
  protected render() {
    return '<h1>Hello word</h1>';
  }
}

WuxDOM.render(new HelloWord(), 'view-root');
```

## Documentation

- [Tutorial](wux_tutorial.pdf)

## Contributors

* [Giorgio Silvestris](https://github.com/giosil)
