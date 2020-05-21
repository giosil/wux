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
        Cron = "crontab",
        TreeSelect = "tree",
        Ftp = "ftp"
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
declare namespace WUX {
    let global: WGlobal;
    function showMessage(m: string, title?: string, type?: string, dlg?: boolean): void;
    function showInfo(m: string, title?: string, dlg?: boolean, f?: () => void): void;
    function showSuccess(m: string, title?: string, dlg?: boolean): void;
    function showWarning(m: string, title?: string, dlg?: boolean): void;
    function showError(m: string, title?: string, dlg?: boolean): void;
    function confirm(m: string, f?: (response: any) => void): void;
    function getInput(m: string, f?: (response: any) => void, d?: any): void;
    function getPageTitle(): JQuery;
    function getBreadcrump(): JQuery;
    function getPageHeader(): JQuery;
    function getPageFooter(): JQuery;
    function getPageMenu(): JQuery;
    function getViewRoot(): JQuery;
    function sticky(c?: WUX.WComponent | JQuery): void;
    function stickyRefresh(): void;
    function formatDate(a: any, withDay?: boolean, e?: boolean): string;
    function formatDateTime(a: any, withSec?: boolean, withDay?: boolean, e?: boolean): string;
    function formatTime(a: any, withSec?: boolean): string;
    function formatNum2(a: any, nz?: string, z?: string, neg?: string): string;
    function formatNum(a: any, nz?: string, z?: string, neg?: string): string;
    function formatCurr(a: any, nz?: string, z?: string, neg?: string): string;
    function formatCurr5(a: any, nz?: string, z?: string, neg?: string): string;
    function formatBoolean(a: any): string;
    function format(a: any): string;
    function formatDay(d: number, e?: boolean): string;
    function formatMonth(m: number, e?: boolean, y?: any): string;
    function decodeMonth(m: any): number;
    function norm(t: any): string;
    function den(t: any): string;
    function text(t: any): string;
    function encrypt(a: any): string;
    function decrypt(a: any): string;
    enum BTN {
        PRIMARY = "btn btn-primary",
        SECONDARY = "btn btn-secondary",
        SUCCESS = "btn btn-success",
        DANGER = "btn btn-danger",
        WARNING = "btn btn-warning",
        INFO = "btn btn-info",
        LIGHT = "btn btn-light",
        DARK = "btn btn-dark",
        LINK = "btn btn-link",
        WHITE = "btn btn-white",
        SM_PRIMARY = "btn btn-sm btn-primary btn-block",
        SM_DEFAULT = "btn btn-sm btn-default btn-block",
        SM_SECONDARY = "btn btn-sm btn-secondary btn-block",
        SM_INFO = "btn btn-sm btn-info btn-block",
        SM_DANGER = "btn btn-sm btn-danger btn-block",
        SM_WHITE = "btn btn-sm btn-white btn-block",
        ACT_PRIMARY = "btn btn-sm btn-primary",
        ACT_DEFAULT = "btn btn-sm btn-default",
        ACT_SECONDARY = "btn btn-sm btn-secondary",
        ACT_INFO = "btn btn-sm btn-info",
        ACT_DANGER = "btn btn-sm btn-danger",
        ACT_WHITE = "btn btn-sm btn-white",
        ACT_OUTLINE_PRIMARY = "btn btn-sm btn-primary btn-outline",
        ACT_OUTLINE_DEFAULT = "btn btn-sm btn-default btn-outline",
        ACT_OUTLINE_INFO = "btn btn-sm btn-info btn-outline",
        ACT_OUTLINE_DANGER = "btn btn-sm btn-danger btn-outline"
    }
    class CSS {
        static readonly NORMAL: WStyle;
        static readonly ERROR: WStyle;
        static readonly WARNING: WStyle;
        static readonly SUCCESS: WStyle;
        static readonly INFO: WStyle;
        static readonly COMPLETED: WStyle;
        static readonly MARKED: WStyle;
        static readonly BTN_MED: WStyle;
        static readonly BTN_SMALL: WStyle;
        static readonly STACK_BTNS: WStyle;
        static readonly LINE_BTNS: WStyle;
        static readonly FORM_CTRL = "form-control";
        static readonly FORM_CTRL_SM = "form-control input-sm";
        static readonly FIELD_REQUIRED: WStyle;
        static readonly FIELD_CRITICAL: WStyle;
        static readonly FIELD_INTERNAL: WStyle;
        static readonly LABEL_NOTICE: WStyle;
        static readonly LABEL_INFO: WStyle;
    }
    enum WIcon {
        LARGE = "fa-lg ",
        ADDRESS_CARD = "fa-address-card",
        ANGLE_DOUBLE_LEFT = "fa-angle-double-left",
        ANGLE_DOUBLE_RIGHT = "fa-angle-double-right",
        ANGLE_LEFT = "fa-angle-left",
        ANGLE_RIGHT = "fa-angle-right",
        ARROW_CIRCLE_DOWN = "fa-arrow-circle-down",
        ARROW_CIRCLE_LEFT = "fa-arrow-circle-left",
        ARROW_CIRCLE_O_DOWN = "fa-arrow-circle-o-down",
        ARROW_CIRCLE_O_LEFT = "fa-arrow-circle-o-left",
        ARROW_CIRCLE_O_RIGHT = "fa-arrow-circle-o-right",
        ARROW_CIRCLE_O_UP = "fa-arrow-circle-o-up",
        ARROW_CIRCLE_RIGHT = "fa-arrow-circle-right",
        ARROW_CIRCLE_UP = "fa-arrow-circle-up",
        ARROW_DOWN = "fa-arrow-down",
        ARROW_LEFT = "fa-arrow-left",
        ARROW_RIGHT = "fa-arrow-right",
        ARROW_UP = "fa-arrow-up",
        BOLT = "fa-bolt",
        BACKWARD = "fa-backward",
        BOOKMARK = "fa-bookmark",
        BOOKMARK_O = "fa-bookmark-o",
        CALENDAR = "fa-calendar",
        CALCULATOR = "fa-calculator",
        CHAIN = "fa-chain",
        CHAIN_BROKEN = "fa-chain-broken",
        CHECK = "fa-check",
        CHECK_CIRCLE = "fa-check-circle",
        CHECK_CIRCLE_O = "fa-check-circle-o",
        CHECK_SQUARE = "fa-check-square",
        CHECK_SQUARE_O = "fa-check-square-o",
        CHEVRON_DOWN = "fa-chevron-down",
        CHEVRON_UP = "fa-chevron-up",
        CLOCK_O = "fa-clock-o",
        CLOSE = "fa-close",
        COG = "fa-cog",
        COMMENT = "fa-comment",
        COMMENTS_O = "fa-comments-o",
        COPY = "fa-copy",
        CUT = "fa-cut",
        DATABASE = "fa-database",
        EDIT = "fa-edit",
        ENVELOPE_O = "fa-envelope-o",
        EXCHANGE = "fa-exchange",
        FILE = "fa-file",
        FILE_O = "fa-file-o",
        FILE_CODE_O = "fa-file-code-o",
        FILE_PDF_O = "fa-file-pdf-o",
        FILE_TEXT_O = "fa-file-text-o",
        FILES = "fa-files-o",
        FILTER = "fa-filter",
        FOLDER = "fa-folder",
        FOLDER_O = "fa-folder-o",
        FOLDER_OPEN = "fa-folder-open",
        FOLDER_OPEN_O = "fa-folder-open-o",
        FORWARD = "fa-forward",
        GRADUATION_CAP = "fa-graduation-cap",
        INFO_CIRCLE = "fa-info-circle",
        LIFE_RING = "fa-life-ring",
        LINK = "fa-link",
        LEGAL = "fa-legal",
        LIST = "fa-list",
        MINUS = "fa-minus",
        MINUS_SQUARE_O = "fa-minus-square-o",
        PASTE = "fa-paste",
        PENCIL = "fa-pencil",
        PIE_CHART = "fa-pie-chart",
        PLUS = "fa-plus",
        PLUS_SQUARE_O = "fa-plus-square-o",
        PRINT = "fa-print",
        QUESTION_CIRCLE = "fa-question-circle",
        RANDOM = "fa-random",
        RECYCLE = "fa-recycle",
        REFRESH = "fa-refresh",
        SEARCH = "fa-search",
        SEARCH_MINUS = "fa-search-minus",
        SEARCH_PLUS = "fa-search-plus",
        SEND = "fa-send",
        SHARE_SQUARE_O = "fa-share-square-o",
        SHOPPING_CART = "fa-shopping-cart",
        SIGN_IN = "fa-sign-in",
        SIGN_OUT = "fa-sign-out",
        SQUARE = "fa-square",
        SQUARE_O = "fa-square-o",
        TH_LIST = "fa-th-list",
        THUMBS_O_DOWN = "fa-thumbs-o-down",
        THUMBS_O_UP = "fa-thumbs-o-up",
        TIMES = "fa-times",
        TIMES_CIRCLE = "fa-times-circle",
        TOGGLE_OFF = "fa-toggle-off",
        TOGGLE_ON = "fa-toggle-on",
        TRASH = "fa-trash",
        TRUCK = "fa-truck",
        UNDO = "fa-undo",
        UPLOAD = "fa-upload",
        USER = "fa-user",
        USER_O = "fa-user-o",
        USERS = "fa-users",
        WARNING = "fa-warning",
        WIFI = "fa-wifi",
        WRENCH = "fa-wrench"
    }
    class RES {
        static readonly OK = "OK";
        static readonly CLOSE = "Chiudi";
        static readonly CANCEL = "Annulla";
        static readonly ERR_DATE = "Data non ammessa.";
    }
}
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
        constructor(id: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object);
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
        constructor(id: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, type?: string);
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
        constructor(id: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, href?: string, target?: string);
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
        constructor(id: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, props?: any);
        addTab(title: string, icon?: string): WContainer;
        protected render(): string;
        protected componentDidUpdate(prevProps: any, prevState: any): void;
        protected componentDidMount(): void;
        componentWillUnmount(): void;
    }
    class WSelect extends WComponent implements WISelectable {
        options: Array<string | WEntity>;
        multiple: boolean;
        constructor(id: string, options?: Array<string | WEntity>, multiple?: boolean, classStyle?: string, style?: string | WStyle, attributes?: string | object);
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
        constructor(id: string, options: Array<string | WEntity>, classStyle?: string, style?: string | WStyle, attributes?: string | object, props?: any);
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
