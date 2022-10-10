declare namespace WUX {
    class WContainer extends WComponent<string, any> {
        inline: boolean;
        components: Array<WElement>;
        layoutManager: WLayoutManager;
        legend: string;
        fieldsetStyle: string | WStyle;
        legendStyle: string | WStyle;
        wrapper: WWrapper;
        stateComp: WComponent;
        constructor(id?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, inline?: boolean, type?: string, addClassStyle?: string);
        static create(w: WWrapper): WContainer;
        protected updateState(nextState: any): void;
        getState(): any;
        on(events: string, handler: (e: any) => any): this;
        off(events?: string): this;
        trigger(eventType: string, ...extParams: any[]): this;
        setLayout(layoutManager: WLayoutManager): void;
        section(title: string, secStyle?: string | WStyle, legStyle?: string | WStyle): this;
        area(title: string, areaStyle?: string | WStyle, legStyle?: string | WStyle): this;
        end(): WContainer;
        grid(): WContainer;
        row(): WContainer;
        col(): WContainer;
        addDiv(height: number, inner?: string, classStyle?: string): WContainer;
        addDiv(css: string | WStyle, inner?: string, attributes?: string, id?: string): WContainer;
        addSpan(width: number, inner?: string, classStyle?: string): WContainer;
        addSpan(css: string | WStyle, inner?: string, attributes?: string, id?: string): WContainer;
        addGroup(w: WWrapper, ...ac: WElement[]): this;
        add(component: WElement, constraints?: string): this;
        remove(index: number): this;
        removeAll(): this;
        addRow(classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object): WContainer;
        addCol(classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object): WContainer;
        addASide(classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object): WContainer;
        addBox(title?: string, classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object): WBox;
        addText(text: string[], rowTag?: string, classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object): this;
        findBox(title_id?: string): WBox;
        addStack(style: string | WStyle, ...ac: Array<WElement>): this;
        addLine(style: string | WStyle, ...ac: Array<WElement>): this;
        addContainer(container: WWrapper, constraints?: string): WContainer;
        addContainer(container: WContainer, constraints?: string): WContainer;
        addContainer(id?: string, classStyle?: string, style?: string, attributes?: string | object, inline?: boolean, props?: any): WContainer;
        protected render(): any;
        protected make(): string;
        protected componentDidMount(): void;
        componentWillUnmount(): void;
        rebuild(): this;
    }
    class WCardLayout implements WLayoutManager {
        mapConstraints: {
            [componentId: string]: string;
        };
        mapComponents: {
            [constraints: string]: WElement;
        };
        currComp: WElement;
        addLayoutComponent(component: WElement, constraints?: string): void;
        removeLayoutComponent(component: WElement): void;
        layoutContainer(container: WContainer, root: JQuery): void;
        show(container: WContainer, name: string): void;
    }
    class WBox extends WContainer {
        protected _header: WContainer;
        protected _footer: WContainer;
        protected _title: string;
        protected _addClassStyle: string;
        protected tools: {
            [key: string]: JQuery;
        };
        protected cntls: WContainer;
        TOOL_COLLAPSE: string;
        TOOL_CLOSE: string;
        TOOL_FILTER: string;
        constructor(id?: string, title?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object);
        get title(): string;
        set title(s: string);
        addTool(tool: JQuery | WComponent): this;
        addTool(tool: string | JQuery | WComponent, icon?: WIcon, attributes?: string, handler?: (e?: any) => any): this;
        addCollapse(handler?: (e?: any) => any): this;
        addClose(handler?: (e?: any) => any): this;
        addFilter(handler?: (e?: any) => any): this;
        get header(): WContainer;
        get content(): WContainer;
        get footer(): WContainer;
        protected componentDidMount(): void;
        componentWillUnmount(): void;
        end(): WContainer;
        addRow(classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object): WContainer;
        collapse(handler?: (e?: any) => any): this;
        expand(handler?: (e?: any) => any): this;
        isCollapsed(): boolean;
        close(): this;
    }
    class WDialog<P = any, S = any> extends WComponent<P, S> {
        cntRoot: WContainer;
        cntMain: WContainer;
        cntContent: WContainer;
        cntHeader: WContainer;
        cntBody: WContainer;
        cntFooter: WContainer;
        protected _title: string;
        protected tagTitle: string;
        btnCloseHeader: WButton;
        btnOK: WButton;
        btnCancel: WButton;
        txtCancel: string;
        buttons: WButton[];
        ok: boolean;
        cancel: boolean;
        isShown: boolean;
        parentHandler: (e?: JQueryEventObject) => any;
        constructor(id: string, name?: string, btnOk?: boolean, btnClose?: boolean, classStyle?: string, style?: string | WStyle, attributes?: string | object);
        onShownModal(handler: (e?: JQueryEventObject) => any): void;
        onHiddenModal(handler: (e?: JQueryEventObject) => any): void;
        get header(): WContainer;
        get body(): WContainer;
        get footer(): WContainer;
        get title(): string;
        set title(s: string);
        protected onClickOk(): boolean;
        protected onClickCancel(): boolean;
        protected buildBtnOK(): WButton;
        protected buildBtnCancel(): WButton;
        buttonOk(): WButton;
        buttonCancel(): WButton;
        show(parent?: WComponent, handler?: (e?: JQueryEventObject) => any): void;
        hide(): void;
        close(): void;
        selection(table: WITable, warn?: string): boolean;
        protected beforeShow(): boolean;
        protected onShown(): void;
        protected onHidden(): void;
        protected render(): WContainer;
        protected componentDidMount(): void;
        componentWillUnmount(): void;
        protected buildTitle(title: string): string;
    }
    class WLabel extends WComponent<string, string> {
        forId: string;
        protected blinks: number;
        constructor(id?: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object);
        get icon(): string;
        set icon(i: string);
        protected updateState(nextState: string): void;
        for(e: WElement): this;
        blink(n?: number): this;
        protected highlight(): this;
        protected render(): string;
        protected componentDidMount(): void;
    }
    class WInput extends WComponent<WInputType, string> {
        size: number;
        label: string;
        valueType: 's' | 'n' | 'p' | 'c' | 'c5' | 'i' | 'd' | 't' | 'h' | 'b';
        blurOnEnter: boolean;
        placeHolder: string;
        constructor(id?: string, type?: WInputType, size?: number, classStyle?: string, style?: string | WStyle, attributes?: string | object);
        protected updateState(nextState: string): void;
        onEnterPressed(handler: (e: WEvent) => any): void;
        protected render(): string;
        protected componentDidMount(): void;
    }
    class WTextArea extends WComponent<number, string> {
        constructor(id?: string, rows?: number, classStyle?: string, style?: string | WStyle, attributes?: string | object);
        protected updateState(nextState: string): void;
        getState(): string;
        protected render(): string;
        protected componentDidMount(): void;
    }
    class WCheck extends WComponent<boolean, any> {
        wrapper: WUX.WContainer;
        value: any;
        protected $label: JQuery;
        protected _text: string;
        constructor(id?: string, text?: string, value?: any, checked?: boolean, classStyle?: string, style?: string | WStyle, attributes?: string | object);
        get text(): string;
        set text(s: string);
        get checked(): boolean;
        set checked(b: boolean);
        getState(): any;
        protected updateProps(nextProps: boolean): void;
        protected updateState(nextState: any): void;
        protected render(): string;
        protected componentDidMount(): void;
        getWrapper(style?: string | WStyle): WContainer;
    }
    class WButton extends WComponent<string, string> {
        readonly type: string;
        constructor(id?: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, type?: string);
        get icon(): string;
        set icon(i: string);
        setText(text?: string, icon?: string): void;
        protected render(): string;
        protected componentDidMount(): void;
        protected componentWillUpdate(nextProps: any, nextState: any): void;
    }
    class WLink extends WComponent<string, string> {
        protected _href: string;
        protected _target: string;
        constructor(id?: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, href?: string, target?: string);
        get icon(): string;
        set icon(s: string);
        get href(): string;
        set href(s: string);
        get target(): string;
        set target(s: string);
        protected render(): string;
        protected componentDidMount(): void;
        protected componentWillUpdate(nextProps: any, nextState: any): void;
    }
    class WTab extends WComponent<any, number> {
        tabs: WContainer[];
        constructor(id?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, props?: any);
        addTab(title: string, icon?: string): WContainer;
        protected render(): string;
        protected componentDidUpdate(prevProps: any, prevState: any): void;
        protected componentDidMount(): void;
        componentWillUnmount(): void;
    }
    class WSelect extends WComponent implements WISelectable {
        options: Array<string | WEntity>;
        multiple: boolean;
        constructor(id?: string, options?: Array<string | WEntity>, multiple?: boolean, classStyle?: string, style?: string | WStyle, attributes?: string | object);
        getProps(): any;
        select(i: number): this;
        addOption(e: string | WEntity, sel?: boolean): this;
        remOption(e: string | WEntity): this;
        setOptions(options: Array<string | WEntity>, prevVal?: boolean): this;
        protected updateState(nextState: any): void;
        protected render(): string;
        protected componentDidMount(): void;
        protected buildOptions(): string;
    }
    class WRadio extends WComponent implements WISelectable {
        options: Array<string | WEntity>;
        label: string;
        constructor(id?: string, options?: Array<string | WEntity>, classStyle?: string, style?: string | WStyle, attributes?: string | object, props?: any);
        set tooltip(s: string);
        select(i: number): this;
        protected render(): string;
        protected componentDidMount(): void;
        protected componentDidUpdate(prevProps: any, prevState: any): void;
    }
    interface WITable extends WComponent {
        header: string[];
        keys: any[];
        types: string[];
        widths: number[];
        widthsPerc: boolean;
        filter: boolean;
        hideHeader: boolean;
        templates: ((cnt: JQuery, opt: {
            data: any;
            text: string;
        }) => any)[];
        selectionMode: 'single' | 'multiple' | 'none';
        clearSelection(): this;
        select(idxs: number[]): this;
        selectAll(toggle?: boolean): this;
        getSelectedRows(): number[];
        getSelectedRowsData(): any[];
        getFilteredRowsData(): any[];
        refresh(): this;
        onSelectionChanged(handler: (e: {
            element?: JQuery;
            selectedRowsData?: Array<any>;
        }) => any): void;
        onDoubleClick(handler: (e: {
            element?: JQuery;
        }) => any): void;
        onRowPrepared(handler: (e: {
            element?: JQuery;
            rowElement?: JQuery;
            data?: any;
            rowIndex?: number;
        }) => any): void;
    }
    class WTable extends WComponent<any, any[]> implements WITable {
        header: string[];
        keys: any[];
        types: string[];
        widths: number[];
        widthsPerc: boolean;
        filter: boolean;
        hideHeader: boolean;
        templates: ((cnt: JQuery, opt: {
            data: any;
            text: string;
        }) => any)[];
        selectionMode: 'single' | 'multiple' | 'none';
        selectedRow: number;
        selClass: string;
        colStyle: string | WStyle;
        rowStyle: string | WStyle;
        headStyle: string | WStyle;
        footerStyle: string | WStyle;
        col0Style: string | WStyle;
        colLStyle: string | WStyle;
        boldNonZero: boolean;
        constructor(id: string, header: string[], keys?: any[], classStyle?: string, style?: string, attributes?: string | object, props?: any);
        onSelectionChanged(handler: (e: {
            element?: JQuery;
            selectedRowsData?: Array<any>;
        }) => any): void;
        onDoubleClick(handler: (e: {
            element?: JQuery;
        }) => any): void;
        onRowPrepared(handler: (e: {
            element?: JQuery;
            rowElement?: JQuery;
            data?: any;
            rowIndex?: number;
        }) => any): void;
        onCellClick(handler: (e: {
            element?: JQuery;
            rowIndex?: number;
            colIndex?: number;
        }) => any): void;
        onCellHoverChanged(handler: (e: {
            element?: JQuery;
            rowIndex?: number;
            colIndex?: number;
        }) => any): void;
        clearSelection(): this;
        select(idxs: number[]): this;
        selectAll(toggle?: boolean): this;
        getSelectedRows(): number[];
        getSelectedRowsData(): any[];
        getFilteredRowsData(): any[];
        refresh(): this;
        getCellValue(r: number, c: number): any;
        getColHeader(c: number): string;
        protected render(): string;
        protected componentDidMount(): void;
        protected componentDidUpdate(prevProps: any, prevState: any): void;
        protected buildBody(): void;
    }
    class WFormPanel extends WComponent<WField[][], any> {
        protected title: string;
        protected rows: WField[][];
        protected roww: WWrapper[];
        protected currRow: WField[];
        protected hiddens: WField[];
        protected internals: {
            [fid: string]: any;
        };
        protected components: WComponent[];
        protected readonly: boolean;
        protected lastTs: number;
        protected dpids: string[];
        captions: WComponent[];
        stateChangeOnBlur: boolean;
        nextOnEnter: boolean;
        inputClass: string;
        checkboxStyle: string;
        nextMap: {
            [fid: string]: string;
        };
        lastChanged: string;
        mapTooltips: {
            [fid: string]: string;
        };
        mapLabelLinks: {
            [fid: string]: WLink[];
        };
        minValues: {
            [fid: string]: any;
        };
        maxValues: {
            [fid: string]: any;
        };
        autoValidate: boolean;
        footer: WElement[];
        footerClass: string;
        footerStyle: string | WStyle;
        footerSep: number | string;
        constructor(id?: string, title?: string, action?: string, props?: any);
        init(): this;
        focus(): this;
        first(enabled?: boolean): WField;
        focusOn(fieldId: string): this;
        onEnterPressed(h: (e: WEvent) => any): void;
        onEnd(h: (e: WEvent) => any): void;
        onChangeDate(h: (e: JQueryEventObject) => any): void;
        addToFooter(c: WElement, sep?: number | string): this;
        addRow(classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object, type?: string): this;
        addTextField(fieldId: string, label: string, readonly?: boolean): this;
        addNoteField(fieldId: string, label: string, rows: number, readonly?: boolean): this;
        addCurrencyField(fieldId: string, label: string, readonly?: boolean): this;
        addCurrency5Field(fieldId: string, label: string, readonly?: boolean): this;
        addIntegerField(fieldId: string, label: string, readonly?: boolean): this;
        addDecimalField(fieldId: string, label: string, readonly?: boolean): this;
        addDateField(fieldId: string, label: string, readonly?: boolean, minDate?: Date, maxDate?: Date): this;
        addOptionsField(fieldId: string, label: string, options?: (string | WEntity)[], attributes?: string, readonly?: boolean): this;
        addBooleanField(fieldId: string, label: string): this;
        addBlankField(label?: string, classStyle?: string, style?: string | WStyle, id?: string, attributes?: string, inner?: string): this;
        addRadioField(fieldId: string, label: string, options?: (string | WEntity)[]): this;
        addPasswordField(fieldId: string, label: string, readonly?: boolean): this;
        addEmailField(fieldId: string, label: string, readonly?: boolean): this;
        addFtpField(fieldId: string, label: string, readonly?: boolean): this;
        addCronField(fieldId: string, label: string, readonly?: boolean, value?: string): this;
        addComponent(fieldId: string, label: string, component: WComponent, readonly?: boolean): this;
        addCaption(label: string, icon?: string, classStyle?: string, style?: string | WStyle): this;
        addInternalField(fieldId: string, value?: any): this;
        addHiddenField(fieldId: string, value?: any): this;
        setTooltip(fieldId: string, text: string): this;
        setLabelLinks(fieldId: string, links: WLink[]): this;
        setReadOnly(readonly: boolean): this;
        setReadOnly(fieldId: string, readonly?: boolean): this;
        set enabled(b: boolean);
        setEnabled(enabled: boolean): this;
        setEnabled(fieldId: string, enabled?: boolean): this;
        setVisible(fieldId: string, visible?: boolean): this;
        setLabelCss(fieldId: string, css: string | WStyle): this;
        setLabelText(fieldId: string, t: string): this;
        setSpanField(fieldId: string, span: number): this;
        getField(fid: string): WField;
        onMount(fid: string, h: (f: WField) => any): this;
        onFocus(fid: string, h: (e: JQueryEventObject) => any): this;
        onBlur(fid: string, h: (e: JQueryEventObject) => any): this;
        getStateOf(fid: string): any;
        getPropsOf(fid: string): any;
        next(fid: string): WField;
        setMandatory(...fids: string[]): this;
        checkMandatory(labels?: boolean, focus?: boolean, atLeastOne?: boolean): string;
        getState(): any;
        protected render(): string;
        protected componentDidMount(): void;
        protected isFocusable(f: WField): boolean;
        protected updateState(nextState: any): void;
        isBlank(fid?: string): boolean;
        isZero(fid: string): boolean;
        match(fid: string, val: any): boolean;
        transferTo(dest: WComponent, force?: boolean, callback?: () => any): boolean;
        clear(): this;
        select(fieldId: string, i: number): this;
        setValue(fid: string, v: any, updState?: boolean): this;
        getValue(fid: string | WField): any;
        getValues(formatted?: boolean): any;
        protected updateView(): void;
        validate(): any;
    }
    class WWindow<P = any, S = any> extends WComponent<P, S> {
        cntRoot: WContainer;
        cntHeader: WContainer;
        cntBody: WContainer;
        btnCloseHeader: WButton;
        isShown: boolean;
        isClosed: boolean;
        position: 'top' | 'bottom';
        width: string | number;
        height: string | number;
        gap: number;
        background: string;
        color: string;
        headerStyle: string | WStyle;
        static DEF_HEADER_STYLE: WStyle;
        titleStyle: string | WStyle;
        protected _title: string;
        protected tagTitle: string;
        constructor(id: string, name?: string, position?: 'top' | 'bottom', attributes?: string | object, props?: any);
        onShow(handler: (e: WUX.WEvent) => any): void;
        onHide(handler: (e: WUX.WEvent) => any): void;
        onClose(handler: (e: WUX.WEvent) => any): void;
        get header(): WContainer;
        get body(): WContainer;
        get container(): WContainer;
        get title(): string;
        set title(s: string);
        show(parent?: WComponent): void;
        hide(): void;
        close(): void;
        scroll(c: WComponent | JQuery, hmin?: number, over?: number): number;
        scrollY(y: number, hmin?: number, over?: number): number;
        protected beforeShow(): boolean;
        protected onShown(): void;
        protected onHidden(): void;
        protected render(): WContainer;
        componentWillUnmount(): void;
        protected buildTitle(title: string): string;
    }
}
