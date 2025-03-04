# WUX - Wrapped User Experience - Samples

Here are a few examples.

## Build

- `npm run build`

Open `index.html`.

## Main source

```typescript
namespace APP {

  import WUtil     = WUX.WUtil;
  import action    = WUX.action;
  import getAction = WUX.getAction;

  // ...

  export class GUIEntities extends WUX.WComponent {
    // Components
    main: WUX.WContainer;
    brcr: Breadcrumb;
    form: WUX.WForm;
    btnFind: WUX.WButton;
    btnReset: WUX.WButton;
    btnNew: WUX.WButton;
    table: WUX.WTable;
    respg: ResPages;
    btnpg: BtnPages;
    btnip: BtnItems;

    // Data
    mock: Mock;
    page: number = 1;

    // Dialogs
    dlg: DlgEntity;

    constructor() {
      super();

      this.mock = new Mock();

      http.mock = true;
      http.mres = {
        "get" : (e: string, p: any) => {
          return this.mock.find(e, p);
        },
        "post": (e: string, p: any) => {
          return this.mock.ins(e, p, 'id');
        },
        "put": (e: string, p: any) => {
          return this.mock.upd(e, p, 'id');
        },
        "delete": (e: string, p: any) => {
          return this.mock.del(e, p, 'id');
        }
      };

      this.dlg = new DlgEntity(this.subId('dlg'));
      // this.dlg.fullscreen = true;
      this.dlg.onHiddenModal((e: JQueryEventObject) => {
        if (!this.dlg.ok) return;
        
        // Action
        let a = this.dlg.getProps();
        // Data
        let s = this.dlg.getState();
        if(!a || !s) return;
        console.log('dlg action,state', a, s);
        switch(a) {
          case 'new':
            http.post('entities/insert', s, (res: Entity) => {
              if(res) {
                showSuccess('Item inserted successfully');
                addItem(this.addActions(res), this.table);
                this.refresh();
              }
              else {
                showWarning('Item not inserted');
              }
            });
            break;
          case 'edit':
            http.put('entities/update', s, (res: Entity) => {
              if(res) {
                showSuccess('Item updated successfully');
                updItem(this.addActions(res), this.table, 'id');
              }
              else {
                showWarning('Item not updated');
              }
            });
            break;
        }
      });
    }

    override render() {
      this.brcr = new Breadcrumb();
      this.brcr.add('Entities');

      this.form = new WUX.WForm(this.subId('form'));
      this.form
        .addRow()
          .addTextField('code', 'Code')
          .addTextField('name', 'Name', {"span": 2});

      this.btnFind = new WUX.WButton(this.subId('btnFind'), 'Search', 'fa-search', 'btn-icon btn btn-primary', 'margin-right: 0.5rem;');
      this.btnFind.on('click', (e: PointerEvent) => {
        
        this.doFind();
        
      });
      this.btnReset = new WUX.WButton(this.subId('btnReset'), 'Cancel', 'fa-undo', 'btn-icon btn btn-secondary');
      this.btnReset.on('click', (e: PointerEvent) => {
        this.form.clear();
        this.form.focus();
        this.table.setState([]);
        this.refresh();
      });
      this.btnNew = new WUX.WButton(this.subId('btnNew'), 'New', 'fa-plus-circle', 'btn-icon btn btn-primary', 'margin-right: 0.5rem;');
      this.btnNew.on('click', (e: PointerEvent) => {
        this.dlg.setProps('new');
        this.dlg.setState(null);
        this.dlg.show(this);
      });

      let h = ['Code', 'Name', 'View', 'Edit', 'Delete'];
      let k = ['code', 'name', '_v',   '_m',   '_d'];
      this.table = new WUX.WTable(this.subId('tapp'), h, k);
      this.table.selectionMode = 'single';
      this.table.div = 'table-responsive';
      this.table.types = ['s', 's', 'w', 'w', 'w'];
      this.table.sortable = [0, 1];
      this.table.paging = true;
      this.table.on('click', (e: PointerEvent) => {
        let a = getAction(e, this);
        console.log('click a=', a);
        if(!a || !a.ref) return;
        if(a.name == 'sort') return;

        let s = this.table.getState();
        let x = WUtil.indexOf(s, 'id', a.ref);
        if(x < 0) return;

        if(a.name == 'delete') {
          confirm('Do you want to delete the item?', (cr: boolean) => {
            if(!cr) return;
            http.delete('entities/delete', s[x], (res: boolean) => {
              if(res) {
                showSuccess('Item successfully deleted');
                delItem(x, this.table);
                this.refresh();
              }
              else {
                showWarning('Item not deleted');
              }
            });
          });
          return;
        }
        this.dlg.setProps(a.name);
        this.dlg.setState(s[x]);
        this.dlg.show(this);
      });
      this.table.onDoubleClick((e: {element?: Element; rowElement?: Element; data?: any; rowIndex?: number; }) => {
        this.dlg.setProps('view');
        this.dlg.setState(e.data);
        this.dlg.show(this);
       });

      // Pagination components
      // Link to page
      this.respg = new ResPages(this.subId('respg'));
      this.respg.on('statechange', (e: WUX.WEvent) => {
        this.table.page = this.respg.getState();
        this.refresh(true);
      });
      // Page selection
      this.btnpg = new BtnPages(this.subId('btnpg'));
      this.btnpg.on('statechange', (e: WUX.WEvent) => {
        this.table.page = this.btnpg.getState();
        this.refresh(true);
      });
      // Items per page
      this.btnip = new BtnItems(this.subId('btnip'));
      this.btnip.on('statechange', (e: WUX.WEvent) => {
        this.table.page = 1;
        this.table.plen = this.btnip.getState();
        this.refresh(true);
      });

      this.main = new WUX.WContainer();
      this.main
        .before(this.brcr)
        .addRow()
          .addCol('col-md-12')
            .add(this.form)
        .addRow()
          .addCol('col-md-8')
            .addGroup({"classStyle": "form-row"}, this.btnFind, this.btnReset)
          .addCol('col-md-4', {a : 'right'})
            .addGroup({"classStyle": "form-row"}, this.btnNew)
        .addRow()
          .addCol('col-md-12')
            .add(this.table)
        .addRow()
          .addCol('col-md-6')
            .add(this.respg)
          .addCol('col-md-3')
            .add(this.btnpg)
          .addCol('col-md-3')
            .add(this.btnip);

      return this.main;
    }

    doFind() {
      // Validation
      let m = this.form.checkMandatory(true, true, true);
      if(m) {
        showWarning('Check: ' + m);
        return;
      }
      // Search
      let filter = this.form.getState();
      http.get('entities/find', filter, (data: Entity[]) => {
        if(!data) data = [];
        let l = data.length;
        if(!l) showWarning('No items found');
        for(let r of data) {
          this.addActions(r);
        }
        this.table.page = 1;
        this.table.plen = this.btnip.getState();
        this.table.setState(data);
        this.refresh();
      });
    }

    addActions(r: any): any {
      if(!r) return r;
      r["_v"] = action('view', r["id"], 'fa-search');
      r["_m"] = action('edit', r["id"], 'fa-edit');
      r["_d"] = action('delete', r["id"], 'fa-trash');
      return r;
    }

    refresh(updTable: boolean = false) {
      if(updTable) this.table.forceUpdate();
      let data = this.table.getState();
      let l = data ? data.length : 0;
      this.respg.refresh(this.table.rows, this.table.plen, l, this.table.page);
      this.btnpg.refresh(this.table.page, this.respg.getProps());
    }
  }
}
```

## License

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Contributors

* [Giorgio Silvestris](https://github.com/giosil)
