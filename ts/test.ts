class Test extends WUX.WComponent {

    protected frmFilter: WUX.WFormPanel;
    protected btnRefresh: WUX.WButton;
    protected btnDialog: WUX.WButton;
    protected btnWindow: WUX.WButton;

    protected tabTest: WUX.WTable;

    protected dlgTest: WUX.WDialog;
    protected winTest: WUX.WWindow;
    protected tcoTest: WUX.WTab;
    protected boxTest: WUX.WBox;

    protected container: WUX.WContainer;

    constructor() {
        super('test', 'Test');
    }

    protected render() {
        // Definizione opzioni 
        let options = new Array<WUX.WEntity>();
        options.push({ id: 0, text: '(None)' });
        options.push({ id: 1, text: 'Option 1' });
        options.push({ id: 2, text: 'Option 2' });

        // Costruzione form                 id           titolo
        this.frmFilter = new WUX.WFormPanel('frmFilter', 'Filtro');
        this.frmFilter.addRow();
        this.frmFilter.addCurrency5Field('c', 'Codice');
        this.frmFilter.addOptionsField('o', 'Opzioni', options);
        this.frmFilter.addRow();
        this.frmFilter.addTextField('d', 'Descrizione');
        this.frmFilter.addDateField('t', 'Data', false);

        this.frmFilter.setValue('t', WUX.WUtil.getCurrDate());

        this.frmFilter.on('statechange', (e: WUX.WEvent) => {
            console.log('WFormPanel:statechange', this.frmFilter.getState());
            this.btnRefresh.trigger('click');
        });

        // Costruzione pulsanti           id            etichetta     icona              classe           stile
        this.btnRefresh = new WUX.WButton('btnRefresh', 'Find items', WUX.WIcon.REFRESH, WUX.BTN.PRIMARY, 'width: 180px');
        this.btnRefresh.tooltip = 'Button example';
        this.btnRefresh.on('click', (e: JQueryEventObject) => {
            console.log('btnRefresh:click', this.frmFilter.getState());
            let result = [];
            for (let i = 0; i < 5; i++) {
                // result.push({id: i, text: 'ITEM ' + i, time: new Date(), flag: (i % 2) == 0})
                result.push([i, 'ITEM ' + i, new Date(), (i % 2) == 0])
            }
            this.tabTest.setState(result);
            WUX.showSuccess(result.length + ' items found');
        });
        //                               id           etichetta      icona           classe             stile
        this.btnDialog = new WUX.WButton('btnDialog', 'Show Dialog', WUX.ICO.EXPORT, WUX.BTN.SECONDARY, 'width: 180px');
        this.btnDialog.on('click', (e: JQueryEventObject) => {
            console.log('btnDialog:click');
            WUX.confirm('Are you sure?', (res) => {
                if (!res) return;
                this.dlgTest.show();
            });
        });
        //                                id           etichetta       icona         classe        stile
        this.btnWindow = new WUX.WButton('btnWindow', 'Show Window', WUX.ICO.OPEN, WUX.BTN.INFO, 'width: 180px');
        this.btnWindow.on('click', (e: JQueryEventObject) => {
            console.log('btnWindow:click');
            this.winTest.show();
        });

        // Costruzione tabella          id         header
        this.tabTest = new WUX.WTable('tabTest', ['Id', 'Description', 'DateTime', 'Flag']);
        this.tabTest.css({ h: 200 });
        this.tabTest.selectionMode = 'multiple';
        this.tabTest.onSelectionChanged((e: { element?: JQuery, selectedRowsData?: Array<any> }) => {
            console.log('WTable:selectionchange ' + e.element.wuxComponent().id);
        });
        this.tabTest.onDoubleClick((e: { element?: JQuery }) => {
            WUX.showWarning('WTable onDoubleClick');
        }); 
        this.tabTest.onRowPrepared((e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number, isSelected?: boolean }) => {
            let id = WUX.WUtil.getNumber(e.data, 'i', 0);
            switch (id) {
                case 1:
                    WUX.setCss(e.rowElement, WUX.CSS.WARNING);
                    break;
                case 3:
                    WUX.setCss(e.rowElement, WUX.CSS.ERROR);
                    break;
            }
        });

        // Costruzione dialog          id
        this.dlgTest = new WUX.WDialog('dlgTest');
        this.dlgTest.header.add('<h4>Test dialog</h4>');
        this.dlgTest.body.add('<p>Example of dialog</p>');
        this.dlgTest.onShownModal((e: JQueryEventObject) => {
            console.log('WDialog:shownmodal', e.target);
        });
        this.dlgTest.onHiddenModal((e: JQueryEventObject) => {
            console.log('WDialog:hiddenmodal ok=' + this.dlgTest.ok);
        });

        // Costruzione window          id
        this.winTest = new WUX.WWindow('winTest');
        // this.winTest.title = 'Test Window';
        this.winTest.width = 300;
        this.winTest.background = '#ffffaa';
        this.winTest.body.add('<p>Example of window</p>');
        this.winTest.onShow((e: WUX.WEvent) => {
            console.log('WWindow:show');
        });
        this.winTest.onHide((e: WUX.WEvent) => {
            console.log('WWindow:hide');
        });

        // Costruzione Tab          id
        this.tcoTest = new WUX.WTab('tcoTest');
        this.tcoTest.addTab('First tab', WUX.ICO.EXPORT).add('<h1>First tab</h1>');
        this.tcoTest.addTab('Second tab', WUX.ICO.EXPORT).add('<h1>Second tab</h1>');
        this.tcoTest.addTab('Third tab', WUX.ICO.EXPORT).add('<h1>Third tab</h1>');
        this.tcoTest.setState(1);
        this.tcoTest.on('statechange', (e: WUX.WEvent) => {
            console.log('WTab:statechange', this.tcoTest.getState());
        });

        // Costruzione Box          id         titolo
        this.boxTest = new WUX.WBox('boxTest', 'Box title');
        this.boxTest.content.add('<h1>Box content</h1>');
        this.boxTest.footer.add('<p>Footer example</p>');

        // Costruzione container
        this.container = new WUX.WContainer();
        this.container.legend = 'Titolo';
        this.container
            .addRow()
                .addCol('col-md-10', 'padding-left: 0')
                    .addBox('Filtro', 'ibox-filter')
                    .add(this.frmFilter)
                .addCol('col-md-2')
                    .addStack({ p: '4px' }, this.btnRefresh, this.btnDialog, this.btnWindow)
            .addRow()
                .addCol('col-md-12')
                    .add(this.tabTest)
            .addRow()
                .addDiv(8)
                .addCol('col-md-6')
                    .add(this.tcoTest)
                .addCol('col-md-6')
                    .add(this.boxTest);

        // Attivazione debug su tutti i componenti
        WUX.debug = false;
        // Attivazione debug su un singolo componente
        this.tcoTest.debug = true;

        return this.container;
    }
}