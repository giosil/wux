var Test = (function (_super) {
    __extends(Test, _super);
    function Test() {
        return _super.call(this, 'test', 'Test') || this;
    }
    Test.prototype.render = function () {
        var _this = this;
        var options = new Array();
        options.push({ id: 0, text: '(None)' });
        options.push({ id: 1, text: 'Option 1' });
        options.push({ id: 2, text: 'Option 2' });
        this.frmFilter = new WUX.WFormPanel('frmFilter', 'Filtro');
        this.frmFilter.addRow();
        this.frmFilter.addCurrency5Field('c', 'Codice');
        this.frmFilter.addOptionsField('o', 'Opzioni', options);
        this.frmFilter.addRow();
        this.frmFilter.addTextField('d', 'Descrizione');
        this.frmFilter.addDateField('t', 'Data', false);
        this.frmFilter.setValue('t', WUX.WUtil.getCurrDate());
        this.frmFilter.on('statechange', function (e) {
            console.log('WFormPanel:statechange', _this.frmFilter.getState());
            _this.btnRefresh.trigger('click');
        });
        this.btnRefresh = new WUX.WButton('btnRefresh', 'Find items', WUX.WIcon.REFRESH, WUX.BTN.PRIMARY, 'width: 180px');
        this.btnRefresh.tooltip = 'Button example';
        this.btnRefresh.on('click', function (e) {
            console.log('btnRefresh:click', _this.frmFilter.getState());
            var result = [];
            for (var i = 0; i < 5; i++) {
                result.push([i, 'ITEM ' + i, new Date(), (i % 2) == 0]);
            }
            _this.tabTest.setState(result);
            WUX.showSuccess(result.length + ' items found');
        });
        this.btnDialog = new WUX.WButton('btnDialog', 'Show Dialog', WUX.WIcon.SHARE_SQUARE_O, WUX.BTN.SECONDARY, 'width: 180px');
        this.btnDialog.on('click', function (e) {
            console.log('btnDialog:click');
            WUX.confirm('Si vuole mostrare la dialog?', function (res) {
                if (!res)
                    return;
                _this.dlgTest.show();
            });
        });
        this.btnWindow = new WUX.WButton('btnWindow', 'Show Window', WUX.WIcon.EDIT, WUX.BTN.INFO, 'width: 180px');
        this.btnWindow.on('click', function (e) {
            console.log('btnWindow:click');
            _this.winTest.show();
        });
        this.tabTest = new WUX.WTable('tabTest', ['Id', 'Description', 'DateTime', 'Flag']);
        this.tabTest.css({ h: 200 });
        this.tabTest.selectionMode = 'multiple';
        this.tabTest.onSelectionChanged(function (e) {
            console.log('WTable:selectionchange ' + e.element.wuxComponent().id);
        });
        this.tabTest.onDoubleClick(function (e) {
            WUX.showWarning('WTable onDoubleClick');
        });
        this.tabTest.onRowPrepared(function (e) {
            var id = WUX.WUtil.getNumber(e.data, '0');
            switch (id) {
                case 1:
                    WUX.setCss(e.rowElement, WUX.CSS.WARNING);
                    break;
                case 3:
                    WUX.setCss(e.rowElement, WUX.CSS.ERROR);
                    break;
            }
        });
        this.dlgTest = new WUX.WDialog('dlgTest');
        this.dlgTest.header.add('<h4>Test dialog</h4>');
        this.dlgTest.body.add('<p>Example of dialog</p>');
        this.dlgTest.onShownModal(function (e) {
            console.log('WDialog:shownmodal', e.target);
        });
        this.dlgTest.onHiddenModal(function (e) {
            console.log('WDialog:hiddenmodal ok=' + _this.dlgTest.ok);
        });
        this.winTest = new WUX.WWindow('winTest');
        this.winTest.width = 300;
        this.winTest.background = '#ffffaa';
        this.winTest.body.add('<p>Example of window</p>');
        this.winTest.onShow(function (e) {
            console.log('WWindow:show');
        });
        this.winTest.onHide(function (e) {
            console.log('WWindow:hide');
        });
        this.tcoTest = new WUX.WTab('tcoTest');
        this.tcoTest.addTab('First tab', WUX.WIcon.CALENDAR).add('<h1>First tab</h1>');
        this.tcoTest.addTab('Second tab', WUX.WIcon.ADDRESS_CARD).add('<h1>Second tab</h1>');
        this.tcoTest.addTab('Third tab', WUX.WIcon.CALCULATOR).add('<h1>Third tab</h1>');
        this.tcoTest.setState(1);
        this.tcoTest.on('statechange', function (e) {
            console.log('WTab:statechange', _this.tcoTest.getState());
        });
        this.boxTest = new WUX.WBox('boxTest', 'Box title');
        this.boxTest.content.add('<h1>Box content</h1>');
        this.boxTest.footer.add('<p>Footer example</p>');
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
        WUX.debug = false;
        this.tcoTest.debug = true;
        return this.container;
    };
    return Test;
}(WUX.WComponent));
//# sourceMappingURL=test.js.map