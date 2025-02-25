namespace APP {

	import WUtil = WUX.WUtil;

	export interface RatingLevel {
		levelRatingId: string;
		levelRatingCodice?: string;
		levelName?: string;
		levelShortDescription?: string;
		levelLongDescription?: string;
		levelOrderNumber?: string;
		starRating?: string;
		rating?: string;
		ratingType?: string;
		operationReason?: string;
	}

	export interface Rating {
		id: number;
		codice?: string;
		nome?: string;
		descrizione?: string;
		startValidityDate?: string;
		endValidityDate?: string;
		validityState?: string;
		operationReason?: string;
		livelli?: RatingLevel[];
	}

	export class DlgRating extends WUX.WDialog<string, Rating> {
		fp: WUX.WForm;
		tab: WUX.WTab;
		tlv: WUX.WDXTable;
		btnAdd: WUX.WButton;
		btnRem: WUX.WButton;
		btnUp: WUX.WButton;
		btnDw: WUX.WButton;

		dlg: DlgRatingLevel;
		
		constructor(id: string) {
			super(id, 'DlgRating');

			this.dlg = new DlgRatingLevel(this.subId('dlg'));
			this.dlg.onHiddenModal((e: JQueryEventObject) => {
				if (!this.dlg.ok) return;
				addItem(this.dlg.getState(), this.tlv);
			});
			
			this.title = 'Modello Rating';
			
			this.fp = new WUX.WForm(this.subId('fp'));
			this.fp.addRow();
			this.fp.addTextField('codice', 'Codice');
			this.fp.addTextField('nome', 'Nome');
			this.fp.addRow();
			this.fp.addTextField('descrizione', 'Descrizione');
			this.fp.addRow();
			this.fp.addDateField('startValidityDate', 'Inizio validit&agrave;');
			this.fp.addDateField('endValidityDate', 'Fine validit&agrave;');
			this.fp.addRow();
			this.fp.addToggleField('validityState', 'Valido');
			this.fp.addInternalField('operationReason');
			this.fp.addInternalField('id');

			this.fp.setMandatory('codice', 'nome', 'startValidityDate');

			let h = ['Codice', 'Nome', 'Desc.Breve', 'Descrizione', 'Star', 'Rating', 'Tipo'];
			let k = ['levelRatingCodice', 'levelName', 'levelShortDescription', 'levelLongDescription', 'starRating', 'rating', 'ratingType'];
			let t = ['s', 's', 's', 's', 's', 's', 's'];
			this.tlv = new WUX.WDXTable(this.subId('tlv'), h, k);
			this.tlv.sorting = false;
			this.tlv.style = 'height:320px;';
			this.tlv.types = t;
			this.tlv.exportFile = "livelli_rating";

			this.btnAdd = new WUX.WButton(this.subId('btnAdd'), 'Aggiungi', 'fa-plus-square', 'btn-icon btn btn-primary', 'min-width:130px;');
			this.btnAdd.on('click', (e: PointerEvent) => {
				this.dlg.setProps('add');
				this.dlg.setState(null);
				this.dlg.show(this);
			});
			this.btnRem = new WUX.WButton(this.subId('btnRem'), 'Rimuovi', ' fa-minus-square', 'btn-icon btn btn-danger', 'min-width:130px;');
			this.btnRem.on('click', (e: PointerEvent) => {
				let sr = this.tlv.getSelectedRows();
				if (!sr || sr.length == 0) {
					showWarning('Selezionare il livello da rimuovere.');
					return;
				}
				delItem(sr[0], this.tlv);
			});
			this.btnUp = new WUX.WButton(this.subId('btnUp'), '', 'fa-angle-up', 'btn-icon btn btn-xs btn-secondary', 'padding-left:22px;margin-right:0.8rem;');
			this.btnUp.on('click', (e: PointerEvent) => {
				upSelItem(this.tlv);
			});
			this.btnDw = new WUX.WButton(this.subId('btnDw'), '', 'fa-angle-down', 'btn-icon btn btn-xs btn-secondary', 'padding-left:22px;');
			this.btnDw.on('click', (e: PointerEvent) => {
				downSelItem(this.tlv);
			});

			this.tab = new WUX.WTab(this.subId('tab'));
			this.tab.contStyle = 'height:400px;padding-top:24px;';
			this.tab
				.addTab('Modello', 'fa-edit')
					.add(this.fp);
			this.tab
				.addTab('Livelli', 'fa-list')
					.addRow()
						.addCol('col-10')
							.add(this.tlv)
						.addCol('col-2')
							.add(this.btnAdd)
							.addDiv(4)
							.add(this.btnRem)
							.addDiv(4)
							.add(this.btnUp)
							.add(this.btnDw);
			
			this.tab.on('statechange', (e: WUX.WEvent) => {
				let i = this.tab.getState();
				if (i == 1) {
					setTimeout(() => { this.tlv.refresh()}, 0);
				}
			});
			
			this.body
				.addRow()
					.addCol('col-md-12')
						.add(this.tab);
		}
		
		override updateState(nextState: Rating): void {
			this.state = nextState;
			if(this.fp) {
				this.fp.clear();
				this.fp.setState(this.state);
				this.tlv.setState(WUtil.getArray(this.state, "livelli"));
			}
		}
		
		override getState(): Rating {
			if(this.fp) this.state = this.fp.getState();
			if(this.state) {
				if(!this.state["validityState"]) {
					this.state["validityState"] = 'false';
				}
				let l = this.tlv.getState();
				if(l) {
					for(let i = 0; i < l.length; i++) {
						let o = i + 1;
						l[i]["levelOrderNumber"] = '' + o;
					}
					this.state.livelli = l;
				}
				else {
					this.state.livelli = [];
				}
			}
			return this.state;
		}
		
		override onClickOk(): boolean {
			if(this.props == 'new' || this.props == 'edit') {
				let m = this.fp.checkMandatory(true, true);
				if(m) {
					showWarning('Valorizzare i seguenti campi: ' + m);
					return false;
				}
			}
			return true;
		}
		
		protected onShown() {
			if(this.props == 'view') {
				// Visualizza
				this.fp.enabled = false;
				this.btnAdd.enabled = false;
				this.btnRem.enabled = false;
				this.btnUp.enabled = false;
				this.btnDw.enabled = false;
				this.updButtons('Chiudi', '');
			}
			else {
				this.fp.enabled = true;
				if(this.props == 'edit') {
					// Modifica
					this.fp.setReadOnly('codice', true);
				}
				else {
					// Nuovo
					this.fp.setReadOnly('codice', false);
					this.fp.setValue('startValidityDate', WUtil.getCurrDate());
					this.fp.setValue('validityState', true);
				}
				this.btnAdd.enabled = true;
				this.btnRem.enabled = true;
				this.btnUp.enabled = true;
				this.btnDw.enabled = true;
				this.updButtons('Salva');
			}
			setTimeout(() => { 
				this.tab.setState(0); 
				this.fp.focusOn('codice'); 
			});
		}
	}

	export class DlgRatingLevel extends WUX.WDialog<string, RatingLevel> {
		fp: WUX.WForm;
		ol: string[];
		
		constructor(id: string) {
			super(id, 'DlgRatingLevel');

			this.title = 'Livello di Rating';
			
			this.fp = new WUX.WForm(this.subId('fp'));
			this.fp.addRow();
			this.fp.addTextField('levelRatingCodice', 'Codice');
			this.fp.addTextField('levelName', 'Nome livello');
			this.fp.addRow();
			this.fp.addTextField('levelShortDescription', 'Descrizione Breve');
			this.fp.addRow();
			this.fp.addTextField('levelLongDescription', 'Descrizione');
			this.fp.addRow();
			this.fp.addOptionsField('starRating', 'Star Rating', this.stars(5));
			this.fp.addTextField('rating', 'Valore Rating')
			this.fp.addOptionsField('ratingType', 'Tipo');

			this.fp.addInternalField('levelOrderNumber');
			this.fp.addInternalField('operationReason');
			this.fp.addInternalField('levelRatingId');

			this.fp.setMandatory('levelRatingCodice', 'levelName', 'levelShortDescription');

			this.body
				.addRow()
					.addCol('col-md-12')
						.add(this.fp);
		}

		stars(n: number) : WUX.WEntity[] {
			let r: WUX.WEntity[] = [];
			let s = '*';
			for(let i = 0; i <= n; i++) {
				let t = '';
				for(let j = 0; j < i; j++) {
					t += s;
				}
				r.push({"id": '' + i, "text": t});
			}
			return r;
		}
		
		override updateState(nextState: RatingLevel): void {
			this.state = nextState;
			if(this.fp) {
				this.fp.clear();
				this.fp.setState(this.state);
			}
		}
		override getState(): RatingLevel {
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
			setTimeout(() => { this.fp.focusOn('levelRatingCodice'); });
			if(!this.ol) {
				http.get('rating-model/findContextValues', {}, (res: string[]) => {
					this.ol = [''].concat(res);
					this.fp.setOptions('ratingType', this.ol);
				});
			}
		}
	}

	export class GUIRating extends WUX.WComponent {
		// Components
		main: WUX.WContainer;
		brcr: Breadcrumb;
		form: WUX.WForm;
		btnFind: WUX.WButton;
		btnReset: WUX.WButton;
		btnNew: WUX.WButton;
		table: WUX.WDXTable;
		
		// Dialogs
		dlg: DlgRating;

		// Pages
		pages: WUX.WPages;

		constructor() {
			super();
			
			this.dlg = new DlgRating(this.subId('dlg'));
			this.dlg.onHiddenModal((e: JQueryEventObject) => {
				this.brcr.status('');
				if (!this.dlg.ok) return;
				
				let a = this.dlg.getProps();
				let s = this.dlg.getState();
				if(!a || !s) return;
				console.log('dlg action,state', a, s);
				switch(a) {
					case 'new':
						http.post('rating-model/create', s, (res: Rating) => {
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
						http.put('rating-model/update', s, (res: Rating) => {
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
			this.brcr.add('Modello di Rating');

			this.form = new WUX.WForm(this.subId('form'));
			this.form
				.addRow()
					.addTextField('codice', 'Codice')
					.addTextField('nome', 'Nome', {"span": 2});

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
				this.brcr.status('Nuovo', 'bg-danger');

				this.dlg.setProps('new');
				this.dlg.setState(null);
				this.dlg.show(this);
			});
			
			let h = ['Codice', 'Nome', 'Descrizione'];
			let k = ['codice', 'nome', 'descrizione'];
			this.table = new WUX.WDXTable(this.subId('tapp'), h, k);
			this.table.selectionMode = 'single';
			this.table.filter = true;
			this.table.exportFile = "modello_rating";
			this.table.types = ['s', 's', 's'];
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
			this.table.onRowPrepared((e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number, isSelected?: boolean }) => {
				if (!e.data) return;
				let vs = WUtil.getBoolean(e.data, 'validityState');
				if(!vs) {
					WUX.setJQCss(e.rowElement, WUX.CSS.DANGER);
				}
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
					let v = WUtil.getBoolean(s[x], "validityState");
					if (!v) {
						showWarning('Elemento precedentemente cancellato');
						return;
					}
					confirm('Si vuole eliminare l\'elemento?', (cr: boolean) => {
						if(!cr) return;
						http.delete('rating-model/delete', s[x], (res: Rating) => {
							if(res) {
								res.validityState = '0';
								showSuccess('Elemento eliminato con successo.');
								updItem(res, this.table, 'id');
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
					this.brcr.status('Modifica', 'bg-danger');
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
				// .before(this.brcr)
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
				.add(this.main); // Pagina 0

			// Visualizzazione in pagina
			this.dlg.addToPages(this.pages, false); // Pagina 1
			
			return this.pages;
		}
		
		doFind() {
			let filter = this.form.getState();
			http.get('rating-model/findByFilters', filter, (data: Rating[]) => {
				if(!data) data = [];
				let l = data.length;
				if(!l) showWarning('Nessun elemento trovato.');
				this.table.setState(data);
			});
		}
	}
}
