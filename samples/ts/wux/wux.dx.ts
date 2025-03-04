namespace WUX {

	export type DxComponentType = 'dxAccordion' | 'dxActionSheet' | 'dxAutocomplete' | 'dxBox' | 'dxButton' | 'dxButtonGroup' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxContextMenu' | 'dxDataGrid' | 'dxDateBox' | 'dxDeferRendering' | 'dxDiagram' | 'dxDraggable' | 'dxDrawer' | 'dxDropDownBox' | 'dxDropDownButton' | 'dxFileManager' | 'dxFileUploader' | 'dxFilterBuilder' | 'dxForm' | 'dxGallery' | 'dxGantt' | 'dxHtmlEditor' | 'dxList' | 'dxLoadIndicator' | 'dxLoadPanel' | 'dxLookup' | 'dxMap' | 'dxMenu' | 'dxMultiView' | 'dxNavBar' | 'dxNumberBox' | 'dxPivotGrid' | 'dxPivotGridFieldChooser' | 'dxPopover' | 'dxPopup' | 'dxProgressBar' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxRecurrenceEditor' | 'dxResizable' | 'dxResponsiveBox' | 'dxScheduler' | 'dxScrollView' | 'dxSelectBox' | 'dxSlideOut' | 'dxSlideOutView' | 'dxSlider' | 'dxSortable' | 'dxSpeedDialAction' | 'dxSwitch' | 'dxTabPanel' | 'dxTabs' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox' | 'dxTileView' | 'dxToast' | 'dxToolbar' | 'dxTooltip' | 'dxTreeList' | 'dxTreeView' | 'dxValidationGroup' | 'dxValidationSummary' | 'dxValidator' | 'dxBarGauge' | 'dxBullet' | 'dxChart' | 'dxCircularGauge' | 'dxFunnel' | 'dxLinearGauge' | 'dxPieChart' | 'dxPolarChart' | 'dxRangeSelector' | 'dxSankey' | 'dxSparkline' | 'dxTreeMap' | 'dxVectorMap';
	
	export let dxTableDidMount: (c: WDXTable) => any;

	export function initDX(callback: () => any) {
		if (debug) console.log('[WUX] initDX...');
		let u = '/cldr/cldr-data-' + global.locale + '.json';
		fetch(u).then(response => {
			if (response.ok) return response.json();
			console.error('[WUX] initDX loading ' + u + ' failed', response);
		})
		.then(data => {
			Globalize.load(data);
			Globalize.locale(global.locale);
			DevExpress.localization.locale(global.locale);
			DevExpress.config({ defaultCurrency: 'EUR' });
			if(callback) callback();
		})
		.catch(error => {
			console.error('[WUX] initDX loading ' + u + ' failed', error);
		});
	}

	export function dx(e: WElement, t: DxComponentType, o?: any, c?: (i: any) => void): any {
		if (!e || !t) return null;
		let j = (e instanceof WComponent) ? JQ(e.getRoot()) : JQ(e);
		if (!j) return null;
		try {
			let r = o ? j[t](o) : j[t]();
			r = o == 'instance' ? r : j[t]('instance');
			if (!r) return null;
			if (c) c(r);
			return r;
		}
		catch(x) {
			console.error('dx(' + e + ',' + t + ',' + o + ',' + c + ') error', x);
		}
		return null;
	}

	export class WDX extends WComponent<DxComponentType, any> {
		opts: any;
		$i: DevExpress.ui.Widget;

		constructor(props: DxComponentType, id?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
			super(id, 'WDX', props, classStyle, style, attributes);
		}

		get options(): any {
			return this.opts;
		}
		set options(o: any) {
			this.opts = o;
			this.getInstance(o);
		}

		override componentDidMount(): void {
			if (!this.$r || !this.$r[this.props]) return null;
			if (this.opts) {
				this.$r[this.props](this.opts);
			}
			else {
				this.$r[this.props]();
			}
			this.$i = this.$r[this.props]('instance') as DevExpress.ui.Widget;
		}

		override updateState(nextState: any): void {
			this.state = nextState;
			this.option('value', this.state);
		}
		
		override getState(): any {
			let s = this.option('value');
			if (s != null) this.state = s;
			return this.state;
		}

		getInstance(c?: (i: any) => void): any;
		getInstance(o?: any, c?: (i: any) => void): any {
			if (!this.$r || !this.$r[this.props]) return null;
			if (o && typeof o != 'function') this.$r[this.props](o);
			this.$i = this.$r[this.props]('instance') as DevExpress.ui.Widget;
			if (this.$i) {
				if (c) c(this.$i);
				if (typeof o == 'function') o(this.$i);
			}
			return this.$i;
		}

		override focus(): this {
			if (!this.$i) return this;
			this.$i.focus();
			return this
		}

		dispose(): this {
			if (!this.$i) return this;
			this.$i.dispose();
			return this
		}

		repaint(t: number = -1, c?: (i: any) => void): this {
			if (!this.$i) return this;
			if (t >= 0) {
				setTimeout(() => { 
					this.$i.repaint(); 
					if (c) c(this.$i); 
				}, t);
			}
			else {
				this.$i.repaint();
				if (c) c(this.$i);
			}
			return this;
		}

		option(n: string, v?: any): any {
			if (!this.$i) return this;
			if (v != undefined) {
				this.$i.option(n, v);
				return v;
			}
			return this.$i.option(n);
		}

		_on(n: string, f: Function): this {
			if (!this.$i) return this;
			this.$i.on(n, f);
			return this;
		}

		_off(n: string, f?: Function): this {
			if (!this.$i) return this;
			this.$i.off(n, f);
			return this;
		}

		_(m: string, ...a: any[]): any {
			if (!this.$i || !m) return null;
			let s = m.indexOf('.');
			if (s > 0) {
				let m0 = m.substring(0, s);
				let m1 = m.substring(s + 1);
				if (!this.$i[m0]) return null;
				let r0 = this.$i[m0]();
				if (!r0 || !r0[m1]) return null;
				return r0[m1](...a);
			}
			if (!this.$i[m]) return null;
			return this.$i[m](...a);
		}
	}
	
	/**
	 * Wrapper DxDataGrid. Required DevExpress.ui.dxDataGrid https://js.devexpress.com/
	 */
	export class WDXTable extends WComponent<DevExpress.ui.dxDataGridOptions, any[]> {
		header: string[];
		keys: any[];
		types: string[];
		widths: number[];
		widthsPerc: boolean;

		selectionMode: 'single' | 'multiple' | 'none';
		templates: ((cnt: JQuery, opt: { data: any, text: string }) => any)[];
		selectedIndex: number;

		filter: boolean;
		hideHeader: boolean;
		keepSorting: boolean;
		exportFile: string;
		scrolling: string;
		pageSize: number;
		paging: boolean;
		sorting: boolean;
		selectionFilter: any[];
		dataSource: any;
		storeKey: string;

		// Actions
		actions: WUX.WField[];
		actionsTitle: string;
		actionsStyle: WUX.WStyle;
		actionWidth: number;

		// Columns groups
		groups: string[];
		groupsCols: number[][];

		// Additional
		_editable: boolean;
		editables: boolean[];
		editmap: {};
		filterOps: string[];
		hiddenCols: string[];

		// Auxiliary
		$csa: JQuery; // Combo Select All
		$i: DevExpress.ui.dxDataGrid;

		constructor(id: string, header: string[], keys?: any[], classStyle?: string, style?: string | WStyle, attributes?: string | Object, props?: any) {
			// WComponent init
			super(id, 'WDXTable', props, classStyle, style, attributes);
			// WDXTable init
			this.header = header;
			this.keys = [];
			if (keys) {
				for (let key of keys) this.keys.push(WUtil.toString(key));
			}
			else {
				if (this.header) for (let i = 0; i < this.header.length; i++) this.keys.push(i.toString());
			}
			this.types = [];
			this.widths = [];
			this.templates = [];
			this.selectionMode = 'single';

			this.filter = false;
			this.keepSorting = false;
			this.scrolling = 'virtual';
			this.pageSize = 100;
			this.paging = false;
			this.sorting = true;

			this.actions = [];
			this.groups = [];
			this.groupsCols = [];

			this._editable = false;
			this.editables = [];
			this.editmap = {};
			this.hiddenCols = [];
		}

		get editable(): boolean {
			return this._editable;
		}
		set editable(b: boolean) {
			this._editable = b;
			this.getInstance({editing:{mode: "cell", allowUpdating: true}});
		}

		setCellEditable(row: number, col: number | string, editable: boolean): this {
			this.editmap[row + '_' + col] = editable;
			return this;
		}

		addHidden(col: string): this {
			this.hiddenCols.push(col);
			return this;
		}

		refresh(): this {
			if (this.$i) this.$i.refresh();
			return this;
		}

		refreshAndEdit(row?: number, col?: any, t: number = 50): this {
			if (!this.$i) return this;
			if (row == null || col == null || col == '' || col == -1) {
				this.$i.refresh();
			}
			else {
				this.$i.refresh().done([() => { setTimeout(() => { if (col) this.$i.editCell(row, col); }, t); }]);
			}
			return this;
		}

		repaintAndEdit(row?: number, col?: any, t: number = 50): this {
			if (!this.$i) return this;
			if (row == null || col == null || col == '' || col == -1) {
				this.$i.repaint();
			}
			else {
				this.$i.repaintRows([row]);
				if (col != null) setTimeout(() => { if (col) this.$i.editCell(row, col); }, t);
			}
			return this;
		}

		repaint(): this {
			if (this.$i) this.$i.repaint();
			if (this.handlers['_selectall'] && this.selectionMode == 'multiple') {
				setTimeout(() => {
					let $cb = $('.dx-header-row .dx-checkbox').first();
					if($cb && $cb.length) {
						if (!this.$csa || !this.$csa.is($cb)) {
							this.$csa = $cb;
							let val = this.$csa.dxCheckBox('instance').option('value');
							this.$csa.on('click', (e: JQueryEventObject) => {
								e.data = val;
								for(let h of this.handlers['_selectall']) h(e);
							});
						}
					}
				}, 500);
			}
			return this;
		}

		closeEditCell(): this {
			if (this.$i) this.$i.closeEditCell();
			return this;
		}

		repaintRows(idxs: number[]): this {
			if (this.$i) this.$i.repaintRows(idxs);
			return this;
		}

		repaintRowByKey(key: any): this {
			if (!this.$i || !key) return this;
			let r = this.$i.getRowIndexByKey(key);
			if (r < 0) return this;
			this.$i.repaintRows([ r ]);
			return this;
		}

		addActions(key: string, field: WUX.WField): this {
			if (!field) return this;
			if (!key) key = '';
			field.key = key;
			this.actions.push(field);
			return this;
		}

		addGroupBefore(name: string, col?: string | number) {
			if (!name) name = '';
			this.groups.push(name);
			let s = 0;
			let e = this.keys.length;
			if (col != null) {
				if (typeof col != 'number') {
					let k = this.keys.indexOf(col);
					if (k > 0) e = k;
				}
				else {
					e = col;
				}
			}
			let g: number[] = [];
			for (let i = s; i < e; i++) g.push(i);
			this.groupsCols.push(g);
		}

		addGroupAfter(name: string, col: string | number) {
			if (!name) name = '';
			this.groups.push(name);
			let s = 0;
			let e = this.keys.length;
			if (col != null) {
				if (typeof col != 'number') {
					let k = this.keys.indexOf(col);
					if (k >= 0) s = k + 1;
				}
				else {
					s = col + 1;
				}
			}
			let g: number[] = [];
			for (let i = s; i < e; i++) g.push(i);
			this.groupsCols.push(g);
		}

		addGroup(name: string, cols: any[]) {
			if (!cols || !cols.length) return;
			if (!name) name = '';
			this.groups.push(name);
			let c0 = cols[0];
			if (typeof c0 != 'number') {
				let coln: number[] = [];
				for (let i = 0; i < cols.length; i++) {
					let k = this.keys.indexOf(cols[i]);
					if (k >= 0) coln.push(k);
				}
				this.groupsCols.push(coln);
			}
			else {
				this.groupsCols.push(cols);
			}
		}

		onClickAction(h: (e: JQueryEventObject) => any): void {
			if (!this.handlers['_clickaction']) this.handlers['_clickaction'] = [];
			this.handlers['_clickaction'].push(h);
		}

		onSelectionChanged(h: (e: { element?: JQuery, selectedRowsData?: Array<any> }) => any): void {
			// Single handler
			this.handlers['_selectionchanged'] = [h];
			this.getInstance({onSelectionChanged: h});
		}

		onDoubleClick(h: (e: { element?: JQuery }) => any): void {
			if (!this.handlers['_doubleclick']) this.handlers['_doubleclick'] = [];
			this.handlers['_doubleclick'].push(h);
		}

		onSelectAll(h: (e: JQueryEventObject) => any): void {
			if (!this.handlers['_selectall']) this.handlers['_selectall'] = [];
			this.handlers['_selectall'].push(h);
		}

		onDoneRefresh(h: (e: WEvent) => any): void {
			if (!this.handlers['_donerefresh']) this.handlers['_donerefresh'] = [];
			this.handlers['_donerefresh'].push(h);
		}

		onRowPrepared(h: (e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number, isSelected?: boolean }) => any) {
			// Single handler
			this.handlers['_rowprepared'] = [h];
			this.getInstance({onRowPrepared: h});
		}

		onCellPrepared(h: (e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: DevExpress.ui.dxDataGridColumn, rowIndex?: number, rowType?: string, row?: DevExpress.ui.dxDataGridRowObject, isSelected?: boolean, isExpanded?: boolean, cellElement?: DevExpress.core.dxElement }) => any) {
			// Single handler
			this.handlers['_cellprepared'] = [h];
			this.getInstance({onCellPrepared: h});
		}

		onContentReady(h: (e: { component?: DevExpress.ui.dxDataGrid, element?: DevExpress.core.dxElement, model?: any }) => any) {
			// Single handler
			this.handlers['_contentready'] = [h];
			this.getInstance({onContentReady: h});
		}

		onRowUpdated(h: (e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, error?: Error }) => any) {
			// Single handler
			this.handlers['_rowupdated'] = [h];
			this.getInstance({onRowUpdated: h});
		}

		onEditorPreparing(h: (e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, cancel?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, editorName?: string, editorOptions?: any, dataField?: string, row?: DevExpress.ui.dxDataGridRowObject }) => any) {
			// Single handler
			this.handlers['_editorpreparing'] = [h];
			this.getInstance({onEditorPreparing: h});
		}

		onEditorPrepared(h: (e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, dataField?: string, row?: DevExpress.ui.dxDataGridRowObject }) => any) {
			// Single handler
			this.handlers['_editorprepared'] = [h];
			this.getInstance({onEditorPrepared: h});
		}

		onEditingStart(h: (e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, dataField?: string, row?: DevExpress.ui.dxDataGridRowObject }) => any) {
			// Single handler
			this.handlers['_editingstart'] = [h];
			this.getInstance({onEditingStart: h});
		}

		onCellClick(h: (e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: DevExpress.event, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: DevExpress.ui.dxDataGridRowObject }) => any) {
			// Single handler
			this.handlers['_cellclick'] = [h];
			this.getInstance({onCellClick: h});
		}

		onScroll(h: (e: { element?: JQuery, reachedBottom?: boolean, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, scrollOffset?: { top?: number, left?: number } }) => any) {
			// Single handler
			this.handlers['_scroll'] = [h];
			if (this.$i) this.$i.getScrollable().on('scroll', h);
		}

		onKeyDown(h: (e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: DevExpress.event, handled?: boolean }) => any) {
			// Single handler
			this.handlers['_keydown'] = [h];
			this.getInstance({onKeyDown: h});
		}

		onToolbarPreparing(h: (e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, toolbarOptions?: DevExpress.ui.dxToolbarOptions }) => any) {
			// Single handler
			this.handlers['_toolbarpreparing'] = [h];
			this.getInstance({onToolbarPreparing: h});
		}

		scrollTo(location: any) {
			if (this.$i) this.$i.getScrollable().scrollTo(location);
		}

		scrollToRow(row: number, delta: number = 0, timeOut: number = 0) {
			if (!this.$i || !this.state) return;
			let l = this.state.length;
			if(l < 2) return;
			let s = this.$i.getScrollable();
			if(!s) return;
			let h = s.scrollHeight();
			if(!h) return;
			row = row - delta;
			if(row < 0) row = 0;
			let t = row * (h / l);
			if(timeOut) {
				setTimeout(() => {
					s.scrollTo({"top": t, "left": 0});
				}, timeOut);
			}
			else {
				s.scrollTo({"top": t, "left": 0});
			}
		}

		clearFilter() {
			if (!this.$i || !this.state) return;
			this.$i.clearFilter();
		}

		off(events?: string): this {
			super.off(events);
			if (!events) return this;
			let gopt: DevExpress.ui.dxDataGridOptions = {};
			if (events.indexOf('_selectionchanged') >= 0) gopt.onSelectionChanged = null;
			if (events.indexOf('_rowprepared') >= 0) gopt.onRowPrepared = null;
			if (events.indexOf('_cellprepared') >= 0) gopt.onCellPrepared = null;
			if (events.indexOf('_contentready') >= 0) gopt.onContentReady = null;
			if (events.indexOf('_rowupdated') >= 0) gopt.onRowUpdated = null;
			if (events.indexOf('_editorprepared') >= 0) gopt.onEditorPrepared = null;
			if (events.indexOf('_editorpreparing') >= 0) gopt.onEditorPreparing = null;
			if (events.indexOf('_editingstart') >= 0) gopt.onEditingStart = null;
			if (events.indexOf('_cellclick') >= 0) gopt.onCellClick = null;
			if (events.indexOf('_keydown') >= 0) gopt.onKeyDown = null;
			if (events.indexOf('_toolbarpreparing') >= 0) gopt.onToolbarPreparing = null;
			this.getInstance(gopt);
			return this;
		}

		clearSelection(): this {
			if (!this.$i || !this.state) return this;
			this.$i.clearSelection();
			return this;
		}

		deselectAll(): this {
			if (this.$i) this.$i.deselectAll();
			return this;
		}

		select(idxs: number[]): this {
			if (this.$i) this.$i.selectRowsByIndexes(idxs);
			return this;
		}

		selectRows(keys: any[], preserve: boolean): this {
			if (this.$i) this.$i.selectRows(keys, preserve);
			return this;
		}

		deselectRows(keys: any[]): this {
			if (this.$i) this.$i.deselectRows(keys);
			return this;
		}

		selectAll(toggle?: boolean): this {
			if (!this.$i) return this;
			if (toggle) {
				let rsize = WUtil.size(this.getSelectedRows());
				let ssize = WUtil.size(this.state);
				if (rsize && rsize == ssize) {
					this.$i.clearSelection();
				}
				else {
					this.$i.selectAll();
				}
			}
			else {
				this.$i.selectAll();
			}
			return this;
		}

		setSelectionMode(s: 'single' | 'multiple' | 'none'): this {
			this.selectionMode = s;
			let gopt: DevExpress.ui.dxDataGridOptions = {};
			if (this.selectionFilter && this.selectionFilter.length) {
				gopt.selection = { mode: this.selectionMode, deferred: true };
			}
			else {
				gopt.selection = { mode: this.selectionMode };
			}
			this.getInstance(gopt);
			return this;
		}

		setColVisible(col: string, vis: boolean): this {
			if (!this.$r) return this;
			this.$r.dxDataGrid('columnOption', col, 'visible', vis);
			this.$i = this.$r.dxDataGrid('instance');
			return this;
		}

		edit(row: number, col: any, t: number = 200): this {
			if (!this.$i) return this;
			setTimeout(() => {
				this.$i.editCell(row, col);
			}, t);
			return this;
		}

		getFilter(key: string): string {
			if (!this.$i) return '';
			let c = this.$i.getCombinedFilter(true);
			let s = WUtil.size(c);
			for (let i = 0; i < s; i++) {
				let f = c[i];
				if (Array.isArray(f)) {
					if (f.length > 2) {
						if (key != f[0]) continue;
						return '' + f[1] + '' + f[2];
					}
				}
				else if (typeof f == 'string') {
					if (key == f && s > 2) {
						return '' + c[1] + '' + c[2];
					}
				}
			}
			return '';
		}

		getInstance(gopt?: DevExpress.ui.dxDataGridOptions): DevExpress.ui.dxDataGrid {
			if (!this.$r) return null;
			if(gopt) this.$r.dxDataGrid(gopt);
			this.$i = this.$r.dxDataGrid('instance');
			return this.$i;
		}

		pageIndex(p: number): this {
            if (!this.$i) return this;
            this.$i.pageIndex(p);
            return this;
        }

		getSelectedKeys(): any[] {
			if (!this.$i) return [];
			return this.$i.getSelectedRowKeys();
		}

		getSelectedRows(): number[] {
			if (!this.$i) return [];
			let keys = this.$i.getSelectedRowKeys();
			if (!keys || !keys.length) return [];
			let rows: number[] = [];
			for (let key of keys) {
				let idx = this.$i.getRowIndexByKey(key);
				if (idx < 0) continue;
				rows.push(idx);
			}
			return rows;
		}

		isSelected(data: any): boolean {
			if (!this.$i) return false;
			return this.$i.isRowSelected(data);
		}

		getSelectedRowsData(): any[] {
			if (!this.$i) return [];
			return this.$i.getSelectedRowsData();
		}

		getFilteredRowsData(): any[] {
			if (!this.$i) return this.state;
			let ds = this.$i.getDataSource();
			if (!ds) return this.state;
			let r = ds.items();
			if (!r || !r.length) return this.state;
			return r;
		}

		cellValue(rowIndex: number, dataField: string): any;
		cellValue(rowIndex: number, dataField: string, value?: any) : any;
		cellValue(rowIndex: number, dataField: string, value?: any) {
			if (!this.$i) return null;
			if (value === undefined) return this.$i.cellValue(rowIndex, dataField);
			this.$i.cellValue(rowIndex, dataField, value);
		}

		saveEditData(r?: number): this {
			if (!this.$i) return this;
			if (r != null) {
				this.$i.saveEditData().done([() => { setTimeout(() => { this.$i.repaintRows([r]); }, 0); }]);
			}
			else {
				this.$i.saveEditData();
			}
			return this;
		}

		count(): number {
			if (this.state) return this.state.length;
			return 0;
		}

		beforeInit(gopt: DevExpress.ui.dxDataGridOptions): void {
		}

		protected componentDidMount(): void {
			if (!this.header) this.header = [];
			let _self = this;

			// DataGrid Init Options
			let gopt: DevExpress.ui.dxDataGridOptions;
			if (typeof (this.props) == 'object') {
				gopt = this.props;
			}
			else {
				gopt = {
					showColumnLines: true,
					showRowLines: true,
					showBorders: true,
					allowColumnResizing: true,
					columnAutoWidth: true,
					rowAlternationEnabled: false
				};
			}
			if (this._editable) {
				gopt.editing = { mode: "cell", allowUpdating: true };
			}
			if (this.hideHeader) {
				gopt.showColumnHeaders = false;
			}
			this.editmap = {};

			// Columns
			let cols = [];
			if (this.groups && this.groups.length) {
				for (let g = 0; g < this.groups.length; g++) {
					let gname = this.groups[g];
					let gcols = this.groupsCols[g];
					let col: DevExpress.ui.dxDataGridColumn = { caption: gname };
					let subCols = [];
					for (let s = 0; s < gcols.length; s++) {
						let i = gcols[s];

						let scol: DevExpress.ui.dxDataGridColumn;
						if (this.keys && this.keys.length) {
							let k = this.keys[i];
							if (this.hiddenCols.indexOf(k) >= 0) continue;

							scol = { caption: this.header[i], dataField: k };
						}
						else {
							let k = i.toString();
							if (this.hiddenCols.indexOf(k) >= 0) continue;

							scol = { caption: this.header[i], dataField: i.toString() };
						}
						scol.allowSorting = this.sorting;
						let w = this.widths && this.widths.length > i ? this.widths[i] : 0;
						if (w) {
							if (w < 0) {
								scol.allowSorting = false;
							}
							else {
								scol.width = this.widthsPerc ? w + '%' : w;
								if (i == 0) scol.fixed = true;
							}
						}
						let x = this.filterOps && this.filterOps.length > i ? this.filterOps[i] : undefined;
						if (x) {
							if (x == '-') {
								scol.allowFiltering = false;
							}
							else {
								// "as any" to pass compiling checks added in ver. 18.1
								scol.selectedFilterOperation = x as any;
							}
						}
						let f = this.templates && this.templates.length > i ? this.templates[i] : undefined;
						if (f) scol.cellTemplate = f;
						scol.allowEditing = this.editables && this.editables.length > i ? this.editables[i] : false;
						let t = WUtil.getItem(this.types, i);
						switch (t) {
							case 's':
								scol.dataType = 'string';
								break;
							case 'w':
								scol.dataType = 'string';
								scol.alignment = 'center';
								break;
							case 'c':
								scol.dataType = 'number';
								scol.format = { type: 'currency', precision: 2 };
								break;
							case 'c5':
								scol.dataType = 'number';
								scol.format = { type: 'currency', precision: 5 };
								break;
							case 'i':
								scol.dataType = 'number';
								scol.format = { precision: 0 };
								break;
							case 'n':
								scol.dataType = 'number';
								scol.format = { precision: 2 };
								break;
							case 'd':
								scol.dataType = 'date';
								scol.format = 'dd/MM/yyyy';
								break;
							case 't':
								scol.dataType = 'date';
								scol.format = 'dd/MM/yyyy HH:mm:ss';
								break;
							case 'b':
								scol.dataType = 'boolean';
								break;
						}
						subCols.push(scol);
					}
					if (gname != '-' && subCols.length) {
						col.columns = subCols;
						cols.push(col);
					}
					else {
						for (let scol of subCols) cols.push(scol);
					}
				}
			}
			else {
				for (let i = 0; i < this.header.length; i++) {
					let col: DevExpress.ui.dxDataGridColumn;
					if (this.keys && this.keys.length) {
						let k = this.keys[i];
						if (this.hiddenCols.indexOf(k) >= 0) continue;

						col = { caption: this.header[i], dataField: k };
					}
					else {
						let k = i.toString();
						if (this.hiddenCols.indexOf(k) >= 0) continue;

						col = { caption: this.header[i], dataField: k };
					}
					col.allowSorting = this.sorting;
					let w = this.widths && this.widths.length > i ? this.widths[i] : 0;
					if (w) {
						if (w < 0) {
							col.allowSorting = false;
						}
						else {
							col.width = this.widthsPerc ? w + '%' : w;
							if (i == 0) col.fixed = true;
						}
					}
					let x = this.filterOps && this.filterOps.length > i ? this.filterOps[i] : undefined;
					if (x) {
						if (x == '-') {
							col.allowFiltering = false;
						}
						else {
							// "as any" to pass compiling checks added in ver. 18.1
							col.selectedFilterOperation = x as any;
						}
					}
					let f = this.templates && this.templates.length > i ? this.templates[i] : undefined;
					if (f) col.cellTemplate = f;
					col.allowEditing = this.editables && this.editables.length > i ? this.editables[i] : false;
					let t = WUtil.getItem(this.types, i);
					switch (t) {
						case 's':
							col.dataType = 'string';
							break;
						case 'w':
							col.dataType = 'string';
							col.alignment = 'center';
							break;
						case 'c':
							col.dataType = 'number';
							col.format = { type: 'currency', precision: 2 };
							break;
						case 'c5':
							col.dataType = 'number';
							col.format = { type: 'currency', precision: 5 };
							break;
						case 'i':
							col.dataType = 'number';
							col.format = { precision: 0 };
							break;
						case 'n':
							col.dataType = 'number';
							col.format = { precision: 2 };
							break;
						case 'd':
							col.dataType = 'date';
							col.format = 'dd/MM/yyyy';
							break;
						case 't':
							col.dataType = 'date';
							col.format = 'dd/MM/yyyy HH:mm:ss';
							break;
						case 'b':
							col.dataType = 'boolean';
							break;
					}
					cols.push(col);
				}
			}

			// Actions
			if (this.actions && this.actions.length) {
				if (!this.actionsTitle) this.actionsTitle = '';
				let aw: any = this.actionWidth ? this.actionWidth : 'auto';
				cols.push({
					caption: this.actionsTitle,
					width: aw,
					alignment: 'center',
					allowFiltering: false,
					allowReordering: false,
					allowResizing: false,
					allowSorting: false,
					allowEditing: false,
					cellTemplate: function (container: JQuery, options: { row: DevExpress.ui.dxDataGridRowObject }) {
						if (_self.actionsStyle) {
							setJQCss(container, _self.actionsStyle);
						}
						else {
							container.addClass('actions');
						}
						for (let i = 0; i < _self.actions.length; i++) {
							let f = _self.actions[i];
							if (f.build) {
								f.build(container, options.row.data);
								continue;
							}
							let cid : any;
							if (f.key) cid = WUtil.getValue(options.row.data, f.key);
							if (!cid) cid = '_' + options.row.rowIndex;
							let s = style(f.labelCss);
							s = s ? ' style="' + s + '"' : '';
							let $a = $('<a id="' + f.id + '-' + cid + '" class="' + f.classStyle + '"' + s + '>' + buildIcon(f.icon, '', '', 0, WUX.cls(f.style), f.label) + '</a>');
							container.append($a);
							$a.on('click', (e: JQueryEventObject) => {
								if (!_self.handlers['_clickaction']) return;
								for (let h of _self.handlers['_clickaction']) h(e);
							});
						}
					}
				});
			}

			// dxDataGrid config
			gopt.columns = cols;
			if (this.dataSource) {
				gopt.dataSource = this.dataSource;
			}
			else {
				gopt.dataSource = this.state;
			}
			gopt.filterRow = { visible: this.filter };
			gopt.paging = { enabled: this.paging, pageSize: this.pageSize };
			if (this.paging) {
				gopt.pager = { showPageSizeSelector: false, allowedPageSizes: [this.pageSize], showInfo: true };
			}
			else {
				// "as any" to pass compiling checks added in ver. 18.1
				gopt.scrolling = { mode: this.scrolling as any };
			}
			gopt.onRowClick = (e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: DevExpress.event, data?: any, key?: any, values?: Array<any>, columns?: Array<any>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, groupIndex?: number, rowElement?: DevExpress.core.dxElement, handled?: boolean }) => {
				let lastClick = e.component['lastClick'] as Date;
				let currClick = e.component['lastClick'] = new Date();
				if (lastClick && (currClick.getTime() - lastClick.getTime() < 300)) {
					if (!this.handlers['_doubleclick']) return;
					for (let handler of this.handlers['_doubleclick']) {
						handler({ element: this.root, data: e.data });
					}
				}
			};
			if (this.selectionMode && this.selectionMode != 'none') {
				if(this.selectionFilter && this.selectionFilter.length) {
					gopt.selection = { mode: this.selectionMode, deferred: true };
				}
				else {
					gopt.selection = { mode: this.selectionMode };
				}
			}
			if (this.selectionFilter && this.selectionFilter.length) {
				gopt.selectionFilter = this.selectionFilter;
			}
			if (this.exportFile) {
				gopt.export = { enabled: true, fileName: this.exportFile };
			}
			// Event handlers
			if (this.handlers['_selectionchanged'] && this.handlers['_selectionchanged'].length) {
				gopt.onSelectionChanged = this.handlers['_selectionchanged'][0];
			}
			if (this.handlers['_rowprepared'] && this.handlers['_rowprepared'].length) {
				gopt.onRowPrepared = this.handlers['_rowprepared'][0];
			}
			if (this.handlers['_cellprepared'] && this.handlers['_cellprepared'].length) {
				gopt.onCellPrepared = this.handlers['_cellprepared'][0];
			}
			if (this.handlers['_contentready'] && this.handlers['_contentready'].length) {
				gopt.onContentReady = this.handlers['_contentready'][0];
			}
			if (this.handlers['_rowupdated'] && this.handlers['_rowupdated'].length) {
				gopt.onRowUpdated = this.handlers['_rowupdated'][0];
			}
			if (this.handlers['_cellclick'] && this.handlers['_cellclick'].length) {
				gopt.onCellClick = this.handlers['_cellclick'][0];
			}
			if (this.handlers['_editorprepared'] && this.handlers['_editorprepared'].length) {
				gopt.onEditorPrepared = this.handlers['_editorprepared'][0];
			}
			if (this.handlers['_editorpreparing'] && this.handlers['_editorpreparing'].length) {
				gopt.onEditorPreparing = this.handlers['_editorpreparing'][0];
			}
			if (this.handlers['_editingstart'] && this.handlers['_editingstart'].length) {
				gopt.onEditingStart = this.handlers['_editingstart'][0];
			}
			if (this.handlers['_keydown'] && this.handlers['_keydown'].length) {
				gopt.onKeyDown = this.handlers['_keydown'][0];
			}
			if (this.handlers['_toolbarpreparing'] && this.handlers['_toolbarpreparing'].length) {
				gopt.onToolbarPreparing = this.handlers['_toolbarpreparing'][0];
			}

			this.beforeInit(gopt);

			this.$r.dxDataGrid(gopt);
			this.$i = this.$r.dxDataGrid('instance');

			if (this.handlers['_scroll'] && this.handlers['_scroll'].length) {
				this.$i.getScrollable().on('scroll', this.handlers['_scroll'][0]);
			}

			if(dxTableDidMount) dxTableDidMount(this);
		}

		protected componentWillUpdate(nextProps: any, nextState: any): void {
			if (!nextState) nextState = [];
			this.editmap = {};
			let gopt: DevExpress.ui.dxDataGridOptions;
			if (this.storeKey) {
				let ds = new DevExpress.data.DataSource(new DevExpress.data.ArrayStore({
					data: nextState,
					key: this.storeKey
				}));
				gopt = { dataSource: ds };
			}
			else {
				gopt = { dataSource: nextState };
			}
			gopt.paging = { enabled: this.paging, pageSize: this.pageSize };
			if (this.paging) gopt.pager = { showPageSizeSelector: false, allowedPageSizes: [this.pageSize], showInfo: true };
			if (!this.keepSorting) {
				this.$i.clearSorting();
			}
			if (!this.selectionFilter || !this.selectionFilter.length) {
				this.$i.clearSelection();
			}
			this.$r.dxDataGrid(gopt);
			this.$i = this.$r.dxDataGrid('instance');
			this.$i.refresh().done(() => {
				if (this.handlers['_donerefresh']) {
					for (let h of this.handlers['_donerefresh']) h(this.createEvent('_donerefresh'));
				}
				if (this.handlers['_selectall'] && this.selectionMode == 'multiple') {
					let $cb = $('.dx-header-row .dx-checkbox').first();
					if($cb && $cb.length) {
						if(!this.$csa || !this.$csa.is($cb)) {
							this.$csa = $cb;
							let val = this.$csa.dxCheckBox('instance').option('value');
							this.$csa.on('click', (e: JQueryEventObject) => {
								e.data = val;
								for(let h of this.handlers['_selectall']) h(e);
							});
						}
					}
				}
			});
			// Work around bug dx-loadpanel
			this.$r.find('.dx-loadpanel-content').hide();
		}
	}

	/*
	* Wrapper dxTreeView. Required DevExpress.ui.dxTreeView https://js.devexpress.com/
	*/
	export class WDxTreeView extends WUX.WComponent<string, any[]> {
		height: number;
		width: number;
		searchEnabled: boolean;
		selectionMode: 'multiple' | 'single';
		selectByClick: boolean;

		constructor(id?: string) {
			super(id ? id : '*', 'WDxTreeView');
		}

		getInstance(opt?: DevExpress.ui.dxTreeViewOptions): DevExpress.ui.dxTreeView {
			if (!this.$r) return null;
			if(opt) this.$r.dxTreeView(opt);
			return this.$r.dxTreeView('instance');
		}

		/** 
			To expand on click:
			e.component.expandItem(e.node.key);
		*/
		onItemClick(h: (e: { component?: DevExpress.ui.dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, jQueryEvent?: JQueryEventObject, event?: DevExpress.events.event, node?: DevExpress.ui.dxTreeViewNode }) => any): void {
			// Single handler
			this.handlers['_onItemClick'] = [h];
			if (this.mounted) {
				let opt: DevExpress.ui.dxTreeViewOptions = {
					onItemClick: h
				};
				this.$r.dxTreeView(opt);
			}
		}

		onSelectionChanged(h: (e: { component?: DevExpress.ui.dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, jQueryEvent?: JQueryEventObject, event?: DevExpress.events.event, node?: DevExpress.ui.dxTreeViewNode }) => any): void {
			// Single handler
			this.handlers['_onSelectionChanged'] = [h];
			if (this.mounted) {
				let opt: DevExpress.ui.dxTreeViewOptions = {
					onSelectionChanged: h
				};
				this.$r.dxTreeView(opt);
			}
		}

		onItemRendered(h: (e: { component?: DevExpress.ui.dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, node?: DevExpress.ui.dxTreeViewNode }) => any): void {
			// Single handler
			this.handlers['_onItemRendered'] = [h];
			if (this.mounted) {
				let opt: DevExpress.ui.dxTreeViewOptions = {
					onItemRendered: h
				};
				this.$r.dxTreeView(opt);
			}
		}

		getSelectedItems(): any[] {
			if (!this.mounted) return [];
			let n = this.$r.dxTreeView('instance').getSelectedNodes();
			if(!n) return [];
			return n.map(function(node) { return node.itemData; });
		}

		select(item: any): this {
			if (!this.mounted) return this;
			this.$r.dxTreeView('selectItem', item);
			return this;
		}

		off(events?: string): this {
			super.off(events);
			if (!events) return this;
			let opt: DevExpress.ui.dxTreeViewOptions = {};
			if (events.indexOf('_onItemClick') >= 0) opt.onItemClick = null;
			if (events.indexOf('_onSelectionChanged') >= 0) opt.onSelectionChanged = null;
			if (events.indexOf('_onItemRendered') >= 0) opt.onItemRendered = null;
			this.$r.dxTreeView(opt);
			return this;
		}

		protected updateState(nextState: any[]): void {
			super.updateState(nextState);
			if (this.$r && this.$r.length) {
				let opt: DevExpress.ui.dxTreeViewOptions = {
					items: nextState
				}
				this.$r.dxTreeView(opt);
			}
		}

		protected updateProps(nextProps: string): void {
			super.updateProps(nextProps);
			if (!this.mounted) return;
			if(this.props) {
				this.$r.dxTreeView('instance').option('searchMode', this.props);
			}
		}

		beforeInit(opt: DevExpress.ui.dxTreeViewOptions): void {
		}

		expandAll(): this {
			if (!this.mounted) return this;
			this.$r.dxTreeView('expandAll');
			return this;
		}

		collapseAll(): this {
			if (!this.mounted) return this;
			this.$r.dxTreeView('collapseAll');
			return this;
		}

		protected componentDidMount(): void {
			let opt: DevExpress.ui.dxTreeViewOptions = {
				height: this.height,
				width: this.width,
				searchEnabled: this.searchEnabled,
				items: this.state
			}
			if(this.selectionMode == "multiple") {
				opt.selectionMode = "multiple";
				opt.showCheckBoxesMode = "normal";
				opt.selectByClick = this.selectByClick;
			}
			if (this.handlers['_onItemClick'] && this.handlers['_onItemClick'].length) {
				opt.onItemClick = this.handlers['_onItemClick'][0];
			}
			if (this.handlers['_onSelectionChanged'] && this.handlers['_onSelectionChanged'].length) {
				opt.onSelectionChanged = this.handlers['_onSelectionChanged'][0];
			}
			if (this.handlers['_onItemRendered'] && this.handlers['_onItemRendered'].length) {
				opt.onItemRendered = this.handlers['_onItemRendered'][0];
			}

			this.beforeInit(opt);

			let t = this.$r.dxTreeView(opt);
			if(this.props) {
				t.option('searchMode', this.props);
			}
		}
	}
}
// Internal init
WUX.init0 = WUX.initDX;