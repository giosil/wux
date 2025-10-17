namespace APP {

	export class Main extends WUX.WComponent {
		box: WUX.WBox;

		protected render() {
			this.box = new WUX.WBox('bxf');
			this.box.title = 'Main Box';
			this.box.addTool(new WUX.WLabel('lbl', 'Label'))
			this.box.addCollapse((e: WUX.WEvent) => {
				console.log(e);
			});
			this.box
				.addRow()
					.addCol('6')
						.add('<span>A</span>')
					.addCol('6')
						.add('<span>B</span>')
				.addRow()
					.addCol('6')
						.add('<span>C</span>')
					.addCol('6')
						.add('<span>D</span>');

			return this.box;
		}
	}

}
