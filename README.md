# WUX - Wrapped User Experience ver. 2

A Javascript library to build component based user interface.

The project was born from a long experience in the development of portals in the public administration, particularly in the Italian market where the [Bootstrap Italia](https://italia.github.io/bootstrap-italia) theme is recommended by [AGID](https://www.agid.gov.it).

The **WUX** library is inspired by [React](https://react.dev) for component lifecycle management, but is designed to be more lightweight, flexible and easy-to-use.
It is also suitable for writing microfrontends with [single-spa](https://single-spa.js.org/) (see the [micro-wux](https://github.com/giosil/micro-wux) repository).
The methods that can be implemented in **WUX**, as in React, to control the behavior of components are listed below.

|The **constructor()** method is called when the component is first created. You use it to initialize the component's state and bind methods to the component's instance.|
|The **render()** method is responsible for generating the component's DOM representation based on its current props and state. It is called every time the component needs to be re-rendered, either because its props or state have changed, or because a parent component has been re-rendered.|
|The **componentDidMount()** method is called once the component has been mounted into the DOM. It is typically used to set up any necessary event listeners and perform other initialization tasks that require access to the browser's DOM API.|
|The **shouldComponentUpdate()** method is called before a component is updated. This method returns a boolean value that determines whether the component should update or not. If this method returns true, the component will update, and if it returns false, the component will not update.|
|The **componentWillUpdate()** method is called just before a component's update cycle starts. It allows you to perform any necessary actions before the component updates.|
|The **componentDidUpdate()** method is called after a component has been updated and re-rendered. It is useful for performing side effects or additional operations when the component's props or state have changed.|
|The **componentWillUnmount()** method is called just before the component is removed from the DOM. It allows you to perform any necessary cleanup or clearing any data structures that were set up during the mounting phase.|

## Build

- `git clone https://github.com/giosil/wux.git`
- `npm install typescript -g`
- `npm install uglify-js -g`
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
