namespace WUX {

    /**
     * Wrapper Select2. Required JQuery plugin Select2 4.0.0 (https://select2.org/)
     */
    export class WSelect2 extends WUX.WComponent implements WISelectable {
        options: Array<string | WEntity>;
        multiple: boolean;
        openOnFocus: boolean;
        prefix: string;
        suffix: string;
        lastChange: number;
        count: number;
        _init: boolean;

        protected dontOpen: boolean;
        protected $cb: JQuery;

        constructor(id: string, options?: Array<string | WEntity>, multiple?: boolean, classStyle?: string, style?: string | WStyle, attributes?: string | object, props?: any) {
            // WComponent init
            super(id ? id : '*', 'WSelect2', props, classStyle, style, attributes);
            this.rootTag = 'select';
            // WSelect init
            this.options = options;
            this.multiple = multiple;
            this.openOnFocus = true;
            this.dontOpen = false;
            this.lastChange = 0;
            this.count = options ? options.length : 0;
            this._init = false;
        }

        set visible(b: boolean) {
            this._visible = b;
            if (this.internal) this.internal.visible = b;
            if (this.root && this.root.length) {
                if (!this.$cb) this.$cb = this.root.parent().find('span[role="combobox"]').first();
                if (this._visible) {
                    if (this.$cb && this.$cb.length) {
                        this.$cb.show();
                    }
                    else {
                        this.root.show();
                    }
                }
                else {
                    if (this.$cb && this.$cb.length) {
                        this.$cb.hide();
                    }
                    else {
                        this.root.hide();
                    }
                }
            }
        }

        focus(): this {
            if (!this.mounted) return this;
            if (!this._enabled) return this;
            this.root.focus();
            if (!this.$cb) this.$cb = this.root.parent().find('span[role="combobox"]').first();
            if (this.$cb && this.$cb.length) this.$cb.focus();
            return this;
        }

        getProps(): any {
            if (!this.root) return this.props;
            this.props = [];
            this.root.find('option:selected').each((i: any, e: Element) => {
                let t = $(e).text();
                if (this.prefix) t = this.prefix + ' ' + t;
                if (this.suffix) t = t + ' ' + this.suffix;
                this.props.push(t);
            });
            return this.props;
        }

        getState(): any {
            if (!this.root) return this.state;
            return this.state = this.root.val();
        }

        getValue(): WEntity {
            let id = this.getState();
            if (id == null) return null;
            let text = WUtil.toString(this.getProps());
            if (!text) text = '' + id;
            return { id: id, text: text };
        }

        select(i: number): this {
            if (!this.root) return this;
            let val = this.root.find('option:eq(' + i + ')').val();
            if (val == null) return this;
            this.root.select2('val', val);
            return this;
        }

        setOptions(items: Array<string | WEntity>): this {
            this.options = items;
            if (!this.root) return this;
            this.root.empty();
            let data = [];
            if (this.options) {
                for (let opt of this.options) {
                    if (typeof opt == 'string') {
                        data.push({id: opt, text: opt});
                    }
                    else {
                        data.push(opt);
                    }
                }
            }
            let options: Select2Options = { data: data, placeholder: "", allowClear: true };
            this.init(options);
            return this;
        }

        reload(clear?: boolean): this {
            if (clear) this.setState(null);
            if (!this.mounted) return this;
            this.root.empty();
            this.componentDidMount();
            return this;
        }

        protected render() {
            if (this.multiple) return this.buildRoot(this.rootTag, '', 'multiple="multiple"', 'form-control');
            return this.buildRoot(this.rootTag, '', '', 'form-control');
        }

        protected updateState(nextState: any): void {
            super.updateState(nextState);
            if (!this.root) return;
            if (Array.isArray(this.state) && this.state.length > 1) {
                this.root.append('<option value="' + this.state[0] + '">' + this.state[this.state.length - 1] + '</option>');
                this.root.val(this.state[0]).trigger('change');
            }
            else if (this.state) {
                if (typeof this.state == 'object') {
                    this.root.append('<option value="' + this.state.id + '">' + this.state.text + '</option>');
                    this.root.val(this.state.id).trigger('change');
                }
                else {
                    this.root.val(this.state).trigger('change');
                }
            }
            else {
                this.root.val([]).trigger('change');
            }
            this.dontTrigger = true;
            this.lastChange = new Date().getTime();
        }

        protected componentDidMount(): void {
            if (this._tooltip) this.root.attr('title', this._tooltip);
            if (this.options) {
                for (let opt of this.options) {
                    if (typeof opt == 'string') {
                        this.root.append('<option>' + WUtil.toText(opt) + '</option>');
                    }
                    else {
                        this.root.append('<option value="' + opt.id + '">' + WUtil.toText(opt.text) + '</option>');
                    }
                }
            }
            let options: Select2Options = { placeholder: "", allowClear: true };
            this.init(options);
        }

        protected init(options: Select2Options) {
            this.root.select2(options);
            this.updateState(this.state);

            if (options) {
                if (options.data) {
                    this.count = WUtil.size(options.data);
                }
            }
            else {
                this.count = 0;
            }

            // Se si ripete init non si registrano ulteriori eventi
            if (this._init) return;

            this.$cb = this.root.parent().find('span[role="combobox"]').first();
            if (this.$cb.length) {
                this.$cb.on('focus', (e: JQueryEventObject) => {
                    if (e.relatedTarget == null) return;
                    if (this.dontOpen) {
                        this.dontOpen = false;
                        return;
                    }
                    if (this.openOnFocus) setTimeout(() => {
                        if (this.multiple) {
                            if (this.$cb && this.$cb.length) {
                                let $sf = this.$cb.find('input.select2-search__field').first();
                                if ($sf && $sf.length && !$sf.is(':focus')) $sf.focus();
                            }
                        }
                        else {
                            let d = new Date().getTime() - this.lastChange;
                            if (d > 900) this.root.select2('open');
                            this.dontOpen = true;
                        }
                    }, 50);
                });
            }
            else {
                this.root.on('focus', (e: JQueryEventObject) => {
                    if (this.dontOpen) {
                        this.dontOpen = false;
                        return;
                    }
                    if (this.openOnFocus) setTimeout(() => {
                        let d = new Date().getTime() - this.lastChange;
                        if (d > 900) this.root.select2('open');
                        this.dontOpen = true;
                    }, 50);
                });
            }

            if (this.multiple) {
                this.root.on('select2:select', (e: JQueryEventObject) => {
                    this.lastChange = new Date().getTime();
                    this.trigger('statechange');
                });
                this.root.on('select2:unselect', (e: JQueryEventObject) => {
                    setTimeout(() => {
                        this.lastChange = new Date().getTime();
                        this.trigger('statechange');
                    }, 0);
                });
            }
            else {
                this.root.on('change', (e: JQueryEventObject) => {
                    this.lastChange = new Date().getTime();
                    this.trigger('statechange');
                });
            }
            this._init = true;
        }

        transferTo(dest: WComponent, force?: boolean, callback?: () => any): boolean {
            if (dest instanceof WSelect2) {
                dest.setState(this.getValue(), force, callback);
                return true;
            }
            return super.transferTo(dest, force, callback);
        }
    }

    export class WLookupDialog extends WDialog<any, any[]> {
        fp: WUX.WFormPanel;
        table: WUX.WITable;
        keys: any[];
        selected: any;
        lookup: (params: any[], rh: (result: any) => void, eh?: (error: any) => void) => void;
        startup: boolean;

        constructor(id: string, title: string, keys?: any[], onlyTable?: boolean) {
            super(id, 'WLookupDialog');

            this.title = title;

            if (!onlyTable) {
                this.fp = new WUX.WFormPanel(this.subId('fp'));
                this.fp.addRow();
                this.fp.addTextField('c', WUX.TXT.CODE);
                this.fp.addRow();
                this.fp.addTextField('d', WUX.TXT.DESCRIPTION);
                this.fp.on('statechange', (e: WUX.WEvent) => {
                    if (this.lookup) {
                        this.lookup(this.getFilter(), (result) => {
                            this.table.setState(result);
                        });
                    }
                });
            }

            this.table = new WUX.WTable(this.subId('table'), [WUX.TXT.CODE, WUX.TXT.DESCRIPTION], keys);
            this.table.widths[0] = 200;
            this.table.css({ h: 360 });
            this.table.onDoubleClick((e: { element?: JQuery }) => {
                let rd = this.table.getSelectedRowsData();
                this.selected = rd && rd.length ? rd[0] : undefined;
                if (this.selected) {
                    this.hide();
                    this.trigger('_selected', this.selected);
                }
            });

            if (onlyTable) {
                this.body
                    .addRow()
                    .addCol('12', { pt: 8, pb: 8 })
                    .add(this.table);
            }
            else {
                this.body
                    .addRow()
                    .addCol('12')
                    .add(this.fp)
                    .addRow()
                    .addCol('12', { pt: 8, pb: 8 })
                    .add(this.table);
            }
        }

        protected updateState(nextState: any[]): void {
            super.updateState(nextState);
            if (this.table) {
                this.table.setState(this.state);
            }
        }

        setFilter(params: any[]): void {
            if (!this.fp) return;
            this.fp.setValue('c', WUtil.getItem(params, 0));
            this.fp.setValue('d', WUtil.getItem(params, 1));
        }

        getFilter(): any[] {
            let r = [];
            if (!this.fp) {
                r.push('');
                r.push('');
                return r;
            }
            r.push(this.fp.getValue('c'));
            r.push(this.fp.getValue('d'));
            return r;
        }

        onSelected(handler: (e: WEvent) => any): void {
            if (!this.handlers['_selected']) this.handlers['_selected'] = [];
            this.handlers['_selected'].push(handler);
        }

        protected onShown() {
            this.startup = true;
            this.table.refresh();
            if (this.fp) {
                let d = this.fp.getValue('d');
                if (d) {
                    this.fp.focusOn('d');
                }
                else {
                    this.fp.focusOn('c');
                }
            }
        }

        protected onClickOk(): boolean {
            let rd = this.table.getSelectedRowsData();
            this.selected = rd && rd.length ? rd[0] : undefined;
            if (!this.selected) {
                WUX.showWarning('Selezionare un elemento.');
                return;
            }
            setTimeout(() => {
                this.trigger('_selected', this.selected);
            }, 100);
            return true;
        }
    }

    export class WMenu extends WUX.WComponent {
        handler: (e: JQueryEventObject) => any;
        data: any;
        items: WUX.WEntity[];
        title: string;

        constructor(id?: string, classStyle: string = 'btn-group') {
            super(id ? id : '*', 'WMenu', '', classStyle);
            this.items = [];
            this.title = 'Seleziona';
        }

        addItem(item: WUX.WEntity): this;
        addItem(id: string, icon: WUX.WIcon | string, text: string, bdef?: boolean): this;
        addItem(id: WUX.WEntity | string, icon?: WUX.WIcon | string, text?: string, bdef?: boolean): this {
            if (typeof id == 'string') {
                this.items.push({ id: id, icon: icon, text: text, marked: bdef });
            }
            else {
                this.items.push(id);
            }
            return this;
        }

        addSep(): this {
            this.items.push({ id: '', type: 'b' });
            return this;
        }

        addSection(name: string): this {
            this.items.push({ id: '', type: 's', text: name });
            return this;
        }

        onClick(handler?: (e: JQueryEventObject) => any) {
            this.handler = handler;
        }

        protected buildItem(node: JQuery, code: string, icon: string, text: string, bdef?: boolean) {
            let $li = $('<li></li>');
            $li.appendTo(node);
            let $a: JQuery;
            if (bdef) {
                $a = $('<a href="#"><i class="fa ' + icon + '"></i> &nbsp;<strong>' + text + '</strong></a>')
            }
            else {
                $a = $('<a href="#"><i class="fa ' + icon + '"></i> &nbsp;' + text + '</a>')
            }
            $a.appendTo($li);
            $a.on('click', (e: JQueryEventObject) => {
                e.data = this.data;
                e.key = code;
                this.handler(e);
            });
        }

        protected componentDidMount(): void {
            if (this.title == null) this.title = 'Seleziona';
            let dt = $('<a class="btn btn-link btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + this.title + ' <span class="caret"></span></a>');
            dt.appendTo(this.root);
            let dm = $('<ul class="dropdown-menu dropdown-menu-right"></ul>');
            dm.appendTo(this.root);

            if (!this.items) this.items = [];
            for (let item of this.items) {
                if (!item.type || item.type == 'i') {
                    this.buildItem(dm, item.id, item.icon, item.text, item.marked);
                }
                else if (item.type == 'b') {
                    dm.append($('<li role="separator" class="divider"></li>'));
                }
                else if (item.type == 's') {
                    dm.append($('<li class="dropdown-header">' + item.text + '</li>'));
                }
            }
        }
    }
}