# WUX - Launcher

A Javascript library to launch external WUX app.

## Example

```html
<script src="dist/launcher.min.js"></script>

<div id="view-root"></div>

<script>
	wlaunch(
		'app.min.js', 
		'view-root', 
		()=>{ 
			WuxDOM.render(new APP.Main(), 'view-root'); 
		}
	);
</script>
```

## License

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Contributors

* [Giorgio Silvestris](https://github.com/giosil)
