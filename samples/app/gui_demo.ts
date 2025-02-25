namespace APP {
	
	import WUtil = WUX.WUtil;

	export class GUIDemo extends WUX.WComponent {
		
		main: WUX.WContainer;
		brcr: Breadcrumb;
		
		map: OLMap;
		inflated: boolean;
		btnFind: WUX.WButton;
		btnCenter: WUX.WButton;
		btnInflate: WUX.WButton;
		btnPolygon: WUX.WButton;
		
		tab: WUX.WTab;
		
		cbar: Chart;
		tbar: WUX.WDXTable;
		cline: Chart;
		tline: WUX.WDXTable;
		cpie: PieChart;
		tpie: WUX.WDXTable;
		
		constructor() {
			super();
		}
		
		override render() {
			this.brcr = new Breadcrumb();
			this.brcr.add('Demo');
			
			let chartData = this.loadChartData();
			
			let h = ['Competenza', 'Data', 'Rating'];
			let k = ['competenza', 'data', 'rating'];
			let t = ['s', 'd', 'n'];
			
			// Mappa
			this.map = new OLMap(this.subId('map'));
			this.map.cfg = {lon: 12.4846, lat: 41.8977, zoom: 9};
			
			// Istogramma
			this.cbar = new Chart(this.subId('cbar'), 'bar');
			this.cbar.css({ h: 300 });
			this.cbar.title = 'Istogramma';
			this.cbar.setState(chartData);
			
			this.tbar = new WUX.WDXTable(this.subId('tbar'), h, k);
			this.tbar.types = t;
			this.tbar.filter = true;
			this.tbar.exportFile = "istogramma";
			this.tbar.setState(this.loadData());
			
			// Grafico lineare
			this.cline = new Chart(this.subId('clne'), 'line');
			this.cline.css({ h: 300 });
			this.cline.title = 'Grafico lineare';
			this.cline.setState(chartData);
			
			this.tline = new WUX.WDXTable(this.subId('tline'), h, k);
			this.tline.types = t;
			this.tline.filter = true;
			this.tline.exportFile = "lineare";
			this.tline.setState(this.loadData());
			
			// Grafico a torta
			this.cpie = new PieChart(this.subId('cpie'), 'pie');
			this.cpie.title = 'Composizione valore';
			this.cpie.css({h: 300});
			this.cpie.labels = true;
			this.cpie.setState(chartData);
			
			this.tpie = new WUX.WDXTable(this.subId('tarea'), h, k);
			this.tpie.types = t;
			this.tpie.filter = true;
			this.tpie.exportFile = "torta";
			this.tpie.setState(this.loadData());
			
			this.tab = new WUX.WTab("tab");
			this.tab.addTab('Istogramma', 'fa-bar-chart')
				.addRow()
					.addCol("col-12")
						.add(this.cbar)
				.addRow()
					.addCol("col-12")
						.add(this.tbar);
			this.tab.addTab('Grafico lineare', 'fa-line-chart')
				.addRow()
					.addCol("col-12")
						.add(this.cline)
				.addRow()
					.addCol("col-12")
						.add(this.tline);
			this.tab.addTab('Grafico a torta', 'fa-pie-chart')
				.addRow()
					.addCol("col-12")
						.add(this.cpie)
				.addRow()
					.addCol("col-12")
						.add(this.tpie);
			this.tab.on('statechange', (e: WUX.WEvent) => {
				let s = this.tab.getState();
				switch(s) {
					case 0:
						this.cbar.forceUpdate();
						this.tbar.refresh();
						break;
					case 1:
						this.cline.forceUpdate();
						this.tline.refresh();
						break;
					case 2:
						this.cpie.forceUpdate();
						this.tpie.refresh();
						break;
				}
			});
			
			this.btnFind = new WUX.WButton(this.subId('btnFind'), 'Ricerca', 'fa-search', 'btn-icon btn btn-primary', 'margin-right: 0.5rem;');
			this.btnFind.on('click', (e: PointerEvent) => {
				
				this.loadMarkers();
				
			});
			this.btnCenter = new WUX.WButton(this.subId('btnCenter'), 'Pulisci', 'fa-bookmark', 'btn-icon btn btn-secondary', 'margin-right: 0.5rem;');
			this.btnCenter.on('click', (e: PointerEvent) => {
				
				this.map.clear();
				this.map.center(12.4846, 41.8977, 9);
				
			});
			this.btnInflate = new WUX.WButton(this.subId('btnInflate'), 'Evidenzia', 'fa-comment', 'btn-icon btn btn-success', 'margin-right: 0.5rem;');
			this.btnInflate.on('click', (e: PointerEvent) => {
				if(this.inflated) {
					this.map.deflate(0);
					this.inflated = false;
				}
				else {
					this.map.inflate(0);
					this.inflated = true;
				}
			});
			this.btnPolygon = new WUX.WButton(this.subId('btnPolygon'), 'Poligoni', 'fa-globe', 'btn-icon btn btn-danger', 'margin-right: 0.5rem;');
			this.btnPolygon.on('click', (e: PointerEvent) => {
				
				this.loadPolygons();
				
			});
			
			let mapcnt = new WUX.WContainer();
			mapcnt
				.addRow()
					.addCol('col-12')
						.add(this.map)
				.addRow(null, 'margin-top: 1rem;')
					.addCol('col-3')
						.add(this.btnFind)
					.addCol('col-3')
						.add(this.btnCenter)
					.addCol('col-3')
						.add(this.btnInflate)
					.addCol('col-3')
						.add(this.btnPolygon)
			
			this.main = new WUX.WContainer();
			this.main
				.before(this.brcr)
				.addRow()
					.addCol('col-md-6')
						.add(mapcnt)
					.addCol('col-md-6')
						.add(this.tab);
			
			return this.main;
		}
		
		componentDidMount() {
			
			this.loadMarkers();
			
		}
		
		onMarkerHover(e: any) {
			this.map.showPopup(e, 'left');
		}
		
		onMarkerClick(e: any) {
			this.map.centerOn(e);
		}
		
		loadMarkers() {
			this.map.clearMarkers();
			
			let on_hover = this.onMarkerHover.bind(this);
			let on_click = this.onMarkerClick.bind(this);
			
			this.map.addMarker(12.2497, 41.7981, 'Fiumicino Airport', 'blue', on_hover, on_click);
			this.map.addMarker(12.5945, 41.7978, 'Ciampino Airport',  'red',  on_hover, on_click);
			
			this.inflated = false;
		}
		
		loadPolygons() {
			this.map.clearPolygons();

			let s = "{\"type\":\"MultiPolygon\",\"coordinates\":[[[[12.6116,41.9209],[12.7406,41.9267],[12.8047,41.8230],[12.5990,41.8531]]]]}";
			let g = JSON.parse(s);
			let t = WUtil.getString(g, "type");
			let c = WUtil.getArray(g, "coordinates");
			this.map.addPolygon(t, c, 'Test Polygon', '#ff0000', null, (e) => {console.log("polygon click ", e); this.map.showPopup(e, 'top'); });

			this.map.addPolygon('LineString', [[12.4241, 41.9766],[12.3770, 42.0274],[12.2440, 42.0523],[12.2682, 42.0916]], 'Test line', '#0000aa');

		}
		
		loadData() {
			let data = [
				{"competenza": "Specialistiche", "data": "01/08/2024", "rating": 8},
				{"competenza": "Specialistiche", "data": "01/09/2024", "rating": 10},
				{"competenza": "Specialistiche", "data": "01/10/2024", "rating": 6},
				{"competenza": "Specialistiche", "data": "01/11/2024", "rating": 8},
				
				{"competenza": "Professionali", "data": "01/08/2024", "rating": 8},
				{"competenza": "Professionali", "data": "01/09/2024", "rating": 7},
				{"competenza": "Professionali", "data": "01/10/2024", "rating": 9},
				{"competenza": "Professionali", "data": "01/11/2024", "rating": 4},
				
				{"competenza": "Comportamentali", "data": "01/08/2024", "rating": 6},
				{"competenza": "Comportamentali", "data": "01/09/2024", "rating": 9},
				{"competenza": "Comportamentali", "data": "01/10/2024", "rating": 4},
				{"competenza": "Comportamentali", "data": "01/11/2024", "rating": 10},
			];
			return data;
		}
		
		loadChartData(): ChartData {
			let data = this.loadData();
			return {
				"series": "competenza", "values": "rating", "arguments": "data",
				"argType": "d", // Date
				"data": data
			};
		}
	}

}
