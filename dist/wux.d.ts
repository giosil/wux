/**
    WRAPPED USER EXPERIENCE - WUX
*/
declare class WuxDOM {
    static components: {
        [id: string]: WUX.WComponent;
    };
    private static renderHandlers;
    private static unmountHandlers;
    private static lastCtx;
    static onRender(handler: (e: WUX.WEvent) => any): void;
    static onUnmount(handler: (e: WUX.WEvent) => any): void;
    static getLastContext(): Element | null;
    static register(node?: WUX.WNode | null, c?: WUX.WComponent | 'delete'): WUX.WComponent | null;
    static render(component: WUX.WElement, node?: WUX.WNode | null, before?: (n?: WUX.WNode | null) => any, after?: (n?: WUX.WNode | null) => any): void;
    static mount(e?: WUX.WElement, node?: WUX.WNode | null): Element | null;
    static unmount(node?: WUX.WNode | null): Element | null;
    static replace(o?: WUX.WElement, e?: WUX.WElement): Element | null;
    static create(node: WUX.WNode, tag?: string, id?: string, cs?: string, st?: string, inner?: WUX.WNode, a?: any): Element | null;
    static mountjq(e: WUX.WElement, node: JQuery): JQuery;
    static unmountjq(node: JQuery): JQuery;
}
declare namespace WUX {
    type WElement = string | Element | WComponent;
    type WNode = string | Element;
    let debug: boolean;
    let registry: string[];
    const version = "2.0.0";
    /** Global settings */
    interface WGlobal {
        /** Locale setting */
        locale: string;
        /** Web app root path */
        rootPath: string;
        /** Global init function */
        init(callback: () => any): void;
        /** Shared data */
        setData(key: string, data: any, dontTrigger?: boolean): void;
        getData(key: string, def?: any): any;
        onDataChanged(key: string, callback: (data: any) => any): void;
    }
    /** Event interface */
    interface WEvent {
        component?: WComponent | null;
        element?: Element | null;
        target: any;
        type: string;
        data?: any;
    }
    /** WWrapper interface */
    interface WWrapper {
        id?: string;
        type?: string;
        classStyle?: string;
        style?: string | WStyle;
        attributes?: string;
        begin?: string;
        wrapper?: WWrapper;
        end?: string;
        title?: string;
        icon?: string;
        element?: Element;
    }
    /** WField interface */
    interface WField {
        id?: string;
        label?: string;
        classStyle?: string;
        style?: string | WStyle;
        attributes?: string;
        span?: number;
        value?: any;
        type?: string;
        key?: string;
        icon?: string;
        tooltip?: string;
        element?: WElement;
        labelCss?: string | WStyle;
        labelComp?: WComponent;
        colClass?: string;
        colStyle?: string | WStyle;
        component?: WComponent;
        required?: boolean;
        readonly?: boolean;
        autofocus?: boolean;
        enabled?: boolean;
        visible?: boolean;
        onbuild?: (e: Element, data: any) => void;
    }
    /** WEntity interface */
    interface WEntity {
        id: any;
        text?: string;
        code?: string;
        group?: any;
        type?: any;
        reference?: any;
        enabled?: boolean;
        marked?: boolean;
        date?: Date;
        notBefore?: Date;
        expires?: Date;
        icon?: string;
        color?: string;
        value?: number;
    }
    /** WAction interface */
    interface WAction {
        /** Action name */
        name: string;
        /** Reference */
        ref?: string;
        /** Reference number (index) */
        idx?: number;
        /** Reference object  */
        obj?: any;
        /** Tag element of action */
        tag?: string;
        /** Component */
        comp?: WComponent;
    }
    /** WISelectable interface */
    interface WISelectable extends WComponent {
        options: Array<string | WEntity>;
        select(i: number): this;
        setOptions(options: Array<string | WEntity>, prevVal?: boolean): this;
        findOption(text: string, d?: any): any;
        addOption(e: string | WEntity, sel?: boolean): this;
        remOption(e: string | WEntity): this;
        indexOption(e: string | WEntity): number;
    }
    /**
     * Base class of a WUX component.
     */
    class WComponent<P = any, S = any> {
        id?: string | null;
        name?: string;
        mounted: boolean;
        parent?: WComponent | null;
        debug: boolean;
        forceOnChange: boolean;
        data: any;
        cuid: number;
        rootTag: string;
        protected context?: Element | null;
        protected root?: Element | null;
        protected $r?: JQuery | null;
        protected internal?: WComponent;
        protected props?: P | null;
        protected state?: S | null;
        protected subSeq: number;
        protected dontTrigger: boolean;
        protected _visible: boolean;
        protected _enabled: boolean;
        protected _style?: string | null;
        protected _baseStyle?: string | null;
        protected _classStyle?: string | null;
        protected _baseClass?: string | null;
        protected _attributes?: string | null;
        protected _tooltip?: string | null;
        protected handlers: {
            [event: string]: ((e?: any) => any)[];
        };
        constructor(he?: Element);
        constructor(id?: string, name?: string, props?: P, classStyle?: string, style?: string | WStyle, attributes?: any);
        get visible(): boolean;
        set visible(b: boolean);
        get enabled(): boolean;
        set enabled(b: boolean);
        get style(): string | null | undefined;
        set style(s: string);
        get classStyle(): string | null | undefined;
        set classStyle(s: string);
        get attributes(): string | null | undefined;
        set attributes(s: string | null | undefined);
        get tooltip(): string | null | undefined;
        set tooltip(s: string | null | undefined);
        css(...items: (string | WStyle)[]): this;
        focus(): this;
        blur(): this;
        forceUpdate(callback?: () => any): this;
        getContext(): Element | null | undefined;
        getRoot(): Element | null | undefined;
        getState(): S | null | undefined;
        setState(nextState: S | null | undefined, force?: boolean, callback?: () => any): this;
        getProps(): P | null | undefined;
        setProps(nextProps: P, force?: boolean, callback?: () => any): this;
        on(events: 'mount' | 'unmount' | 'statechange' | 'propschange', handler: (e: WEvent) => any): this;
        on(events: 'click' | 'dblclick' | 'mouseenter' | 'mouseleave' | 'keypress' | 'keydown' | 'keyup' | 'submit' | 'change' | 'focus' | 'blur' | 'resize', handler: (e: Event) => any): this;
        on(events: string, handler: (e: any) => any): this;
        off(events?: 'mount' | 'unmount' | 'statechange' | 'propschange'): this;
        off(events?: 'click' | 'dblclick' | 'mouseenter' | 'mouseleave' | 'keypress' | 'keydown' | 'keyup' | 'submit' | 'change' | 'focus' | 'blur' | 'resize'): this;
        off(events?: string): this;
        trigger(event: 'mount' | 'unmount', data?: any): this;
        trigger(event: 'statechange', nextState?: S): this;
        trigger(event: 'propschange', nextProps?: P): this;
        trigger(event: 'click' | 'dblclick' | 'mouseenter' | 'mouseleave' | 'keypress' | 'keydown' | 'keyup' | 'blur' | 'submit' | 'change' | 'focus' | 'resize', ...extraParameters: any[]): this;
        trigger(event: string, ...extParams: any[]): this;
        unmount(): this;
        mount(context?: Element | null): this;
        componentWillUnmount(): void;
        protected componentWillMount(): void;
        protected render(): WElement | undefined;
        protected componentDidMount(): void;
        protected componentDidCatch(error: any, errorInfo: string): void;
        protected shouldComponentUpdate(nextProps: P | null | undefined, nextState: S | null | undefined): boolean;
        protected componentWillUpdate(nextProps: P | null | undefined, nextState: S | null | undefined): void;
        protected componentDidUpdate(prevProps: P | null | undefined, prevState: S | null | undefined): void;
        protected updateProps(nextProps: P | null | undefined): void;
        protected updateState(nextState: S | null | undefined): void;
        protected update(nextProps: P | null | undefined, nextState: S | null | undefined, propsChange: boolean, stateChange: boolean, force?: boolean, callback?: () => any): boolean;
        protected createEvent(type: string, data?: any): WEvent;
        protected shouldBuildRoot(): boolean;
        protected buildRoot(tagName?: string | null, inner?: string | null, baseAttribs?: any, classStyle?: string | null, style?: string | null, attributes?: any, id?: string | null): string | undefined;
        protected build(tagName?: string | null, inner?: string | null, baseAttribs?: any, classStyle?: string | null, style?: string | null, attributes?: any, id?: string | null): string;
        protected make(): string;
        subId(wc?: WComponent): string;
        subId(id?: string, s?: any): string;
        ripId(sid: string | null | undefined): string | null | undefined;
        transferTo(dest: WComponent, force?: boolean, callback?: () => any): boolean;
    }
    function getId(e: any): string | null | undefined;
    function firstSub(e: any, r?: boolean): string;
    function lastSub(e: any): string;
    function getComponent(id: string): WUX.WComponent | null;
    function getRootComponent(c: WUX.WComponent): WUX.WComponent;
    function setProps(id: string, p: any): WUX.WComponent | null;
    function getProps(id: string, d?: any): any;
    function setState(id: string, s: any): WUX.WComponent | null;
    function getState(id: string, d?: any): any;
    function newInstance(n: string): WUX.WComponent | null;
    function same(e1: WElement, e2: WElement): boolean;
    function match(i: any, o: string | WEntity): boolean;
    /**
     * Split content "before<>content<>after" -> ["before", "content", "after"]
     * As well " content " -> ["&nbsp;", "content", "&nbsp;"]
     *
     * @param s content
     */
    function divide(s?: string | null): [string, string, string];
    /**
     * Convert to string for log trace.
     *
     * @param a any
     */
    function str(a: any): string;
    function getTagName(c: any): string;
    interface WStyle {
        /** border */
        b?: string;
        /** border-collapse */
        bc?: 'separate' | 'collapse' | 'initial' | 'inherit' | 'unset';
        /** border-spacing */
        bsp?: string | number;
        /** border-radius */
        br?: string | number;
        /** box-shadow */
        bs?: string;
        /** box-sizing */
        bz?: 'content-box' | 'border-box';
        /** margin */
        m?: string | number;
        /** margin-top */
        mt?: string | number;
        /** margin-right */
        mr?: string | number;
        /** margin-bottom */
        mb?: string | number;
        /** margin-left */
        ml?: string | number;
        /** padding */
        p?: string | number;
        /** padding-top */
        pt?: string | number;
        /** padding-right */
        pr?: string | number;
        /** padding-bottom */
        pb?: string | number;
        /** padding-left */
        pl?: string | number;
        /** text-align */
        a?: 'left' | 'right' | 'center' | 'justify' | 'inherit';
        /** vertical-align */
        v?: string;
        /** display */
        d?: 'inline' | 'block' | 'flex' | 'inline-block' | 'inline-flex' | 'inline-table' | 'list-item' | 'run-in' | 'table' | 'table-caption' | 'table-column-group' | 'table-header-group' | 'table-footer-group' | 'table-row-group' | 'table-cell' | 'table-column' | 'table-row' | 'none' | 'initial' | 'inherit';
        /** z-index */
        z?: string | number;
        /** color */
        c?: string;
        /** background(-color) */
        bg?: string;
        /** background-image */
        bgi?: string;
        /** background-repeat */
        bgr?: 'repeat' | 'space' | 'round' | 'repeat-x' | 'repeat-y' | 'no-repeat' | 'initial' | 'inherit' | 'unset';
        /** background-position */
        bgp?: string;
        /** cursor */
        cr?: string;
        /** content */
        cn?: string;
        /** font(-size) */
        f?: string | number;
        /** font-style */
        fs?: 'normal' | 'italic' | 'oblique' | 'inherit';
        /** font-weight */
        fw?: 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'inherit';
        /** text-transform */
        tt?: 'capitalize' | 'uppercase' | 'lowercase' | 'none' | 'initial' | 'inherit';
        /** transform */
        tr?: string;
        /** float */
        fl?: 'left' | 'right' | 'none' | 'initial' | 'inherit';
        /** clear */
        cl?: 'left' | 'right' | 'both' | 'none' | 'initial' | 'inherit';
        /** overflow */
        o?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit';
        /** overflow-x */
        ox?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit';
        /** overflow-y */
        oy?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit';
        /** opacity */
        op?: number;
        /** outline */
        ol?: number;
        /** text(-decoration) */
        text?: string;
        /** -webkit -moz -o -ms */
        k?: string;
        /** line-height */
        lh?: string;
        /** position */
        ps?: 'absolute' | 'fixed' | 'inherit' | 'initial' | 'relative' | 'static' | 'sticky' | 'unset';
        /** left */
        l?: string | number;
        /** right */
        r?: string | number;
        /** top */
        t?: string | number;
        /** bottom */
        bt?: string | number;
        /** width */
        w?: string | number;
        /** height */
        h?: string | number;
        /** min-width */
        minw?: string | number;
        /** max-width */
        maxw?: string | number;
        /** min-height */
        minh?: string | number;
        /** max-height */
        maxh?: string | number;
        /** white-space */
        ws?: 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap' | 'initial' | 'inherit';
        /** style */
        s?: string;
        /** class name */
        n?: string;
    }
    function style(ws: string | WStyle | null | undefined): string;
    function styleObj(ws: string | WStyle | null): {
        [key: string]: string;
    };
    function toggleAttr(e: Element, a: string, b: boolean, v?: string): Element;
    function toggleStyle(s: string | WStyle | null, k: string, b?: boolean, v1?: string): string;
    function toggleStyle(s: string | WStyle | null, k: string, v0?: string, v1?: string): string;
    function css(...a: (string | WStyle | null | undefined)[]): string;
    function cls(...a: (string | WStyle | null | undefined)[]): string;
    function attributes(a: any): string;
    function buildCss(...a: (string | WStyle | null | undefined)[]): string;
    function addClass(css: string | null | undefined, name: string): string;
    function removeClass(css: string | null | undefined, name: string): string;
    function toggleClass(css: string | null | undefined, name: string): string;
    function addClassOf(e: Element, name: string): Element;
    function removeClassOf(e: Element, name: string): Element;
    function toggleClassOf(e: Element, name: string): Element;
    function toggleStyleOf(e: Element, k: string, b?: boolean, v1?: string): Element;
    function toggleStyleOf(e: Element, k: string, v0?: string, v1?: string): Element;
    function isVisible(e: Element): boolean;
    function slideToggle(e: Element, d?: number): Element;
    function slideUp(e: Element | null, d?: number): Element | null;
    function slideDown(e: Element | null, d?: number): Element | null;
    function setCss(e: WComponent | Element, ...a: (string | WStyle)[]): WComponent | Element;
    function buildIcon(icon?: string | null, before?: string | null, after?: string | null, size?: number | null, cls?: string | null, title?: string | null): string;
    function build(tagName: string | null, inner?: string | null, css?: string | WStyle | null, attr?: any, id?: string | null, cls?: string | null): string;
    function create(tagName: string, inner?: string, css?: string | WStyle, attr?: any, id?: string, cls?: string): Element | null;
    /**
     * Utilities
     */
    class WUtil {
        static toArray(a: any): any[];
        static toArrayNumber(a: any, nz?: boolean): number[];
        static toArrayString(a: any, ne?: boolean): string[];
        static splitNumbers(a: any, s: string): number[];
        static toObject<T>(a: any, d?: T): T | undefined;
        static toString(a: any, d?: string | null): string | null;
        static toText(a: any, d?: string): string | null;
        static toNumber(a: any, d?: number): number;
        static toInt(a: any, d?: number): number;
        static toIntTime(a: any, d?: number): number;
        static isNumeric(a: any): a is string | number;
        static checkEmail(e: any): string;
        static starts(a: any, s: string): boolean;
        static ends(a: any, s: string): boolean;
        static isEmpty(a: any): boolean;
        static toBoolean(a: any, d?: boolean): boolean;
        static toDate(a: any, d?: Date | null): Date | null | undefined;
        static getWeek(a?: any): number;
        static getParam(name: string, url?: string): string;
        static size(a: any): number;
        static get(o: any, k?: string): any;
        static is(t: "array" | "array0" | "arraynot0" | "bigint" | "boolean" | "date" | "empty" | "function" | "nan" | "notnull" | "null" | "number" | "object" | "string" | "symbol" | "undefined" | "value", o: any, k?: string): boolean;
        static setValue(a: any, k: string, v: any): any;
        static getValue(a: any, k: string, d?: any): any;
        static getItem(a: any, i: number, d?: any): any;
        static getFirst(a: any, d?: any): any;
        static getLast(a: any, d?: any): any;
        static getNumber(a: any, k: string, d?: number): number;
        static getInt(a: any, k: string, d?: number): number;
        static getString(a: any, k: string, d?: string, f?: string): string | null | undefined;
        static getText(a: any, k: string, d?: string): string | null;
        static getBoolean(a: any, k: string, d?: boolean): boolean;
        static getDate(a: any, k: string, d?: Date): Date | null | undefined;
        static getArray(a: any, k: string): any[];
        static getArrayNumber(a: any, k: string, nz?: boolean): number[];
        static getArrayString(a: any, k: string, ne?: boolean): string[];
        static getObject<T>(a: any, k: string, n?: boolean): T | null | undefined;
        static sort(a: any, t?: boolean, k?: string): any[];
        static find(a: any, k: any, v: any): any;
        static indexOf(a: any, k: any, v: any): number;
        static indexOption(o: Array<string | WEntity>, e: string | WEntity): number;
        static isSameDate(a: Date, b: Date): boolean;
        static indexOfDate(a: Date[], v: Date): number;
        static round2(a: any): number;
        static floor2(a: any): number;
        static ceil2(a: any): number;
        static compare2(a: any, b: any): number;
        static compare5(a: any, b: any): number;
        static getCurrDate(d?: number, m?: number, y?: number, f?: boolean, l?: boolean): Date;
        static calcDate(r: Date, d?: number, m?: number, y?: number, f?: boolean, l?: boolean): Date;
        static timestamp(dt?: any): string;
        static nvl(...v: any[]): any;
        static eqValues(o1: any, o2: any, ...keys: any[]): boolean;
        static col(tuples: any[], i: number, d?: any): any[];
        static getSortedKeys(map: object): any[];
        static diffMinutes(ah: any, al: any): number;
        static diffHours(ah: any, al: any): number;
        static diffDays(ah: any, al: any): number;
        /**
         * Replace scalar value field with object value. Es.
         *
         * o = { "person": 1 }
         * a = [ {"id": 1, "name": "John"}, {"id": 2, "name": "Jack"} ]
         *
         * rplObj(o, 'person', 'id', a)
         *
         * o = { "person": {"id": 1, "name": "John"} }
         */
        static rplObj(o: any, f: string, k: string, a: any): any;
        /**
         * Replace object field with scalar value. Es.
         *
         * o = { "person": {"id": 1, name: "John"} }
         *
         * rplVal(o, 'person', 'id')
         *
         * o = { "person": 1 }
         */
        static rplVal(o: any, f: string, k: string): any;
        static map(src: any, dst: any, ks: string[], kd: string[], t?: string[], d?: any[]): any;
    }
}
declare namespace WUX {
    /** Internal init */
    let init0: (callback: () => any) => any;
    /** App init */
    let initApp: (callback: () => any) => any;
    let global: WGlobal;
    class CSS {
        static ROW: string;
        static COL: string;
        static SEC_DIV_CLASS: string;
        static SEC_DIV_STYLE: string;
        static SEC_TAG: string;
        static SEC_CLASS: string;
        static SEC_STYLE: string;
        static SEC_PARENT: string;
        static BOX_TAG: string;
        static BOX_CLASS: string;
        static BOX_INNER: string;
        static BOX_ICON: string;
        static BOX_TITLE: string;
        static BOX_TITLE_TAG: string;
        static BOX_TITLE_CLASS: string;
        static BOX_TITLE_STYLE: string;
        static BOX_TOOLS_EXT: string;
        static BOX_TOOLS: string;
        static BOX_TOOLS_POS: number;
        static BOX_CONTENT: string;
        static BOX_FOOTER: string;
        static BOX_CLP_CLASS: string;
        static BOX_CLP_STYLE: string;
        static BOX_CLP: string;
        static BOX_EXP: string;
        static FORM: string;
        static FORM_GROUP: string;
        static FORM_CTRL: string;
        static FORM_CHECK: string;
        static LBL_CLASS: string;
        static SEL_WRAPPER: string;
        static RADIO_STYLE: string;
        static CKDIV_STYLE: string;
        static CKBOX_STYLE: string;
        static LEVER_CLASS: string;
        static LEVER_STYLE: string;
        static DIALOG_CLASS: string;
        static DIALOG_MAIN: string;
        static DIALOG_FULL: string;
        static DIALOG_CONTENT: string;
        static DIALOG_BODY: string;
        static DIALOG_HEADER: string;
        static DIALOG_FOOTER: string;
        static DIALOG_TITLE: string;
        static DIALOG_TITLE_TAG: string;
        static DIALOG_OK: string;
        static DIALOG_CANCEL: string;
        static DIALOG_X_POS: number;
        static ICON: string;
        static SEL_ROW: string;
        static PRIMARY: WStyle;
        static SECONDARY: WStyle;
        static SUCCESS: WStyle;
        static DANGER: WStyle;
        static ERROR: WStyle;
        static WARNING: WStyle;
        static INFO: WStyle;
        static LABEL_NOTICE: WStyle;
        static LABEL_INFO: WStyle;
    }
    class RES {
        static OK: string;
        static CLOSE: string;
        static CANCEL: string;
        static REQ_MARK: string;
    }
    function formatDate(a: any): string;
    function isoDate(a: any): string;
    function formatDateTime(a: any, withSec?: boolean): string;
    function formatTime(a: any, withSec?: boolean): string;
    /**
     * Formatta numero alla 2a cifra decimale SENZA separatore migliaia.
     */
    function formatNum2(a: any, nz?: string, z?: string, neg?: string): string;
    /**
     * Formatta numero di default SENZA separatore migliaia. Specificare 'l' per la rappresentazione locale.
     */
    function formatNum(a: any, nz?: string, z?: string, neg?: string): string;
    /**
     * Formatta numero alla 2a cifra decimale CON separatore migliaia e riportando SEMPRE le cifre decimali.
     */
    function formatCurr(a: any, nz?: string, z?: string, neg?: string): string;
    /**
     * Formatta numero alla 5a cifra decimale CON separatore migliaia e riportando SEMPRE le cifre decimali (massimo 2).
     */
    function formatCurr5(a: any, nz?: string, z?: string, neg?: string): string;
    function formatBoolean(a: any): string;
    function format(a: any): string;
    function saveFile(base64: string, fileName: string, mimeType?: string): void;
    function viewFile(base64: string, fileName: string, mimeType?: string): void;
    function getAction(ie?: string | Event | null, c?: WUX.WComponent, tag?: string): WAction | null;
    function action(name: string, ref?: string | number, ele?: string, comp?: WUX.WComponent, inner?: string, cls?: string): string;
}
declare namespace WUX {
    let formWillMount: (c: WForm) => any;
    class Wrapp extends WComponent<WElement, any> {
        isText?: boolean;
        constructor(props: WElement, tag?: string, id?: string, classStyle?: string, style?: string | WStyle, attributes?: any);
        protected render(): WElement;
        protected componentDidMount(): void;
    }
    class WContainer extends WComponent<string, any> {
        cbef: WComponent[];
        ashe: string[];
        cbgr: WComponent[];
        comp: WComponent[];
        sr_c: string[];
        grid: string[][];
        _end: boolean;
        cagr: WComponent[];
        asta: string[];
        caft: WComponent[];
        constructor(id?: string | null, classStyle?: string, style?: string | WStyle, attributes?: any, inline?: boolean, type?: string);
        addRow(classStyle?: string, style?: string | WStyle): this;
        addCol(classStyle?: string, style?: string | WStyle): this;
        head(...items: string[]): this;
        tail(...items: string[]): this;
        before(...items: WElement[]): this;
        after(...items: WElement[]): this;
        add(e: WElement | null | undefined): this;
        addGroup(w: WWrapper, ...ac: (WElement | null | undefined)[]): this;
        addLine(style: string | WStyle, ...ac: WElement[]): this;
        addStack(style: string | WStyle, ...ac: WElement[]): this;
        addContainer(c: WUX.WContainer): WContainer;
        addContainer(w: WWrapper): WContainer;
        addContainer(i: string, classStyle?: string | null, style?: string | null, attributes?: string | null, inline?: boolean, type?: string): WContainer;
        end(): WContainer;
        section(title: string, secStyle?: string | WStyle, legStyle?: string | WStyle, ids?: string): this;
        addBox(title?: string, classStyle?: string, style?: string | WStyle, id?: string, attributes?: any): WBox;
        protected componentWillMount(): void;
        protected render(): WElement;
        protected componentDidMount(): void;
        protected _mount(x?: Element | null, r?: Element | null): void;
        componentWillUnmount(): void;
        getElement(r: number, c?: number): HTMLElement | null;
    }
    /**
     * Box container
     *   inner
     *     title
     *       caption
     *       tools
     *         collapse [ addCollapse(h: (e?: WUX.WEvent) => any) ]
     *       tools-ext [ addTool(c: WUX.WComponent) ]
     *     content
     *     footer
     */
    class WBox extends WContainer {
        _title?: string;
        footer?: string;
        tools: WComponent[];
        collapsed?: boolean;
        _ce?: boolean;
        _ch?: ((e?: WEvent) => any) | null;
        constructor(id?: string, title?: string, classStyle?: string, style?: string | WStyle, attributes?: any);
        get title(): string | undefined;
        set title(s: string);
        addTool(c: WComponent): this;
        addCollapse(h?: (e?: WEvent) => any): this;
        offCollapse(ce?: boolean): this;
        endBox(): WContainer;
        end(): WContainer;
        collapse(h?: ((e?: WEvent) => any) | null): this;
        expand(h?: ((e?: WEvent) => any) | null): this;
        toggle(h?: (e?: WEvent) => any): this;
        protected render(): WElement;
        protected componentDidMount(): void;
        componentWillUnmount(): void;
    }
    class WPages extends WComponent<any, number> {
        components: WComponent[];
        cbef?: WUX.WComponent;
        caft?: WUX.WComponent;
        hs: number[];
        constructor(id?: string, classStyle?: string, style?: string | WStyle, attributes?: any, props?: any);
        get pages(): number;
        add(c: WComponent): this;
        addContainer(cid?: string, cls?: string, style?: string, attributes?: string | null, inline?: boolean, type?: string): WContainer;
        before(c: WComponent): this;
        after(c: WComponent): this;
        first(): this;
        last(): this;
        back(): this;
        next(): boolean;
        prev(): boolean;
        show(p: number, before?: (c: WComponent) => any, after?: (c: WComponent) => any, t?: number): WComponent | null;
        curr(): WComponent | null;
        protected render(): WElement;
        protected updateState(nextState: number): void;
        protected componentDidMount(): void;
        componentWillUnmount(): void;
    }
    class WLink extends WComponent<string, string> {
        _href?: string;
        _target?: string;
        lock?: boolean;
        constructor(id?: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: any, href?: string, target?: string);
        get icon(): string | null | undefined;
        set icon(s: string);
        get href(): string | undefined;
        set href(s: string);
        get target(): string | undefined;
        set target(s: string);
        protected render(): WElement;
        setState(nextState: string, force?: boolean, callback?: () => any): this;
        protected componentWillUpdate(nextProps: any, nextState: any): void;
    }
    class WLabel extends WComponent<string, string> {
        forId?: string | null;
        constructor(id?: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: any);
        get icon(): string | null | undefined;
        set icon(i: string);
        protected updateState(nextState: string | null | undefined): void;
        for(e: WElement): this;
        protected render(): WElement | undefined;
        protected componentDidMount(): void;
    }
    class WInput extends WComponent<string, string> {
        size?: number;
        label?: string;
        placeHolder?: string;
        _ro?: boolean;
        _af?: boolean;
        constructor(id?: string, type?: string, size?: number, classStyle?: string, style?: string | WStyle, attributes?: any);
        get readonly(): boolean | undefined;
        set readonly(v: boolean);
        get autofocus(): boolean | undefined;
        set autofocus(v: boolean);
        onEnter(h: (e: KeyboardEvent) => any): this;
        protected shouldComponentUpdate(nextProps: string, nextState: string): boolean;
        protected updateState(nextState: string | null): void;
        getState(): string | null | undefined;
        protected render(): WElement;
        protected componentDidMount(): void;
    }
    class WTextArea extends WComponent<number, string> {
        _ro?: boolean;
        _af?: boolean;
        constructor(id?: string, rows?: number, classStyle?: string, style?: string | WStyle, attributes?: any);
        get readonly(): boolean | undefined;
        set readonly(v: boolean);
        get autofocus(): boolean | undefined;
        set autofocus(v: boolean);
        protected updateState(nextState: string): void;
        getState(): string | null | undefined;
        protected render(): WElement;
        protected componentDidMount(): void;
    }
    class WButton extends WComponent<string, string> {
        readonly type: string;
        lock?: boolean;
        constructor(id?: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: any, type?: string);
        get icon(): string | null | undefined;
        set icon(i: string);
        setText(text?: string | null, icon?: string): void;
        setState(nextState: string | null | undefined, force?: boolean, callback?: () => any): this;
        protected render(): WElement;
        protected componentDidMount(): void;
        protected componentWillUpdate(nextProps: any, nextState: any): void;
    }
    class WCheck extends WComponent<boolean, any> {
        divClass?: string;
        divStyle?: string;
        label?: string;
        value: any;
        noval: any;
        text?: string | null;
        lever?: boolean;
        leverStyle: string;
        constructor(id?: string, text?: string | null, value?: any, checked?: boolean, classStyle?: string, style?: string | WStyle, attributes?: any);
        get checked(): boolean | null | undefined;
        set checked(b: boolean);
        set tooltip(s: string);
        getState(): any;
        protected updateProps(nextProps: boolean): void;
        protected updateState(nextState: any): void;
        protected render(): WElement;
        protected componentDidMount(): void;
    }
    class WRadio extends WComponent<string, any> implements WISelectable {
        options: Array<string | WEntity>;
        label?: string;
        classDiv: string;
        styleDiv?: string;
        constructor(id?: string, options?: Array<string | WEntity>, classStyle?: string, style?: string | WStyle, attributes?: any, props?: any);
        get enabled(): boolean;
        set enabled(b: boolean);
        set tooltip(s: string);
        select(i: number): this;
        getProps(): string | null;
        findOption(text: string, d?: any): any;
        setOptions(options: Array<string | WEntity>, prevVal?: boolean): this;
        addOption(e: string | WEntity, sel?: boolean): this;
        remOption(e: string | WEntity): this;
        indexOption(e: string | WEntity): number;
        protected updateState(nextState: any): void;
        protected render(): WElement;
        protected componentDidMount(): void;
        protected componentDidUpdate(prevProps: any, prevState: any): void;
        protected buildOptions(): string;
    }
    class WSelect extends WComponent implements WISelectable {
        options: Array<string | WEntity>;
        multiple?: boolean;
        constructor(id?: string, options?: Array<string | WEntity>, multiple?: boolean, classStyle?: string, style?: string | WStyle, attributes?: any);
        getProps(): any;
        findOption(text: string, d?: any): any;
        select(i: number): this;
        addOption(e: string | WEntity, sel?: boolean): this;
        remOption(e: string | WEntity): this;
        indexOption(e: string | WEntity): number;
        setOptions(options: Array<string | WEntity>, prevVal?: boolean): this;
        protected updateState(nextState: any): void;
        protected render(): WElement | undefined;
        protected componentDidMount(): void;
        protected buildOptions(): string;
    }
    class WTable extends WComponent<any, any[]> {
        header: string[];
        keys: any[];
        types?: string[];
        widths: number[];
        widthsPerc?: boolean;
        hideHeader?: boolean;
        div?: string;
        colStyle?: string | WStyle;
        rowStyle?: string | WStyle;
        headStyle?: string | WStyle;
        footerStyle?: string | WStyle;
        /** First col style */
        col0Style?: string | WStyle;
        /** Last col style */
        colLStyle?: string | WStyle;
        sortable?: number[];
        soId?: string[];
        sortBy?: number[];
        reqSort: number;
        prvSort: number;
        selClass: string;
        selectionMode?: 'single' | 'multiple' | 'none';
        selectedRow: number;
        paging: boolean;
        plen: number;
        page: number;
        rows: number;
        constructor(id: string, header: string[], keys?: any[], classStyle?: string, style?: string | WStyle, attributes?: any, props?: any);
        onSelectionChanged(handler: (e: {
            element?: Element;
            selectedRowsData?: any[];
        }) => any): void;
        onDoubleClick(handler: (e: {
            element?: Element;
            rowElement?: Element;
            data?: any;
            rowIndex?: number;
        }) => any): void;
        onRowPrepared(handler: (e: {
            element?: Element;
            rowElement?: Element;
            data?: any;
            rowIndex?: number;
        }) => any): void;
        clearSelection(): this;
        select(idxs: number[]): this;
        selectAll(toggle?: boolean): this;
        getSelectedRows(): number[];
        getSelectedRowsData(): any[];
        protected render(): WElement;
        protected componentDidMount(): void;
        protected componentDidUpdate(prevProps: any, prevState: any): void;
        protected updSort(): void;
        protected getType(i: number): string;
        protected buildBody(): void;
        onSort(h: (e: WEvent) => any): void;
    }
    class WForm extends WComponent<WField[][], any> {
        title?: string;
        fieldset?: Element;
        rows?: WField[][];
        roww?: WWrapper[];
        currRow?: WField[] | null;
        main?: WContainer;
        foot?: WContainer;
        footer?: WElement[];
        footerClass?: string;
        footerStyle?: string | WStyle;
        captions?: WComponent[];
        mainClass?: string;
        mainStyle?: string | WStyle;
        groupStyle?: string | WStyle;
        tips?: {
            [fid: string]: string;
        };
        leg?: Element | null;
        constructor(id?: string, title?: string, action?: string);
        get enabled(): boolean;
        set enabled(b: boolean);
        init(): this;
        legend(inner: string, cls?: string, css?: string | WStyle, attr?: any): this;
        onEnter(h: (e: KeyboardEvent) => any): this;
        onFocus(fid: string, h: (e: FocusEvent) => any): this;
        onBlur(fid: string, h: (e: FocusEvent) => any): this;
        focus(): this;
        first(enabled?: boolean): WField | null;
        focusOn(fid: string): this;
        getField(fid: string): WField | null;
        getComponent(fid: string, def?: WComponent): WComponent | undefined;
        onField(fid: string, events: 'mount' | 'unmount' | 'statechange' | 'propschange', handler: (e: WEvent) => any): this;
        onField(fid: string, events: 'click' | 'dblclick' | 'mouseenter' | 'mouseleave' | 'keypress' | 'keydown' | 'keyup' | 'submit' | 'change' | 'focus' | 'blur' | 'resize', handler: (e: Event) => any): this;
        onField(fid: string, events: string, handler: (e: any) => any): this;
        setOptions(fid: string, options: Array<string | WEntity>, prevVal?: boolean): this;
        findOption(fid: string, text: string, d?: any): any;
        indexOption(fid: string, e: string | WEntity): number;
        addOption(fid: string, e: string | WEntity, sel?: boolean): this;
        remOption(fid: string, e: string | WEntity): this;
        setOptionValue(fid: string, text: string, d?: any): this;
        addRow(classStyle?: string, style?: string | WStyle, id?: string, attributes?: any, type?: string): this;
        protected _add(id: string, label: string, co: WComponent, type: string, opts?: WField): this;
        addTextField(fid: string, label: string, opts?: WField | boolean): this;
        addNumberField(fid: string, label: string, min?: number, max?: number, opts?: WField): this;
        addPasswordField(fid: string, label: string, opts?: WField): this;
        addDateField(fid: string, label: string, opts?: WField): this;
        addMonthField(fid: string, label: string, opts?: WField): this;
        addTimeField(fid: string, label: string, opts?: WField): this;
        addEmailField(fid: string, label: string, opts?: WField): this;
        addNoteField(fid: string, label: string, rows: number, opts?: WField): this;
        addFileField(fid: string, label: string, opts?: WField): this;
        addOptionsField(fid: string, label: string, options?: (string | WEntity)[], opts?: WField): this;
        addRadioField(fid: string, label: string, options?: (string | WEntity)[], opts?: WField): this;
        addBooleanField(fid: string, label: string, labelCheck?: string, opts?: WField): this;
        addBooleanField(fid: string, label: string, values?: any[], opts?: WField): this;
        addToggleField(fid: string, label: string, labelCheck?: string, opts?: WField): this;
        addToggleField(fid: string, label: string, values?: any[], opts?: WField): this;
        addBlankField(label?: string, classStyle?: string, style?: string | WStyle, e?: WElement): this;
        addCaption(text: string, icon?: string, classStyle?: string, style?: string | WStyle, opts?: WField): this;
        addHiddenField(fid: string, value?: any): this;
        addInternalField(fid: string, value?: any): this;
        addComponent(fid: string, label: string, component: WComponent, opts?: WField): this;
        section(title: string, secStyle?: string | WStyle, legStyle?: string | WStyle, ids?: string): this;
        setTooltip(fid: string, text: string): this;
        setLabelCss(fid: string, css: string | WStyle): this;
        setLabelText(fid: string, t: string): this;
        addToFooter(c: WElement): this;
        componentWillMount(): void;
        componentDidMount(): void;
        componentWillUnmount(): void;
        clear(): this;
        setValue(fid: string, v: any, updState?: boolean, cbNoOpt?: (cmp: WComponent, val: any) => any): this;
        setValueOf(fid: string, v: any, k: string, updState?: boolean, cbNoOpt?: (cmp: WComponent, val: any) => any): this;
        getValue(fid: string | WField): any;
        notBlank(...fids: string[]): number;
        isBlank(...fids: string[]): boolean;
        getFile(fid: string, onload: (f: File, b64: string) => any): File | null;
        getFile(fid: string, x: number, onload: (f: File, b64: string) => any): File | null;
        setSpan(fid: string, span: number): this;
        setEnabled(fid: string, v: boolean): this;
        setReadOnly(fid: string, v: boolean): this;
        getValues(ts?: boolean): any;
        getState(): any;
        protected updateState(nextState: any): void;
        protected updateView(): void;
        setMandatory(...fids: string[]): this;
        checkMandatory(labels?: boolean, focus?: boolean, atLeastOne?: boolean): string;
    }
}
declare namespace WUX {
    let BS_VER: number;
    let BS_DLG_X: string | WWrapper;
    function JQ(e: any): JQuery | null;
    function setJQCss(e: WComponent | JQuery, ...a: (string | WStyle)[]): WComponent | JQuery;
    class WDialog<P = any, S = any> extends WUX.WComponent<P, S> {
        cntRoot?: WUX.WContainer;
        cntMain?: WUX.WContainer;
        cntContent?: WUX.WContainer;
        cntHeader?: WUX.WContainer;
        cntBody?: WUX.WContainer;
        cntFooter?: WUX.WContainer;
        mainClass?: string;
        contClass?: string;
        contStyle?: string;
        bodyClass?: string;
        _title?: string;
        tagTitle?: string;
        btnClose?: WUX.WButton;
        btnOK?: WUX.WButton;
        btnCancel?: WUX.WButton;
        txtCancel?: string;
        buttons: WUX.WButton[];
        ok: boolean;
        cancel: boolean;
        isShown: boolean;
        fullscreen?: boolean;
        ph?: ((e?: JQueryEventObject) => any) | null;
        sh?: ((e?: JQueryEventObject) => any) | null;
        hh?: ((e?: JQueryEventObject) => any) | null;
        wp?: WPages;
        pg: number;
        constructor(id: string, name?: string, btnOk?: boolean, btnClose?: boolean, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object);
        addToPages(wp: WPages, headVis?: boolean, footVis?: boolean, headStyle?: string | WStyle, footStyle?: string | WStyle, btnStyle?: string | WStyle): this;
        makeUp(title: string, body: string | WUX.WComponent, onHidden?: (e?: JQueryEventObject) => any): this;
        onShownModal(handler: (e?: JQueryEventObject) => any): this;
        onHiddenModal(handler: (e?: JQueryEventObject) => any): this;
        get header(): WUX.WContainer;
        get body(): WUX.WContainer;
        get footer(): WUX.WContainer;
        get title(): string | undefined;
        set title(s: string);
        protected onClickOk(): boolean;
        protected onClickCancel(): boolean;
        protected buildBtnOK(): WUX.WButton;
        protected buildBtnCancel(): WUX.WButton;
        fireOk(): void;
        fireCancel(): void;
        doOk(): void;
        doCancel(): void;
        buttonOk(): WUX.WButton | undefined;
        buttonCancel(): WUX.WButton | undefined;
        updButtons(ok?: string, canc?: string): this;
        show(parent?: WUX.WComponent, handler?: (e?: JQueryEventObject) => any): void;
        hide(): void;
        close(): void;
        protected beforeShow(): boolean;
        protected onShown(): void;
        protected onHidden(): void;
        protected render(): WContainer;
        protected componentDidMount(): void;
        protected _s(e?: JQueryEventObject): void;
        protected _h(e?: JQueryEventObject): void;
        componentWillUnmount(): void;
        protected buildTitle(): string;
    }
    class WTab extends WComponent<any, number> {
        tabs: WContainer[];
        contStyle?: string | WStyle;
        ulClass?: string;
        tpClass?: string;
        saClass?: string;
        _t: string;
        _a: string;
        _r: string;
        constructor(id?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, props?: any);
        addTab(title: string, icon?: string, style?: string | WStyle, attributes?: string | null): WContainer;
        get count(): number;
        isEnabled(i: number): boolean;
        setEnabled(i: number, e: boolean): this;
        protected render(): string;
        protected componentDidUpdate(prevProps: any, prevState: any): void;
        protected componentDidMount(): void;
        componentWillUnmount(): void;
    }
}
