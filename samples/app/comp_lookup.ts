namespace APP {

	import WUtil = WUX.WUtil;

	export class LookupField extends WUX.WComponent {
		label: string;
		icon: string;
		hint: string;
		_ro: boolean;
		_i: HTMLElement;
		_s: HTMLElement;
		_c: HTMLElement;

		constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
			super(id ? id : '*', 'LookupField', '', classStyle, style, attributes);
		}

		get readonly(): boolean {
			return this._ro;
		}
		set readonly(v: boolean) {
			this._ro = v;
			WUX.toggleAttr(this._i, 'readonly', this._ro);
		}

		get enabled(): boolean {
			if (this._i) return this._i.getAttribute('disabled') == null;
			return this._enabled;
		}
		set enabled(b: boolean) {
			this._enabled = b;
			if (this.internal) this.internal.enabled = b;
			WUX.toggleAttr(this._i, 'disabled', !b);
			WUX.toggleAttr(this._s, 'disabled', !b);
			WUX.toggleAttr(this._c, 'disabled', !b);
		}

		setText(text: string, lock?: boolean): this {
			if (!this._i) return this;
			this._i['value'] = text;
			this.readonly = lock;
			return this;
		}

		getText(): string {
			if (!this._i) return '';
			return this._i['value'];
		}

		onSearch(h: (e: WUX.WEvent) => any): void {
			// Single handler
			this.handlers['_search'] = [h];
		}

		onCancel(h: (e: WUX.WEvent) => any): void {
			// Single handler
			this.handlers['_cancel'] = [h];
		}

		render() {
			let c = '';
			let r = '';
			if (this.label) {
				c = this._classStyle ? 'form-group ' + this._classStyle : 'form-group';
				r += '<label id="' + this.id + '-l" class="active">' + this.label + '</label>';
			}
			else {
				c = this._classStyle ? 'container ' + this._classStyle : 'container';
			}
			r += '<div id="' + this.id + '-g" class="input-group">';
			if (this.icon) {
				let i = this.icon.indexOf(' ') > 0 ? this.icon : 'fas ' + this.icon;
				r += '<span class="input-group-text"><i class="' + i + '"></i></span>';
			}
			if (!this.hint) this.hint = '';
			r += '<input id="' + this.id + '-i" type="text" class="form-control" placeholder="' + this.hint + '">';
			r += '<button id="' + this.id + '-s" type="button" title="Cerca" class="btn btn-dark"><i class="fas fa-search"></i></button>';
			r += '<button id="' + this.id + '-c" type="button" title="Cancella" class="btn btn-secondary"><i class="fas fa-times"></i></button>';
			r += '</div>';
			return this.build('div', r, '', c);
		}

		protected componentDidMount(): void {
			this._i = document.getElementById(this.id + '-i');
			this._s = document.getElementById(this.id + '-s');
			this._c = document.getElementById(this.id + '-c');
			if (this._i) {
				this._i.addEventListener("keydown", (e: KeyboardEvent) => {
					if (e.key === "Enter") {
						e.preventDefault();
						this.trigger('_search', this.getText());
					}
				});
			}
			if (this._s) {
				this._s.onclick = (e: MouseEvent) => {
					this.trigger('_search', this.getText());
				};
			}
			if (this._c) {
				this._c.onclick = (e: MouseEvent) => {
					this.readonly = false;
					this.setProps(null);
					this.setState(null);
					if(this._i) {
						this._i['value'] = '';
						this._i.focus();
					}
					this.trigger('_cancel');
				};
			}
		}
	}

	export class GUIDipendenti extends WUX.WComponent {
		// Components
		main: WUX.WContainer;
		brcr: Breadcrumb;
		form: WUX.WForm;
		btnFind: WUX.WButton;
		btnReset: WUX.WButton;
		table: WUX.WDXTable;
		// Dialog esterna
		xd: WUX.WDialog;

		constructor(id?: string, extDialog?: WUX.WDialog) {
			super(id ? id : '*', 'GUIDipendenti');
			this.xd = extDialog;
		}
		
		override render() {
			this.brcr = new Breadcrumb();
			this.brcr.add('Dipendenti');
			
			this.form = new WUX.WForm(this.subId('form'));
			this.form
				.addRow()
					.addTextField('cognome', 'Cognome')
					.addTextField('codiceFiscale', 'Codice Fiscale')
					.addTextField('matricola', 'Matricola');
			
			this.form.onEnter((e: KeyboardEvent) => {
				this.doFind();
			});
			
			this.form.setMandatory('cognome', 'codiceFiscale', 'matricola');
			
			this.btnFind = new WUX.WButton(this.subId('btnFind'), 'Esegui ricerca', 'fa-search', 'btn-icon btn btn-primary', 'margin-right: 0.5rem;');
			this.btnFind.on('click', (e: PointerEvent) => {
				
				this.doFind();
				
			});
			this.btnReset = new WUX.WButton(this.subId('btnReset'), 'Annulla', 'fa-undo', 'btn-icon btn btn-secondary');
			this.btnReset.on('click', (e: PointerEvent) => {

				this.doReset();

			});
			
			let h = ['Codice Fiscale', 'Matricola', 'Cognome', 'Nome'];
			let k = ['codiceFiscale', 'matricola', 'cognome', 'nome'];
			this.table = new WUX.WDXTable(this.subId('tapp'), h, k);
			this.table.selectionMode = 'single';
			this.table.filter = true;
			this.table.exportFile = "dipendenti";
			this.table.types = ['s', 's', 's', 's'];
			this.table.paging = true;
			this.table.pageSize = 5;

			this.table.onDoubleClick((e: { element?: JQuery }) => {
				let srd = this.table.getSelectedRowsData();
				if (!srd || !srd.length) return;
				if (this.xd) {
					// Se la GUI e' istanziata dalla Dialog che la contiene
					// al doppio click si esegue il click sul pulsante Ok.
					this.xd.fireOk();
					return;
				}
			});
			
			this.table.onSelectionChanged((e: any) => {
				let c = WUtil.get(e, 'component');
				if (c) c.focus();
			});
			this.table.onKeyDown((e: any) => {
				let k = WUtil.get(e, 'event.key');
				if(k == 'Enter') {
					let srd = this.table.getSelectedRows();
					if (!srd || !srd.length) return;
					if (this.xd) {
						// Se la GUI e' istanziata dalla Dialog che la contiene
						// alla pressione dell'INVIO si esegue il click sul pulsante Ok.
						this.xd.fireOk();
						return;
					}
				}
				else if (k == 'ArrowUp') {
					let srd = this.table.getSelectedRows();
					if (!srd || !srd.length) return;
					let x = srd[0];
					if (x > 0) {
						x--;
						setTimeout(() => {
							this.table.select([x]);
						});
					}
				}
				else if (k == 'ArrowDown') {
					let srd = this.table.getSelectedRows();
					if (!srd || !srd.length) return;
					let s = this.table.getState();
					if (!s || !s.length) return;
					let x = srd[0];
					if (x < s.length - 1) {
						x++;
						setTimeout(() => {
							this.table.select([x]);
						});
					}
				}
			});

			this.main = new WUX.WContainer();
			if (!this.xd) this.main.before(this.brcr);
			this.main
				.addRow()
				.addCol('col-md-12')
					.add(this.form)
				.addRow()
					.addCol('col-md-8')
						.addGroup({"classStyle": "form-row"}, this.btnFind, this.btnReset)
				.addRow()
					.addCol('col-md-12', 'padding-top: 1rem;')
						.add(this.table);

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
			http.get('dipendente/findByFilters', this.form.getState(), (data: Dipendente[]) => {
				let l = WUtil.size(data);
				if (!l) showWarning('Nessun dipendente trovato.');
				this.table.pageIndex(0);
				this.table.setState(data);
				if (l) {
					setTimeout(() => {
						this.table.select([0]);
					}, 100);
				}
				else {
					setTimeout(() => { 
						this.form.focus();
					}, 100);
				}
			});
		}

		doReset(f?: any) {
			this.form.clear();
			if (f) this.form.setState(f);
			this.table.setState([]);
		}

		getSelected(): Dipendente {
			let srd = this.table.getSelectedRowsData();
			if (!srd || !srd.length) return null;
			return srd[0];
		}
	}

	export class DlgDipendenti extends WUX.WDialog<string, Dipendente> {
		gui: GUIDipendenti;
		filter: Dipendente;

		constructor(id: string) {
			super(id, 'DlgDipendenti');
			
			this.mainClass = 'modal-dialog modal-xl';
			this.title = 'Selezionare il dipendente';

			this.gui = new GUIDipendenti(this.subId('gui'), this);
			this.body.add(this.gui)
		}

		override onClickOk(): boolean {
			this.state = this.gui.getSelected();
			if (!this.state) {
				showWarning('Selezionare il dipendente.');
				return false;
			}
			return true;
		}

		protected onShown() {
			// Si riporta il filtro
			this.gui.doReset(this.filter);
			// Si esegue la ricerca automatica
			this.gui.doFind();
		}

		protected onHidden() {
			// Quando si chiude la dialog si azzera il filtro
			this.filter = null;
		}
	}

	export class LookupDip extends LookupField {
		dlg: DlgDipendenti;

		constructor(id?: string) {
			super(id ? id : '*', 'LookupDip');

			// Personalizzazione componente
			this.label = 'Dipendente';
			this.icon = 'fa-user';
			this.hint = 'Ricerca dipendente...';
			this.onSearch((e: WUX.WEvent) => {
				if (!this.readonly) {
					this.dlg.filter = this.getFilter();
				}
				this.dlg.show();
			});
			this.onCancel((e: WUX.WEvent) => {
				this.setState(null);
			});

			this.dlg = new DlgDipendenti(this.subId('dlg'));
			this.dlg.onHiddenModal((e: JQueryEventObject) => {
				if (!this.dlg.ok) return;
				let d = this.dlg.getState();
				if (!d) return;
				if(!d.codiceFiscale) {
					showWarning('Codice fiscale assente.');
					return;
				}
				let t = d.codiceFiscale;
				if (d.cognome) t += '    ' + d.cognome;
				if (d.nome) t += '    ' + d.nome;
				this.setText(t, true);
				this.setState(d.codiceFiscale);
			});
		}

		getFilter(): any {
			let t = this.getText();
			if (!t) return null;
			t = t.trim().toUpperCase();
			if (!t) return null;
			let c0 = t.substring(0, 1);
			if (c0 >= '0' && c0 <= '9') {
				return { matricola: t };
			}
			if (t.length > 6) {
				let c6 = t.substring(6, 7);
				if (c6 >= '0' && c6 <= '9') {
					if (t.length > 16) t = t.substring(0, 16);
					return { codiceFiscale: t };
				}
			}
			return { cognome: t };
		}
	}
}