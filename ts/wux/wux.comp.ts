namespace WUX {

    export class WContainer extends WComponent<string, any> {
        inline: boolean = false;
        components: Array<WElement>;
        layoutManager: WLayoutManager;
        legend: string;
        fieldsetStyle: string | WStyle;
        legendStyle: string | WStyle;
        wrapper: WWrapper;
        stateComp: WComponent;

        constructor(id?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, inline?: boolean, type?: string, addClassStyle?: string) {
            // WComponent init
            super(id, 'WContainer', type, classStyle, WUX.style(style), attributes);
            // WContainer init
            this.components = [];
            this.inline = inline;
            if (addClassStyle) this._classStyle = this._classStyle ? this._classStyle + ' ' + addClassStyle : addClassStyle;
            this.rootTag = inline ? 'span' : 'div';
            if (type == 'aside') this.rootTag = 'aside';
        }

        public static create(w: WWrapper): WContainer {
            if (!w) return new WContainer();
            let ctype = w.type ? '<' + w.type + '>' : '';
            let c = new WContainer(w.id, w.classStyle, w.style, w.attributes, false, ctype)
            c.wrapper = w.wrapper;
            return c;
        }

        protected updateState(nextState: any) {
            super.updateState(nextState);
            if (this.stateComp) this.stateComp.setState(this.state);
        }

        getState(): any {
            if (this.stateComp) this.state = this.stateComp.getState();
            return this.state;
        }

        on(events: string, handler: (e: any) => any): this {
            super.on(events, handler);
            if (events == 'statechange') {
                if (this.stateComp) this.stateComp.on('statechange', handler);
            }
            return this;
        }

        off(events?: string): this {
            super.off(events);
            if (events == 'statechange') {
                if (this.stateComp) this.stateComp.off('statechange');
            }
            return this;
        }

        trigger(eventType: string, ...extParams: any[]): this {
            super.trigger(eventType, ...extParams);
            if (eventType == 'statechange') {
                if (this.stateComp) this.stateComp.trigger('statechange', ...extParams);
            }
            return this;
        }

        setLayout(layoutManager: WLayoutManager) {
            this.layoutManager = layoutManager;
        }

        section(title: string, secStyle?: string | WStyle, legStyle?: string | WStyle): this {
            this.legend = title;
            this.fieldsetStyle = secStyle ? WUX.css(WUX.global.section, secStyle) : WUX.global.section;
            this.legendStyle = legStyle ? WUX.css(WUX.global.section_title, legStyle): WUX.global.section_title;
            return this;
        }

        area(title: string, areaStyle?: string | WStyle, legStyle?: string | WStyle): this {
            this.legend = title;
            this.fieldsetStyle = areaStyle ? WUX.css(WUX.global.area, areaStyle) : WUX.global.area;
            this.legendStyle = legStyle ? WUX.css(WUX.global.area_title, legStyle) : WUX.global.area_title;
            return this;
        }

        end(): WContainer {
            if (this.parent instanceof WContainer) return this.parent.end();
            return this;
        }

        grid(): WContainer {
            if (this.props == 'row' && this.parent instanceof WContainer) return this.parent;
            if (this.parent instanceof WContainer) return this.parent.grid();
            return this;
        }

        row(): WContainer {
            if (this.props == 'row') return this;
            if (!this.parent) {
                if (!this.components || !this.components.length) return this;
                for (let i = this.components.length-1; i >= 0; i--) {
                    let c = this.components[i];
                    if (c instanceof WContainer && c.getProps() == 'row') return c;
                }
                return this;
            }
            if (this.parent instanceof WContainer) return this.parent.row();
            return this;
        }

        col(): WContainer {
            if (this.props == 'col') return this;
            if (this.parent instanceof WContainer) return this.parent.col();
            return this;
        }

        addDiv(height: number, inner?: string, classStyle?: string): WContainer;
        addDiv(css: string | WStyle, inner?: string, attributes?: string, id?: string): WContainer;
        addDiv(hcss: number | string | WStyle, inner?: string, cls_att?: string, id?: string): WContainer {
            if (typeof hcss == 'number') {
                if (hcss < 1) return this;
                let r = WUX.build('div', inner, { h: hcss, n: cls_att });
                return this.add($(r));
            }
            else {
                let r = WUX.build('div', inner, hcss, cls_att, id);
                return this.add($(r));
            }
        }

        addSpan(width: number, inner?: string, classStyle?: string): WContainer;
        addSpan(css: string | WStyle, inner ?: string, attributes ?: string, id ?: string): WContainer;
        addSpan(wcss: number | string | WStyle, inner?: string, cls_att?: string, id?: string): WContainer {
            if (typeof wcss == 'number') {
                let r = WUX.build('span', inner, { w: wcss, d: 'inline-block', a: 'center', n: cls_att});
                return this.add($(r));
            }
            else {
                let r = WUX.build('span', inner, wcss, cls_att, id);
                return this.add($(r));
            }
        }

        addGroup(w: WWrapper, ...ac: WElement[]): this {
            if (w) {
                let cnt = this.addContainer(w);
                if (!ac || !ac.length) return this;
                for (let c of ac) cnt.add(c);
                return this;
            }
            if (!ac || !ac.length) return this;
            for (let c of ac) this.add(c);
            return this;
        }

        add(component: WElement, constraints?: string): this {
            if (!component) return this;
            if (component instanceof WComponent) {
                if (!component.parent) component.parent = this;
            }
            let c: WElement;
            if (typeof component == 'string' && component.length > 0) {
                if (component.charAt(0) == '<' && component.charAt(component.length - 1) == '>') {
                    c = $(component);
                }
            }
            if (!c) c = component;
            this.components.push(c);
            if (this.layoutManager) this.layoutManager.addLayoutComponent(c, constraints);
            return this;
        }

        remove(index: number): this {
            if (index < 0) index = this.components.length + index;
            if (index < 0 || index >= this.components.length) return undefined;
            let removed = this.components.splice(index, 1);
            if (this.layoutManager && removed.length) this.layoutManager.removeLayoutComponent(removed[0]);
            return this;
        }

        removeAll(): this {
            if (this.layoutManager) {
                for (let element of this.components) {
                    this.layoutManager.removeLayoutComponent(element);
                }
            }
            if (this.mounted) {
                this.parent = null;
                for (let c of this.components) {
                    if (c instanceof WComponent) c.unmount();
                }
            }
            this.components = [];
            return this;
        }

        addRow(classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object): WContainer {
            let classRow = classStyle == null ? 'row' : classStyle;
            let row = new WContainer(id, classRow, style, attributes, false, 'row');
            row.name = row.name + '_row';
            return this.grid().addContainer(row);
        }

        addCol(classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object): WContainer {
            if (WUtil.isNumeric(classStyle)) classStyle = 'col-md-' + classStyle;
            let classCol = classStyle == null ? 'col' : classStyle;
            let col = new WContainer(id, classCol, style, attributes, false, 'col');
            col.name = col.name + '_col';
            return this.row().addContainer(col);
        }

        addASide(classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object): WContainer {
            let c = new WContainer(id, classStyle, style, attributes, false, 'aside');
            c.name = c.name + '_aside';
            return this.end().addContainer(c);
        }

        addBox(title?: string, classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object): WBox {
            let box = new WBox(id, title, classStyle, style, attributes);
            this.addContainer(box);
            return box;
        }

        addText(text: string[], rowTag?: string, classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object): this {
            if (!text || !text.length) return this;
            let endRow = '';
            if (rowTag) {
                let i = rowTag.indexOf(' ');
                endRow = i > 0 ? rowTag.substring(0, i) : rowTag;
            }
            let s = '';
            for (let r of text) {
                if (r && r.length > 3) {
                    let b = r.substring(0, 3);
                    if (b == '<ul' || b == '<ol' || b == '<li' || b == '<di') {
                        s += r;
                        continue;
                    }
                }
                if (rowTag && rowTag != 'br') {
                    s += '<' + rowTag + '>' + r + '</' + endRow + '>';
                }
                else {
                    s += r + '<br>';
                }
            }
            if (classStyle || style || id || attributes) {
                this.add(WUX.build('div', s, style, attributes, id, classStyle));
            }
            else {
                this.add(s);
            }
            return this;
        }

        findBox(title_id?: string): WBox {
            let bid = '';
            if (title_id && title_id.length > 1 && title_id.charAt(0) == '#') bid = title_id.substring(1);
            for (let c of this.components) {
                if (c instanceof WBox) {
                    if (bid) {
                        if (c.id == bid) return c;
                    }
                    else if (title_id) {
                        if (c.title == title_id || c.id == title_id) return c;
                    }
                    else {
                        return c;
                    }
                }
                else if (c instanceof WContainer) {
                    let b = c.findBox(title_id);
                    if (!b) return b;
                }
            }
            return null;
        }

        addStack(style: string | WStyle, ...ac: Array<WElement>): this {
            if (!ac || ac.length == 0) return this;
            let rowStyle = WUX.style(style);
            let rowClass = WUX.cls(style);
            for (let i = 0; i < ac.length; i++) {
                let row = new WContainer(this.subId(), rowClass, rowStyle).add(ac[i]);
                row.name = row.name + '_stack_' + i;
                this.addContainer(row);
            }
            return this;
        }

        addLine(style: string | WStyle, ...ac: Array<WElement>): this {
            if (!ac || ac.length == 0) return this;
            let colStyle = WUX.style(style);
            let colClass = WUX.cls(style);
            for (let i = 0; i < ac.length; i++) {
                let c = ac[i];
                let s = this.subId();
                let col: WContainer;
                if (!colClass && !colStyle) {
                    col = new WContainer(s, '', null, null, true).add(c);
                }
                else if (colClass) {
                    col = new WContainer(s, colClass, null, null, true).add(c);
                }
                else {
                    col = new WContainer(s, '', colStyle, null, true).add(c);
                }
                col.name = col.name + '_line_' + i;
                this.addContainer(col);
            }
            return this;
        }

        addContainer(container: WWrapper, constraints?: string): WContainer;
        addContainer(container: WContainer, constraints?: string): WContainer;
        addContainer(id?: string, classStyle?: string, style?: string, attributes?: string | object, inline?: boolean, props?: any): WContainer;
        addContainer(conid: string | WContainer | WWrapper, classStyle?: string, style?: string, attributes?: string | object, inline?: boolean, props?: any) {
            if (conid instanceof WContainer) {
                if (this._classStyle == null) {
                    // If you add a 'row'...
                    if (conid._classStyle && conid._classStyle.indexOf('row') == 0) {
                        if (this.parent instanceof WContainer) {
                            this._classStyle = global.con_class;
                        }
                        else {
                            this._classStyle = global.main_class;
                        }
                    }
                }
                conid.parent = this;
                if (!conid.layoutManager) conid.layoutManager = this.layoutManager;
                this.components.push(conid);
                // classStyle = constraints
                if (this.layoutManager) this.layoutManager.addLayoutComponent(conid, classStyle);
                return conid;
            }
            else if (typeof conid == 'string') {
                let container = new WContainer(conid, classStyle, style, attributes, inline, props);
                if (!container.layoutManager) container.layoutManager = this.layoutManager;
                this.components.push(container);
                if (this.layoutManager) this.layoutManager.addLayoutComponent(container);
                return container;
            }
            else {
                if (!conid) return this;
                let c = WContainer.create(conid);
                c.parent = this;
                c.layoutManager = this.layoutManager;
                this.components.push(c);
                // classStyle = constraints
                if (this.layoutManager) this.layoutManager.addLayoutComponent(c, classStyle);
                return c;
            }
        }

        protected render(): any {
            if (this.parent || this._classStyle || this._style) {
                return this.build(this.rootTag);
            }
            return this.buildRoot(this.rootTag);
        }

        protected make(): string {
            if (this.legend == null) return '';
            let fss = this.fieldsetStyle ? ' style="' + WUX.style(this.fieldsetStyle) + '"' : '';
            let lgs = this.legendStyle ? ' style="' + WUX.style(this.legendStyle) + '"' : '';
            return '<fieldset id="' + this.subId('fs') + '"' + fss + '><legend' + lgs + '>' + this.legend + '</legend></fieldset>';
        }

        protected componentDidMount(): void {
            let node = this.root;
            if (this.legend != null) {
                let $fs = $('#' + this.subId('fs'));
                if ($fs && $fs.length) node = $fs;
            }
            if (this.wrapper) node = WUX.addWrapper(node, this.wrapper);
            if (this.layoutManager) {
                this.layoutManager.layoutContainer(this, node);
                return;
            }
            for (let element of this.components) {
                if (element instanceof WComponent) {
                    element.mount(node);
                }
                else {
                    node.append(element);
                }
            }
        }

        componentWillUnmount(): void {
            for (let c of this.components) {
                if (c instanceof WComponent) c.unmount();
            }
        }

        rebuild(): this {
            let node = this.root;
            if (this.legend != null) {
                let $fs = $('#' + this.subId('fs'));
                if ($fs && $fs.length) node = $fs;
            }
            node.empty();
            if (this.wrapper) node = WUX.addWrapper(node, this.wrapper);
            if (this.layoutManager) {
                this.layoutManager.layoutContainer(this, node);
                return;
            }
            for (let element of this.components) {
                if (element instanceof WComponent) {
                    element.mount(node);
                }
                else {
                    node.append(element);
                }
            }
            return this;
        }
    }

    export class WCardLayout implements WLayoutManager {
        mapConstraints: { [componentId: string]: string } = {};
        mapComponents: { [constraints: string]: WElement } = {};
        currComp: WElement;

        addLayoutComponent(component: WElement, constraints?: string): void {
            if (!component || !constraints) return;
            let cmpId = getId(component);
            if (!cmpId) return;
            this.mapConstraints[cmpId] = constraints;
            this.mapComponents[constraints] = component;
        }

        removeLayoutComponent(component: WElement): void {
            let cmpId = getId(component);
            if (!cmpId) return;
            let constraints = this.mapConstraints[cmpId];
            delete this.mapConstraints[cmpId];
            if (constraints) delete this.mapComponents[constraints];
        }

        layoutContainer(container: WContainer, root: JQuery): void {
            let curId = getId(this.currComp);
            for (let c of container.components) {
                let eleId = getId(c);
                let ehide = false;
                if (eleId && eleId != curId && this.mapConstraints[eleId]) ehide = true;
                if (c instanceof WComponent) {
                    if (ehide) c.visible = false;
                    c.mount(root);
                }
                else if (c instanceof jQuery) {
                    if (ehide) (c as JQuery).hide();
                }
            }
        }

        show(container: WContainer, name: string): void {
            let c = this.mapComponents[name];
            if (!c) return;
            if (this.currComp instanceof WComponent) {
                this.currComp.visible = false;
            }
            else if (this.currComp instanceof jQuery) {
                (this.currComp as JQuery).show();
            }
            if (c instanceof WComponent) {
                c.visible = true;
                this.currComp = c;
            }
            else if (this.currComp instanceof jQuery) {
                (c as JQuery).show();
                this.currComp = c;
            }
            else {
                this.currComp = undefined;
            }
        }
    }

    export class WBox extends WContainer {
        protected _header: WContainer;
        protected _footer: WContainer;
        protected _title: string;
        protected _addClassStyle: string;
        protected tools: { [key: string]: JQuery };
        protected cntls: WContainer;

        public TOOL_COLLAPSE = 'collapse-link';
        public TOOL_CLOSE = 'close-link';
        public TOOL_FILTER = 'filter-link';

        constructor(id?: string, title?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
            // WContainer init
            super(id, global.box_class, style, attributes, false, 'box');
            this.name = 'WBox';
            // WBox init
            this._addClassStyle = classStyle;
            this.title = title;
        }

        get title(): string {
            return this._title;
        }
        set title(s: string) {
            if (this._title) {
                this.header.remove(0);
            }
            this._title = s;
            if (s) {
                if (s.charAt(0) != '<' && global.box_title) {
                    this.header.add(global.box_title.replace('$', s));
                }
                else {
                    this.header.add(s);
                }
            }
        }

        addTool(tool: JQuery | WComponent): this;
        addTool(tool: string | JQuery | WComponent, icon?: WIcon, attributes?: string, handler?: (e?: any) => any): this;
        addTool(tool: string | JQuery | WComponent, icon?: WIcon, attributes?: string, handler?: (e?: any) => any): this {
            if (!tool) return this;
            if (typeof tool == 'string') {
                if (!icon) icon = WIcon.WRENCH;
                if (!this.cntls) {
                    this.cntls = new WContainer('', global.box_tools);
                    this.header.add(this.cntls);
                    this.tools = {};
                }
                let $r = $('<a class="' + tool + '">' + WUX.buildIcon(icon) + '</a>');
                this.cntls.add($r);
                this.tools[tool] = $r;
                if (handler) {
                    if (tool == this.TOOL_COLLAPSE) {
                        this.handlers['_' + this.TOOL_COLLAPSE] = [(e: JQueryEventObject) => { this.collapse(handler); }];
                    }
                    else {
                        this.handlers['_' + tool] = [handler];
                    }
                }
                else {
                    if (tool == this.TOOL_COLLAPSE) this.handlers['_' + this.TOOL_COLLAPSE] = [(e: JQueryEventObject) => { this.collapse(); }];
                    if (tool == this.TOOL_CLOSE) this.handlers['_' + this.TOOL_CLOSE] = [(e: JQueryEventObject) => { this.close(); }];
                }
            }
            else {
                this.header.add(tool);
            }
            return this;
        }

        addCollapse(handler?: (e?: any) => any): this {
            this.addTool(this.TOOL_COLLAPSE, WIcon.CHEVRON_UP, '', handler);
            return this;
        }

        addClose(handler?: (e?: any) => any): this {
            this.addTool(this.TOOL_CLOSE, WIcon.TIMES, '', handler);
            return this;
        }

        addFilter(handler?: (e?: any) => any): this {
            this.addTool(this.TOOL_FILTER, WIcon.FILTER, '', handler);
            return this;
        }

        get header(): WContainer {
            if (this._header) return this._header;
            return this._header = new WContainer('', WUX.cls(global.box_header, this._addClassStyle));
        }

        get content(): WContainer {
            return this;
        }

        get footer(): WContainer {
            if (this._footer) return this._footer;
            return this._footer = new WContainer('', WUX.cls(global.box_footer, this._addClassStyle));
        }

        protected componentDidMount(): void {
            if (this._header) this._header.mount(this.root);
            let boxContent = $(this.build('div', '', '', WUX.cls(global.box_content, this._addClassStyle), undefined, null));
            this.root.append(boxContent);
            for (let element of this.components) {
                if (element instanceof WComponent) {
                    element.mount(boxContent);
                }
                else {
                    boxContent.append(element);
                }
            }
            if (this._footer) this._footer.mount(this.root);
            if (!this.tools) return;
            for (let t in this.tools) {
                let hs = this.handlers['_' + t];
                if (!hs || !hs.length) continue;
                for (let h of hs) this.tools[t].click(h);
            }
        }

        componentWillUnmount(): void {
            super.componentWillUnmount();
            if (this._header) this._header.unmount();
            if (this._footer) this._footer.unmount();
        }

        // WContainer overriding

        end(): WContainer {
            // if (this.parent instanceof WContainer) return this.parent.end();
            // In questo modo si rimanda nel container di cui e' figlio diretto
            if (this.parent instanceof WContainer) return this.parent;
            return this;
        }

        addRow(classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object): WContainer {
            let classRow = classStyle == null ? 'row' : classStyle;
            let row = new WContainer(id, classRow, style, attributes, false, 'row');
            row.name = row.name + '_row';
            // return this.grid().addContainer(row);
            // In questo modo si rimane nella box
            return this.content.addContainer(row);
        }

        // WBox tool functions

        collapse(handler?: (e?: any) => any): this {
            if (!this.root) return this;
            if (handler) {
                let e = this.createEvent('_' + this.TOOL_COLLAPSE, { collapsed: this.isCollapsed() });
                handler(e);
            }
            if (this.tools && this.tools[this.TOOL_COLLAPSE]) {
                this.tools[this.TOOL_COLLAPSE].find('i').toggleClass(WIcon.CHEVRON_UP).toggleClass(WIcon.CHEVRON_DOWN);
            }
            let d = this.root;
            d.children('.ibox-content').slideToggle(200);
            d.toggleClass('').toggleClass('border-bottom');
            setTimeout(function () {
                d.resize();
                d.find('[id^=map-]').resize();
            }, 50);
            return this;
        }

        expand(handler?: (e?: any) => any): this {
            if (this.isCollapsed()) this.collapse(handler);
            return this;
        }

        isCollapsed(): boolean {
            if (!this.root) return false;
            return this.tools[this.TOOL_COLLAPSE].find('i').hasClass(WIcon.CHEVRON_DOWN);
        }

        close(): this {
            if (!this.root) return this;
            this.root.remove();
        }
    }

    export class WDialog<P = any, S = any> extends WComponent<P, S> {
        cntRoot: WContainer;
        cntMain: WContainer;
        cntContent: WContainer;
        cntHeader: WContainer;
        cntBody: WContainer;
        cntFooter: WContainer;
        // GUI
        protected _title: string;
        protected tagTitle: string;
        btnCloseHeader: WButton;
        btnOK: WButton;
        btnCancel: WButton;
        txtCancel: string;
        buttons: WButton[];
        // Flag
        ok: boolean;
        cancel: boolean;
        isShown: boolean;
        // Control
        parentHandler: (e?: JQueryEventObject) => any;

        constructor(id: string, name: string = 'WDialog', btnOk = true, btnClose = true, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
            super(id, name, undefined, classStyle, style, attributes);
            this.buttons = [];
            this.tagTitle = 'h3';
            if (btnClose) {
                if (!btnOk) this.txtCancel = RES.CLOSE;
                this.buttonCancel();
            }
            if (btnOk) this.buttonOk();
            this.ok = false;
            this.cancel = false;
            this.isShown = false;
            // Auto-mount
            if (this.id && this.id != '*') {
                if ($('#' + this.id).length) $('#' + this.id).remove();
            }
            WuxDOM.onRender((e: WEvent) => {
                if (this.mounted) return;
                this.mount(e.element);
            });
        }

        onShownModal(handler: (e?: JQueryEventObject) => any) {
            this.on('shown.bs.modal', handler);
        }

        onHiddenModal(handler: (e?: JQueryEventObject) => any) {
            this.on('hidden.bs.modal', handler);
        }

        get header(): WContainer {
            if (this.cntHeader) return this.cntHeader;
            this.cntHeader = new WContainer('', 'modal-header');
            this.btnCloseHeader = new WButton(this.subId('bhc'), '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>', undefined, 'close', '', 'data-dismiss="modal"');
            this.cntHeader.add(this.btnCloseHeader);
            return this.cntHeader;
        }

        get body(): WContainer {
            if (this.cntBody) return this.cntBody;
            this.cntBody = new WContainer('', WUX.cls('modal-body', this._classStyle), '', this._attributes);
            return this.cntBody;
        }

        get footer(): WContainer {
            if (this.cntFooter) return this.cntFooter;
            this.cntFooter = new WContainer('', 'modal-footer');
            return this.cntFooter;
        }

        get title(): string {
            return this._title;
        }
        set title(s: string) {
            if (this._title && this.cntHeader) {
                this._title = s;
                this.cntHeader.getRoot().children(this.tagTitle + ':first').text(s);
            }
            else {
                this._title = s;
                this.header.add(this.buildTitle(s));
            }
        }

        protected onClickOk(): boolean {
            return true;
        }

        protected onClickCancel(): boolean {
            return true;
        }

        protected buildBtnOK(): WButton {
            return new WButton(this.subId('bfo'), RES.OK, '', BTN.INFO + ' button-sm', '', '');
        }

        protected buildBtnCancel(): WButton {
            if (this.txtCancel) {
                return new WButton(this.subId('bfc'), this.txtCancel, '', BTN.SECONDARY + ' button-sm', '', '');
            }
            return new WButton(this.subId('bfc'), RES.CANCEL, '', BTN.SECONDARY + ' button-sm', '', '');
        }

        buttonOk(): WButton {
            if (this.btnOK) return this.btnOK;
            this.btnOK = this.buildBtnOK();
            this.btnOK.on('click', (e: JQueryEventObject) => {
                if (this.onClickOk()) {
                    this.ok = true;
                    this.cancel = false;
                    this.root.modal('hide');
                }
            });
            this.buttons.push(this.btnOK);
        }

        buttonCancel(): WButton {
            if (this.btnCancel) return this.btnCancel;
            this.btnCancel = this.buildBtnCancel();
            this.btnCancel.on('click', (e: JQueryEventObject) => {
                if (this.onClickCancel()) {
                    this.ok = false;
                    this.cancel = true;
                    this.root.modal('hide');
                }
            });
            this.buttons.push(this.btnCancel);
        }

        show(parent?: WComponent, handler?: (e?: JQueryEventObject) => any): void {
            if (!this.beforeShow()) return;
            this.ok = false;
            this.cancel = false;
            this.parent = parent;
            this.parentHandler = handler;
            if (!this.mounted) WuxDOM.mount(this);
            if (this.root && this.root.length) this.root.modal({ backdrop: 'static', keyboard: false });
        }

        hide(): void {
            if (this.root && this.root.length) this.root.modal('hide');
        }

        close(): void {
            this.ok = false;
            this.cancel = false;
            if (this.root && this.root.length) this.root.modal('hide');
        }

        selection(table: WITable, warn?: string): boolean {
            if (!table) return false;
            let sr = table.getSelectedRows();
            if (!sr || !sr.length) {
                if (warn) WUX.showWarning(warn);
                return false;
            }
            let sd = table.getSelectedRowsData();
            if (!sd || !sd.length) {
                if (warn) WUX.showWarning(warn);
                return false;
            }
            if (this.props == null || typeof this.props == 'number') {
                let idx: any = sr[0];
                this.setProps(idx);
            }
            this.setState(sd[0]);
            return true;
        }

        protected beforeShow(): boolean {
            return true;
        }

        protected onShown() {
        }

        protected onHidden() {
            // Forzatura in caso di problemi nella rimozione del backdrop
            // $('.modal-backdrop').remove();
        }

        protected render() {
            this.isShown = false;
            this.cntRoot = new WContainer(this.id, 'modal inmodal fade', '', 'role="dialog" aria-hidden="true"');
            this.cntMain = this.cntRoot.addContainer('', 'modal-dialog modal-lg', this._style);
            this.cntContent = this.cntMain.addContainer('', 'modal-content');
            if (this.cntHeader) this.cntContent.addContainer(this.cntHeader);
            if (this.cntBody) this.cntContent.addContainer(this.cntBody);
            for (let btn of this.buttons) this.footer.add(btn);
            if (this.cntFooter) this.cntContent.addContainer(this.cntFooter);
            return this.cntRoot;
        }

        protected componentDidMount(): void {
            this.root.on('shown.bs.modal', (e: JQueryEventObject) => {
                this.isShown = true;
                this.onShown();
            });
            this.root.on('hidden.bs.modal', (e: JQueryEventObject) => {
                this.isShown = false;
                this.onHidden();
                if (this.parentHandler) {
                    this.parentHandler(e);
                    this.parentHandler = null;
                }
            });
        }

        componentWillUnmount(): void {
            this.isShown = false;
            if (this.btnCloseHeader) this.btnCloseHeader.unmount();
            if (this.btnCancel) this.btnCancel.unmount();
            if (this.cntFooter) this.cntFooter.unmount();
            if (this.cntBody) this.cntBody.unmount();
            if (this.cntHeader) this.cntHeader.unmount();
            if (this.cntContent) this.cntContent.unmount();
            if (this.cntMain) this.cntMain.unmount();
            if (this.cntRoot) this.cntRoot.unmount();
        }

        protected buildTitle(title: string): string {
            if (!this.tagTitle) this.tagTitle = 'h3';
            return '<' + this.tagTitle + '>' + WUtil.toText(title) + '</' + this.tagTitle + '>';
        }
    }

    export class WLabel extends WComponent<string, string> {
        forId: string;
        protected blinks: number;

        constructor(id?: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
            // WComponent init
            super(id ? id : '*', 'WLabel', icon, classStyle, style, attributes);
            this.rootTag = 'span';
            this.updateState(text);
        }

        get icon(): string {
            return this.props;
        }
        set icon(i: string) {
            this.update(i, this.state, true, false, false);
        }

        protected updateState(nextState: string): void {
            if (!nextState) nextState = '';
            super.updateState(nextState);
            if (this.root) this.root.html(WUX.buildIcon(this.props, '', ' ') + nextState);
        }

        for(e: WElement): this {
            this.forId = WUX.getId(e);
            return this;
        }

        blink(n?: number): this {
            if (!this.root || !this.root.length) return this;
            this.blinks = n ? n : 3;
            this.highlight();
            return this;
        }

        protected highlight(): this {
            if (!this.root || !this.root.length) return this;
            if (this.blinks) {
                this.blinks--;
                this.root.effect('highlight', {}, 600, this.highlight.bind(this));
            }
            return this;
        }

        protected render() {
            let text = this.state ? this.state : '';
            if (this.forId) return this.buildRoot('label', WUX.buildIcon(this.props, '', ' ') + text, 'for="' + this.forId + '"', this._classStyle);
            return this.buildRoot(this.rootTag, WUX.buildIcon(this.props, '', ' ') + text, null, this._classStyle);
        }

        protected componentDidMount(): void {
            if (this._tooltip) this.root.attr('title', this._tooltip);
        }
    }

    export class WInput extends WComponent<WInputType, string> {
        size: number;
        label: string;
        /** 's'=string, 'n'=number, 'p'=percentage, 'c'=currency, 'c5'=currency, 'i'=integer, 'd'=date, 't'=date-time, 'h'=time, 'b'=boolean */
        valueType: 's' | 'n' | 'p' | 'c' | 'c5' | 'i' | 'd' | 't' | 'h' | 'b';
        blurOnEnter: boolean;
        placeHolder: string;

        constructor(id?: string, type?: WInputType, size?: number, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
            // WComponent init
            super(id ? id : '*', 'WInput', type, classStyle, style, attributes);
            this.rootTag = 'input';
            // WInput init
            this.size = size;
            this.valueType = 's';
            this.blurOnEnter = false;
        }

        protected updateState(nextState: string) {
            super.updateState(nextState);
            if (this.root) this.root.val(nextState);
        }

        onEnterPressed(handler: (e: WEvent) => any): void {
            if (!this.handlers['_enter']) this.handlers['_enter'] = [];
            this.handlers['_enter'].push(handler);
        }

        protected render() {
            let l = '';
            if (this.label) {
                l = this.id ? '<label for="' + this.id + '">' : '<label>'
                let br = this.label.lastIndexOf('<br');
                if (br > 0) {
                    l += this.label.substring(0, br).replace('<', '&lt;').replace('>', '&gt;')
                    l += '</label><br>';
                }
                else {
                    l += this.label.replace('<', '&lt;').replace('>', '&gt;')
                    l += '</label> ';
                }
            }
            if (this.props == 'static') {
                return l + this.build('span', this.state);
            }
            else {
                let addAttributes = 'name="' + this.id + '"';
                addAttributes += this.props ? ' type="' + this.props + '"' : ' type="text"';
                if (this.size) addAttributes += ' size="' + this.size + '"';
                if (this.state) addAttributes += ' value="' + this.state + '"';
                if (this.placeHolder) addAttributes += ' placeholder="' + this.placeHolder + '"';
                return l + this.build(this.rootTag, '', addAttributes);
            }
        }

        protected componentDidMount(): void {
            if (this._tooltip) this.root.attr('title', this._tooltip);
            let _self = this;
            this.root.keypress(function (e: JQueryEventObject) {
                // this refers to element
                if (e.which == 13) {
                    let v = this.value;
                    if (_self.valueType == 'c') {
                        if (this.value) this.value = WUX.formatCurr(WUtil.toNumber(this.value));
                    }
                    else if (_self.valueType == 'c5') {
                        if (this.value) this.value = WUX.formatCurr5(WUtil.toNumber(this.value));
                    }
                    else if (_self.valueType == 'n' || _self.valueType == 'p') {
                        if (this.value) this.value = WUX.formatNum(this.value);
                    }
                    else if (_self.valueType == 'i') {
                        if (this.value) this.value = WUtil.toInt(this.value);
                    }
                    _self.trigger('statechange', v);
                    _self.trigger('_enter');
                    if (_self.blurOnEnter) $(this).blur();
                }
            });
            this.root.blur(function (e: JQueryEventObject) {
                // this refers to element
                let v = this.value;
                if (_self.valueType == 'c') {
                    if (this.value) this.value = WUX.formatCurr(WUtil.toNumber(this.value));
                }
                else if (_self.valueType == 'c5') {
                    if (this.value) this.value = WUX.formatCurr5(WUtil.toNumber(this.value));
                }
                else if (_self.valueType == 'n' || _self.valueType == 'p') {
                    if (this.value) this.value = WUX.formatNum(this.value);
                }
                else if (_self.valueType == 'i') {
                    if (this.value) this.value = WUtil.toInt(this.value);
                }
                if (_self.state != v) _self.trigger('statechange', v);
            });
            this.root.focus(function (e: JQueryEventObject) {
                // this refers to element
                if (!this.value) return;
                if (_self.valueType == 'c' || _self.valueType == 'c5') {
                    let s = WUX.formatNum(this.value);
                    if (s.indexOf(',00') >= 0 && s.indexOf(',00') == s.length - 3) s = s.substring(0, s.length - 3);
                    if (s.indexOf(',0') >= 0 && s.indexOf(',0') == s.length - 2) s = s.substring(0, s.length - 3);
                    this.value = s;
                }
                else if (_self.valueType == 'n' || _self.valueType == 'p') {
                    this.value = WUX.formatNum(this.value);
                }
                else if (_self.valueType == 'i') {
                    this.value = this.value = WUtil.toInt(this.value);
                }
                $(this).select();
            });
        }
    }

    export class WTextArea extends WComponent<number, string> {
        constructor(id?: string, rows?: number, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
            // WComponent init
            super(id ? id : '*', 'WTextArea', rows, classStyle, style, attributes);
            this.rootTag = 'textarea';
            if (!rows) this.props = 5;
        }

        protected updateState(nextState: string) {
            super.updateState(nextState);
            if (this.root) this.root.val(this.state);
            // if (this.root) this.root.val(WUX.den(this.state));
        }

        getState(): string {
            if (this.root) this.state = WUX.norm(this.root.val());
            return this.state;
        }

        protected render() {
            if (!this.props) this.props = 1;
            if (this._style) {
                if (this._style.indexOf('width') < 0) {
                    this._style += ";width:100%";
                }
            }
            else {
                this._style = "width:100%";
            }
            if (this._attributes) {
                if (this._style.indexOf('rows=') < 0) {
                    this._attributes += ' rows="' + this.props + '"';
                }
            }
            else {
                this._attributes = 'rows="' + this.props + '"';
            }
            return WUX.build('textarea', '', this._style, this._attributes, this.id, this._classStyle);
        }

        protected componentDidMount(): void {
            if (this._tooltip) this.root.attr('title', this._tooltip);
            if (this.state) this.root.val(WUX.den(this.state));
        }
    }

    export class WCheck extends WComponent<boolean, any> {
        wrapper: WUX.WContainer;
        value: any;
        protected $label: JQuery;
        protected _text: string;

        constructor(id?: string, text?: string, value?: any, checked?: boolean, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
            // WComponent init
            super(id ? id : '*', 'WCheck', checked, classStyle, style, attributes);
            this.rootTag = 'input';
            // WCheck init
            this.value = value ? value : '1';
            if (checked) this.updateState(value);
            this._text = text;
        }

        get text(): string {
            if (!this._text && this.$label) return this.$label.text();
            return this._text;
        }
        set text(s: string) {
            if (!this._text && this.$label) {
                this.$label.text(s); 
                return;
            }
            this._text = s;
            if (this.mounted) this.root.html(s);
        }

        get checked(): boolean {
            this.props = this.root.is(':checked');
            this.state = this.props ? this.value : undefined;
            return this.props;
        }
        set checked(b: boolean) {
            this.setProps(b);
        }

        getState(): any {
            if (this.checked) {
                this.state = this.value;
            }
            else {
                this.state = null;
            }
            return this.state;
        }

        protected updateProps(nextProps: boolean) {
            super.updateProps(nextProps);
            this.state = this.props ? this.value : undefined;
            if (this.root) this.root.prop('checked', this.props);
        }

        protected updateState(nextState: any) {
            if (typeof nextState == 'boolean') {
                nextState = nextState ? this.value : undefined;
            }
            super.updateState(nextState);
            if (this.root) this.root.prop('checked', this.state != undefined);
        }

        protected render() {
            let addAttributes = 'name="' + this.id + '" type="checkbox"';
            addAttributes += this.props ? ' checked="checked"' : '';
            let inner = this._text ? '&nbsp;' + this._text : '';
            return this.build(this.rootTag, inner, addAttributes);
        }

        protected componentDidMount(): void {
            if (this._tooltip) this.root.attr('title', this._tooltip);
            this.root.change((e: JQueryEventObject) => {
                let checked = this.root.is(':checked');
                this.trigger('propschange', checked);
                this.trigger('statechange', checked ? this.value : undefined);
            });
        }

        getWrapper(style?: string | WStyle) {
            if (this.wrapper) return this.wrapper;
            if (this.id) {
                this.$label = this._text ? $('<label for="' + this.id + '">' + this._text + '</label>') : $('<label></label>');
            }
            else {
                this.$label = this._text ? $('<label>' + this._text + '</label>') : $('<label></label>');
            }
            this._text = '';
            this.wrapper = new WUX.WContainer(this.subId(), 'checkbox', style);
            this.wrapper.add(this);
            this.wrapper.add(this.$label);
            this.wrapper.stateComp = this;
            return this.wrapper;
        }
    }

    export class WButton extends WComponent<string, string> {
        public readonly type: string;

        constructor(id?: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, type?: string) {
            // WComponent init
            super(id ? id : '*', 'WButton', icon, classStyle, style, attributes);
            this.updateState(text);
            this.rootTag = 'button';
            // WButton init
            this.type = type ? type : 'button';
        }

        get icon(): string {
            return this.props;
        }
        set icon(i: string) {
            this.update(i, this.state, true, false, false);
        }

        setText(text?: string, icon?: string) {
            if (icon != null) this.props = icon;
            this.setState(text);
        }

        protected render() {
            if (!this._classStyle) this._classStyle = BTN.PRIMARY;
            let addAttributes = this.type ? 'type="' + this.type + '"' : '';
            let html = '';
            if (this.state) {
                html += WUX.buildIcon(this.props, '', ' ') + this.state;
            }
            else {
                html += WUX.buildIcon(this.props);
            }
            return this.build(this.rootTag, html, addAttributes);
        }

        protected componentDidMount(): void {
            if (this._tooltip) this.root.attr('title', this._tooltip);
        }

        protected componentWillUpdate(nextProps: any, nextState: any): void {
            let html = '';
            if (nextState) {
                html += WUX.buildIcon(this.props, '', ' ') + nextState;
            }
            else {
                html += WUX.buildIcon(this.props);
            }
            this.root.html(html);
        }
    }

    export class WLink extends WComponent<string, string> {
        protected _href: string;
        protected _target: string;

        constructor(id?: string, text?: string, icon?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, href?: string, target?: string) {
            // WComponent init
            super(id ? id : '*', 'WLink', icon, classStyle, style, attributes);
            this.updateState(text);
            this.rootTag = 'a';
            // WLink init
            this._href = href;
            this._target = target;
        }

        get icon(): string {
            return this.props;
        }
        set icon(s: string) {
            this.update(s, this.state, true, false, false);
        }

        get href(): string {
            return this._href;
        }
        set href(s: string) {
            this._href = s;
            if (this.root && this.root.length) {
                if (s) {
                    this.root.attr('href', s);
                }
                else {
                    this.root.removeAttr('href');
                }
            }
        }

        get target(): string {
            return this._target;
        }
        set target(s: string) {
            this._target = s;
            if (this.root && this.root.length) {
                if (s) {
                    this.root.attr('target', s);
                }
                else {
                    this.root.removeAttr('target');
                }
            }
        }

        protected render() {
            let addAttributes = '';
            if (this._href) addAttributes += 'href="' + this._href + '"';
            if (this._target) {
                if (addAttributes) addAttributes += ' ';
                addAttributes += 'target="' + this._target + '"';
            }
            let html = '';
            if (this.state) {
                html += WUX.buildIcon(this.icon, '', ' ') + this.state;
            }
            else {
                html += WUX.buildIcon(this.icon);
            }
            return this.build(this.rootTag, html, addAttributes);
        }

        protected componentDidMount(): void {
            if (this._tooltip) this.root.attr('title', this._tooltip);
        }

        protected componentWillUpdate(nextProps: any, nextState: any): void {
            let html = '';
            if (nextState) {
                html += WUX.buildIcon(this.icon, '', ' ') + nextState;
            }
            else {
                html += WUX.buildIcon(this.icon);
            }
            this.root.html(html);
        }
    }

    export class WTab extends WComponent<any, number> {
        tabs: WContainer[];

        constructor(id?: string, classStyle?: string, style?: string | WStyle, attributes?: string | object, props?: any) {
            // WComponent init
            super(id ? id : '*', 'WTab', props, classStyle, style, attributes);
            // WTab init
            this.tabs = [];
        }

        addTab(title: string, icon?: string): WContainer {
            let tab = new WContainer('', 'panel-body');
            tab.name = WUX.buildIcon(icon, '', ' ') + title;
            this.tabs.push(tab);
            return tab;
        }

        protected render() {
            if (this.state == null) this.state = 0;
            let r: string = '<div';
            if (this._classStyle) {
                r += ' class="tabs-container ' + this._classStyle + '"';
            }
            else {
                r += ' class="tabs-container"';
            }
            r += ' id="' + this.id + '"';
            if (this._style) r += ' style="' + this._style + '"';
            if (this.attributes) r += ' ' + this.attributes;
            r += '>';
            r += '<ul class="nav nav-tabs">';
            for (let i = 0; i < this.tabs.length; i++) {
                let tab = this.tabs[i];
                if (i == this.state) {
                    r += '<li class="active"><a data-toggle="tab" href="#' + this.id + '-' + i + '"> ' + tab.name + '</a></li>';
                }
                else {
                    r += '<li><a data-toggle="tab" href="#' + this.id + '-' + i + '"> ' + tab.name + '</a></li>';
                }
            }
            r += '</ul>';
            r += '<div class="tab-content">';
            for (let i = 0; i < this.tabs.length; i++) {
                if (i == this.state) {
                    r += '<div id="' + this.id + '-' + i + '" class="tab-pane active"></div>';
                }
                else {
                    r += '<div id="' + this.id + '-' + i + '" class="tab-pane"></div>';
                }
            }
            r += '</div></div>';
            return r;
        }

        protected componentDidUpdate(prevProps: any, prevState: any): void {
            $('.nav-tabs a[href="#' + this.id + '-' + this.state + '"]').tab('show');
        }

        protected componentDidMount(): void {
            if (!this.tabs.length) return;
            for (let i = 0; i < this.tabs.length; i++) {
                let container = this.tabs[i];
                let tabPane = $('#' + this.id + '-' + i);
                if (!tabPane.length) continue;
                container.mount(tabPane);
            }
            let _self = this;
            this.root.find('a[data-toggle="tab"]').on('shown.bs.tab', (e?: JQueryEventObject) => {
                let href = $(e.target).attr('href');
                if (href) {
                    let sep = href.lastIndexOf('-');
                    if (sep >= 0) _self.setState(parseInt(href.substring(sep + 1)));
                }
            });
        }

        componentWillUnmount(): void {
            for (let c of this.tabs) {
                if(c) c.unmount();
            }
        }
    }

    export class WSelect extends WComponent implements WISelectable {
        options: Array<string | WEntity>;
        multiple: boolean;

        constructor(id?: string, options?: Array<string | WEntity>, multiple?: boolean, classStyle?: string, style?: string | WStyle, attributes?: string | object) {
            // WComponent init
            super(id ? id : '*', 'WSelect', null, classStyle, style, attributes);
            // WSelect init
            this.rootTag = 'select';
            this.options = options;
            this.multiple = multiple;
        }

        getProps(): any {
            if (!this.root) return this.props;
            this.props = [];
            this.root.find('option:selected').each((i: any, e: Element) => {
                this.props.push($(e).text());
            });
            return this.props;
        }

        select(i: number): this {
            if (!this.root || !this.options) return this;
            this.setState(this.options.length > i ? this.options[i] : null);
            return this;
        }

        addOption(e: string | WEntity, sel?: boolean): this {
            if (!e) return this;
            if (!this.options) this.options = [];
            this.options.push(e);
            if (!this.mounted) return this;
            let o = this.buildOptions();
            this.root.html(o);
            if (sel) this.updateState(e);
            return this;
        }

        remOption(e: string | WEntity): this {
            if (!e || !this.options) return this;
            let x = -1;
            for (let i = 0; i < this.options.length; i++) {
                let s = this.options[i];
                if (!s) continue;
                if (typeof e == 'string') {
                    if (typeof s == 'string') {
                        if (s == e) {
                            x = i;
                            break;
                        }
                    }
                    else {
                        if (s.id == e) {
                            x = i;
                            break;
                        }
                    }
                }
                else {
                    if (typeof s == 'string') {
                        if (s == e.id) {
                            x = i;
                            break;
                        }
                    }
                    else {
                        if (s.id == e.id) {
                            x = i;
                            break;
                        }
                    }
                }
            }
            if (x >= 0) {
                this.options.splice(x, 1);
                if (!this.mounted) return this;
                let o = this.buildOptions();
                this.root.html(o);
            }
            return this;
        }

        setOptions(options: Array<string | WEntity>, prevVal?: boolean): this {
            this.options = options;
            if (!this.mounted) return this;
            let pv = this.root.val();
            let o = this.buildOptions();
            this.root.html(o);
            if (prevVal) {
                this.root.val(pv);
            }
            else if (options && options.length) {
                if (typeof options[0] == 'string') {
                    this.trigger('statechange', options[0]);
                }
                else {
                    this.trigger('statechange', WUtil.getString(options[0], 'id'));
                }
            }
            return this;
        }

        protected updateState(nextState: any) {
            super.updateState(nextState);
            if (this.root) {
                if (this.state == null) {
                    this.root.val('');
                }
                else if (typeof this.state == 'string' || typeof this.state == 'number') {
                    this.root.val('' + this.state);
                }
                else {
                    this.root.val(this.state.id);
                }
            }
        }

        protected render() {
            let o = this.buildOptions();
            let addAttributes = 'name="' + this.id + '"';
            if (this.multiple) addAttributes += ' multiple="multiple"';
            return this.buildRoot('select', o, addAttributes);
        }

        protected componentDidMount(): void {
            if (this._tooltip) this.root.attr('title', this._tooltip);
            if (this.state) this.root.val(this.state);
            this.root.on('change', (e: JQueryEventObject) => {
                this.trigger('statechange', this.root.val());
            });
        }

        protected buildOptions(): string {
            let r = '';
            if(!this.options) this.options = [];
            for (let opt of this.options) {
                if (typeof opt == 'string') {
                    r += '<option>' + opt + '</option>';
                }
                else {
                    r += '<option value="' + opt.id + '">' + opt.text + '</option>';
                }
            }
            return r;
        }
    }

    export class WRadio extends WComponent implements WISelectable {
        options: Array<string | WEntity>;
        label: string;

        constructor(id?: string, options?: Array<string | WEntity>, classStyle?: string, style?: string | WStyle, attributes?: string | object, props?: any) {
            // WComponent init
            super(id ? id : '*', 'WRadio', props, classStyle, style, attributes);
            // WRadio init 
            this.options = options;
        }

        set tooltip(s: string) {
            this._tooltip = s;
            if (this.internal) this.internal.tooltip = s;
            if (!this.options || !this.options.length) return;
            for (let i = 0; i < this.options.length; i++) {
                let $item = $('#' + this.id + '-' + i);
                if (!$item.length) continue;
                if (this._tooltip) $item.attr('title', this._tooltip);
            }
        }

        select(i: number): this {
            if (!this.root || !this.options) return this;
            this.setState(this.options.length > i ? this.options[i] : null);
            return this;
        }

        protected render() {
            let r = '';
            if (this.label) {
                r += this.id ? '<label for="' + this.id + '">' : '<label>'
                r += this.label.replace('<', '&lt;').replace('>', '&gt;')
                r += '</label> ';
            }
            if (!this.options || !this.options.length) return r;
            if (this.state === undefined) this.state = this.options[0];
            for (let i = 0; i < this.options.length; i++) {
                let opt = this.options[i];
                if (typeof opt == "string") {
                    if (match(this.state, opt)) {
                        r += '&nbsp;<label style="display:inline;"><input type="radio" value="' + opt + '" name="' + this.id + '" id="' + this.id + '-' + i + '" checked> ' + opt + '</label>&nbsp;';
                    }
                    else {
                        r += '&nbsp;<label style="display:inline;"><input type="radio" value="' + opt + '" name="' + this.id + '" id="' + this.id + '-' + i + '"> ' + opt + '</label>&nbsp;';
                    }
                }
                else {
                    if (match(this.state, opt)) {
                        r += '&nbsp;<label style="display:inline;"><input type="radio" value="' + opt.id + '" name="' + this.id + '" id="' + this.id + '-' + i + '" checked> ' + opt.text + '</label>&nbsp;';
                    }
                    else {
                        r += '&nbsp;<label style="display:inline;"><input type="radio" value="' + opt.id + '" name="' + this.id + '" id="' + this.id + '-' + i + '"> ' + opt.text + '</label>&nbsp;';
                    }
                }
            }
            return r;
        }

        protected componentDidMount(): void {
            if (!this.options || !this.options.length) return;
            for (let i = 0; i < this.options.length; i++) {
                let $item = $('#' + this.id + '-' + i);
                if (!$item.length) continue;
                if (this._tooltip) $item.attr('title', this._tooltip);
                let opt = this.options[i];
                $item.click(() => {
                    this.setState(opt);
                });
            }
        }

        protected componentDidUpdate(prevProps: any, prevState: any): void {
            let idx = -1;
            for (let i = 0; i < this.options.length; i++) {
                if (match(this.state, this.options[i])) {
                    idx = i;
                    break;
                }
            }
            if (idx >= 0) $('#' + this.id + '-' + idx).prop('checked', true);
        }
    }

    export interface WITable extends WComponent {
        // Base attributes
        header: string[];
        keys: any[];
        /** 's'=string, 'n'=number, 'p'=percentage, 'c'=currency, 'c5'=currency, 'i'=integer, 'd'=date, 't'=date-time, 'h'=time, 'b'=boolean */
        types: string[];
        widths: number[];
        widthsPerc: boolean;
        filter: boolean;
        hideHeader: boolean;
        templates: ((cnt: JQuery, opt: { data: any, text: string }) => any)[];

        // Selection
        selectionMode: 'single' | 'multiple' | 'none';
        clearSelection(): this;
        select(idxs: number[]): this;
        selectAll(toggle?: boolean): this;
        getSelectedRows(): number[];
        getSelectedRowsData(): any[];

        // Utilities
        getFilteredRowsData(): any[];
        refresh(): this;

        // Events
        onSelectionChanged(handler: (e: { element?: JQuery, selectedRowsData?: Array<any> }) => any): void;
        onDoubleClick(handler: (e: { element?: JQuery }) => any): void;
        onRowPrepared(handler: (e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number }) => any): void;
    }

    export class WTable extends WComponent<any, any[]> implements WITable {
        header: string[];
        keys: any[];
        types: string[];
        widths: number[];
        widthsPerc: boolean;
        filter: boolean;
        hideHeader: boolean;
        templates: ((cnt: JQuery, opt: { data: any, text: string }) => any)[];

        selectionMode: 'single' | 'multiple' | 'none';
        selectedRow: number = -1;

        selClass: string;
        colStyle: string | WStyle;
        rowStyle: string | WStyle;
        headStyle: string | WStyle;
        footerStyle: string | WStyle;
        /** First col style */
        col0Style: string | WStyle;
        /** Last col style */
        colLStyle: string | WStyle;
        /** Bold non zero value */
        boldNonZero: boolean;

        constructor(id: string, header: string[], keys?: any[], classStyle?: string, style?: string, attributes?: string | object, props?: any) {
            // WComponent init
            super(id ? id : '*', 'WTable', props, classStyle, style, attributes);
            this.rootTag = 'table';
            // WTable init
            this.header = header;
            if (keys && keys.length) {
                this.keys = keys;
            }
            else {
                this.keys = [];
                if (this.header) for (let i = 0; i < this.header.length; i++) this.keys.push(i);
            }
            this.widths = [];
            this.templates = [];
            this.boldNonZero = false;
            this.selClass = 'success';
        }

        onSelectionChanged(handler: (e: { element?: JQuery, selectedRowsData?: Array<any> }) => any): void {
            if (!this.handlers['_selectionchanged']) this.handlers['_selectionchanged'] = [];
            this.handlers['_selectionchanged'].push(handler);
        }

        onDoubleClick(handler: (e: { element?: JQuery }) => any): void {
            if (!this.handlers['_doubleclick']) this.handlers['_doubleclick'] = [];
            this.handlers['_doubleclick'].push(handler);
        }

        onRowPrepared(handler: (e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number }) => any) {
            if (!this.handlers['_rowprepared']) this.handlers['_rowprepared'] = [];
            this.handlers['_rowprepared'].push(handler);
        }

        onCellClick(handler: (e: { element?: JQuery, rowIndex?: number, colIndex?: number }) => any) {
            if (!this.handlers['_cellclick']) this.handlers['_cellclick'] = [];
            this.handlers['_cellclick'].push(handler);
        }

        onCellHoverChanged(handler: (e: { element?: JQuery, rowIndex?: number, colIndex?: number }) => any) {
            if (!this.handlers['_cellhover']) this.handlers['_cellhover'] = [];
            this.handlers['_cellhover'].push(handler);
        }

        clearSelection(): this {
            this.selectedRow = -1;
            if (!this.mounted) return this;
            this.root.find('tbody tr').removeClass('success');
            if (!this.handlers['_selectionchanged']) return this;
            for (let handler of this.handlers['_selectionchanged']) {
                handler({ element: this.root, selectedRowsData: [] });
            }
            return this;
        }

        select(idxs: number[]): this {
            this.selectedRow = idxs && idxs.length ? idxs[0] : -1;
            if (!this.mounted) return this;
            this.root.find('tbody tr').removeClass('success');
            for (let idx of idxs) {
                this.root.find('tbody tr:eq(' + idx + ')').addClass('success');
            }
            if (!this.handlers['_selectionchanged']) return this;
            for (let handler of this.handlers['_selectionchanged']) {
                handler({ element: this.root, selectedRowsData: [] });
            }
            return this;
        }

        selectAll(toggle?: boolean): this {
            if (!this.mounted) return this;
            this.root.find('tbody tr').addClass('success');
            if (!this.handlers['_selectionchanged']) return this;
            for (let handler of this.handlers['_selectionchanged']) {
                handler({ element: this.root, selectedRowsData: [] });
            }
            return this;
        }

        getSelectedRows(): number[] {
            if (!this.mounted) return [];
            if (this.selectedRow < 0) return [];
            return [this.selectedRow];
        }

        getSelectedRowsData(): any[] {
            if (!this.mounted) return [];
            if (this.selectedRow < 0) return [];
            if (!this.state || !this.state.length) return [];
            if (this.state.length <= this.selectedRow) return [];
            return [this.state[this.selectedRow]];
        }

        getFilteredRowsData(): any[] {
            return this.state;
        }

        refresh(): this {
            return this;
        }

        getCellValue(r: number, c: number): any {
            if (r < 0 || c < 0) return null;
            if (!this.state || this.state.length <= r) return null;
            if (!this.keys || this.keys.length <= c) return null;
            let key = this.keys[c];
            let row = this.state[r];
            return WUtil.getValue(row, key);
        }

        getColHeader(c: number): string {
            if (c < 0) return '';
            if (!this.header || this.header.length <= c) return '';
            return this.header[c];
        }

        protected render() {
            if (!this.shouldBuildRoot()) return undefined;
            let tableClass = 'table';
            if (this._classStyle) tableClass = this._classStyle.indexOf('table ') >= 0 ? this._classStyle : tableClass + ' ' + this._classStyle;
            let ts = this.style ? ' style="' + this.style + '"' : '';
            let r = '<div class="table-responsive"><table id="' + this.id + '" class="' + tableClass + '"' + ts + '>';
            if (this.header && this.header.length) {
                let ths = false;
                if (typeof this.headStyle == 'string') {
                    if (this.headStyle.indexOf('text-align') > 0) ths = true;
                }
                else if (this.headStyle && this.headStyle.a) {
                    ths = true;
                }
                if (!this.hideHeader) {
                    if (ths) {
                        r += '<thead><tr>';
                    }
                    else {
                        r += '<thead><tr' + WUX.buildCss(this.headStyle) + '>';
                    }
                    let j = -1;
                    for (let h of this.header) {
                        j++;
                        let s: string | WStyle;
                        if (j == 0) {
                            s = this.col0Style ? this.col0Style : this.colStyle;
                        }
                        else if (j == this.header.length - 1) {
                            s = this.colLStyle ? this.colLStyle : this.colStyle;
                        }
                        else {
                            s = ths ? this.headStyle : this.colStyle;
                        }
                        let w = this.widths && this.widths.length > j ? this.widths[j] : 0;
                        if (w) {
                            if (this.widthsPerc) {
                                r += '<th' + WUX.buildCss(s, { w: w + '%' }) + '>' + h + '</th>';
                            }
                            else {
                                r += '<th' + WUX.buildCss(s, { w: w }) + '>' + h + '</th>';
                            }
                        }
                        else {
                            r += '<th' + WUX.buildCss(s) + '>' + h + '</th>';
                        }
                    }
                    r += '</tr></thead>';
                }
            }
            r += '<tbody></tbody>';
            r += '</table></div>';
            return r;
        }

        protected componentDidMount(): void {
            this.buildBody();

            let _self = this;
            this.root.on('click', 'tbody tr', function (e) {
                if (!_self.handlers['_selectionchanged']) {
                    if (!_self.selectionMode || _self.selectionMode == 'none') return;
                }
                else {
                    if (!_self.selectionMode || _self.selectionMode == 'none') return;
                }
                let $this = $(this);
                $this.addClass('success').siblings().removeClass('success');
                _self.selectedRow = $this.index();
                let rowData = _self.state && _self.state.length ? _self.state[_self.selectedRow] : undefined;
                if (_self.handlers['_selectionchanged']) {
                    for (let h of _self.handlers['_selectionchanged']) {
                        h({ element: _self.root, selectedRowsData: [rowData] });
                    }
                }
            });
            this.root.on('click', 'tbody tr td', function (e) {
                if (!_self.handlers['_cellclick']) return;
                let $this = $(this);
                let r = $this.parent().index();
                let c = $this.index();
                for (let h of _self.handlers['_cellclick']) {
                    h({ element: _self.root, rowIndex: r, colIndex: c });
                }
            });
            this.root.on('mouseover', 'tbody tr td', function (e) {
                if (!_self.handlers['_cellhover']) return;
                let $this = $(this);
                let r = $this.parent().index();
                let c = $this.index();
                for (let h of _self.handlers['_cellhover']) {
                    h({ element: _self.root, rowIndex: r, colIndex: c });
                }
            });
            this.root.on('dblclick', 'tbody tr', function (e) {
                if (!_self.handlers['_doubleclick']) return;
                for (let h of _self.handlers['_doubleclick']) {
                    h({ element: _self.root });
                }
            });
        }

        protected componentDidUpdate(prevProps: any, prevState: any): void {
            this.buildBody();
        }

        protected buildBody(): void {
            this.selectedRow = -1;
            let tbody = this.root.find('tbody');
            tbody.html('');

            if (!this.state || !this.state.length) return;
            if (!this.keys || !this.keys.length) return;
            let i = -1;
            for (let row of this.state) {
                i++;
                let $r: JQuery;
                if (i == this.state.length - 1) {
                    if (this.footerStyle) {
                        $r = $(WUX.build('tr', '', this.footerStyle));
                    }
                    else {
                        $r = $(WUX.build('tr', '', this.rowStyle));
                    }
                }
                else {
                    $r = $(WUX.build('tr', '', this.rowStyle));
                }
                tbody.append($r);
                if (this.handlers['_rowprepared']) {
                    let e = { element: this.root, rowElement: $r, data: row, rowIndex: i };
                    for (let handler of this.handlers['_rowprepared']) handler(e);
                }
                let j = -1;
                for (let key of this.keys) {
                    let v = row[key];

                    let align = '';
                    if (v == null) v = '';

                    j++;
                    let t = WUtil.getItem(this.types, j);
                    switch (t) {
                        case 'w':
                            align = 'text-center';
                            break;
                        case 'c':
                            v = WUX.formatCurr(v);
                            align = 'text-right';
                            break;
                        case 'c5':
                            v = WUX.formatCurr5(v);
                            align = 'text-right';
                            break;
                        case 'i':
                            v = WUX.formatNum(v);
                            align = 'text-right';
                            break;
                        case 'n':
                            v = WUX.formatNum2(v);
                            align = 'text-right';
                            break;
                        case 'd':
                            v = WUX.formatDate(v);
                            break;
                        case 't':
                            v = WUX.formatDateTime(v);
                            break;
                        case 'b':
                            v = v ? '&check;' : '';
                            break;
                        default:
                            if (v instanceof Date) v = WUX.formatDate(v);
                            if (typeof v == 'boolean') v = v ? '&check;' : '';
                            if (typeof v == 'number') {
                                v = WUX.formatNum2(v);
                                align = 'text-right';
                            }
                    }

                    let s: string | WStyle;
                    if (j == 0) {
                        s = this.col0Style ? this.col0Style : this.colStyle;
                    }
                    else if (j == this.header.length - 1) {
                        s = this.colLStyle ? this.colLStyle : this.colStyle;
                    }
                    else {
                        s = this.colStyle;
                    }
                    if (typeof s == 'string') {
                        if (s.indexOf('text-align') > 0) align = '';
                    }
                    else if (s && s.a) {
                        align = '';
                    }
                    let w = this.widths && this.widths.length > j ? this.widths[j] : 0;
                    let f = this.templates && this.templates.length > j ? this.templates[j] : undefined;
                    if (f) {
                        let $td = $('<td' + WUX.buildCss(s, align, { w: w }) + '></td>');
                        f($td, { data: row, text: v });
                        $r.append($td); 
                    }
                    else {
                        if (WUtil.hasComponents(v)) {
                            let ac = WUtil.toArrayComponent(v);
                            for (let c of ac) {
                                let $td = $('<td' + WUX.buildCss(s, align, { w: w }) + '></td>');
                                $r.append($td);
                                c.mount($td);
                            }
                        }
                        else {
                            if (this.boldNonZero && v != 0 && v != '0' && v != '') {
                                $r.append($('<td' + WUX.buildCss(s, align, { w: w }) + '><strong>' + v + '</strong></td>')); 
                            }
                            else {
                                $r.append($('<td' + WUX.buildCss(s, align, { w: w }) + '>' + v + '</td>')); 
                            }
                        }
                    }
                }
                if (this.header && this.header.length > this.keys.length) {
                    for (let i = 0; i < this.header.length - this.keys.length; i++) {
                        $r.append($('<td' + WUX.buildCss(this.colStyle) + '></td>'));
                    }
                }
            }
        }
    }

    export class WFormPanel extends WComponent<WField[][], any> {
        protected title: string;
        protected rows: WField[][];
        protected roww: WWrapper[];
        protected currRow: WField[];
        protected hiddens: WField[];
        protected internals: { [fid: string]: any };
        protected components: WComponent[];
        protected readonly: boolean;
        protected lastTs: number;
        protected dpids: string[];

        captions: WComponent[];
        stateChangeOnBlur: boolean;
        nextOnEnter: boolean;
        inputClass: string;
        checkboxStyle: string;
        nextMap: { [fid: string]: string };
        lastChanged: string;
        mapTooltips: { [fid: string]: string };
        mapLabelLinks: { [fid: string]: WLink[] };
        minValues: { [fid: string]: any };
        maxValues: { [fid: string]: any };
        autoValidate: boolean;

        footer: WElement[];
        footerClass: string;
        footerStyle: string | WStyle;
        footerSep: number | string;

        constructor(id?: string, title?: string, action?: string, props?: any) {
            // WComponent init
            super(id ? id : '*', 'WFormPanel', props);
            this.rootTag = 'form';
            if (action) {
                this._attributes = 'role="form" name="' + this.id + '" action="' + action + '"';
            }
            else {
                this._attributes = 'role="form" name="' + this.id + '" action="javascript:void(0);"';
            }
            // WFormPanel init
            this.stateChangeOnBlur = false;
            this.inputClass = CSS.FORM_CTRL;
            this.title = title;
            this.nextOnEnter = true;
            this.autoValidate = false;

            this.init();
        }

        init(): this {
            this.rows = [];
            this.roww = [];
            this.hiddens = [];
            this.internals = {};
            this.components = [];
            this.captions = [];
            this.dpids = [];
            this.nextMap = {};
            this.mapTooltips = {};
            this.mapLabelLinks = {};
            this.minValues = {};
            this.maxValues = {};
            this.footer = [];
            this.currRow = null;
            this.addRow();
            return this;
        }

        focus(): this {
            if (!this.mounted) return this;
            let f = this.first(true);
            if (f) {
                if (f.component) {
                    f.component.focus();
                }
                else if (f.element) {
                    f.element.focus();
                }
            }
            return this;
        }

        first(enabled?: boolean): WField {
            if (!this.rows) return null;
            for (let row of this.rows) {
                for (let f of row) {
                    if (enabled) {
                        if (f.enabled == null || f.enabled) {
                            if (f.readonly == null || !f.readonly) return f;
                        }
                    }
                    else {
                        return f;
                    }
                }
            }
            return null;
        }

        focusOn(fieldId: string): this {
            if (!this.mounted) return this;
            let f = this.getField(fieldId);
            if (!f) return this;
            if (f.component) {
                f.component.focus();
            }
            else if (f.element) {
                f.element.focus();
            }
            return this;
        }

        onEnterPressed(h: (e: WEvent) => any): void {
            if (!h) return;
            if (!this.handlers['_enter']) this.handlers['_enter'] = [];
            this.handlers['_enter'].push(h);
            this.nextOnEnter = false;
        }

        onEnd(h: (e: WEvent) => any): void {
            if (!h) return;
            if (!this.handlers['_end']) this.handlers['_end'] = [];
            this.handlers['_end'].push(h);
        }

        onChangeDate(h: (e: JQueryEventObject) => any): void {
            if (!h) return;
            if (!this.handlers['_changedate']) this.handlers['_changedate'] = [];
            this.handlers['_changedate'].push(h);
        }

        addToFooter(c: WElement, sep?: number | string): this {
            if (!c && !this.footer) return this;
            if (sep != undefined) this.footerSep = sep;
            this.footer.push(c)
            return this;
        }

        addRow(classStyle?: string, style?: string | WStyle, id?: string, attributes?: string | object, type: string = 'row'): this {
            if (this.currRow && !this.currRow.length) {
                this.roww[this.roww.length - 1] = {
                    classStyle: classStyle,
                    style: style,
                    id: id,
                    attributes: WUX.attributes(attributes),
                    type: type
                };
                return this;
            }
            this.currRow = new Array<WField>();
            this.rows.push(this.currRow);
            this.roww.push({
                classStyle: classStyle,
                style: style,
                id: id,
                attributes: WUX.attributes(attributes),
                type: type
            });
            return this;
        }

        addTextField(fieldId: string, label: string, readonly?: boolean): this {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WInputType.Text, 'readonly': readonly });
            return this;
        }

        addNoteField(fieldId: string, label: string, rows: number, readonly?: boolean): this {
            if (!rows) rows = 3;
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WInputType.Note, 'attributes': 'rows="' + rows + '"', 'readonly': readonly });
            return this;
        }

        addCurrencyField(fieldId: string, label: string, readonly?: boolean): this {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WInputType.Text, 'readonly': readonly, valueType: 'c', style: { a: 'right' } });
            return this;
        }

        addCurrency5Field(fieldId: string, label: string, readonly?: boolean): this {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WInputType.Text, 'readonly': readonly, valueType: 'c5', style: { a: 'right' } });
            return this;
        }

        addIntegerField(fieldId: string, label: string, readonly?: boolean): this {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WInputType.Text, 'readonly': readonly, valueType: 'i' });
            return this;
        }

        addDecimalField(fieldId: string, label: string, readonly?: boolean): this {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WInputType.Text, 'readonly': readonly, valueType: 'n' });
            return this;
        }

        addDateField(fieldId: string, label: string, readonly?: boolean, minDate?: Date, maxDate?: Date): this {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WInputType.Date, 'readonly': readonly, valueType: 'd', minValue: minDate, maxValue: maxDate });
            return this;
        }

        addOptionsField(fieldId: string, label: string, options?: (string | WEntity)[], attributes?: string, readonly?: boolean): this {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WInputType.Select, 'readonly': readonly, 'options': options, 'attributes': attributes });
            return this;
        }

        addBooleanField(fieldId: string, label: string): this {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WInputType.CheckBox });
            return this;
        }

        addBlankField(label?: string, classStyle?: string, style?: string | WStyle, id?: string, attributes?: string, inner?: string): this {
            this.currRow.push({ 'id': id, 'label': label, 'type': WInputType.Blank, 'classStyle': classStyle, 'style': style, 'attributes': attributes, 'placeholder': inner });
            return this;
        }

        addRadioField(fieldId: string, label: string, options?: (string | WEntity)[]): this {
            let comp = new WRadio(this.subId(fieldId), options);
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WInputType.Radio, 'component': comp });
            return this;
        }

        addPasswordField(fieldId: string, label: string, readonly?: boolean): this {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WInputType.Password, 'readonly': readonly });
            return this;
        }

        addEmailField(fieldId: string, label: string, readonly?: boolean): this {
            this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WInputType.Email, 'readonly': readonly });
            return this;
        }

        addComponent(fieldId: string, label: string, component: WComponent, readonly?: boolean): this {
            if (!component) return this;
            if (fieldId) {
                component.id = this.subId(fieldId);
                this.currRow.push({ 'id': this.subId(fieldId), 'label': label, 'type': WInputType.Component, 'component': component, 'readonly': readonly });
                if (component instanceof WUX.WInput) {
                    if (!component.classStyle) component.classStyle = WUX.CSS.FORM_CTRL;
                }
            }
            else {
                component.id = '';
                this.currRow.push({ 'id': '', 'label': label, 'type': WInputType.Component, 'component': component, 'readonly': readonly });
            }
            this.components.push(component);
            return this;
        }

        addCaption(label: string, icon?: string, classStyle?: string, style?: string | WStyle): this {
            if (!label) return;
            let component = new WUX.WLabel('', label, icon, classStyle, style);
            this.currRow.push({ 'id': '', 'label': '', 'type': WInputType.Component, 'component': component, 'readonly': true });
            this.components.push(component);
            this.captions.push(component);
            return this;
        }

        addInternalField(fieldId: string, value?: any): this {
            if (value === undefined) value = null;
            this.internals[fieldId] = value;
            return this;
        }

        addHiddenField(fieldId: string, value?: any): this {
            this.hiddens.push({ 'id': this.subId(fieldId), 'type': WInputType.Hidden, 'value': value });
            return this;
        }

        setTooltip(fieldId: string, text: string): this {
            let f = this.getField(fieldId);
            if (!f) return this;
            if (!text) {
                delete this.mapTooltips[f.id];
            }
            else {
                this.mapTooltips[f.id] = text;
            }
            return this;
        }

        setLabelLinks(fieldId: string, links: WLink[]): this {
            let f = this.getField(fieldId);
            if (!f) return this;
            if (!links || !links.length) {
                delete this.mapLabelLinks[f.id];
            }
            else {
                this.mapLabelLinks[f.id] = links;
            }
            return this;
        }

        setReadOnly(readonly: boolean): this;
        setReadOnly(fieldId: string, readonly?: boolean): this;
        setReadOnly(fieldId: string | boolean, readonly?: boolean): this {
            if (typeof fieldId == 'string') {
                let f = this.getField(fieldId);
                if (!f) return this;
                f.readonly = readonly;
                if (this.mounted) {
                    if (f.component) {
                        f.component.enabled = !readonly;
                    }
                    else {
                        let $f = $('#' + f.id);
                        let t = WUX.getTagName($f);
                        if (t == 'select') {
                            if (readonly) {
                                $f.prop("disabled", true);
                            }
                            else {
                                $f.prop("disabled", false);
                            }
                        }
                        else {
                            $f.prop('readonly', readonly);
                        }
                    }
                }
            }
            else {
                for (let i = 0; i < this.rows.length; i++) {
                    let row = this.rows[i];
                    for (let j = 0; j < row.length; j++) {
                        let f = row[j];
                        f.readonly = fieldId;
                        if (this.mounted) {
                            if (f.component) {
                                f.component.enabled = !fieldId;
                            }
                            else {
                                let $f = $('#' + f.id);
                                let t = WUX.getTagName($f);
                                if (t == 'select') {
                                    if (fieldId) {
                                        $f.prop('disabled', true);
                                    }
                                    else {
                                        $f.prop('disabled', false);
                                    }
                                }
                                else {
                                    $f.prop('readonly', fieldId);
                                }
                            }
                        }
                    }
                }
            }
            this.trigger('propschange');
            return this;
        }

        set enabled(b: boolean) {
            this._enabled = b;
            for (let i = 0; i < this.rows.length; i++) {
                let row = this.rows[i];
                for (let j = 0; j < row.length; j++) {
                    let f = row[j];
                    f.enabled = b;
                    if (this.mounted) {
                        if (f.component) {
                            f.component.enabled = b;
                        }
                        else {
                            $('#' + f.id).prop("disabled", !b);
                        }
                    }
                }
            }
        }

        setEnabled(enabled: boolean): this;
        setEnabled(fieldId: string, enabled?: boolean): this;
        setEnabled(fieldId: string | boolean, enabled?: boolean): this {
            if (typeof fieldId == 'string') {
                let f = this.getField(fieldId);
                if (!f) return this;
                f.enabled = enabled;
                if (this.mounted) {
                    if (f.component) {
                        f.component.enabled = enabled;
                    }
                    else {
                        $('#' + f.id).prop("disabled", !enabled);
                    }
                }
            }
            else {
                this.enabled = fieldId;
            }
            this.trigger('propschange');
            return this;
        }

        setVisible(fieldId: string, visible?: boolean): this {
            let f = this.getField(fieldId);
            if (!f) return this;
            f.visible = visible;
            if (this.mounted) {
                if (f.component) {
                    f.component.visible = visible;
                }
                else {
                    if (visible)
                        $('#' + f.id).show();
                    else
                        $('#' + f.id).hide();
                }
                if (f.label) {
                    if (visible)
                        $('label[for="' + f.id + '"]').show();
                    else
                        $('label[for="' + f.id + '"]').hide();
                }
            }
            this.trigger('propschange');
            return this;
        }

        setLabelCss(fieldId: string, css: string | WStyle): this {
            let f = this.getField(fieldId);
            if (!f) return this;
            f.labelCss = css;
            if (this.mounted) {
                let $l = $('label[for="' + f.id + '"]');
                if ($l.length) WUX.setCss($l, css);
            }
            return this;
        }

        setLabelText(fieldId: string, t: string): this {
            let f = this.getField(fieldId);
            if (!f) return this;
            f.label = t;
            if (this.mounted) {
                let $l = $('label[for="' + f.id + '"]');
                if ($l.length) $l.html(t);
            }
            return this;
        }

        setSpanField(fieldId: string, span: number): this {
            let f = this.getField(fieldId);
            if (!f) return this;
            f.span = span;
            return this;
        }
 
        getField(fid: string): WField {
            if (!fid) return;
            let sid = fid.indexOf(this.id + '-') == 0 ? fid : this.subId(fid);
            for (let i = 0; i < this.rows.length; i++) {
                let row = this.rows[i];
                for (let j = 0; j < row.length; j++) {
                    let f = row[j];
                    if (f.id == sid) return f;
                }
            }
            return;
        }

        onMount(fid: string, h: (f: WField) => any): this {
            let x = this.getField(fid);
            if (!x) return this;
            x.onmount = h;
            return this;
        }

        onFocus(fid: string, h: (e: JQueryEventObject) => any): this {
            let x = this.getField(fid);
            if (!x) return this;
            x.onfocus = h;
            return this;
        }

        onBlur(fid: string, h: (e: JQueryEventObject) => any): this {
            let x = this.getField(fid);
            if (!x) return this;
            x.onblur = h;
            return this;
        }

        getStateOf(fid: string): any {
            let f = this.getField(fid);
            if (!f) return null;
            if (!f.component) return null;
            return f.component.getState();
        }

        getPropsOf(fid: string): any {
            let f = this.getField(fid);
            if (!f) return null;
            if (!f.component) return null;
            return f.component.getProps();
        }

        next(fid: string): WField {
            if (!fid) return;
            let sid = fid.indexOf(this.id + '-') == 0 ? fid : this.subId(fid);
            if (this.nextMap) {
                let nid = this.nextMap[this.ripId(sid)];
                if (nid) {
                    let r = this.getField(nid);
                    if (r) return r;
                }
            }
            let x = false;
            for (let i = 0; i < this.rows.length; i++) {
                let row = this.rows[i];
                for (let j = 0; j < row.length; j++) {
                    let f = row[j];
                    if (x) return f;
                    if (f.id == sid) x = true;
                }
            }
            return;
        }

        setMandatory(...fids: string[]): this {
            if (!this.rows) return this;
            let sids: string[] = [];
            for (let fid of fids) {
                let sid = fid.indexOf(this.id + '-') == 0 ? fid : this.subId(fid);
                sids.push(sid);
            }
            for (let i = 0; i < this.rows.length; i++) {
                let row = this.rows[i];
                for (let j = 0; j < row.length; j++) {
                    let f = row[j];
                    if (sids.indexOf(f.id) >= 0) {
                        f.required = true;
                    }
                    else {
                        f.required = false;
                    }
                }
            }
            return this;
        }

        checkMandatory(labels?: boolean, focus?: boolean, atLeastOne?: boolean): string {
            let values = this.getState();
            if (!values) values = {};
            let r = '';
            let x = '';
            let a = false;
            for (let i = 0; i < this.rows.length; i++) {
                let row = this.rows[i];
                for (let j = 0; j < row.length; j++) {
                    let f = row[j];
                    let id = this.ripId(f.id);
                    let v = values[id];
                    if (f.required) {
                        if (v == null || v == '') {
                            if (labels) {
                                r += ',' + f.label;
                            }
                            else {
                                r += ',' + id;
                            }
                            if (!x) x = id; // first
                        }
                        else {
                            a = true;
                        }
                    }
                }
            }
            if (atLeastOne && a) return '';
            if (x && focus) this.focusOn(x);
            if (r) return r.substring(1);
            return r;
        }

        getState() {
            this.state = this.autoValidate ? this.validate() : this.getValues();
            return this.state;
        }

        protected render() {
            return this.buildRoot(this.rootTag);
        }

        protected componentDidMount(): void {
            if (!this.inputClass) this.inputClass = CSS.FORM_CTRL;
            this.minValues = {};
            this.maxValues = {};
            this.dpids = [];
            for (let i = 0; i < this.rows.length; i++) {
                let w = this.roww[i];
                let r = '<div';
                if (w) {
                    let c = WUX.cls(w.type, w.classStyle, w.style);
                    if (c) r += ' class="' + c + '"';
                    let s = WUX.style(w.style);
                    if (s) r += ' style="' + s + '"';
                    if (w.id) r += ' id="' + w.id + '"';
                    if (w.attributes) r += ' ' + w.attributes;
                }
                else {
                    r += ' class="row"';
                }
                r += '></div>';
                let $r: JQuery = $(r);
                this.root.append($r);
                let row = this.rows[i];

                // Calcolo colonne effettive
                let cols = 0;
                for (let j = 0; j < row.length; j++) {
                    let f = row[j];
                    if (f.type === WInputType.Hidden) continue;
                    cols += f.span && f.span > 0 ? f.span : 1;
                }

                for (let j = 0; j < row.length; j++) {
                    let f = row[j];
                    if (f.id) {
                        if (f.minValue) this.minValues[f.id] = f.minValue;
                        if (f.maxValue) this.maxValues[f.id] = f.maxValue;
                    }
                    if (f.type === WInputType.Hidden) continue;

                    let cs = Math.floor(12 / cols);
                    if (cs < 1) cs = 1;
                    if ((cs == 1 && cols < 11) && (j == 0 || j == cols - 1)) cs = 2;
                    if (f.span && f.span > 0) cs = cs * f.span;
                    let $c = $('<div class="col-md-' + cs + '"></div>');
                    $r.append($c);

                    let $fg = $('<div class="form-group"></div>');
                    $c.append($fg);
                    if (f.label) {
                        let la = '';
                        let af = '';
                        if (f.labelCss) {
                            let lc = WUX.cls(f.labelCss);
                            let ls = WUX.style(f.labelCss);
                            if (lc) la += ' class="' + lc + '"';
                            if (ls) la += ' style="' + ls + '"';
                        }
                        else if (f.required) {
                            let lc = WUX.cls(WUX.CSS.FIELD_REQUIRED);
                            let ls = WUX.style(WUX.CSS.FIELD_REQUIRED);
                            if (lc) la += ' class="' + lc + '"';
                            if (ls) la += ' style="' + ls + '"';
                            af = ' *';
                        }
                        if (f.id && this.mapTooltips[f.id]) {
                            $fg.append($('<label for="' + f.id + '" title="' + this.mapTooltips[f.id] + '"' + la + '>' + f.label + af + '</label>'));
                        }
                        else if (f.id) {
                            $fg.append($('<label for="' + f.id + '" title="' + f.label + '"' + la + '>' + f.label + af + '</label>'));
                        }
                        else {
                            $fg.append($('<label title="' + f.label + '"' + la + '>' + f.label + af + '</label>'));
                        }
                        if (f.id && this.mapLabelLinks[f.id]) {
                            for (let link of this.mapLabelLinks[f.id]) {
                                let $sl = $('<span style="padding-left:8px;"></span>');
                                $fg.append($sl);
                                link.mount($sl);
                            }
                        }
                    }
                    switch (f.type) {
                        case WInputType.Blank:
                            f.element = $(WUX.build('div', f.placeholder, f.style, f.attributes, f.id, f.classStyle));
                            break;
                        case WInputType.Text:
                            let ir = '<input type="text" name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '" ';
                            if (f.readonly) ir += 'readonly ';
                            if (f.enabled == false) ir += 'disabled ';
                            if (f.style) ir += ' style="' + WUX.style(f.style) + '"';
                            ir += '/>';
                            f.element = $(ir);
                            break;
                        case WInputType.Note:
                            let nr = '<textarea name="' + f.id + '" id="' + f.id + '" class="form-control" ';
                            if (f.attributes) nr += f.attributes + ' ';
                            if (f.readonly) nr += 'readonly ';
                            if (f.enabled == false) nr += 'disabled ';
                            if (f.style) nr += ' style="' + WUX.style(f.style) + '"';
                            nr += '></textarea>';
                            f.element = $(nr);
                            break;
                        case WInputType.Date:
                            this.dpids.push(f.id);
                            let dr = '<div class="input-group" id="igd-' + f.id + '">';
                            dr += '<span class="input-group-addon">' + WUX.buildIcon(WUX.WIcon.CALENDAR) + '</span> ';
                            dr += '<input type="text" name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '" ';
                            if (f.readonly) dr += 'readonly ';
                            if (f.enabled == false) dr += 'disabled ';
                            dr += '/></div>';
                            f.element = $(dr);
                            break;
                        case WInputType.CheckBox:
                            if (!this.checkboxStyle) {
                                let ch = Math.round(0.8 * parseInt(this.root.css('font-size')));
                                if(isNaN(ch) || ch < 16) ch = 16;
                                this.checkboxStyle = 'height:' + ch + 'px;';
                            }
                            if(this.checkboxStyle.length > 2) {
                                f.element = $('<input type="checkbox" name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '" style="' + this.checkboxStyle + '"/>');
                            }
                            else {
                                f.element = $('<input type="checkbox" name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '"/>');
                            }
                            break;
                        case WInputType.Radio:
                            if (f.component) f.component.mount($fg);
                            break;
                        case WInputType.Select:
                            let sr = '';
                            if (f.attributes) {
                                sr += '<select name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '" ' + f.attributes;
                                if (f.readonly || f.enabled == false) sr += ' disabled';
                                sr += '>';
                            }
                            else {
                                sr += '<select name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '"';
                                if (f.readonly || f.enabled == false) sr += 'disabled';
                                sr += '>';
                            }
                            if (f.options && f.options.length > 0) {
                                for (let k = 0; k < f.options.length; k++) {
                                    let opt = f.options[k];
                                    sr += typeof opt === 'string' ? '<option>' + opt + '</option>' : '<option value="' + opt.id + '">' + opt.text + '</option>';
                                }
                            }
                            sr += '</select>';
                            f.element = $(sr);
                            break;
                        case WInputType.Email:
                            let ie = '<input type="text" name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '" ';
                            if (f.readonly) ie += 'readonly ';
                            if (f.enabled == false) ie += 'disabled ';
                            if (f.style) ie += ' style="' + WUX.style(f.style) + '"';
                            ie += '/>';
                            f.element = $(ie);
                            break;
                        case WInputType.Password:
                            let ip = '<input type="password" name="' + f.id + '" id="' + f.id + '" class="' + this.inputClass + '" ';
                            if (f.readonly) ip += 'readonly ';
                            if (f.enabled == false) ip += 'disabled ';
                            if (f.style) ip += ' style="' + WUX.style(f.style) + '"';
                            ip += '/>';
                            f.element = $(ip);
                            break;
                        case WInputType.Component:
                            if (f.component) {
                                if (f.enabled == false || f.readonly) f.component.enabled = false;
                                f.component.mount($fg);
                                if (f.onmount) f.onmount(f);
                                if (f.onfocus) f.component.on('focus', f.onfocus);
                                if (f.onblur) f.component.on('blur', f.onblur);
                            }
                            break;
                    }
                    if (f.element) {
                        $fg.append(f.element);
                        if (f.type == WInputType.Text) {
                            if (f.valueType == 'c' || f.valueType == 'c5') {
                                f.element.focus(function (e: JQueryEventObject) {
                                    // this refers to element
                                    if (!this.value) return;
                                    let s = WUX.formatNum(this.value);
                                    if (s.indexOf(',00') >= 0 && s.indexOf(',00') == s.length - 3) s = s.substring(0, s.length - 3);
                                    if (s.indexOf(',0') >= 0 && s.indexOf(',0') == s.length - 2) s = s.substring(0, s.length - 3);
                                    this.value = s;
                                    $(this).select();
                                });
                                if (f.valueType == 'c') {
                                    f.element.blur(function (e: JQueryEventObject) {
                                        // this refers to element
                                        if (!this.value) return;
                                        this.value = WUX.formatCurr(WUtil.toNumber(this.value));
                                    });
                                }
                                else {
                                    f.element.blur(function (e: JQueryEventObject) {
                                        // this refers to element
                                        if (!this.value) return;
                                        this.value = WUX.formatCurr5(WUtil.toNumber(this.value));
                                    });
                                }
                            }
                            else if (f.valueType == 'n') {
                                f.element.focus(function (e: JQueryEventObject) {
                                    // this refers to element
                                    if (!this.value) return;
                                    this.value = WUX.formatNum(this.value);
                                    $(this).select();
                                });
                                f.element.blur(function (e: JQueryEventObject) {
                                    // this refers to element
                                    if (!this.value) return;
                                    this.value = WUX.formatNum(this.value);
                                });
                            }
                            else if (f.valueType == 'i') {
                                f.element.focus(function (e: JQueryEventObject) {
                                    // this refers to element
                                    if (!this.value) return;
                                    this.value = WUtil.toInt(this.value);
                                    $(this).select();
                                });
                                f.element.blur(function (e: JQueryEventObject) {
                                    // this refers to element
                                    if (!this.value) return;
                                    this.value = WUtil.toInt(this.value);
                                });
                            }
                            else {
                                f.element.focus(function (e: JQueryEventObject) {
                                    $(this).select();
                                });
                            }
                        }
                        if (f.visible != null && !f.visible) {
                            f.element.hide();
                            if (f.label) $('label[for="' + f.id + '"]').hide();
                        }
                        if (f.onmount) f.onmount(f);
                        if (f.onfocus) f.element.focus(f.onfocus);
                        if (f.onblur) f.element.blur(f.onblur);
                    }
                }
            }
            for (let f of this.hiddens) {
                if (f.value == null) f.value = '';
                this.root.append('<input type="hidden" name="' + f.id + '" id="' + f.id + '" value="' + f.value + '">');
            }
            if (this.footer && this.footer.length > 0) {
                let fs = WUX.style(this.footerStyle);
                if (!this.footerClass) this.footerClass = 'col-md-12';
                fs = fs ? ' style="' + fs + '"' : ' style="text-align:right;"';

                if (this.footerSep) {
                    if (typeof this.footerSep == 'string') {
                        let c0 = this.footerSep.charAt(0);
                        if (c0 == '<') {
                            this.root.append(this.footerSep);
                        }
                        else if (WUtil.isNumeric(c0)) {
                            this.root.append('<div style="height:' + this.footerSep + 'px;"></div>');
                        }
                    }
                    else {
                        this.root.append('<div style="height:' + this.footerSep + 'px;"></div>');
                    }
                }

                let $fr: JQuery = $('<div class="row"></div>');
                this.root.append($fr);
                let $fc = $('<div class="' + this.footerClass + '"' + fs + '></div>');
                $fr.append($fc);
                for (let fco of this.footer) {
                    if (typeof fco == 'string' && fco.length > 0) {
                        $fc.append($(fco));
                    }
                    else if (fco instanceof WComponent) {
                        fco.mount($fc);
                    }
                    else {
                        $fc.append(fco);
                    }
                }
            }
            for (let fid of this.dpids) {
                let minDate = WUtil.getDate(this.minValues, fid);
                $('#' + fid).datepicker({
                    language: global.locale,
                    todayBtn: 'linked',
                    keyboardNavigation: false,
                    forceParse: false,
                    calendarWeeks: true,
                    autoclose: true,
                    minDate: minDate
                }).on('changeDate', (e: JQueryEventObject) => {
                    if (this.handlers['_changedate']) {
                        for (let h of this.handlers['_changedate']) h(e);
                    }
                    let md = WUtil.getDate(this.minValues, fid);
                    let xd = WUtil.getDate(this.maxValues, fid);
                    if (!md && !xd) return;
                    let dv = WUtil.getDate(e, 'date');
                    if (!dv) return;
                    let iv = WUtil.toInt(dv);
                    if (iv < 19000101) return;
                    let mv = WUtil.toInt(md);
                    if (mv >= 19000101 && iv < mv) {
                        WUX.showWarning(RES.ERR_DATE);
                        $(e.target).datepicker('setDate', md);
                    }
                    let xv = WUtil.toInt(xd);
                    if (xv >= 19000101 && iv > xv) {
                        WUX.showWarning(RES.ERR_DATE);
                        $(e.target).datepicker('setDate', xd);
                    }
                });
            }
            if (typeof this.state == 'object') this.updateView();
            this.root.find('input').keypress((e: JQueryEventObject) => {
                if (e.which == 13) {
                    let tid = $(e.target).attr('id');
                    let f = this.next(tid);
                    while (f && !this.isFocusable(f)) {
                        f = this.next(f.id);
                    }
                    if (f && this.nextOnEnter) {
                        if (f.component) {
                            f.component.focus();
                        }
                        else if (f.element) {
                            if (f.element.prop("tagName") == 'DIV') {
                                f.element.find('input').focus();
                            }
                            else {
                                f.element.focus();
                            }
                        }
                        if (!this.stateChangeOnBlur) {
                            this.lastChanged = this.ripId(tid);
                            this.trigger('statechange');
                        }
                    }
                    else {
                        this.lastChanged = this.ripId(tid);
                        this.trigger('statechange');
                    }
                    this.trigger('_enter', this.ripId(tid));
                    if (!f) {
                        this.trigger('_end', this.ripId(tid));
                    }
                }
            });
            if (this.stateChangeOnBlur) {
                this.root.find('input').blur((e: JQueryEventObject) => {
                    this.lastChanged = this.ripId($(e.target).attr('id'));
                    this.trigger('statechange');
                });
            }
            this.root.on('change', 'select', (e: JQueryEventObject) => {
                let ts = new Date().getTime();
                if (this.lastTs && ts - this.lastTs < 200) return;
                this.lastTs = ts;
                this.lastChanged = this.ripId($(e.target).attr('id'));
                this.trigger('statechange');
            });
        }

        protected isFocusable(f: WField): boolean {
            if (!f) return false;
            if (f.readonly) return false;
            if (f.enabled != null && !f.enabled) return false;
            return true;
        }

        protected updateState(nextState: any): void {
            super.updateState(nextState);
            if (!this.mounted) return;
            if (!nextState || $.isEmptyObject(nextState)) {
                this.clear();
            }
            else {
                this.updateView();
            }
        }

        isBlank(fid?: string): boolean {
            if (fid) {
                let v = this.getValue(fid);
                if (v === 0) return false;
                if (!v) return true;
                let s = '' + v;
                if (!s.trim()) return true;
                return false;
            }
            else {
                for (let i = 0; i < this.rows.length; i++) {
                    let row = this.rows[i];
                    for (let j = 0; j < row.length; j++) {
                        let f = row[j];
                        let v = this.getValue(f);
                        if (v == 0) return false;
                        if (v) return false;
                        let s = '' + v;
                        if (s.trim()) return false;
                    }
                }
                return true;
            }
        }

        isZero(fid: string): boolean {
            let v = this.getValue(fid);
            if (!v) return true;
            if (v == '0') return true;
            let s = '' + v;
            if (!s.trim()) return true;
            return false;
        }

        match(fid: string, val: any): boolean {
            let v = this.getValue(fid);
            let s1 = WUtil.toString(v);
            let s2 = WUtil.toString(val);
            return s1 == s2;
        }

        transferTo(dest: WComponent, force?: boolean, callback?: () => any): boolean {
            let res: boolean;
            if (dest instanceof WUX.WFormPanel) {
                dest.clear();
                res = super.transferTo(dest, force);
                for (let i = 0; i < this.rows.length; i++) {
                    let row = this.rows[i];
                    for (let j = 0; j < row.length; j++) {
                        let f = row[j];
                        if (!f.component) continue;
                        let d = dest.getField(this.ripId(f.id));
                        if (!d || !d.component) continue;
                        res = res && f.component.transferTo(d.component);
                    }
                }
                if (callback) callback();
            }
            else {
                res = super.transferTo(dest, force, callback);
            }
            return res;
        }

        clear(): this {
            if (this.debug) console.log('WUX.WFormPanel.clear');
            // Components
            for (var i = 0; i < this.components.length; i++) {
                if (this.components[i].id) this.components[i].setState(null);
            }
            // Internals
            for (let fid in this.internals) {
                if (!this.internals.hasOwnProperty(fid)) continue;
                this.internals[fid] = null;
            }
            if (!this.root) return this;
            // Reset form values
            let form = this.root;
            let f = form[0] as HTMLFormElement;
            if (!f || !f.elements) return this;
            for (let i = 0; i < f.elements.length; i++) {
                let e: any = f.elements[i];
                switch (e.type) {
                    case 'checkbox':
                    case 'radio':
                        e.checked = false;
                        break;
                    case 'select-one':
                    case 'select-multiple':
                        e.selectedIndex = -1;
                        break;
                    default:
                        e.value = '';
                }
            }
            // Dates
            if (this.dpids) {
                for(let d of this.dpids) {
                    $('#' + d).datepicker('setDate', null);
                }
            }
            return this;
        }

        select(fieldId: string, i: number): this {
            if (!fieldId) return this;
            let f = this.getField(fieldId);
            if (!f || !f.component) return this;
            let s = f.component['select'];
            if (typeof s === 'function') {
                s.bind(f.component)(i);
                return this;
            }
            console.error('WFormPanel.select(' + fieldId + ',' + i + ') not applicable.');
            return this;
        }

        setValue(fid: string, v: any, updState: boolean = true): this {
            if (this.debug) console.log('WUX.WFormPanel.setValue(' + fid + ',' + v + ',' + updState + ')');
            if (!fid) return this;
            let sid = this.subId(fid);
            if (updState) {
                if (!this.state) this.state = {};
                this.state[fid] = v;
            }
            // Internals
            if (this.internals[fid] !== undefined) {
                if (v === undefined) v = null;
                this.internals[fid] = v;
                return this;
            }
            // Components
            for (let c of this.components) {
                if (c.id == sid) {
                    c.setState(v);
                    return this;
                }
            }
            if (!this.root || !this.root.length) return this;
            if (typeof v == 'number') v = WUX.formatNum(v);
            // Dates
            if (this.dpids && this.dpids.indexOf(sid) >= 0) {
                $('#' + sid).datepicker('setDate', WUtil.toDate(v));
                return;
            }
            var $c = this.root.find('[name=' + sid + ']');
            if (!$c.length) $c = $('#' + sid);
            if (!$c.length) return this;
            if (v == null) v = '';
            switch ($c.attr('type')) {
                case 'checkbox':
                case 'radio':
                    $c.prop('checked', v);
                    break;
                default:
                    if (v instanceof Date) {
                        $c.val(WUX.formatDate(v));
                    } else if (Array.isArray(v)) {
                        $c.val(v);
                    } else {
                        $c.val(den(v.toString()));
                    }
            }
            return this;
        }

        getValue(fid: string | WField): any {
            if (!fid) return;
            let sid: string;
            let iid: string;
            if (typeof fid == 'string') {
                sid = this.subId(fid);
                iid = fid;
            }
            else {
                sid = fid.id;
                iid = fid.id;
            }
            // Components
            for (let c of this.components) {
                if (c.id == sid) return c.getState();
            }
            // Internals
            if (this.internals[iid] !== undefined) {
                return this.internals[iid];
            }
            if (!this.root || !this.root.length) return;
            // Get value form
            let $c = this.root.find('[name=' + sid + ']');
            if (!$c.length) $c = $('#' + sid);
            if (!$c.length) return;
            let e = $c.get(0);
            if (e) {
                switch (e.type) {
                    case 'checkbox': return e.checked;
                    case 'select-multiple':
                        let a = [];
                        for (var j = 0; j < e.length; j++) {
                            a.push(e.options[j].value);
                        }
                        return a;
                }
            }
            return $c.val();
        }

        getValues(formatted?: boolean): any {
            if (!this.root || !this.root.length) return {};
            let r = {};
            // Internals
            for (let fid in this.internals) {
                if (!this.internals.hasOwnProperty(fid)) continue;
                let v = this.internals[fid];
                if (v != null) r[fid] = v;
            }
            // Form Values
            let form = this.root;
            let f: HTMLFormElement = form[0] as HTMLFormElement;
            if (!f || !f.elements) return r;
            for (let i = 0; i < f.elements.length; i++) {
                let e: any = f.elements[i];
                if (!e.name || !e.value) continue;
                let k = e.name;
                switch (e.type) {
                    case 'checkbox':
                        r[this.ripId(k)] = e.checked;
                        break;
                    case 'radio':
                        if (e.checked) r[this.ripId(k)] = e.value;
                        break;
                    case 'select-one':
                        r[this.ripId(k)] = e.options[e.selectedIndex].value;
                        break;
                    case 'select-multiple':
                        let a = [];
                        for (let j = 0; j < e.length; j++) {
                            if (e.options[j].selected) a.push(e.options[j].value);
                        }
                        r[this.ripId(k)] = a;
                        break;
                    case 'text':
                    case 'textarea':
                        r[this.ripId(k)] = norm(e.value);
                        break;
                    default:
                        r[this.ripId(k)] = e.value;
                }
            }
            // Components
            for (let c of this.components) {
                if (c.id) {
                    let cv = null;
                    if (formatted) {
                        cv = WUX.format(c);
                    }
                    else {
                        cv = c.getState();
                    }
                    if (cv == null) continue;
                    r[this.ripId(c.id)] = cv;
                }
            }
            return r;
        }

        protected updateView() {
            if (this.debug) console.log('WUX.WFormPanel.updateView()');
            if (!this.state) {
                this.clear();
                return;
            }
            for (let id in this.state) {
                this.setValue(id, this.state[id], false);
            }
        }

        validate(): any {
            let values = this.getValues();
            for (let i = 0; i < this.rows.length; i++) {
                let row = this.rows[i];
                for (let j = 0; j < row.length; j++) {
                    let f = row[j];
                    var k = f.id;
                    let id = this.ripId(k);
                    if (f.required && values[id] == null) {
                        throw new Error(f.label + ': obbligatorio');
                    }
                    if (f.size && values[id] != null && values[id].length > f.size) {
                        throw new Error(f.label + ': supera ' + f.size + ' caratteri');
                    }
                    if (f.type && values[id] != null) {
                        let msg = null;
                        let rex = null;
                        if (f.type == WInputType.Date) {
                            values[id] = WUtil.toDate(values[id]);
                        }
                        switch (f.type) {
                            case WInputType.Number:
                                rex = new RegExp('^\\d+\\.\\d{1,2}$|^\\d*$');
                                if (!rex.test(values[id]))
                                    msg = f.label + ": " + values[id] + " non numerico";
                                break;
                            case WInputType.Integer:
                                rex = new RegExp('^\\d*$');
                                if (!rex.test(values[id]))
                                    msg = f.label + ": " + values[id] + " non intero";
                                break;
                            case WInputType.Email:
                                rex = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
                                if (!rex.test(values[id]))
                                    msg = f.label + ": " + values[id] + " email non valida";
                                break;
                        }
                        if (msg) throw new Error(msg);
                    }
                }
            }
            return values;
        }
    }

    export class WWindow<P = any, S = any> extends WComponent<P, S> {
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
        static DEF_HEADER_STYLE: WStyle = { p: 5, a: 'center' };
        titleStyle: string | WStyle;
        protected _title: string;
        protected tagTitle: string;
        
        constructor(id: string, name: string = 'WWindow', position?: 'top' | 'bottom', attributes?: string | object, props?: any) {
            // WComponent init
            super(id ? id : '*', name, props, '', '', attributes);
            this.position = position;
            if (!this.position) this.position = 'bottom';
            this.headerStyle = WWindow.DEF_HEADER_STYLE;
            // Auto-mount
            if (this.id && this.id != '*') {
                if ($('#' + this.id).length) $('#' + this.id).remove();
            }
            WuxDOM.onRender((e: WEvent) => {
                if (this.mounted) return;
                this.mount(e.element);
            });
        }

        onShow(handler: (e: WUX.WEvent) => any): void {
            if (!this.handlers['_onshow']) this.handlers['_onshow'] = [];
            this.handlers['_onshow'].push(handler);
        }

        onHide(handler: (e: WUX.WEvent) => any): void {
            if (!this.handlers['_onhide']) this.handlers['_onhide'] = [];
            this.handlers['_onhide'].push(handler);
        }

        onClose(handler: (e: WUX.WEvent) => any): void {
            if (!this.handlers['_onclose']) this.handlers['_onclose'] = [];
            this.handlers['_onclose'].push(handler);
        }

        get header(): WContainer {
            if (this.cntHeader) return this.cntHeader;
            this.cntHeader = new WContainer('', 'modal-header', this.headerStyle);
            this.btnCloseHeader = new WButton(this.subId('bhc'), '<span aria-hidden="true" tabIndex="-1">&times;</span><span class="sr-only">Close</span>', undefined, 'close', { op: 0.6 });
            this.btnCloseHeader.on('click', (e: JQueryEventObject) => {
                this.close();
            });
            this.cntHeader.add(this.btnCloseHeader);
            return this.cntHeader;
        }

        get body(): WContainer {
            if (this.cntBody) return this.cntBody;
            this.cntBody = new WContainer('', WUX.cls(this._classStyle));
            return this.cntBody;
        }

        get container(): WContainer {
            if (this.cntRoot) return this.cntRoot;
            let crs = '';
            let cra: WStyle = {};
            if (this.width) cra.w = this.width;
            if (this.height) cra.h = this.height;
            if (this.background) cra.bg = this.background;
            if (this.color) cra.c = this.color;
            if (this.position == 'top') {
                if (this.gap) {
                    cra.ml = WUtil.getNumber(WUX.global.window_top, 'ml') + this.gap;
                    crs = WUX.css(WUX.global.window_top, { d: 'none', b: 'rgba(0,0,0,0)', bs: '0 1px 3px rgba(0, 0, 0, 0.6)', t: this.gap }, this._style, cra);
                }
                else {
                    crs = WUX.css(WUX.global.window_top, { d: 'none', b: 'rgba(0,0,0,0)', bs: '0 1px 3px rgba(0, 0, 0, 0.6)' }, this._style, cra);
                }
            }
            else {
                if (this.gap) {
                    cra.ml = WUtil.getNumber(WUX.global.window_bottom, 'ml') + this.gap;
                    crs = WUX.css(WUX.global.window_bottom, { d: 'none', b: 'rgba(0,0,0,0)', bs: '0 1px 3px rgba(0, 0, 0, 0.6)', bt: this.gap }, this._style, cra);
                }
                else {
                    crs = WUX.css(WUX.global.window_bottom, { d: 'none', b: 'rgba(0,0,0,0)', bs: '0 1px 3px rgba(0, 0, 0, 0.6)' }, this._style, cra);
                }
            }
            this.cntRoot = new WContainer(this.id, this._classStyle, crs, this._attributes);            
            return this.cntRoot;
        }

        get title(): string {
            return this._title;
        }
        set title(s: string) {
            if (this._title && this.cntHeader) {
                this._title = s;
                this.cntHeader.getRoot().children(this.tagTitle + ':first').text(s);
            }
            else {
                this._title = s;
                this.header.add(this.buildTitle(s));
            }
        }

        show(parent?: WComponent): void {
            if (!this.beforeShow()) return;
            this.parent = parent;
            if (!this.mounted) WuxDOM.mount(this);
            if (this.root && this.root.length) {
                this.isShown = true;
                this.isClosed = false;
                this.root.show();
            }

            if (!this.handlers['_onshow']) return;
            for (let h of this.handlers['_onshow']) h(this.createEvent('_onshow'));
        }

        hide(): void {
            this.isShown = false;
            if (this.root && this.root.length) this.root.hide();

            if (!this.handlers['_onhide']) return;
            for (let h of this.handlers['_onhide']) h(this.createEvent('_onhide'));
        }

        close(): void {
            this.isClosed = true;
            if (this.handlers['_onclose']) {
                for (let h of this.handlers['_onclose']) h(this.createEvent('_onclose'));
            }
            this.hide();
        }

        scroll(c: WComponent | JQuery, hmin: number = 0, over: number = 4): number {
            if (!c || !this.root) return 0;
            let $c = c instanceof WComponent ? c.getRoot() : c;
            if (this.position == 'top') {
                // Scroll Top
                let st = $(document).scrollTop();
                // Component Top
                let et = $c.offset().top;
                // Real Top
                let rt = et - st - 2;
                // Overlay Height
                let oh = this.root.height();
                if (hmin && oh < hmin) oh = hmin;
                // If Component (Real) Top < Overlay Height...
                if (rt < oh) {
                    // Delta scroll
                    let ds = rt - oh;
                    if (st < ds) {
                        $(document).scrollTop(0);
                    }
                    else {
                        $(document).scrollTop(st - ds);
                    }
                    return ds;
                }
            }
            else {
                // Scroll Top
                let st = $(document).scrollTop();
                // Component Top
                let et = $c.offset().top;
                if (!et) {
                    let ep = $c.position();
                    if (ep) et = ep.top;
                }
                // Component Height
                let eh = $c.height();
                if (!eh) eh = 18;
                // Component Bottom
                let eb = et + eh;
                // Real Bottom
                let rb = eb - st + 2;
                // Window Height
                let wh = $(window).height();
                // Overlay Height
                let oh = this.root.height();
                if (hmin && oh < hmin) oh = hmin;
                // Overlay Top
                let ot = wh - oh;
                // If Component (Real) Bottom > Overlay Top...
                if (rb > ot) {
                    // Delta scroll
                    let ds = rb - ot + over;
                    $(document).scrollTop(st + ds);
                    return ds;
                }
            }
            return 0;
        }

        scrollY(y: number, hmin: number = 0, over: number = 4): number {
            if (this.position == 'top') {
                // Scroll Top
                let st = $(document).scrollTop();
                // Real Top
                let rt = y - 2;
                // Overlay Height
                let oh = this.root.height();
                if (hmin && oh < hmin) oh = hmin;
                // If Component (Real) Top < Overlay Height...
                if (rt < oh) {
                    // Delta scroll
                    let ds = rt - oh;
                    if (st < ds) {
                        $(document).scrollTop(0);
                    }
                    else {
                        $(document).scrollTop(st - ds);
                    }
                    return ds;
                }
            }
            else {
                // Scroll Top
                let st = $(document).scrollTop();
                // Real Bottom
                let rb = y + (over / 2) + 2;
                // Window Height
                let wh = $(window).height();
                // Overlay Height
                let oh = this.root.height();
                if (hmin && oh < hmin) oh = hmin;
                // Overlay Top
                let ot = wh - oh;
                // If Component (Real) Bottom > Overlay Top...
                if (rb > ot) {
                    // Delta scroll
                    let ds = rb - ot + over;
                    $(document).scrollTop(st + ds);
                    return ds;
                }
            }
            return 0;
        }

        protected beforeShow(): boolean {
            return true;
        }

        protected onShown() {
        }

        protected onHidden() {
        }

        protected render() {
            this.isShown = false;
            this.isClosed = false;
            if (this.cntHeader) this.container.addContainer(this.cntHeader);
            if (this.cntBody) this.container.addContainer(this.cntBody);
            return this.cntRoot;
        }

        componentWillUnmount(): void {
            this.isShown = false;
            if (this.btnCloseHeader) this.btnCloseHeader.unmount();
            if (this.cntBody) this.cntBody.unmount();
            if (this.cntHeader) this.cntHeader.unmount();
            if (this.cntRoot) this.cntRoot.unmount();
        }

        protected buildTitle(title: string): string {
            if (title == null) return '';
            if (!this.tagTitle) this.tagTitle = 'h3';
            if (this.titleStyle) {
                let ts = WUX.style(this.titleStyle);
                if (ts) return '<' + this.tagTitle + ' style="' + ts + '">' + WUtil.toText(title) + '</' + this.tagTitle + '>';
            }
            return '<' + this.tagTitle + '>' + WUtil.toText(title) + '</' + this.tagTitle + '>';
        }
    }
}