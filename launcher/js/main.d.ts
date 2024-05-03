declare class WLaucher {
    _cf: string;
    _le: string | Element;
    _ln: Element;
    _cs: string[];
    _ci: number;
    _js: string[];
    _ji: number;
    _cx: string[];
    _jx: string[];
    constructor(config?: string);
    get config(): string;
    set config(s: string);
    get loading(): string | Element;
    set loading(s: string | Element);
    css(href: string, v?: any): void;
    js(src: string, v?: any): void;
    create(node: string | Element, tag?: string, id?: string, cs?: string, st?: string, inner?: string | Element): Element;
    clear(node: string | Element): Element;
    protected appendLinks(cb?: () => any): void;
    protected appendScripts(cb?: () => any): void;
    nextCss(): string;
    nextJs(): string;
    start(cb: () => any): void;
}
declare function wlaunch(script: string, loading: string | Element, callback: () => any): void;
