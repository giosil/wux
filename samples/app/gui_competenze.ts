namespace APP {

	import WUtil = WUX.WUtil;

	export interface Competenza {
		id: number;
		tipoCompetenza?: string;
		codice?: string;
		nome?: string;
		descrizione?: string;
		areaCompetenza?: string;
		validityState?: string;
		commento?: string;
		creationDate?: any;
		creationBy?: string;
		lastUpdateDate?: any;
		lastUpdateBy?: string;
		reasonOperation?: string;
	}

	export class DlgCompetenza extends WUX.WDialog<string, Competenza> {
		fp: WUX.WForm;
		
		constructor(id: string) {
			super(id, 'DlgCompetenza');
			
			this.title = 'Competenza';
			
			this.fp = new WUX.WForm(this.subId('fp'));
			this.fp.addRow();
			this.fp.addTextField('codice', 'Codice');
			this.fp.addRow();
			this.fp.addTextField('nome', 'Nome');
			this.fp.addRow();
			this.fp.addTextField('descrizione', 'Descrizione');
			this.fp.addRow();
			this.fp.addTextField('areaCompetenza', 'Area di competenza');
			this.fp.addInternalField('id');
			
			this.body
				.addRow()
					.addCol('col-md-12')
						.add(this.fp);
		}
		
		override updateState(nextState: Competenza): void {
			this.state = nextState;
			if(this.fp) {
				this.fp.setState(this.state);
			}
		}
		
		override getState(): Competenza {
			if(this.fp) {
				this.state = this.fp.getState();
			}
			if(this.state) {
				if(!this.state.validityState) {
					this.state.validityState = 'false';
				}
			}
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
					this.fp.setReadOnly('codice', true);
					setTimeout(() => { this.fp.focusOn('nome'); });
				}
				else {
					this.fp.setReadOnly('codice', false);
					setTimeout(() => { this.fp.focusOn('codice'); });
				}
			}
		}
		
		clear() {
			if(this.fp) {
				this.fp.clear();
			}
			this.state = null;
		}
	}

	export class GUICompetenze extends WUX.WComponent {
		
		// Components
		main: WUX.WContainer;
		brcr: Breadcrumb;
		form: WUX.WForm;
		btnFind: WUX.WButton;
		btnReset: WUX.WButton;
		table: WUX.WDXTable;
		
		title: string;
		tipo: string;
		
		// Dialogs
		dlg: DlgCompetenza;
		
		constructor(title: string, tipo: string) {
			super('*', 'GUICompetenze');
			
			this.title = title;
			this.tipo = tipo;
			
			if(!this.title) this.title = 'Competenze';
			if(!this.tipo) this.tipo = 'C_TP';
			
			this.dlg = new DlgCompetenza(this.subId('dlg'));
			this.dlg.onHiddenModal((e: JQueryEventObject) => {
				if (!this.dlg.ok) return;
				
				let a = this.dlg.getProps();
				let s = this.dlg.getState();
				if(!a || !s) return;
				console.log('dlg action,state', a, s);
			});
		}
		
		override render() {
			this.brcr = new Breadcrumb();
			this.brcr.add(this.title);
			
			this.form = new WUX.WForm(this.subId('form'));
			this.form
				.addRow()
					.addTextField('codice', 'Codice')
					.addTextField('nome', 'Competenza', {"span": 2});

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
			
			let h = ['Codice', 'Competenza'];
			let k = ['codice', 'nome'];
			this.table = new WUX.WDXTable(this.subId('tapp'), h, k);
			this.table.selectionMode = 'single';
			this.table.filter = true;
			this.table.exportFile = "competenze";
			this.table.types = ['s', 's', 'w', 'w'];
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
			this.table.onClickAction((e: JQueryEventObject) => {
				// Action id
				let ai = WUX.firstSub(e.currentTarget);
				if (!ai) return;
				// Action value
				let av: number = WUtil.toNumber(WUX.lastSub(e.currentTarget));
				if (!av) return;
				console.log('action=' + ai + ",value=" + av);
				
				let s = this.table.getState();
				let x = WUtil.indexOf(s, 'id', av);
				if(x < 0) return;
				
				this.dlg.setProps(ai);
				this.dlg.setState(s[x]);
				this.dlg.show(this);
			});
			this.table.onDoubleClick((e: { element?: JQuery }) => {
				let srd = this.table.getSelectedRowsData();
				if (!srd || !srd.length) return;
				
				this.dlg.setProps('view');
				this.dlg.setState(srd[0]);
				this.dlg.show(this);
			});
			
			this.main = new WUX.WContainer();
			this.main
				.before(this.brcr)
				.addRow()
					.addCol('col-md-12')
						.add(this.form)
				.addRow('form-row justify-content-end')
					.add(this.btnFind)
					.add(this.btnReset)
				.addRow()
					.addCol('col-md-12')
						.add(this.table);
			
			return this.main;
		}
		
		doFind() {
			// Ricerca
			let filter = this.form.getState() as Competenza;
			filter.tipoCompetenza = this.tipo;
			filter.validityState = 'true';

			http.get('competenza/findByFilters', filter, (data: Competenza[]) => {
				if(!data) data = [];
				let l = data.length;
				if(!l) {
					showWarning('Nessun elemento trovato.');
				}
				this.table.setState(data);
			});
		}
	}
}
