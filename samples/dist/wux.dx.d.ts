declare namespace WUX {
    type DxComponentType = 'dxAccordion' | 'dxActionSheet' | 'dxAutocomplete' | 'dxBox' | 'dxButton' | 'dxButtonGroup' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxContextMenu' | 'dxDataGrid' | 'dxDateBox' | 'dxDeferRendering' | 'dxDiagram' | 'dxDraggable' | 'dxDrawer' | 'dxDropDownBox' | 'dxDropDownButton' | 'dxFileManager' | 'dxFileUploader' | 'dxFilterBuilder' | 'dxForm' | 'dxGallery' | 'dxGantt' | 'dxHtmlEditor' | 'dxList' | 'dxLoadIndicator' | 'dxLoadPanel' | 'dxLookup' | 'dxMap' | 'dxMenu' | 'dxMultiView' | 'dxNavBar' | 'dxNumberBox' | 'dxPivotGrid' | 'dxPivotGridFieldChooser' | 'dxPopover' | 'dxPopup' | 'dxProgressBar' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxRecurrenceEditor' | 'dxResizable' | 'dxResponsiveBox' | 'dxScheduler' | 'dxScrollView' | 'dxSelectBox' | 'dxSlideOut' | 'dxSlideOutView' | 'dxSlider' | 'dxSortable' | 'dxSpeedDialAction' | 'dxSwitch' | 'dxTabPanel' | 'dxTabs' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox' | 'dxTileView' | 'dxToast' | 'dxToolbar' | 'dxTooltip' | 'dxTreeList' | 'dxTreeView' | 'dxValidationGroup' | 'dxValidationSummary' | 'dxValidator' | 'dxBarGauge' | 'dxBullet' | 'dxChart' | 'dxCircularGauge' | 'dxFunnel' | 'dxLinearGauge' | 'dxPieChart' | 'dxPolarChart' | 'dxRangeSelector' | 'dxSankey' | 'dxSparkline' | 'dxTreeMap' | 'dxVectorMap';
    let dxTableDidMount: (c: WDXTable) => any;
    let dxTreeDidMount: (c: WDxTreeView) => any;
    let dxCompDidMount: (c: WDX) => any;
    function initDX(callback: () => any): void;
    class WDX extends WComponent<DxComponentType, any> {
        opts: any;
        $i: DevExpress.ui.Widget;
        constructor(props: DxComponentType, id?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object);
        get options(): any;
        set options(o: any);
        componentDidMount(): void;
        updateState(nextState: any): void;
        getState(): any;
        getInstance(c?: (i: any) => void): any;
        focus(): this;
        dispose(): this;
        exec(m: string, t?: number, c?: (i: any) => void): this;
        option(n: string, v?: any): any;
        _on(n: string, f: Function): this;
        _off(n: string, f?: Function): this;
        _(m: string, ...a: any[]): any;
    }
    /**
     * Wrapper DxDataGrid. Required DevExpress.ui.dxDataGrid https://js.devexpress.com/
     */
    class WDXTable extends WComponent<DevExpress.ui.dxDataGridOptions, any[]> {
        header: string[];
        keys: any[];
        types: string[];
        widths: number[];
        widthsPerc: boolean;
        selectionMode: 'single' | 'multiple' | 'none';
        templates: ((cnt: JQuery, opt: {
            data: any;
            text: string;
        }) => any)[];
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
        actions: WUX.WField[];
        actionsTitle: string;
        actionsStyle: WUX.WStyle;
        actionWidth: number;
        groups: string[];
        groupsCols: number[][];
        _editable: boolean;
        editables: boolean[];
        editmap: {};
        filterOps: string[];
        hiddenCols: string[];
        $csa: JQuery;
        $i: DevExpress.ui.dxDataGrid;
        constructor(id: string, header: string[], keys?: any[], classStyle?: string, style?: string | WStyle, attributes?: string | Object, props?: any);
        get editable(): boolean;
        set editable(b: boolean);
        setCellEditable(row: number, col: number | string, editable: boolean): this;
        addHidden(col: string): this;
        refresh(): this;
        refreshAndEdit(row?: number, col?: any, t?: number): this;
        repaintAndEdit(row?: number, col?: any, t?: number): this;
        repaint(): this;
        closeEditCell(): this;
        repaintRows(idxs: number[]): this;
        repaintRowByKey(key: any): this;
        addActions(key: string, field: WUX.WField): this;
        addGroupBefore(name: string, col?: string | number): void;
        addGroupAfter(name: string, col: string | number): void;
        addGroup(name: string, cols: any[]): void;
        onClickAction(h: (e: JQueryEventObject) => any): void;
        onSelectionChanged(h: (e: {
            element?: JQuery;
            selectedRowsData?: Array<any>;
        }) => any): void;
        onDoubleClick(h: (e: {
            element?: JQuery;
        }) => any): void;
        onSelectAll(h: (e: JQueryEventObject) => any): void;
        onDoneRefresh(h: (e: WEvent) => any): void;
        onRowPrepared(h: (e: {
            element?: JQuery;
            rowElement?: JQuery;
            data?: any;
            rowIndex?: number;
            isSelected?: boolean;
        }) => any): void;
        onCellPrepared(h: (e: {
            component?: DevExpress.DOMComponent;
            element?: DevExpress.core.dxElement;
            model?: any;
            data?: any;
            key?: any;
            value?: any;
            displayValue?: string;
            text?: string;
            columnIndex?: number;
            column?: DevExpress.ui.dxDataGridColumn;
            rowIndex?: number;
            rowType?: string;
            row?: DevExpress.ui.dxDataGridRowObject;
            isSelected?: boolean;
            isExpanded?: boolean;
            cellElement?: DevExpress.core.dxElement;
        }) => any): void;
        onContentReady(h: (e: {
            component?: DevExpress.ui.dxDataGrid;
            element?: DevExpress.core.dxElement;
            model?: any;
        }) => any): void;
        onRowUpdated(h: (e: {
            component?: DevExpress.DOMComponent;
            element?: DevExpress.core.dxElement;
            model?: any;
            data?: any;
            key?: any;
            error?: Error;
        }) => any): void;
        onEditorPreparing(h: (e: {
            component?: DevExpress.DOMComponent;
            element?: DevExpress.core.dxElement;
            model?: any;
            parentType?: string;
            value?: any;
            setValue?: any;
            updateValueTimeout?: number;
            width?: number;
            disabled?: boolean;
            rtlEnabled?: boolean;
            cancel?: boolean;
            editorElement?: DevExpress.core.dxElement;
            readOnly?: boolean;
            editorName?: string;
            editorOptions?: any;
            dataField?: string;
            row?: DevExpress.ui.dxDataGridRowObject;
        }) => any): void;
        onEditorPrepared(h: (e: {
            component?: DevExpress.DOMComponent;
            element?: DevExpress.core.dxElement;
            model?: any;
            parentType?: string;
            value?: any;
            setValue?: any;
            updateValueTimeout?: number;
            width?: number;
            disabled?: boolean;
            rtlEnabled?: boolean;
            editorElement?: DevExpress.core.dxElement;
            readOnly?: boolean;
            dataField?: string;
            row?: DevExpress.ui.dxDataGridRowObject;
        }) => any): void;
        onEditingStart(h: (e: {
            component?: DevExpress.DOMComponent;
            element?: DevExpress.core.dxElement;
            model?: any;
            parentType?: string;
            value?: any;
            setValue?: any;
            updateValueTimeout?: number;
            width?: number;
            disabled?: boolean;
            rtlEnabled?: boolean;
            editorElement?: DevExpress.core.dxElement;
            readOnly?: boolean;
            dataField?: string;
            row?: DevExpress.ui.dxDataGridRowObject;
        }) => any): void;
        onCellClick(h: (e: {
            component?: DevExpress.DOMComponent;
            element?: DevExpress.core.dxElement;
            model?: any;
            jQueryEvent?: JQueryEventObject;
            event?: DevExpress.event;
            data?: any;
            key?: any;
            value?: any;
            displayValue?: string;
            text?: string;
            columnIndex?: number;
            column?: any;
            rowIndex?: number;
            rowType?: string;
            cellElement?: DevExpress.core.dxElement;
            row?: DevExpress.ui.dxDataGridRowObject;
        }) => any): void;
        onScroll(h: (e: {
            element?: JQuery;
            reachedBottom?: boolean;
            reachedLeft?: boolean;
            reachedRight?: boolean;
            reachedTop?: boolean;
            scrollOffset?: {
                top?: number;
                left?: number;
            };
        }) => any): void;
        onKeyDown(h: (e: {
            component?: DevExpress.DOMComponent;
            element?: DevExpress.core.dxElement;
            model?: any;
            jQueryEvent?: JQueryEventObject;
            event?: DevExpress.event;
            handled?: boolean;
        }) => any): void;
        onToolbarPreparing(h: (e: {
            component?: DevExpress.DOMComponent;
            element?: DevExpress.core.dxElement;
            model?: any;
            toolbarOptions?: DevExpress.ui.dxToolbarOptions;
        }) => any): void;
        scrollTo(location: any): void;
        scrollToRow(row: number, delta?: number, timeOut?: number): void;
        clearFilter(): void;
        off(events?: string): this;
        clearSelection(): this;
        deselectAll(): this;
        select(idxs: number[]): this;
        selectRows(keys: any[], preserve: boolean): this;
        deselectRows(keys: any[]): this;
        selectAll(toggle?: boolean): this;
        setSelectionMode(s: 'single' | 'multiple' | 'none'): this;
        setColVisible(col: string, vis: boolean): this;
        edit(row: number, col: any, t?: number): this;
        getFilter(key: string): string;
        getInstance(gopt?: DevExpress.ui.dxDataGridOptions): DevExpress.ui.dxDataGrid;
        pageIndex(p: number): this;
        getSelectedKeys(): any[];
        getSelectedRows(): number[];
        isSelected(data: any): boolean;
        getSelectedRowsData(): any[];
        getFilteredRowsData(): any[];
        cellValue(rowIndex: number, dataField: string): any;
        cellValue(rowIndex: number, dataField: string, value?: any): any;
        saveEditData(r?: number): this;
        count(): number;
        beforeInit(gopt: DevExpress.ui.dxDataGridOptions): void;
        protected componentDidMount(): void;
        protected componentWillUpdate(nextProps: any, nextState: any): void;
    }
    class WDxTreeView extends WUX.WComponent<string, any[]> {
        height: number;
        width: number;
        searchEnabled: boolean;
        selectionMode: 'multiple' | 'single';
        selectByClick: boolean;
        constructor(id?: string);
        getInstance(opt?: DevExpress.ui.dxTreeViewOptions): DevExpress.ui.dxTreeView;
        /**
            To expand on click:
            e.component.expandItem(e.node.key);
        */
        onItemClick(h: (e: {
            component?: DevExpress.ui.dxTreeView;
            element?: DevExpress.core.dxElement;
            model?: any;
            itemData?: any;
            itemElement?: DevExpress.core.dxElement;
            itemIndex?: number | any;
            jQueryEvent?: JQueryEventObject;
            event?: DevExpress.events.event;
            node?: DevExpress.ui.dxTreeViewNode;
        }) => any): void;
        onSelectionChanged(h: (e: {
            component?: DevExpress.ui.dxTreeView;
            element?: DevExpress.core.dxElement;
            model?: any;
            itemData?: any;
            itemElement?: DevExpress.core.dxElement;
            itemIndex?: number | any;
            jQueryEvent?: JQueryEventObject;
            event?: DevExpress.events.event;
            node?: DevExpress.ui.dxTreeViewNode;
        }) => any): void;
        onItemRendered(h: (e: {
            component?: DevExpress.ui.dxTreeView;
            element?: DevExpress.core.dxElement;
            model?: any;
            itemData?: any;
            itemElement?: DevExpress.core.dxElement;
            itemIndex?: number;
            node?: DevExpress.ui.dxTreeViewNode;
        }) => any): void;
        getSelectedItems(): any[];
        select(item: any): this;
        off(events?: string): this;
        protected updateState(nextState: any[]): void;
        protected updateProps(nextProps: string): void;
        beforeInit(opt: DevExpress.ui.dxTreeViewOptions): void;
        expandAll(): this;
        collapseAll(): this;
        protected componentDidMount(): void;
    }
}
