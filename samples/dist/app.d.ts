declare namespace APP {
    function showInfo(m: string, title?: string): void;
    function showSuccess(m: string, title?: string): void;
    function showWarning(m: string, title?: string): void;
    function showError(m: string, title?: string): void;
    function confirm(m: string, f?: (response: any) => void): void;
    function dropdownBtn(id: string, t: string, items: string, cls?: string): string;
    function addItem(r: any, t: WUX.WComponent): void;
    function updItem(r: any, c: WUX.WComponent, f: string, a?: boolean): void;
    function delItem(i: number, c: WUX.WComponent): void;
    function delItemBy(f: string, v: any, c: WUX.WComponent): void;
}
declare namespace APP {
    class Mock {
        dat: {
            [coll: string]: any[];
        };
        seq: {
            [coll: string]: number;
        };
        constructor();
        clean(coll: string): void;
        clear(): void;
        inc(coll: string): number;
        find(coll: string, filter?: any): any[];
        ins(coll: string, ent: any, key?: string): any;
        upd(coll: string, ent: any, key: string): any;
        del(coll: string, val: any, key: string): boolean;
        read(coll: string, key: string, val: any): any;
        protected match(rec: any, flt: any): boolean;
        protected norm(coll: string): string;
    }
}
declare namespace APP {
    function getURLServices(): string;
    class HttpClient {
        url: string;
        mres: {
            [key: string]: any;
        };
        mock: boolean;
        auth: string;
        constructor(url?: string, auth?: string);
        before(): void;
        after(): void;
        sim(method: string, entity: string, params: any, success: (result: any) => void, failure?: (error: any) => void): void;
        get(entity: string, params: {
            [key: string]: any;
        }, success: (result: any) => void, failure?: (error: any) => void): void;
        delete(entity: string, params: {
            [key: string]: any;
        }, success: (result: any) => void, failure?: (error: any) => void): void;
        remove(entity: string, params: {
            [key: string]: any;
        }, success: (result: any) => void, failure?: (error: any) => void): void;
        post(entity: string, data: object, success: (result: any) => void, failure?: (error: any) => void): void;
        put(entity: string, data: object, success: (result: any) => void, failure?: (error: any) => void): void;
        patch(entity: string, data: object, success: (result: any) => void, failure?: (error: any) => void): void;
        _get(method: string, entity: string, params: {
            [key: string]: any;
        }, success: (result: any) => void, failure?: (error: any) => void): void;
        _send(method: string, entity: string, data: object, success: (result: any) => void, failure?: (error: any) => void): void;
    }
    let http: HttpClient;
}
declare namespace APP {
    class Breadcrumb extends WUX.WComponent<string, string[]> {
        home: string;
        lhtm: string;
        leid: string;
        constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object);
        add(link: string): this;
        status(t: string, cls?: string): this;
        render(): string;
    }
    class ResPages extends WUX.WComponent<number, number> {
        max: number;
        constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object);
        refresh(rows: number, lim: number, tot: number, curr: number): this;
        clear(): this;
        protected updateState(nextState: number): void;
        protected componentDidMount(): void;
        getBtnPrev(): string;
        getBtnNext(): string;
        getPageItem(i: number, a?: boolean, t?: string): string;
    }
    class BtnPages extends WUX.WComponent<number, number> {
        constructor(id?: string);
        refresh(page: number, pages: number): void;
        protected updateState(n: number): void;
        render(): string;
        protected componentDidMount(): void;
    }
    class BtnItems extends WUX.WComponent<number, number> {
        IPP: number[];
        constructor(id?: string);
        render(): string;
        protected updateState(n: number): void;
        protected componentDidMount(): void;
    }
    class DlgConfirm extends WUX.WDialog<string, boolean> {
        _msg: string;
        readonly DEF_MSG = "Do you want to proceed with the operation?";
        constructor(id?: string, msg?: string);
        get message(): string;
        set message(s: string);
        protected buildBtnOK(): WUX.WButton;
        protected buildBtnCancel(): WUX.WButton;
    }
}
declare namespace APP {
    class WCalendar extends WUX.WComponent<number, Date> {
        ep: HTMLElement;
        em: HTMLElement;
        en: HTMLElement;
        pm: string;
        nm: string;
        et: HTMLElement;
        eb: HTMLElement;
        ct: string;
        cd: string;
        sp: string;
        sm: string;
        sn: string;
        tr: string;
        sw: string;
        sd: string;
        so: string;
        ss: string;
        sk: string;
        se: string;
        st: string;
        td: string;
        am: string[];
        mt: {
            [k: string]: string;
        };
        ls: string;
        constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object);
        onDoubleClick(handler: (e: WUX.WEvent) => any): void;
        protected updateState(nextState: Date): void;
        protected render(): string;
        add(a: number): Date;
        mark(...p: any[]): this;
        unmark(...p: any[]): this;
        title(d: any, t: string): this;
        unm(i: number, r?: boolean): void;
        clear(): this;
        prev(): Date;
        next(): Date;
        ele(dt: Date): HTMLElement;
        str(dt: Date): string;
        from(): string;
        to(): string;
        protected body(): string;
        protected componentDidMount(): void;
    }
}
declare namespace APP {
    interface WChartData {
        labels?: string[];
        titles?: string[];
        series?: number[][];
        styles?: string[];
        type?: string;
    }
    /**
        Chart Component.
        P: string - Chart type (bar, line)
        S: WChartData - Chart data
    */
    class WChart extends WUX.WComponent<string, WChartData> {
        fontName: string;
        fontSize: number;
        axis: string;
        grid: string;
        line: string;
        offx: number;
        offy: number;
        maxy: number;
        barw: number;
        _w: number;
        _h: number;
        constructor(id?: string, type?: string, classStyle?: string, style?: string | WUX.WStyle);
        size(width: number, height: number): this;
        get width(): number;
        set width(v: number);
        get height(): number;
        set height(v: number);
        protected componentDidMount(): void;
    }
}
declare namespace APP {
    interface Entity {
        id: number;
        code?: string;
        name?: string;
    }
    class DlgEntity extends WUX.WDialog<string, Entity> {
        form: WUX.WForm;
        constructor(id: string);
        updateState(nextState: Entity): void;
        getState(): Entity;
        onClickOk(): boolean;
        protected onShown(): void;
    }
    class GUIEntities extends WUX.WComponent {
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
        mock: Mock;
        page: number;
        dlg: DlgEntity;
        constructor();
        render(): WUX.WContainer;
        doFind(): void;
        addActions(r: any): any;
        refresh(updTable?: boolean): void;
    }
}
