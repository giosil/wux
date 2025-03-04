namespace APP {
	import WUtil = WUX.WUtil;

	export interface OLMapCon {
		attribution?: boolean;
		zoom?: boolean;
	}

	export interface OLMapInt {
		doubleClickZoom?: boolean;
		dragAndDrop?: boolean;
		dragPan?: boolean;
		keyboardPan?: boolean;
		keyboardZoom?: boolean;
		mouseWheelZoom?: boolean;
		pointer?: boolean;
		select?: boolean;
	}

	export interface OLMapCfg {
		lon?: number;
		lat?: number;
		zoom?: number;
		controls?: OLMapCon;
		interactions?: OLMapInt;
	}

	export interface OLMapShare {
		view?: ol.View;
	}

	type OLMarkerColor = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow' | 'gray';

	export class OLMap extends WUX.WComponent<any, string> {
		_cfg: OLMapCfg;
		imgs: string = '/images/';

		map: ol.Map;
		view: ol.View;
		controls: ol.Collection<ol.control.Control>;
		interactions: ol.Collection<ol.interaction.Interaction>;

		markers: any[][];
		mrkSrc: ol.source.Vector;
		mrkLay: ol.layer.Vector;
		mrkFea: ol.Feature[];

		polygons: any[][];
		polSrc: ol.source.Vector;
		polLay: ol.layer.Vector;
		polFea: ol.Feature[];

		popup: ol.Overlay;
		popups: string = "position:fixed;top:10;left:10;z-index:1000;padding:8px;background-color:#ffffff;font-weight:bold;font-size:small;box-shadow:0px 4px 10px rgba(0,0,0,0.5)";
		popupe: Element;
		popupn: string;
		pdx: number = 0;
		pdy: number = 0;

		share: OLMapShare;

		constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
			// WComponent init
			super(id ? id : '*', 'OLMap', null, classStyle, style ? style : 'width:100%;height:600px', attributes);
			this._cfg = {};

			this.markers = [];
			this.mrkFea = [];

			this.polygons = [];
			this.polFea = [];
		}

		get cfg(): OLMapCfg {
			return this._cfg;
		}
		set cfg(c: OLMapCfg) {
			this._cfg = c;
		}

		clear(): void {
			this.clearMarkers();
			this.clearPolygons();
		}

		clearMarkers(): void {
			this.markers = [];
			this.mrkFea = [];
			if(this.mounted && this.mrkLay) {
				this.map.removeLayer(this.mrkLay);
				this.mrkSrc = null;
				this.mrkLay = null;
				this.hidePopup();
			}
		}

		clearPolygons(): void {
			this.polygons = [];
			this.polFea = [];
			if(this.mounted && this.polLay) {
				this.map.removeLayer(this.polLay);
				this.polSrc = null;
				this.polLay = null;
				this.hidePopup();
			}
		}

		addMarker(lon: number, lat: number, name?: string, color?: OLMarkerColor, onhover?: (e: any) => any, onclick?: (e: any) => any): void {
			//                 0    1    2     3      4        5
			this.markers.push([lon, lat, name, color, onhover, onclick]);
			if(this.mounted) {
				this.hidePopup(false);
				this._addMarker(lon, lat, name, color);
			}
		}

		addPolygon(type: string, coordinates: any[], name?: string, color?: string, onhover?: (e: any) => any, onclick?: (e: any) => any): void {
			//                  0     1            2     3      4        5
			this.polygons.push([type, coordinates, name, color, onhover, onclick]);
			if(this.mounted) {
				this.hidePopup(false);
				this._addPolygon(type, coordinates, name, color);
			}
		}

		addGeometry(json: string, name: string, color?: string, onhover?: (e: any) => any, onclick?: (e: any) => any): void {
			if(!json) return;
			try {
				let g = JSON.parse(json);
				if(!g) return;
				let t = WUtil.getString(g, "type");
				if(!t) return;
				let c = WUtil.getArray(g, "coordinates");
				if(!c || !c.length) return;
				if(t == 'Point') {
					this.addMarker(c[0], c[1], name, color as OLMarkerColor, onhover, onclick);
				}
				else {
					this.addPolygon(t, c, name, color, onhover, onclick);
				}
			}
			catch(err) {
				console.error(err + ' in addGeometry ' + json);
			}
		}

		inflate(i: number, nc?: OLMarkerColor) {
			if(i < 0 && i >= this.mrkFea.length) return;
			let mi = this.markers[i];
			let mf = this.mrkFea[i];
			if(!mi || !mf) return;
			let c = mi[3] as OLMarkerColor;
			if(nc) c = nc;
			if(!c) c = 'blue';
			mf.setStyle(new ol.style.Style({
				image: new ol.style.Icon({
					anchor: [0.5, 46],
					anchorXUnits: 'fraction',
					anchorYUnits: 'pixels',
					src: this.imgs + 'marker-' + c + '.png',
					scale: 1,
				})
			}));
		}

		deflate(i: number, nc?: OLMarkerColor) {
			if(i < 0 && i >= this.mrkFea.length) return;
			let mi = this.markers[i];
			let mf = this.mrkFea[i];
			if(!mi || !mf) return;
			let c = mi[3] as OLMarkerColor;
			if(nc) c = nc;
			if(!c) c = 'blue';
			mf.setStyle(new ol.style.Style({
				image: new ol.style.Icon({
					anchor: [0.5, 46],
					anchorXUnits: 'fraction',
					anchorYUnits: 'pixels',
					src: this.imgs + 'marker-' + c + '.png',
					scale: 0.6,
				})
			}));
		}

		center(lon: number, lat: number, zoom: number): void {
			this.hidePopup(true);

			if(!lon && !lat) return;
			if(this.view) {
				this.view.setCenter(ol.proj.fromLonLat([lon, lat]));
				this.view.setZoom(zoom);
			}
			else {
				this._cfg.lon = lon;
				this._cfg.lat = lat;
				this._cfg.zoom = zoom;
			}
		}

		centerOn(o: any, zoom: number = 16) {
			let lon : number = 0;
			let lat : number = 0;
			if(typeof o == 'number') {
				if(!this.markers) return;
				if(o < 0 || o >= this.markers.length) return;
				let m = this.markers[o];
				lon = m[0];
				lat = m[1];
			}
			else {
				lon = WUtil.getNumber(o, "lon");
				lat = WUtil.getNumber(o, "lat");
			}
			if(!lon && !lat) return;
			this.center(lon, lat, zoom);
		}

		hidePopup(hard?: boolean): void {
			if(this.popupe) this.popupe.setAttribute('style', 'display:none;');
			this.popupn = '';
			if(hard) {
				this.map.removeOverlay(this.popup);
				if(this.popupe) this.popupe.remove();
				this.createPopup();
				this.popup = new ol.Overlay({
					element: this.popupe,
					positioning: 'bottom-center',
					stopEvent: false,
				});
				this.map.addOverlay(this.popup);
			}
		}

		createPopup(): Element {
			this.popupe = document.getElementById(this.subId('man-popup'));
			if(this.popupe) return this.popupe;
			let s = '';
			if(this.pdx) s+= 'margin-left:' + this.pdx + 'px;'
			if(this.pdy) s+= 'margin-top:' + this.pdy + 'px;'
			if(s) s = ' style="' + s + '"';
			let t = document.createElement("template");
			t.innerHTML = '<div id="' + this.subId('man-popup') + '"' + s + '></div>';
			this.popupe = t.content.firstElementChild;
			document.body.appendChild(this.popupe);
			return this.popupe;
		}

		showPopup(e: any, p: 'top' | 'bottom' | 'left' | 'right' = 'top'): string {
			let n : string = '';
			let f = e ? this.map.forEachFeatureAtPixel(e.pixel, function(f) { return f; }) : null;
			if (f) {
				n = f.get('name');
				if(n == this.popupn) return n;
			}
			if(this.popupn) this.hidePopup(true);
			this.popupn = n;
			if (n) {
				this.popup.setPosition(e.coordinate);
				if(this.popupe) {
					this.popupe.innerHTML = n;
					this.popupe.setAttribute('style', 'display:block;' + this.popups);
				}
			}
			return n;
		}

		protected hexToRgba(hex: string, a: string): string {
			var res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			if(!res) return '';
			let r = parseInt(res[1], 16);
			let g = parseInt(res[2], 16);
			let b = parseInt(res[3], 16);
			if(!a) a = '1.0';
			return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
		}

		protected componentDidMount(): void {
			if(!this._cfg.lon) this._cfg.lon = 12.4846;
			if(!this._cfg.lat) this._cfg.lat = 41.8977;
			if(!this._cfg.zoom) this._cfg.zoom = 9;

			if(this.share) {
				if(this.share.view) {
					this.view = this.share.view;
				}
				else {
					this.view = new ol.View({
						center: ol.proj.fromLonLat([this._cfg.lon, this._cfg.lat]),
						zoom: this._cfg.zoom
					});
					this.share.view = this.view;
				}
			}
			else {
				this.view = new ol.View({
					center: ol.proj.fromLonLat([this._cfg.lon, this._cfg.lat]),
					zoom: this._cfg.zoom
				});
			}

			if(this._cfg.controls) {
				// OpenLayers <= 6.14.1
				// this.controls = ol.control.defaults(this._cfg.controls);
				// OpenLayers >= 7.1
				this.controls = ol.control.defaults.defaults(this._cfg.controls);
			}
			if(this._cfg.interactions) {
				// OpenLayers <= 6.14.1
				// this.interactions = ol.interaction.defaults(this._cfg.interactions);
				// OpenLayers >= 7.1
				this.interactions = ol.interaction.defaults.defaults(this._cfg.interactions);
			}
			
			// source: new ol.source.Stamen({layer: 'watercolor'})
			// source: new ol.source.Stamen({layer: 'terrain'})
			// source: new ol.source.OSM()
			
			this.map = new ol.Map({
				target: this.id,
				layers: [
					new ol.layer.Tile({
						source: new ol.source.OSM()
					})
				],
				view: this.view,
				controls: this.controls,
				interactions: this.interactions
			});

			this.createPopup();
			this.popup = new ol.Overlay({
				element: this.popupe,
				positioning: 'bottom-center',
				stopEvent: false,
			});
			this.map.addOverlay(this.popup);

			this.map.on('click', (e: ol.events.Event) => {
				this.hidePopup(true);
				var f = this.map.forEachFeatureAtPixel(e.pixel, function(f) { return f; });
				let m = this.getMarker(f);
				if(m) {
					let h = m[5];
					if(h) {
						e["lon"] = m[0];
						e["lat"] = m[1];
						e["name"] = m[2];
						h(e);
					}
				}
				let p = this.getPolygon(f);
				if(p) {
					let h = p[5];
					if(h) h(e);
				}
			});
			this.map.on('pointermove', (e: ol.events.Event) => {
				let x = document.getElementById(this.map.getTarget() as string);
				var f = this.map.forEachFeatureAtPixel(e.pixel, function(f) { return f; });
				let m = this.getMarker(f);
				let c = false;
				if(m) {
					let h = m[4];
					if(m[5]) c = true;
					if(h) {
						e["lon"] = m[0];
						e["lat"] = m[1];
						e["name"] = m[2];
						h(e);
					}
				}
				let p = this.getPolygon(f);
				if(p) {
					let h = p[4];
					if(p[5]) c = true;
					if(h) h(e);
				}
				x.style.cursor = c ? 'pointer' : '';
			});

			if(this.markers) {
				for(let m of this.markers) {
					this._addMarker(m[0], m[1], m[2], m[3])
				}
			}

			if(this.polygons) {
				for(let p of this.polygons) {
					this._addPolygon(p[0], p[1], p[2], p[3]);
				}
			}
		}

		protected getMarker(f: ol.Feature | ol.render.Feature): any[] {
			if (f && this.markers) {
				let name = f.get('name')
				let idx = WUtil.indexOf(this.markers, 2, name);
				if(idx >= 0) return this.markers[idx];
			}
			return null;
		}

		protected getPolygon(f: ol.Feature | ol.render.Feature): any[] {
			if (f && this.polygons) {
				let name = f.get('name')
				let idx = WUtil.indexOf(this.polygons, 2, name);
				if(idx >= 0) return this.polygons[idx];
			}
			return null;
		}

		protected _addMarker(lon: number, lat: number, name?: string, color?: OLMarkerColor) {
			let mf = new ol.Feature({
				geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
				name: name,
			});
			if(!color) color = 'blue';
			mf.setStyle(new ol.style.Style({
				image: new ol.style.Icon({
					anchor: [0.5, 46],
					anchorXUnits: 'fraction',
					anchorYUnits: 'pixels',
					src: this.imgs + 'marker-' + color + '.png',
					scale: 0.6,
				})
			}));
			this.mrkFea.push(mf);
			
			if(this.mrkSrc && this.mrkLay) {
				this.mrkSrc.addFeature(mf);
			}
			else {
				this.mrkSrc = new ol.source.Vector({
					features: this.mrkFea
				});
				this.mrkLay = new ol.layer.Vector({
					source: this.mrkSrc
				});
				this.map.addLayer(this.mrkLay);
			}
		}

		protected _addPolygon(type: string, coordinates: any[], name?: string, color?: string): void {
			if(!type) type = 'MultiPolygon';
			if(!color) color = '#ff0000';

			let pf : ol.Feature;
			if(type == 'Polygon') {
				if(WUtil.starts(color, '#')) {
					color = this.hexToRgba(color, '0.4');
				}
				coordinates = this.fromLonLat(coordinates, 3);
				pf = new ol.Feature({
					geometry: new ol.geom.Polygon(coordinates),
					name: name,
				});
				pf.setStyle(new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: 'black',
						width: 1,
					}),
					fill: new ol.style.Fill({
						color: color,
					})
				}));
			}
			else if(type == 'LineString') {
				coordinates = this.fromLonLat(coordinates, 2);
				pf = new ol.Feature({
					geometry: new ol.geom.LineString(coordinates),
					name: name,
				});
				pf.setStyle(new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: color,
						width: 3,
					})
				}));
			}
			else if(type == 'MultiLineString') {
				coordinates = this.fromLonLat(coordinates, 3);
				pf = new ol.Feature({
					geometry: new ol.geom.MultiLineString(coordinates),
					name: name,
				});
				pf.setStyle(new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: color,
						width: 3,
					})
				}));
			}
			else {
				if(WUtil.starts(color, '#')) {
					color = this.hexToRgba(color, '0.4');
				}
				coordinates = this.fromLonLat(coordinates, 4);
				pf = new ol.Feature({
					geometry: new ol.geom.MultiPolygon(coordinates),
					name: name,
				});
				pf.setStyle(new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: 'black',
						width: 1,
					}),
					fill: new ol.style.Fill({
						color: color,
					})
				}));
			}
			this.polFea.push(pf);

			if(this.polSrc && this.polLay) {
				this.polSrc.addFeature(pf);
			}
			else {
				this.polSrc = new ol.source.Vector({
					features: this.polFea
				});
				this.polLay = new ol.layer.Vector({
					source: this.polSrc
				});
				this.map.addLayer(this.polLay);
			}
		}

		protected fromLonLat(c: any[], d: number = 1): any[] {
			if(d == 1) {
				let ll = ol.proj.fromLonLat(c as ol.Coordinate);
				c[0] = ll[0];
				c[1] = ll[1];
			}
			else if(d == 2) {
				// [][]
				for(let c0 of c) {
					let ll = ol.proj.fromLonLat(c0);
					c0[0] = ll[0];
					c0[1] = ll[1];
				}
			}
			else if(d == 3) {
				// [][][]
				for(let c0 of c) {
					for(let c1 of c0) {
						let ll = ol.proj.fromLonLat(c1);
						c1[0] = ll[0];
						c1[1] = ll[1];
					}
				}
			}
			else if(d == 4) {
				// [][][][]
				for(let c0 of c) {
					for(let c1 of c0) {
						for(let c2 of c1) {
							let ll = ol.proj.fromLonLat(c2);
							c2[0] = ll[0];
							c2[1] = ll[1];
						}
					}
				}
			}
			return c;
		}
	}
}