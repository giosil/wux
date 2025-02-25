namespace APP {

	export class GUIText extends WUX.WComponent {
		
		main: WUX.WContainer;
		
		brcr: Breadcrumb;
		
		title: string;
		text: string;
		
		constructor(title: string, text: string) {
			super();
			this.title = title;
			this.text = text;
		}

		override render() {
			this.main = new WUX.WContainer();

			if(this.title) {
				this.brcr = new Breadcrumb();
				this.brcr.add(this.title);
				
				this.main.before(this.brcr)
			}
			if(!this.text) this.text = '';

			this.main
				.addRow()
					.addCol('col-md-12')
						.add('<p>' + this.text + '</p>');

			return this.main;
		}
	}
	
}
