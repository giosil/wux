declare interface JQuery {
    wuxComponent(createIfNotExists?: boolean): WUX.WComponent;
    wuxComponent(component?: WUX.WComponent): WUX.WComponent;
}
declare class WuxDOM {
    private static onRenderHandlers;
    static onRender(handler: (e: WUX.WEvent) => any): void;
    private static onUnmountHandlers;
    static onUnmount(handler: (e: WUX.WEvent) => any): void;
    private static lastCtx;
    static render(component: WUX.WElement, node?: WUX.WNode, before?: (n?: WUX.WNode) => any, after?: (n?: WUX.WNode) => any): void;
    static mount(e: WUX.WElement, node?: WUX.WNode): JQuery;
    static unmount(node?: WUX.WNode): JQuery;
    static replace(o: WUX.WElement, e?: WUX.WElement): JQuery;
}
declare namespace WUX {
    type WElement = string | JQuery | WComponent;
    type WNode = string | JQuery;
    let debug: boolean;
    let registry: string[];
    const version = "1.0.0";
    interface WGlobal {
        locale: string;
        main_class: string;
        con_class: string;
        box_class: string;
        box_header: string;
        box_title: string;
        box_content: string;
        box_tools: string;
        box_footer: string;
        chart_bg0: string;
        chart_bg1: string;
        chart_bg2: string;
        chart_bc0: string;
        chart_bc1: string;
        chart_bc2: string;
        chart_p0: string;
        chart_p1: string;
        chart_p2: string;
        area: string | WStyle;
        area_title: string | WStyle;
        section: string | WStyle;
        section_title: string | WStyle;
        window_top: string | WStyle;
        window_bottom: string | WStyle;
        init(callback: () => any): any;
        setData(key: string, data: any, dontTrigger?: boolean): void;
        getData(key: string, def?: any): any;
        onDataChanged(key: string, callback: (data: any) => any): any;
    }
    interface WEvent {
        component: WComponent;
        element: JQuery;
        target: any;
        type: string;
        data?: any;
    }
    class WComponent<P = any, S = any> {
        id: string;
        name: string;
        mounted: boolean;
        parent: WComponent;
        debug: boolean;
        forceOnChange: boolean;
        data: any;
        cuid: number;
        rootTag: string;
        protected context: JQuery;
        protected root: JQuery;
        protected internal: WComponent;
        protected props: P;
        protected state: S;
        protected subSeq: number;
        protected dontTrigger: boolean;
        protected _visible: boolean;
        protected _enabled: boolean;
        protected _style: string;
        protected _baseStyle: string;
        protected _classStyle: string;
        protected _baseClass: string;
        protected _attributes: string;
        protected _tooltip: string;
        protected handlers: {
            [event: string]: ((e?: any) => any)[];
        };
        constructor(jq?: JQuery);
        constructor(id?: string, name?: string, props?: P, classStyle?: string, style?: string | WStyle, attributes?: string | object);
        get visible(): boolean;
        set visible(b: boolean);
        get enabled(): boolean;
        set enabled(b: boolean);
        get style(): string;
        set style(s: string);
        get classStyle(): string;
        set classStyle(s: string);
        get attributes(): string;
        set attributes(s: string);
        get tooltip(): string;
        set tooltip(s: string);
        css(...items: (string | WStyle)[]): this;
        focus(): this;
        blur(): this;
        forceUpdate(callback?: () => any): this;
        getContext(): JQuery;
        getRoot(): JQuery;
        getState(): S;
        setState(nextState: S, force?: boolean, callback?: () => any): this;
        getProps(): P;
        setProps(nextProps: P, force?: boolean, callback?: () => any): this;
        on(events: 'mount' | 'unmount' | 'statechange' | 'propschange', handler: (e: WEvent) => any): this;
        on(events: 'click' | 'dblclick' | 'mouseenter' | 'mouseleave' | 'keypress' | 'keydown' | 'keyup' | 'submit' | 'change' | 'focus' | 'blur' | 'resize', handler: (e: JQueryEventObject) => any): this;
        on(events: string, handler: (e: any) => any): this;
        off(events?: 'mount' | 'unmount' | 'statechange' | 'propschange'): this;
        off(events?: 'click' | 'dblclick' | 'mouseenter' | 'mouseleave' | 'keypress' | 'keydown' | 'keyup' | 'submit' | 'change' | 'focus' | 'blur' | 'resize'): this;
        off(events?: string): this;
        trigger(eventType: 'mount' | 'unmount', data?: any): this;
        trigger(eventType: 'statechange', nextState?: S): this;
        trigger(eventType: 'propschange', nextProps?: P): this;
        trigger(eventType: 'click' | 'dblclick' | 'mouseenter' | 'mouseleave' | 'keypress' | 'keydown' | 'keyup' | 'blur' | 'submit' | 'change' | 'focus' | 'resize', ...extraParameters: any[]): this;
        trigger(eventType: string, ...extParams: any[]): this;
        unmount(): this;
        mount(context?: JQuery): this;
        componentWillUnmount(): void;
        protected componentWillMount(): void;
        protected render(): any;
        protected componentDidMount(): void;
        protected componentDidCatch?(error: Error, errorInfo: string): void;
        protected shouldComponentUpdate(nextProps: P, nextState: S): boolean;
        protected componentWillUpdate(nextProps: P, nextState: S): void;
        protected componentDidUpdate(prevProps: P, prevState: S): void;
        protected updateProps(nextProps: P): void;
        protected updateState(nextState: S): void;
        protected update(nextProps: P, nextState: S, propsChange: boolean, stateChange: boolean, force?: boolean, callback?: () => any): boolean;
        protected createEvent(type: string, data?: any): WEvent;
        protected shouldBuildRoot(): boolean;
        protected buildRoot(tagName?: string, inner?: string, baseAttribs?: string | object, classStyle?: string, style?: string, attributes?: string | object, id?: string): string;
        protected build(tagName?: string, inner?: string, baseAttribs?: string | object, classStyle?: string, style?: string, attributes?: string | object, id?: string): string;
        protected make(): string;
        subId(wc?: WComponent): string;
        subId(id?: string, s?: any): string;
        ripId(sid: string): string;
        transferTo(dest: WComponent, force?: boolean, callback?: () => any): boolean;
    }
    interface WLayoutManager {
        mapConstraints: {
            [componentId: string]: string;
        };
        mapComponents: {
            [constraints: string]: WElement;
        };
        addLayoutComponent(component: WElement, constraints?: string): void;
        removeLayoutComponent(component: WElement): void;
        layoutContainer(container: WContainer, root: JQuery): void;
    }
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
        icon?: WIcon | string;
        color?: string;
        value?: number;
    }
    enum WInputType {
        Text = "text",
        Number = "number",
        Password = "password",
        CheckBox = "checkbox",
        Radio = "radio",
        Date = "date",
        DateTime = "datetime",
        Time = "time",
        File = "file",
        Image = "image",
        Color = "color",
        Email = "email",
        Url = "url",
        Month = "month",
        Week = "week",
        Search = "search",
        Hidden = "hidden",
        Note = "note",
        Select = "select",
        Static = "static",
        Component = "component",
        Blank = "blank",
        Link = "link",
        Integer = "integer",
        TreeSelect = "tree"
    }
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
        element?: JQuery;
    }
    interface WField {
        id: string;
        type?: WInputType;
        label?: string;
        labelCss?: string | WStyle;
        icon?: string | WUX.WIcon;
        placeholder?: string;
        span?: number;
        classStyle?: string;
        style?: string | WStyle;
        attributes?: string;
        options?: (string | WEntity)[];
        key?: string;
        value?: any;
        valueType?: string;
        minValue?: any;
        maxValue?: any;
        size?: number;
        component?: WComponent;
        element?: JQuery;
        wrapper?: WWrapper;
        build?: (container: JQuery, data: any) => void;
        required?: boolean;
        readonly?: boolean;
        enabled?: boolean;
        visible?: boolean;
        onmount?: (f: WField) => any;
        onfocus?: (e: JQueryEventObject) => any;
        onblur?: (e: JQueryEventObject) => any;
    }
    interface WISelectable extends WComponent {
        options: Array<string | WEntity>;
        select(i: number): this;
    }
    class WUtil {
        static toArrayComponent(a: any): WComponent[];
        static hasComponents(a: any): boolean;
        static toArray(a: any): any[];
        static toArrayNumber(a: any, nz?: boolean): number[];
        static toArrayString(a: any, ne?: boolean): string[];
        static splitNumbers(a: any, s: string): number[];
        static toObject<T>(a: any, d?: T): T;
        static toString(a: any, d?: string): string;
        static toText(a: any, d?: string): string;
        static toNumber(a: any, d?: number): number;
        static toInt(a: any, d?: number): number;
        static toIntTime(a: any, d?: number): number;
        static isNumeric(a: any): a is string | number;
        static checkEmail(e: any): string;
        static starts(a: any, s: string): boolean;
        static ends(a: any, s: string): boolean;
        static isEmpty(a: any): boolean;
        static toBoolean(a: any, d?: boolean): boolean;
        static toDate(a: any, d?: Date): Date;
        static getWeek(a?: any): number;
        static getParam(name: string, url?: string): string;
        static size(a: any): number;
        static setValue(a: any, k: string, v: any): any;
        static getValue(a: any, k: string, d?: any): any;
        static getItem(a: any, i: number, d?: any): any;
        static getEntity(a: any, ...k: string[]): WEntity;
        static toEntity(a: any, m: {
            id?: string;
            text?: string;
            code?: string;
            group?: string;
            type?: string;
            reference?: string;
            enabled?: string;
            marked?: string;
            date?: string;
            notBefore?: string;
            expires?: string;
            icon?: string;
            color?: string;
            value?: string;
        }): WEntity;
        static getFirst(a: any, d?: any): any;
        static getLast(a: any, d?: any): any;
        static toCode(a: any, d?: any): any;
        static toDesc(a: any, d?: string): string;
        static getNumber(a: any, k: string, d?: number): number;
        static getInt(a: any, k: string, d?: number): number;
        static getString(a: any, k: string, d?: string, f?: string): string;
        static getText(a: any, k: string, d?: string): string;
        static getBoolean(a: any, k: string, d?: boolean): boolean;
        static getDate(a: any, k: string, d?: Date): Date;
        static getArray(a: any, k: string): any[];
        static getArrayNumber(a: any, k: string, nz?: boolean): number[];
        static getArrayString(a: any, k: string, ne?: boolean): string[];
        static getCode(a: any, k: string, d?: string): any;
        static getDesc(a: any, k: string, d?: string): string;
        static getObject<T>(a: any, k: string, n?: boolean): T;
        static sort(a: any, t?: boolean, k?: string): any[];
        static find(a: any, k: any, v: any): any;
        static indexOf(a: any, k: any, v: any): number;
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
        static eqValues(o1: object, o2: object, ...keys: any[]): boolean;
        static cat(t1: any, t2: any, s?: any, b?: any, a?: any): string;
        static col(tuples: any[], i: number, d?: any): any[];
        static getSortedKeys(map: object): any[];
        static diffMinutes(ah: any, al: any): number;
        static diffHours(ah: any, al: any): number;
        static diffDays(ah: any, al: any): number;
    }
    function getId(e: any): string;
    function firstSub(e: any, r?: boolean): string;
    function lastSub(e: any): string;
    function getComponent(id: string): WUX.WComponent;
    function getRootComponent(c: WUX.WComponent): WUX.WComponent;
    function setProps(id: string, p: any): WUX.WComponent;
    function getProps(id: string, d?: any): any;
    function setState(id: string, s: any): WUX.WComponent;
    function getState(id: string, d?: any): any;
    function newInstance(n: string): WUX.WComponent;
    function same(e1: WElement, e2: WElement): boolean;
    function parse(s: any): [string, JQuery, string];
    function divide(s: string): [string, string, string];
    function str(a: any): string;
    function getTagName(c: any): string;
    function match(i: any, o: string | WEntity): boolean;
    function hashCode(a: any): number;
    interface WStyle {
        b?: string;
        bc?: 'separate' | 'collapse' | 'initial' | 'inherit' | 'unset';
        bsp?: string | number;
        br?: string | number;
        bs?: string;
        bz?: 'content-box' | 'border-box';
        m?: string | number;
        mt?: string | number;
        mr?: string | number;
        mb?: string | number;
        ml?: string | number;
        p?: string | number;
        pt?: string | number;
        pr?: string | number;
        pb?: string | number;
        pl?: string | number;
        a?: 'left' | 'right' | 'center' | 'justify' | 'inherit';
        v?: string;
        d?: 'inline' | 'block' | 'flex' | 'inline-block' | 'inline-flex' | 'inline-table' | 'list-item' | 'run-in' | 'table' | 'table-caption' | 'table-column-group' | 'table-header-group' | 'table-footer-group' | 'table-row-group' | 'table-cell' | 'table-column' | 'table-row' | 'none' | 'initial' | 'inherit';
        z?: string | number;
        c?: string;
        bg?: string;
        bgi?: string;
        bgr?: 'repeat' | 'space' | 'round' | 'repeat-x' | 'repeat-y' | 'no-repeat' | 'initial' | 'inherit' | 'unset';
        bgp?: string;
        cr?: string;
        cn?: string;
        f?: string | number;
        fs?: 'normal' | 'italic' | 'oblique' | 'inherit';
        fw?: 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'inherit';
        tt?: 'capitalize' | 'uppercase' | 'lowercase' | 'none' | 'initial' | 'inherit';
        tr?: string;
        fl?: 'left' | 'right' | 'none' | 'initial' | 'inherit';
        cl?: 'left' | 'right' | 'both' | 'none' | 'initial' | 'inherit';
        o?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit';
        ox?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit';
        oy?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit';
        op?: number;
        ol?: number;
        text?: string;
        k?: string;
        lh?: string;
        ps?: 'absolute' | 'fixed' | 'inherit' | 'initial' | 'relative' | 'static' | 'sticky' | 'unset';
        l?: string | number;
        r?: string | number;
        t?: string | number;
        bt?: string | number;
        w?: string | number;
        h?: string | number;
        minw?: string | number;
        maxw?: string | number;
        minh?: string | number;
        maxh?: string | number;
        ws?: 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap' | 'initial' | 'inherit';
        s?: string;
        n?: string;
    }
    function styleObj(ws: string | WStyle): {
        [key: string]: string;
    };
    function style(ws: string | WStyle): string;
    function addStyle(s: string, k: string, v: string, n?: boolean): string;
    function css(...a: (string | WStyle)[]): string;
    function cls(...a: (string | WStyle)[]): string;
    function attributes(a: any): string;
    function ul(css: string | WStyle, ...a: string[]): string;
    function ol(css: string | WStyle, start: number, ...a: string[]): string;
    function buildCss(...a: (string | WStyle)[]): string;
    function removeClass(css: string, name: string): string;
    function toggleClass(css: string, name: string): string;
    function setCss(e: WComponent | JQuery, ...a: (string | WStyle)[]): WComponent | JQuery;
    function buildIcon(icon: string, before?: string, after?: string, size?: number, cls?: string, title?: string): string;
    function build(tagName: string, inner?: string, css?: string | WStyle, attributes?: string | object, id?: string, classStyle?: string): string;
    function addWrapper(n: JQuery, w: WWrapper, b?: string, e?: string): JQuery;
    function val(e: any, v?: any): any;
    function getContainer(e: WElement, s?: string): JQuery;
    function openURL(url: string, history?: boolean, newTab?: boolean, params?: any): void;
}
