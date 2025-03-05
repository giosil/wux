# WUX - Wrapped User Experience ver. 2 &middot; [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

A Javascript library to build component based user interface.

The project was born from a long experience in the development of portals in the public sector, particularly in the Italian market where the [Bootstrap Italia](https://italia.github.io/bootstrap-italia) theme is recommended by [AGID](https://www.agid.gov.it).

The **WUX** library is inspired by [React](https://react.dev) for component lifecycle management, but is designed to be more 
- **lightweight**, 
- **flexible**, 
- **easy-to-use**.

It is also suitable for writing microfrontends with [single-spa](https://single-spa.js.org/) (see the [micro-wux](https://github.com/giosil/micro-wux) repository).

[See a sample application.](samples/)

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

## Documentation

The methods that can be implemented in **WUX**, as in React, to control the behavior of components are listed below.

<table>
<tr><td>The <strong>constructor()</strong> method is called when the component is first created. You use it to initialize the component's state and bind methods to the component's instance.</td></tr>
<tr><td>The <strong>render()</strong> method is responsible for generating the component's DOM representation based on its current props and state. It is called every time the component needs to be re-rendered, either because its props or state have changed, or because a parent component has been re-rendered.</td></tr>
<tr><td>The <strong>componentDidMount()</strong> method is called once the component has been mounted into the DOM. It is typically used to set up any necessary event listeners and perform other initialization tasks that require access to the browser's DOM API.</td></tr>
<tr><td>The <strong>shouldComponentUpdate()</strong> method is called before a component is updated. This method returns a boolean value that determines whether the component should update or not. If this method returns true, the component will update, and if it returns false, the component will not update.</td></tr>
<tr><td>The <strong>componentWillUpdate()</strong> method is called just before a component's update cycle starts. It allows you to perform any necessary actions before the component updates.</td></tr>
<tr><td>The <strong>componentDidUpdate()</strong> method is called after a component has been updated and re-rendered. It is useful for performing side effects or additional operations when the component's props or state have changed.</td></tr>
<tr><td>The <strong>componentWillUnmount()</strong> method is called just before the component is removed from the DOM. It allows you to perform any necessary cleanup or clearing any data structures that were set up during the mounting phase.</td></tr>
</table>

## Components

In addition to the development model, WUX offers some ready-to-use components that are frequently used in web applications.

Below are some of the more relevant components.

### WUX.WContainer

**WContainer** allows you to implement the layout of a component.

```typescript
this.main = new WUX.WContainer();
this.main
  .addRow()
    .addCol('col-md-12')
      .add(this.form)
  .addRow()
    .addCol('col-md-8')
      .addGroup({"classStyle": "form-row"}, this.btnFind, this.btnReset)
    .addCol('col-md-4', {a : 'right'})
      .addGroup({"classStyle": "form-row"}, this.btnNew)
  .addRow()
    .addCol('col-md-12', 'padding-top: 1rem;')
      .add(this.table);
```

### WUX.WForm

**WForm** allows you to implement an HTML form.

```typescript
this.form = new WUX.WForm(this.subId('form'));
this.form
  .addRow()
    .addTextField('name', 'Name')
    .addOptionsField('gender', 'Gender', options, {"span": 2})
  .addRow()
    .addDateField('date', 'Date')
    .addTimeField('time', 'Time')
    .addBooleanField('flag', 'Flag');

// Validation
this.form.setMandatory('name', 'gender');

let returnLabels = true;
let focusOn = true;
let atLeastOne = false;
let m = this.form.checkMandatory(returnLabels, focusOn, atLeastOne);
if(m) {
  alert('Check: ' + m);
  return;
}
```

### WUX.WButton

**WButton** allows you to implement an HTML button and handle related events.

```typescript
this.btnFind = new WUX.WButton(this.subId('btnFind'), 'Search', 'fa-search', 'btn-icon btn btn-primary', 'margin-right: 0.5rem;');
this.btnFind.on('click', (e: PointerEvent) => {
  // Perform operation
});
```

### WUX.WTable

**WTable** allows you to implement an HTML table.

```typescript
let h = ['Code', 'Name', 'View', 'Edit', 'Delete'];
let k = ['code', 'name', '_v',   '_m',   '_d'];
this.table = new WUX.WTable(this.subId('tapp'), h, k);
this.table.selectionMode = 'single';
this.table.div = 'table-responsive';
this.table.types = ['s', 's', 'w', 'w', 'w'];
this.table.sortable = [0, 1];
this.table.on('click', (e: PointerEvent) => {
  let a = WUX.getAction(e, this);
  if(!a || !a.ref) return;
  if(a.name == 'sort') return;
  let s = this.table.getState();
  let x = WUX.WUtil.indexOf(s, 'id', a.ref);
  if(x < 0) return;
  // Perform operation
});
this.table.onDoubleClick((e: {element?: Element; rowElement?: Element; data?: any; rowIndex?: number; }) => {
  // Perform operation
});

// Let "data" be an array containing the records to be displayed in the table
let data = [];
for(let r of data) {
  r["_v"] = WUX.action('view',   r["id"], 'fa-search');
  r["_m"] = WUX.action('edit',   r["id"], 'fa-edit');
  r["_d"] = WUX.action('delete', r["id"], 'fa-trash');
}

this.table.setState(data);
```

### WUX.WTab

**WTab** allows you to implement tabs and handle related events.

```typescript
this.tab = new WUX.WTab(this.subId('tab'));
this.tab.contStyle = 'height:400px;padding-top:24px;';
this.tab
  .addTab('Form', 'fa-edit')
    .add(this.form);
this.tab
  .addTab('Table', 'fa-list')
    .addRow()
      .addCol('col-10')
        .add(this.table)
      .addCol('col-2')
        .add(this.btnAdd)
        .addDiv(4)
        .add(this.btnRem)
        .addDiv(4)
        .add(this.btnUp)
        .add(this.btnDw);

this.tab.on('statechange', (e: WUX.WEvent) => {
  let index = this.tab.getState();
  // Perform operation
});
```

### WUX.WPages

**WPages** allows you to display one component at a time in a view.

```typescript
this.pages = new WUX.WPages();
this.pages
  .before(compBefore)
  .add(component0)
  .add(component1)
  .add(component2)
  .add(component3);

// Show dialog in same view
dialog.addToPages(this.pages, false);

// Show single page
this.pages.show(0);
```

### WUX.WDialog

**WDialog** allows you to implement modal dialogs.

```typescript
export interface Entity {
  id: number;
  code?: string;
  name?: string;
}

export class DlgEntity extends WUX.WDialog<string, Entity> {
  form: WUX.WForm;

  constructor(id: string) {
    super(id, 'DlgEntity');
    
    this.title = 'Entity';

    this.form = new WUX.WForm(this.subId('form'));
    this.form.addRow();
    this.form.addTextField('code', 'Code');
    this.form.addRow();
    this.form.addTextField('name', 'Name');
    this.form.addInternalField('id');

    this.form.setMandatory('code', 'name')
    
    this.body
      .addRow()
        .addCol('col-md-12')
          .add(this.form);
  }

  override updateState(nextState: Entity): void {
    this.state = nextState;
    if(this.form) {
      this.form.clear();
      this.form.setState(this.state);
    }
  }

  override getState(): Entity {
    if(this.form) this.state = this.form.getState();
    return this.state;
  }

  override onClickOk(): boolean {
    if(this.props == 'new' || this.props == 'edit') {
      let m = this.form.checkMandatory(true, true);
      if(m) {
        showWarning('Check: ' + m);
        return false;
      }
    }
    return true;
  }

  protected onShown() {
    if(this.props == 'view') {
      this.form.enabled = false;
      this.updButtons('Close', '');
    }
    else {
      this.form.enabled = true;
      this.updButtons('Save');
      if(this.props == 'edit') {
        this.form.setReadOnly('code', true);
        setTimeout(() => { this.form.focusOn('name'); });
      }
      else {
        this.form.setReadOnly('code', false);
        setTimeout(() => { this.form.focusOn('code'); });
      }
    }
  }
}
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
