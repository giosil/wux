namespace APP {
	
	import WUtil = WUX.WUtil;

	/*
		Example:
		
		let data = [
			{"merce": "M1", "data": "01/01/2023", "qta": 10},
			{"merce": "M1", "data": "08/01/2023", "qta": 12},
			{"merce": "M1", "data": "15/01/2023", "qta": 8},
			
			{"merce": "M2", "data": "01/01/2023", "qta": 7},
			{"merce": "M2", "data": "08/01/2023", "qta": 9},
			{"merce": "M2", "data": "15/01/2023", "qta": 11},
		];
		
		let chartData = {
			"series": "merce", "values": "qta", "arguments": "data",
			"argType": "d", // Date
			"data": data
		};
		
		this.chart = new Chart(this.subId('chart'), 'bar');
		this.chart.css({ h: 200 });
		this.chart.title = 'Rilevazione';
		this.chart.setState(chartData);
	*/

	export interface ChartData {
		series?: string;
		values?: string;
		arguments?: string;
		argType?: string;
		data?: any[];
	}

	type CharType = 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';

	export class Chart extends WUX.WComponent<CharType, ChartData> {
		title: string;
		subTitle: string;
		palette: any;
		source: any[];
		series: Array<DevExpress.viz.ChartSeries>;
		labels: boolean = false;
		legend: boolean = true;
		rotated: boolean = false;
		xTitle: string;
		xRotate: number;
		yTitle: string;
		sTitle: string;
		pSymbol: 'circle' | 'cross' | 'polygon' | 'square' | 'triangleDown' | 'triangleUp';
		pSize: number;
		pVisible: boolean;
		color: string;

		constructor(id?: string, type?: CharType, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
			super(id ? id : '*', 'Chart', type, classStyle, style, attributes);
			this.forceOnChange = true;
		}

		protected updateState(nextState: ChartData): void {
			super.updateState(nextState);

			this.source = [];
			this.series = [];

			if(!this.state) return;
			let d = this.state.data;
			if(!d || !d.length) return;

			let s = this.state.series;
			let v = this.state.values;
			if(!v) return;
			let a = this.state.arguments;
			if(!a) return;
			let t = this.state.argType;

			let noS = !s || s == a;
			if(noS) {
				this.series.push({
					"valueField": "s0", "name": this.sTitle ? this.sTitle : s
				});
			}

			// Array di series
			let arrayS: any[] = [];
			// Array di arguments
			let arrayA: any[] = [];

			// Si ottengono tutti i valori di series e arguments
			for(let dr of d) {
				if(!noS) {
					let serVal = dr[s];
					if(serVal && arrayS.indexOf(serVal) < 0) {
						let idx = arrayS.length;
						arrayS.push(serVal);
						this.series.push({
							"valueField": "s" + idx, "name": serVal
						});
					}
				}
				let argVal = dr[a];
				if(argVal && arrayA.indexOf(argVal) < 0) {
					arrayA.push(argVal);
				}
			}

			// Si costruisce source
			for(let ai of arrayA) {
				let sr = {};
				if(t == 'd') {
					let d = WUtil.toDate(ai);
					sr["a"] = d ? WUX.formatDate(d) : ai;
				}
				else {
					sr["a"] = ai;
				}
				for(let dr of d) {
					let argVal = dr[a];
					if(argVal != ai) continue;

					let value = dr[v];
					if(!value) value = 0;

					if(noS) {
						sr["s0"] = value;
					}
					else {
						let serVal = dr[s];
						let idx = arrayS.indexOf(serVal);
						if(idx < 0) continue;
						sr["s" + idx] = value;
					}
				}
				this.source.push(sr);
			}
		}

		protected componentDidMount(): void {
			if (this._tooltip) {
				this.$r.attr('title', this._tooltip);
			}
			if(!this.title) this.title = '';
			if(!this.source) this.source = [];
			if(!this.series) this.series = [];
			if(!this.props) this.props = 'bar';

			let opt: DevExpress.viz.dxChartOptions = {
				dataSource: this.source,
				commonSeriesSettings: {
					argumentField: 'a',
					type: this.props,
					label: {
						visible: this.labels,
					},
					point: {
						symbol: this.pSymbol,
						size: this.pSize,
						visible: this.pVisible
					}
				},
				series: this.series,
				title: this.title,
				legend: {
					verticalAlignment: 'bottom',
					horizontalAlignment: 'center',
					visible: this.legend
				},
				export: {
					enabled: true,
				},
				tooltip: {
					enabled: true,
					location: 'edge',
					customizeTooltip(a){return {text: `${a.seriesName}: ${a.valueText}`};}
				},
				rotated: this.rotated
			};
			if(this.color) {
				opt.commonSeriesSettings.color = this.color;
			}
			if(this.palette) {
				opt.palette = this.palette;
			}
			if(this.xRotate) {
				opt.argumentAxis = {
					label: {
						displayMode:"rotate",
						rotationAngle: this.xRotate
					}
				};
			}
			if(this.subTitle) {
				opt.title = {
					text: this.title,
					subtitle: {
						text: this.subTitle
					}
				};
			}
			if(this.xTitle) {
				opt.argumentAxis = {
					title: {
						text: this.xTitle
					}
				}
			}
			if(this.yTitle) {
				opt.valueAxis = {
					title: {
						text: this.yTitle
					}
				}
			}
			if(this.$r) this.$r.dxChart(opt);
		}

		getInstance(copt?: DevExpress.viz.dxChartOptions): DevExpress.viz.dxChart {
			if (!this.mounted) return null;
			if(copt) this.$r.dxChart(copt);
			return this.$r.dxChart('instance');
		}
	}

	export class PieChart extends WUX.WComponent<'donut' | 'doughnut' | 'pie', ChartData> {
		title: string;
		subTitle: string;
		palette: any
		source: any[];
		series: Array<DevExpress.viz.PieChartSeries>;
		labels: boolean = false;

		constructor(id?: string, type?: 'donut' | 'doughnut' | 'pie', classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
			super(id ? id : '*', 'PieChart', type, classStyle, style, attributes);
			this.forceOnChange = true;
		}

		protected updateState(nextState: ChartData): void {
			super.updateState(nextState);

			this.source = [];
			this.series = [];

			if(!this.state) return;
			let d = this.state.data;
			if(!d || !d.length) return;

			let v = this.state.values;
			if(!v) return;
			let a = this.state.arguments;
			if(!a) this.state.series;
			if(!a) return;
			
			// Array di arguments
			let arrayA: any[] = [];
			let mapAV: {[arg: string]: number} = {};
			let tot = 0;
			for(let r of d) {
				let val = WUtil.getNumber(r, v);
				tot += val;
				
				let arg = WUtil.getString(r, a);
				if(!arg) continue;
				if(arrayA.indexOf(arg) < 0) {
					arrayA.push(arg);
				}
				
				let pv = WUtil.getNumber(mapAV, arg);
				mapAV[arg] = pv + val;
			}
			
			for(let arg of arrayA) {
				let val = WUtil.getNumber(mapAV, arg);
				let prc = tot ? val * 100 / tot : 0;
				this.source.push({"a": arg, "v": WUtil.round2(prc)});
			}
			
			this.series.push({
				argumentField: "a",
				valueField: "v",
				label: {
					visible: this.labels,
					connector: {
						visible: this.labels,
						width: 1
					}
				}
			})
		}

		protected componentDidMount(): void {
			if (this._tooltip) {
				this.$r.attr('title', this._tooltip);
			}
			if(!this.title) this.title = '';
			if(!this.source) this.source = [];
			if(!this.series) this.series = [];
			if(!this.props) this.props = 'pie';

			let opt: DevExpress.viz.dxPieChartOptions = {
				dataSource: this.source,
				series: this.series,
				title: this.title,
				legend: {
					verticalAlignment: 'bottom',
					horizontalAlignment: 'center',
				},
				export: {
					enabled: true,
				},
				tooltip: {
					enabled: true,
					customizeTooltip(a){return {text: `${a.argumentText}: ${a.valueText}`};}
				}
			};
			if(this.palette) {
				opt.palette = this.palette;
			}
			if(this.subTitle) {
				opt.title = {
					text: this.title,
					subtitle: {
						text: this.subTitle
					}
				};
			}
			if(this.$r) this.$r.dxPieChart(opt);
		}

		getInstance(copt?: DevExpress.viz.dxPieChartOptions): DevExpress.viz.dxPieChart {
			if (!this.mounted) return null;
			if(copt) this.$r.dxPieChart(copt);
			return this.$r.dxPieChart('instance');
		}
	}
}