# WUX - Wrapped User Experience ver. 2 &middot; [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

**WUX** is a Javascript library to build component based user interface.

The project builds on years of experience developing portals for the Italian public sector, where [AGID](https://www.agid.gov.it) recommends the [Bootstrap Italia](https://italia.github.io/bootstrap-italia) theme.

The main idea was to support the development of modern web applications without using more complicated frameworks.

The **WUX** library is inspired by [React](https://react.dev) for component lifecycle management, but is designed to be more 
- **lightweight**, 
- **flexible**, 
- **easy-to-use**.

By installing Typescript globally there are no additional direct dependencies. In other words, **you no longer have to deal with large node_modules directories**. :sunglasses:

**JQuery** is supported, but NOT required.

It is also suitable for writing microfrontends with [single-spa](https://single-spa.js.org/) (see the [micro-wux](https://github.com/giosil/micro-wux) repository).

[See a sample application.](samples/)

To check the accessibility of your web application see [MAUVE++](https://mauve.isti.cnr.it) based on the Web Content Accessibility Guidelines - [WCAG](https://www.w3.org/TR/WCAG21/).

## Build

- `git clone https://github.com/giosil/wux.git`
- `npm install typescript -g`
- `npm install uglify-js -g`
- `npm run build`

## Examples

The simplest example of **WUX.WComponent** is as follows:

```typescript
namespace APP {
  export class Main extends WUX.WComponent {
    protected render() {
      return '<div>Hello World!</div>';
    }
  }
}
```

The **render()** method can also return an HTML element.

```typescript
namespace APP {
  export class Main extends WUX.WComponent {
    protected render() {
      let ele = document.createElement('div');
      ele.textContent = 'Hello World!'
      return ele;
    }
  }
}
```

Finally, the **render()** method can also return an instance of **WUX.WComponent**.

```typescript
namespace APP {
  export class Main extends WUX.WComponent {
    protected render() {
      return new WUX.Wrapp('Hello World!', 'div');
    }
  }
}
```

This way you can develop a view by composing strings, elements and instances of **WUX.WComponent**.

Generally you can use the **WUX.WContainer** component to lay out other components, html or elements.

```typescript
namespace APP {
  export class Main extends WUX.WComponent {
    main:      WUX.WContainer;
    component: WUX.Wrapp;
    element:   Element;

    protected render() {
      this.component = new WUX.Wrapp('Hello World!', 'h1');

      this.element = document.createElement('p');
      this.element.textContent = 'Sample element';

      this.main = new WUX.WContainer();
      this.main
        .addRow()
          .addCol('col-md-12')
            .add(this.component)
        .addRow()
          .addCol('col-md-6')
            .add('<p>Sample string</p>')
          .addCol('col-md-6')
            .add(this.element);

      return this.main;
    }
  }
}
```

To mount a view, simply write:

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

![WUX Lifecycle](WUX.png)

Additional methods and properties are listed below.

<table>
<tr><td>The <strong>updateState(nextState: S)</strong> method is called when the <strong>state</strong> needs to be updated.</td></tr>
<tr><td>The <strong>updateProps(nextProps: P)</strong> method is called when the <strong>props</strong> needs to be updated.</td></tr>
<tr><td>The <strong>buildRoot, build, make</strong> methods are called in <strong>render</strong> default implementation.</td></tr>
<tr><td>The <strong>on, off, trigger</strong> methods allow you to handle events provided by the DOM or custom events (the event name begins with an underscore).</td></tr>
<tr><td>The <strong>style, classStyle, attributes</strong> properties allow you to characterize the component in terms of presentation.</td></tr>
<tr><td>The <strong>visible, enabled</strong> properties allow you to respectively make the component visible or not and enable or disable it.</td></tr>
<tr><td>The <strong>focus(), blur()</strong> methods allow you to handle the focus on the component.</td></tr>
<tr><td>The <strong>forceUpdate()</strong> method forces the component to update.</td></tr>
<tr><td>The <strong>getRoot()</strong> method returns the root element of the component.</td></tr>
<tr><td>The <strong>getContext()</strong> method returns the element on which the component was mounted.</td></tr>
</table>

## Wrapper like component

In WUX a component is effectively a wrapper.

In addition to the development model, WUX offers some ready-to-use wrappers that are frequently used in web applications.

Below are some of the more relevant wrappers.

### WUX.WContainer

**WContainer** allows you to implement the layout of a component composed of other components.

```typescript
this.main = new WUX.WContainer();
this.main
  .before('<h1>Title</h1>')
  .head('<p>Head</p>')
  .addRow()
    .addCol('col-md-12')
      .section('Title')
      .add(this.form)
  .addRow()
    .addCol('col-md-8')
      .addGroup(
        {"classStyle": "form-row"}, 
        this.btnFind, 
        this.btnReset)
    .addCol('col-md-4', {a: 'right'})
      .addGroup(
        {"classStyle": "form-row"}, 
        this.btnNew)
  .addRow()
    .addCol('col-md-12', 'padding-top: 1rem;')
      .add(this.table)
  .addBox('Box title')
    .addTool(this.badges)
    .addCollapse()
    .addRow()
      .addCol('col-md-12')
        .add('<p>Box sample</p>')
    .endBox()
  .tail('<p>Tail</p>')
  .after('<p>After</p>');
```

### WUX.WForm

**WForm** allows you to implement an HTML form.

```typescript
let options: WUX.WEntity[] = [
  {id: 'N', text: ''},
  {id: 'M', text: 'Male'}, 
  {id: 'F', text: 'Female'}
];

this.form = new WUX.WForm(this.subId('form'));
this.form
  .legend('Filter')
  .addRow()
    .addTextField('name', 'Name')
    .addOptionsField('gender', 'Gender', options, {"span": 2})
  .section('Section title')
  .addRow()
    .addDateField('date', 'Date')
    .addTimeField('time', 'Time')
    .addBooleanField('flag', 'Check')
    .addToggleField('toggle', 'Active')
  .addInternalField('id')
  .addToFooter('<em>(*) Mandatory field</em>');

// Validation
this.form.setMandatory('name', 'gender');

let returnLabels  = true;
let focusOn       = true;
let atLeastOne    = false;
let invalidFields = this.form.checkMandatory(returnLabels, focusOn, atLeastOne);
if(invalidFields) {
  alert('Check: ' + invalidFields);
  return;
}

// Utilities

// Clear all fields
this.form.clear();

// Enable / Disable a field
this.form.setEnabled('date', false);

// Set focus on a field
this.form.focusOn('name');

// Handle focus event on a field
this.form.onFocus('name', (e: FocusEvent) => {
  console.log('focus', e);
});

// Handle blur event on a field
this.form.onBlur('name', (e: FocusEvent) => {
  console.log('blur', e);
});

// Find option by text
this.form.findOption('gender', 'Male');

// Load options later
this.form.setOptions('gender', options);

// True/False values
this.form.addToggleField('confirm', 'Confirm', ['Yes','No']);

// Register an event handler on a specific field
this.form.onField('gender', 'statechange', (e: WUX.WEvent) => {
  console.log('gender statechange', e);
});

// Set nested value
let updState = false;
this.form.setValueOf('name', booking, 'person.name', updState);

// Set nested value with check option
this.form.setValueOf('gender', booking, 'person.gender', updState, 
  (c: WUX.WComponent, v: any) => {
    // Function called when the value is not present in the options
    // Load options
    let opts = this.loadGenderOptions();
    this.fp.setOptions('gender', opts);
    // Set selected option
    setTimeout(() => { this.fp.setValue('gender', v); }, 100);
  }
);

// Set single value
this.form.setValue('name', 'Jhon');

// Get single value
let name = this.form.getValue('name');

// Check blank form
if(this.form.isBlank()) {
  console.log('The form is blank.');
}

// Check blank field
if(this.form.isBlank('name')) {
  console.log('name is blank.');
}

// Check blank fields
if(this.form.isBlank('name', 'gender')) {
  console.log('name and gender are blank.');
}

// Count not blank fields
let count = this.form.notBlank('name', 'gender');

// Load file
let f = this.form.getFile('file', (f: File, b64: string) => {
  console.log('file, content', f, b64);
}

// Modify label text
this.form.setLabelText('file', 'File to upload');

// Modify label Style
this.form.setLabelCss('file', 'color: red;');
```

### WUX.WButton

**WButton** allows you to implement an HTML button and handle related events.

```typescript
this.btnFind = new WUX.WButton(
  this.subId('btnFind'),       // Element id
  'Search',                    // Caption
  'fa-search',                 // Icon
  'btn-icon btn btn-primary',  // Style class
  'margin-right: 0.5rem;'      // Inline style
);
this.btnFind.on('click', (e: PointerEvent) => {
  // Perform operation
});

this.btnReset = new WUX.WButton(
  this.subId('btnReset'),      // Element id
  'Cancel',                    // Caption
  'fa-undo',                   // Icon
  'btn-icon btn btn-secondary' // Style class
);
this.btnReset.on('click', (e: PointerEvent) => {
  this.form.clear();
  this.form.focus();
  this.table.setState([]);
});

// To disable a button
this.btnFind.enabled = false;
```

### WUX.WLink

**WLink** allows you to implement an HTML link and handle related events.

```typescript
let fid  = 5;
let link = new WUX.WLink(
  this.subId('file-' + fid), // Element id
  'Link to file',            // Caption
  'fa-file',                 // Icon
  'text-primary',            // Style class
  'cursor:pointer;'          // Inline style
);
link.lock = true; // Inhibits state change (Caption)
link.tooltip = 'Download file';
link.on('click', (e: MouseEvent) => {
  let cid = WUX.getId(e.currentTarget);
  let fid = WUtil.toNumber(WUX.lastSub(cid));
  // Perform operation
});
```

### WUX.WInput

**WInput** allows you to implement an HTML input and handle related events.

```typescript
let input = new WUX.WInput(this.subId('inp'), 'text', 20);
input.placeHolder = 'Search...';
input.readonly = false;
input.enabled = true;
input.autofocus = true;
input.onEnter((e: KeyboardEvent) => {
  // Perform operation
});
```

### WUX.WTextArea

**WTextArea** allows you to implement an HTML textarea and handle related events.

```typescript
// Create a textarea with 3 rows
let ta = new WUX.WTextArea(this.subId('ta'), 3);
ta.readonly = false;
ta.enabled = true;
ta.autofocus = true;
ta.setState('Hello World!");
```

### WUX.WRadio

**WRadio** allows you to implement an HTML radio input and handle related events.

```typescript
let options: WUX.WEntity[] = [
  {id: 'N', text: ''},
  {id: 'M', text: 'Male'}, 
  {id: 'F', text: 'Female'}
];

let radio = new WUX.WRadio(this.subId('rad'));
radio.setOptions(options);
radio.on('statechange', (e: WUX.WEvent) => {
  console.log('rad statechange', e);
});

// Find option by text
let optM = radio.findOption('Male');
```

### WUX.WCheck

**WCheck** allows you to implement an HTML checkbox input and handle related events.

```typescript
let check = new WUX.WCheck(this.subId('ck'));
check.label = 'Label';

// Bootstrap styles 
check.divClass   = WUX.CSS.FORM_CHECK;
check.divStyle   = WUX.CSS.CHECK_STYLE;
check.classStyle = WUX.CSS.FORM_CTRL;

// Toggles
check.lever      = true;
check.leverStyle = WUX.CSS.LEVER_STYLE;

check.on('statechange', (e: WUX.WEvent) => {
  console.log('ck statechange', e);
});
```

### WUX.WSelect

**WSelect** allows you to implement an HTML select and handle related events.

```typescript
let options: WUX.WEntity[] = [
  {id: 'N', text: ''},
  {id: 'M', text: 'Male'}, 
  {id: 'F', text: 'Female'}
];

let select = new WUX.WSelect(this.subId('sel'));
select.setOptions(options);
select.on('statechange', (e: WUX.WEvent) => {
  console.log('sel statechange', e);
});

// Find option by text
let optM = select.findOption('Male');
```

### WUX.WLabel

**WLabel** allows you to implement an HTML span or label (if "for" attribute setted).

```typescript
let label = new WUX.WLabel(
  this.subId('label'),    // Element id
  'Text',                 // Text
  'fa-circle-info',       // Icon
  'text-primary',         // Style class
  'margin-right: 0.5rem;' // Inline style
);
```

### WUX.Wrapp

**Wrapp** allows you to wrapp an HTML element.

```typescript
let ele = document.createElement('span');
ele.id  = 'w1';
ele.setAttribute('style', 'margin-top: 1rem;');
ele.className = 'badge bg-primary';
ele.textContent = 'Hello';

let w1 = new WUX.Wrapp(ele);

let w2 = new WUX.Wrapp('<span id="w2" class="badge bg-primary" style="margin-top: 1rem;">Hello</span>');

let w3 = new WUX.Wrapp('Hello', 
           'span', 
           'w3', 
           'badge bg-primary', 
           'margin-top: 1rem;');
```

### WUX.WTable

**WTable** allows you to implement an HTML table.

```typescript
// Header captions
let h = ['Code', 'Name', 'View', 'Edit', 'Delete'];
// Header symbols
let k = ['code', 'name', '_v',   '_m',   '_d'];
this.table = new WUX.WTable(this.subId('tapp'), h, k);
this.table.selectionMode = 'single';
this.table.div = 'table-responsive';
this.table.types = ['s', 's', 'w', 'w', 'w'];
this.table.sortable = [0, 1];
// Click event
this.table.on('click', (e: PointerEvent) => {
  let a = WUX.getAction(e, this);
  if(!a || !a.ref) return;
  if(a.name == 'sort') return;
  let s = this.table.getState();
  let x = WUX.WUtil.indexOf(s, 'id', a.ref);
  if(x < 0) return;
  // Perform operation
});
// DoubleClick event
this.table.onDoubleClick((e: {element?: Element; rowElement?: Element; data?: any; rowIndex?: number; }) => {
  // Perform operation
});
// Selection event
this.table.onSelectionChanged((e: {element?: Element, selectedRowsData?: any[]}) => {
  let srs = this.table.getSelectedRows();     // array of selected indexes
  let srd = this.table.getSelectedRowsData(); // array of selected data
  // Perform operation
});
// RowPrepared event 
this.table.onRowPrepared((e: {element?: Element, rowElement?: Element, data?: any, rowIndex?: number}) => {
  let mark = e.data['mark'];
  if (mark) {
    WUX.setCss(e.rowElement, WUX.CSS.WARNING);
  }
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

Default CSS class setted in `WUX.CSS.SEL_ROW` is `primary-bg-a2`.

```css
.primary-bg-a2 {
  background-color: hsl(208deg,62.6865671642%,89.28%)!important;
}
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

// To disable a tab
this.tab.setEnabled(1, false);
```

### WUX.WPages

**WPages** allows you to display one component at a time in a view. The component also allows you to display a Dialog like a page.

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
  id:    number;
  code?: string;
  name?: string;
}

export class DlgEntity extends WUX.WDialog<string, Entity> {
  form: WUX.WForm;

  constructor(id: string) {
    super(id, 'DlgEntity');

    this.title = 'Entity';

    // Default:
    // this.mainClass = 'modal-dialog modal-lg';

    // this.fullscreen = true;
    // this.mainClass = 'modal-dialog modal-fullscreen';

    // Custom modal class:
    // this.mainClass = 'modal-dialog modal-xl';

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

// The Dialog is typically created in the constructor of component that manages it.
constructor() {
  super();
  this.dlg = new DlgEntity(this.subId('dlg'));
  // this.dlg.fullscreen = true;
  this.dlg.onHiddenModal((e: JQueryEventObject) => {
    if (!this.dlg.ok) return;
    // Perform operation
  }
}

// To show dialog
this.dlg.setProps(props);
this.dlg.setState(state);
this.dlg.show(this);
```

### WUX.WUtil

**WUtil** collects utilities for data manipulation.

```typescript
namespace APP {

  import WUtil = WUX.WUtil;
  
  export function samples() {
    // es. http://localhost?name=Jhon
    let pn = WUtil.getParam('name');
    
    let n  = WUtil.toNumber('1');
    
    let array = [{"id": 7, "name": 'Jhon'};];
    let x = WUtil.indexOf(array, 'id', 7);
    
    let obj  = {"name": 'Jhon', "age": 20};
    let name = WUtil.getString(obj, 'name', 'default');
    let age  = WUtil.getNumber(obj, 'age',  0);
    let flg  = WUtil.getBoolean(obj, 'flag');
    
    let city = WUtil.get(obj, 'person.address.city');
    
    let pg = 3.14159;
    let p2 = WUtil.round2(pg);
    
    let t = 'a > b';
    let h = WUtil.toText(t); // a &gt; b
    
    let d1 = new Date();
    let d2 = new Date();
    if (WUtil.isSameDate(d1, d2)) {
      console.log('Same date');
    }
    
    if (WUtil.is('number', obj, 'age')) {
      console.log('age is number');
    }
    
    if (WUtil.isEmpty(array)) {
      console.log('empty');
    }
    
    obj   = { "person": 1 };
    array = [ {"id": 1, "name": "John"}, {"id": 2, "name": "Jack"} ];
    WUtil.rplObj(obj, 'person', 'id', array);
    // obj = { "person": {"id": 1, "name": "John"} }
    
    obj = { "person": {"id": 1, "name": "John"} }
    WUtil.rplVal(obj, 'person', 'id');
    // obj = { "person": 1 };
    
    let src = {"c": '1', "n": 'name', "i": '3', "f": false};
    let dst = WUtil.map(
      src, // source
      {},  // dest
      ['c',    'n',    'i',  'f'],    // source fields
      ['code', 'name', 'id', 'flag'], // dest fields
      ['s',    's',    'n',  'b'],    // dest types (optional)
      ['NA',   '-',     0,   false]   // default values (optional)
    );
  }
}
```

### WuxDOM

**WuxDOM** allows you to render WUX components.

```html
<script type="text/javascript">
  // Render APP.Main component on view-root node
  WuxDOM.render(new APP.Main(), 'view-root');
  
  // Unmount component and remove view-root node
  WuxDOM.unmount('view-root');
  
  // Create view-root node on body
  WuxDOM.create(document.body, 'div', 'view-root', 'container', 'margin: 2px');
  
  // Render APP.Main component on view-root node
  let c = new APP.Main();
  WuxDOM.render(c, 'view-root');
  
  // Replace component
  WuxDOM.replace(c, new WUX.Wrapp('Hello World 2!', 'div'));
</script>
```

### WUX ###

The **WUX** namespace also contains some useful functions for creating your own components.

```typescript
let i = WUX.newInstance("APP.Main");
// -> new instance of WComponent APP.Main

let f = WUX.getComponent("w620572380-form");
// -> WComponent instance with id="w620572380-form"

let ls = WUX.lastSub(f);
// -> form

let id = WUX.getId(f);
// -> w620572380-form

let s = WUX.style({"mt": 4, "pb": 8, a: "center", c: "#ffff00", "h": 100, "minh": 100});
// -> 'margin-top:4px;padding-bottom:8px;text-align:center;color:#ffff00;height:100px;min-height:100px;'

let c = WUX.buildCss('text-center', {"mt": 4, "pb": 8});
// -> ' class="text-center" style="margin-top:4px;padding-bottom:8px;"'

WUX.setCss(document.body, 'text-center', {"mt": 4, "pb": 8});
// sets class and style of an element

let ac1 = WUX.addClass('text-center', 'text-red');
// -> 'text-center text-red'
// see also WUX.addClassOf(e: Element, name: string) 

let ac2 = WUX.addClass('text-center', 'text-center');
// -> 'text-center'

let rc = WUX.removeClass('text-center text-red', 'text-red');
// -> 'text-center'
// see also WUX.removeClassOf(e: Element, name: string)

let tc1 = WUX.toggleClass('text-center', 'text-red');
// -> 'text-center text-red'
// see also WUX.toggleClassOf(e: Element, name: string)

let tc2 = WUX.toggleClass('text-center text-red', 'text-red');
// -> 'text-center'

let b = WUX.build('div', '<p>Bye</p>', 'color: red', 'aria-label="bye"', 'id-bye', 'text-center');
// -> '<div id="id-bye" class="text-center" style="color: red" aria-label="bye"><p>Bye</p></div>'

let e = WUX.create('div', '<p>Bye</p>', 'color: red', 'aria-label="bye"', 'id-bye', 'text-center');
// -> Element <div id="id-bye" class="text-center" style="color: red" aria-label="bye"><p>Bye</p></div>
```

### WUX DX Extension ###

In the `/samples/ts/wux` folder you will find the `wux.dx.ts` extension.

[DevExtreme](https://js.devexpress.com/) library is required.

```typescript
// The '_' character will be replaced with a <br> in onCellPrepared (see below)
let h = ['Code', 'First name_of person'];
let k = ['code', 'name'];
this.table = new WUX.WDXTable(this.subId('tapp'), h, k);
this.table.selectionMode = 'single';
this.table.filter = true;
this.table.exportFile = "entities";
this.table.types = ['s', 's'];
// Pagination
this.table.paging = true;
this.table.pageSize = 5;

// Column width (optional)
this.table.widths[0] = 100;

// Actions
this.table.actionsTitle = 'Actions';
this.table.actionWidth = 140;
this.table.addActions('id', {
  id: 'view',
  classStyle: 'btn btn-link btn-xs',
  label: 'View',
  icon: 'fa-search',
  onbuild: (e: Element, data: any) => {
    // Customize or hide actions dynamically
    let n = WUtil.getString(data, 'name');
    if(n == 'HIDE') {
      e.setAttribute('style', 'display:none;');
    }
    else if(n == 'DISABLE') {
      e.setAttribute('class', 'btn btn-link btn-xs disabled');
    }
  }
});
this.table.addActions('id', {
  id: 'edit',
  classStyle: 'btn btn-link btn-xs',
  label: 'Edit',
  icon: 'fa-edit'
});
this.table.addActions('id', {
  id: 'delete',
  classStyle: 'btn btn-link btn-xs',
  label: 'Delete',
  icon: 'fa-trash'
});
this.table.onClickAction((e: JQueryEventObject) => {
  // Action id
  let ai = WUX.firstSub(e.currentTarget);
  if (!ai) return;
  // Action value
  let av: number = WUtil.toNumber(WUX.lastSub(e.currentTarget));
  if (!av) return;
  console.log('action=' + ai + ',value=' + av);
  
  let s = this.table.getState();
  let x = WUtil.indexOf(s, 'id', av);
  if(x < 0) return;
  
  console.log(ai, s[x]);
});
this.table.onDoubleClick((e: { element?: JQuery }) => {
  let srd = this.table.getSelectedRowsData();
  if (!srd || !srd.length) return;
  
  console.log(srd);
});
this.table.onRowPrepared((e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number, isSelected?: boolean }) => {
  if (!e.data) return;
  let n = WUtil.getString(e.data, 'name');
  if(n == 'NA') {
    WUX.setJQCss(e.rowElement, WUX.CSS.WARNING);
  }
  else if(n == 'ERR') {
    WUX.setJQCss(e.rowElement, WUX.CSS.DANGER);
  }
  else if(n == 'OK') {
    WUX.setJQCss(e.rowElement, WUX.CSS.SUCCESS);
  }
  else if(n == 'INFO') {
    WUX.setJQCss(e.rowElement, WUX.CSS.INFO);
  }
});
this.tabReg.onCellPrepared((e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: DevExpress.ui.dxDataGridColumn, rowIndex?: number, rowType?: string, row?: DevExpress.ui.dxDataGridRowObject, isSelected?: boolean, isExpanded?: boolean, cellElement?: DevExpress.core.dxElement }) => {
  let row = e.row;
  if (row != null && row.rowType == 'data') {
    let f = e.column.dataField;
    if (f == 'name') {
      e.cellElement.addClass('clickable');
    }
  }
  else if(e.rowType == 'header' && e.column.caption) {
    // Multi row column header
    let t = e.cellElement.find('.dx-datagrid-text-content');
    if(t && t.length) {
      t.html(e.column.caption.replace('_', '<br>'));
    }
  }
});
this.tabReg.onCellClick((e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: DevExpress.event, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: DevExpress.ui.dxDataGridRowObject }) => {
  let row = e.row;
  if (row != null && row.rowType == 'data') {
    let f = e.column.dataField;
    if (f == 'name') {
      console.log('click on name', row);
    }
  }
});

// Generic wrapper
let opt: DevExpress.viz.dxPolarChartOptions = {
  dataSource: [],
  useSpiderWeb: true,
  commonSeriesSettings: {
    type: "line",
    argumentField: "arg"
  },
  series: [
    { valueField: "val1", name: "Value 1"},
    { valueField: "val2", name: "Value 2"}
  ],
  title: "Polar chart",
  tooltip: {
    enabled: true,
  },
  export: {
    enabled: true
  },
  argumentAxis: {
    label: {
      overlappingBehavior: "none"
    }
  }
};

// Create wrapper        Component       Id
let chart = new WUX.WDX('dxPolarChart', 'chart');
// Set options
chart.options = opt;
// Execute a method (t >= 0 timeout, -1 synchronous)
chart.exec('refresh', 0);
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
