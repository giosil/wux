namespace APP {

	import WUtil = WUX.WUtil;

	/**
	 * Definizione entita'.
	 */
	export interface Entity {
		id: number;
		code?: string;
		name?: string;
	}

	/**
	 * Dialogo per la gestione delle entita'.
	 */
	export class DlgEntity extends WUX.WDialog<string, Entity> {
		fp: WUX.WForm;
		
		constructor(id: string) {
			super(id, 'DlgEntity');
			
			this.title = 'Entity';
			
			this.fp = new WUX.WForm(this.subId('fp'));
			this.fp.addRow();
			this.fp.addTextField('code', 'Codice');
			this.fp.addRow();
			this.fp.addTextField('name', 'Nome');
			this.fp.addInternalField('id');

			this.fp.setMandatory('code', 'name')
			
			this.body
				.addRow()
					.addCol('col-md-12')
						.add(this.fp);
		}
		
		override updateState(nextState: Entity): void {
			this.state = nextState;
			if(this.fp) {
				this.fp.clear();
				this.fp.setState(this.state);
			}
		}
		
		override getState(): Entity {
			if(this.fp) this.state = this.fp.getState();
			return this.state;
		}
		
		override onClickOk(): boolean {
			if(this.props == 'new' || this.props == 'edit') {
				let m = this.fp.checkMandatory(true, true);
				if(m) {
					showWarning('Valorizzare: ' + m);
					return false;
				}
			}
			return true;
		}
		
		protected onShown() {
			if(this.props == 'view') {
				this.fp.enabled = false;
				this.updButtons('Chiudi', '');
			}
			else {
				this.fp.enabled = true;
				this.updButtons('Salva');
				if(this.props == 'edit') {
					this.fp.setReadOnly('code', true);
					setTimeout(() => { this.fp.focusOn('name'); });
				}
				else {
					this.fp.setReadOnly('code', false);
					setTimeout(() => { this.fp.focusOn('code'); });
				}
			}
		}
	}

	/**
	 * Implementazione della GUI di gestione che impiega WDXTable (componente DevExpress.ui.dxDataGrid).
	 */
	export class GUIEntitiesDX extends WUX.WComponent {
		// Components
		main: WUX.WContainer;
		brcr: Breadcrumb;
		form: WUX.WForm;
		btnFind: WUX.WButton;
		btnReset: WUX.WButton;
		btnNew: WUX.WButton;
		table: WUX.WDXTable;
		
		// Data
		mock: Mock;
		
		// Dialogs
		dlg: DlgEntity;
		// Pages
		pages: WUX.WPages;
		
		constructor() {
			super();

			this.mock = new Mock();

			http.mock = true; // Simulazione
			http.mres = {
				"get" : (e: string, p: any) => {
					return this.mock.find(e, p);
				},
				"post": (e: string, p: any) => {
					return this.mock.ins(e, p, 'id');
				},
				"put": (e: string, p: any) => {
					return this.mock.upd(e, p, 'id');
				},
				"delete": (e: string, p: any) => {
					return this.mock.del(e, p, 'id');
				}
			};
			
			this.dlg = new DlgEntity(this.subId('dlg'));
			this.dlg.onHiddenModal((e: JQueryEventObject) => {
				this.brcr.status('');
				if (!this.dlg.ok) return;
				
				let a = this.dlg.getProps();
				let s = this.dlg.getState();
				if(!a || !s) return;
				console.log('dlg action,state', a, s);
				switch(a) {
					case 'new':
						http.post('entities/insert', s, (res: Entity) => {
							if(res) {
								showSuccess('Elemento inserito con successo.');
								addItem(res, this.table);
							}
							else {
								showWarning('Elemento non inserito');
							}
						});
						break;
					case 'edit':
						http.put('entities/update', s, (res: Entity) => {
							if(res) {
								showSuccess('Elemento aggiornato con successo.');
								updItem(res, this.table, 'id');
							}
							else {
								showWarning('Elemento non aggiornato');
							}
						});
						break;
				}
			});
		}
		
		override render() {
			this.brcr = new Breadcrumb();
			this.brcr.add('Entities');

			this.form = new WUX.WForm(this.subId('form'));
			this.form
				.addRow()
					.addTextField('code', 'Codice')
					.addTextField('name', 'Nome', {"span": 2});

			this.btnFind = new WUX.WButton(this.subId('btnFind'), 'Esegui ricerca', 'fa-search', 'btn-icon btn btn-primary', 'margin-right: 0.5rem;');
			this.btnFind.on('click', (e: PointerEvent) => {
				
				this.doFind();
				
			});
			this.btnReset = new WUX.WButton(this.subId('btnReset'), 'Annulla', 'fa-undo', 'btn-icon btn btn-secondary');
			this.btnReset.on('click', (e: PointerEvent) => {
				this.form.clear();
				this.form.focus();
				this.table.setState([]);
			});
			this.btnNew = new WUX.WButton(this.subId('btnNew'), 'Nuovo', 'fa-plus-circle', 'btn-icon btn btn-primary', 'margin-right: 0.5rem;');
			this.btnNew.on('click', (e: PointerEvent) => {
				this.brcr.status('Nuovo');
				
				this.dlg.setProps('new');
				this.dlg.setState(null);
				this.dlg.show(this);
			});
			
			let h = ['Codice', 'Nome'];
			let k = ['code',   'name'];
			this.table = new WUX.WDXTable(this.subId('tapp'), h, k);
			this.table.selectionMode = 'single';
			this.table.filter = true;
			this.table.exportFile = "competenze";
			this.table.types = ['s', 's'];
			this.table.paging = true;
			this.table.pageSize = 5;
			
			this.table.actionsTitle = 'Azioni';
			this.table.actionWidth = 140;
			this.table.addActions('id', {
				id: 'view',
				classStyle: 'btn btn-link btn-xs',
				label: 'Vedi',
				icon: 'fa-search'
			});
			this.table.addActions('id', {
				id: 'edit',
				classStyle: 'btn btn-link btn-xs',
				label: 'Modifica',
				icon: 'fa-edit'
			});
			this.table.addActions('id', {
				id: 'delete',
				classStyle: 'btn btn-link btn-xs',
				label: 'Elimina',
				icon: 'fa-trash'
			});
			this.table.onClickAction((e: JQueryEventObject) => {
				// Action id
				let ai = WUX.firstSub(e.currentTarget);
				if (!ai) return;
				// Action value
				let av: number = WUtil.toNumber(WUX.lastSub(e.currentTarget));
				if (!av) return;
				console.log('action=' + ai + ',value=' + av);
				
				let s = this.table.getState();
				let x = WUtil.indexOf(s, 'id', av);
				if(x < 0) return;

				if(ai == 'delete') {
					confirm('Si vuole eliminare l\'elemento?', (cr: boolean) => {
						if(!cr) return;
						http.delete('entities/delete', s[x], (res: boolean) => {
							if(res) {
								showSuccess('Elemento eliminato con successo.');
								delItem(x, this.table);
							}
							else {
								showWarning('Elemento non eliminato');
							}
						});
					});
					return;
				}
				else if(ai == 'view') {
					this.brcr.status('Visualizza');
				}
				else if(ai == 'edit') {
					this.brcr.status('Modifica');
				}
				
				this.dlg.setProps(ai);
				this.dlg.setState(s[x]);
				this.dlg.show(this);
			});
			this.table.onDoubleClick((e: { element?: JQuery }) => {
				let srd = this.table.getSelectedRowsData();
				if (!srd || !srd.length) return;
				this.brcr.status('Visualizza');
				this.dlg.setProps('view');
				this.dlg.setState(srd[0]);
				this.dlg.show(this);
			});

			this.main = new WUX.WContainer();
			this.main
				// .before(this.brcr) // -> spostato in pages
				.addRow()
					.addCol('col-md-12')
						.add(this.form)
				.addRow()
					.addCol('col-md-8')
						.addGroup({"classStyle": "form-row"}, this.btnFind, this.btnReset)
					.addCol('col-md-4', {a : 'right'})
						.addGroup({"classStyle": "form-row"}, this.btnNew)
				.addRow()
					.addCol('col-md-12', 'padding-top: 1rem;')
						.add(this.table);

			this.pages = new WUX.WPages();
			this.pages
				.before(this.brcr)
				.add(this.main);

			// Visualizzazione in pagina
			this.dlg.addToPages(this.pages, false);

			return this.pages;
		}
		
		doFind() {
			// Validazione
			let m = this.form.checkMandatory(true, true, true);
			if(m) {
				showWarning('Compilare almeno: ' + m);
				return;
			}
			// Ricerca
			let filter = this.form.getState();
			http.get('entities/find', filter, (data: Entity[]) => {
				if(!data) data = [];
				let l = data.length;
				if(!l) {
					showWarning('Nessun elemento trovato.');
				}
				this.table.setState(data);
			});
		}
	}

	import action = WUX.action;
	import getAction = WUX.getAction;

	/**
	 * Implementazione alternativa della GUI di gestione che impiega WTable (componente tabella HTML).
	 */
	export class GUIEntities extends WUX.WComponent {
		// Components
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
		
		// Data
		mock: Mock;
		page: number = 1;
		
		// Dialogs
		dlg: DlgEntity;
		
		constructor() {
			super();

			this.mock = new Mock();

			http.mock = true; // Simulazione
			http.mres = {
				"get" : (e: string, p: any) => {
					return this.mock.find(e, p);
				},
				"post": (e: string, p: any) => {
					return this.mock.ins(e, p, 'id');
				},
				"put": (e: string, p: any) => {
					return this.mock.upd(e, p, 'id');
				},
				"delete": (e: string, p: any) => {
					return this.mock.del(e, p, 'id');
				}
			};
			
			this.dlg = new DlgEntity(this.subId('dlg'));
			// this.dlg.fullscreen = true;
			this.dlg.onHiddenModal((e: JQueryEventObject) => {
				if (!this.dlg.ok) return;
				
				// Azione
				let a = this.dlg.getProps();
				// Valori
				let s = this.dlg.getState();
				if(!a || !s) return;
				console.log('dlg action,state', a, s);
				switch(a) {
					case 'new':
						http.post('entities/insert', s, (res: Entity) => {
							if(res) {
								showSuccess('Elemento inserito con successo.');
								addItem(this.addActions(res), this.table);
								this.refresh();
							}
							else {
								showWarning('Elemento non inserito');
							}
						});
						break;
					case 'edit':
						http.put('entities/update', s, (res: Entity) => {
							if(res) {
								showSuccess('Elemento aggiornato con successo.');
								updItem(this.addActions(res), this.table, 'id');
							}
							else {
								showWarning('Elemento non aggiornato');
							}
						});
						break;
				}
			});
		}
		
		override render() {
			this.brcr = new Breadcrumb();
			this.brcr.add('Entities');

			this.form = new WUX.WForm(this.subId('form'));
			this.form
				.addRow()
					.addTextField('code', 'Codice')
					.addTextField('name', 'Nome', {"span": 2});

			this.btnFind = new WUX.WButton(this.subId('btnFind'), 'Esegui ricerca', 'fa-search', 'btn-icon btn btn-primary', 'margin-right: 0.5rem;');
			this.btnFind.on('click', (e: PointerEvent) => {
				
				this.doFind();
				
			});
			this.btnReset = new WUX.WButton(this.subId('btnReset'), 'Annulla', 'fa-undo', 'btn-icon btn btn-secondary');
			this.btnReset.on('click', (e: PointerEvent) => {
				this.form.clear();
				this.form.focus();
				this.table.setState([]);
				this.refresh();
			});
			this.btnNew = new WUX.WButton(this.subId('btnNew'), 'Nuovo', 'fa-plus-circle', 'btn-icon btn btn-primary', 'margin-right: 0.5rem;');
			this.btnNew.on('click', (e: PointerEvent) => {
				this.dlg.setProps('new');
				this.dlg.setState(null);
				this.dlg.show(this);
			});
			
			let h = ['Codice', 'Nome', 'Vedi', 'Modifica', 'Elimina'];
			let k = ['code',   'name', '_v',   '_m',	   '_d'];
			this.table = new WUX.WTable(this.subId('tapp'), h, k);
			this.table.selectionMode = 'single';
			this.table.div = 'table-responsive';
			this.table.types = ['s', 's', 'w', 'w', 'w'];
			this.table.sortable = [0, 1];
			this.table.paging = true;
			this.table.on('click', (e: PointerEvent) => {
				let a = getAction(e, this);
				console.log('click a=', a);
				if(!a || !a.ref) return;
				if(a.name == 'sort') return;
				
				let s = this.table.getState();
				let x = WUtil.indexOf(s, 'id', a.ref);
				if(x < 0) return;

				if(a.name == 'delete') {
					confirm('Si vuole eliminare l\'elemento?', (cr: boolean) => {
						if(!cr) return;
						http.delete('entities/delete', s[x], (res: boolean) => {
							if(res) {
								showSuccess('Elemento eliminato con successo.');
								delItem(x, this.table);
								this.refresh();
							}
							else {
								showWarning('Elemento non eliminato');
							}
						});
					});
					return;
				}
				
				this.dlg.setProps(a.name);
				this.dlg.setState(s[x]);
				this.dlg.show(this);
			});
			this.table.onDoubleClick((e: {element?: Element; rowElement?: Element; data?: Competenza; rowIndex?: number; }) => {
				this.dlg.setProps('view');
				this.dlg.setState(e.data);
				this.dlg.show(this);
 			});
			
			// Componenti di paginazione
			// Selezione pagina da link
			this.respg = new ResPages(this.subId('respg'));
			this.respg.on('statechange', (e: WUX.WEvent) => {
				this.table.page = this.respg.getState();
				this.refresh(true);
			});
			// Selezione pagina da select
			this.btnpg = new BtnPages(this.subId('btnpg'));
			this.btnpg.on('statechange', (e: WUX.WEvent) => {
				this.table.page = this.btnpg.getState();
				this.refresh(true);
			});
			// Numero elementi per pagina
			this.btnip = new BtnItems(this.subId('btnip'));
			this.btnip.on('statechange', (e: WUX.WEvent) => {
				this.table.page = 1;
				this.table.plen = this.btnip.getState();
				this.refresh(true);
			});

			this.main = new WUX.WContainer();
			this.main
				.before(this.brcr)
				.addRow()
					.addCol('col-md-12')
						.add(this.form)
				.addRow()
					.addCol('col-md-8')
						.addGroup({"classStyle": "form-row"}, this.btnFind, this.btnReset)
					.addCol('col-md-4', {a : 'right'})
						.addGroup({"classStyle": "form-row"}, this.btnNew)
				.addRow()
					.addCol('col-md-12')
						.add(this.table)
				.addRow()
					.addCol('col-md-6')
						.add(this.respg)
					.addCol('col-md-3')
						.add(this.btnpg)
					.addCol('col-md-3')
						.add(this.btnip);
			
			return this.main;
		}
		
		doFind() {
			// Validazione
			let m = this.form.checkMandatory(true, true, true);
			if(m) {
				showWarning('Compilare almeno: ' + m);
				return;
			}
			// Ricerca
			let filter = this.form.getState();
			http.get('entities/find', filter, (data: Entity[]) => {
				if(!data) data = [];
				let l = data.length;
				if(!l) showWarning('Nessun elemento trovato.');
				for(let r of data) {
					this.addActions(r);
				}
				this.table.page = 1;
				this.table.plen = this.btnip.getState();
				this.table.setState(data);
				this.refresh();
			});
		}

		addActions(r: any): any {
			if(!r) return r;
			r["_v"] = action('view', r["id"], 'fa-search');
			r["_m"] = action('edit', r["id"], 'fa-edit');
			r["_d"] = action('delete', r["id"], 'fa-trash');
			return r;
		}
		
		refresh(updTable: boolean = false) {
			if(updTable) this.table.forceUpdate();
			let data = this.table.getState();
			let l = data ? data.length : 0;
			this.respg.refresh(this.table.rows, this.table.plen, l, this.table.page);
			this.btnpg.refresh(this.table.page, this.respg.getProps());
		}
	}
}
