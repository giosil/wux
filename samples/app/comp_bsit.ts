namespace APP {

	export class Card extends WUX.WComponent<string, number> {
		bcls: string;
		title: string;
		text: string;
		icon: string;
		label: string;
		link: string;
		badge: boolean;

		constructor(id?: string, badge?: boolean, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
			super(id ? id : '*', 'Card', 'card', classStyle, style, attributes);
			this.badge = badge;
		}

		set(key?: string, title?: string, text?: string, icon?: string, link?: string, val?: number): this {
			this.props = key;
			this.title = title;
			this.text = text;
			this.icon = icon;
			this.link = link;
			this.state = val;
			return this;
		}

		render() {
			if (!this._classStyle) this._classStyle = 'card border-0 shadow-lg rounded-4 p-3';
			if (!this.bcls) this.bcls = 'card-body text-center';
			let s = this._style ? ' style="' + this._style + '"' : '';
			let r = '';
			r += '<div class="card-wrapper card-space">';
			r += '<div class="' + this._classStyle + '"' + s + '>';
			r += '<div class="' + this.bcls + '">';
			if (this.icon) {
				r += '<div class="icon-wrapper mb-3">';
				r += '<span class="icon-circle bg-light-primary text-primary"><i class="' + this.icon + '"></i></span>';
				r += '</div>';
			}
			if (this.title) {
				let b = '';
				if (this.badge) {
					if (this.state == null) {
						b = ' <span id="' + this.id + '-b" class="badge bg-warning" style="display:none;"></span>';
					}
					else if (this.state < 1) {
						b = ' <span id="' + this.id + '-b" class="badge bg-danger">' + this.state + '</span>';
					}
					else if(this.state > 0) {
						b = ' <span id="' + this.id + '-b" class="badge bg-primary">' + this.state + '</span>';
					}
				}
				r += '<h5 class="card-title fw-bold">' + this.title + b + '</h5>';
			}
			if (this.text) {
				r += '<p class="card-text text-muted">' + this.text + '</p>';
			}
			if (this.link) {
				if (!this.label) this.label = 'Esplora';
				r += '<a class="btn btn-primary btn-sm rounded-pill px-4 mt-2" href="' + this.link + '">';
				r += this.label + ' <i class="fas fa-arrow-right ms-2"></i>';
				r += '</a>';
			}
			r += '</div></div></div>';
			return r;
		}

		protected updateState(nextState: number): void {
			super.updateState(nextState);
			let b = document.getElementById(this.id + '-b');
			if (!b) return;
			if (this.state == null) {
				b.className = 'badge bg-danger';
				b.innerText = '';
				b.setAttribute('style', 'display:none;');
			}
			else if (this.state < 1) {
				b.className = 'badge bg-danger';
				b.innerText = '' + this.state;
				b.setAttribute('style', '');
			}
			else if(this.state > 0) {
				b.className = 'badge bg-primary';
				b.innerText = '' + this.state;
				b.setAttribute('style', '');
			}
		}
	}

}