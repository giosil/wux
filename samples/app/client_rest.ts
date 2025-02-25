namespace APP {
	
	export function getURLServices() {
		let h = window.location.hostname;
		let p = window.location.protocol;
		if(!p) p = "http:"
		if(!h || h.indexOf('localhost') >= 0) return "http://localhost:8081";
		let s = h.indexOf('.');
		if(s < 1) return "http://localhost:8081";
		return p + '//hcm-services' + h.substring(s);
	}
	
	export class HttpClient {
		url: string;
		mres: { [key: string]: any };
		mock: boolean;
		auth: string;
		
		constructor(url?: string, auth?: string) {
			this.url = url ? url : window.location.origin;
			this.auth = auth ? auth : '';
		}
		
		before() {
			window['BSIT'].showLoader();
		}
		
		after() {
			window['BSIT'].hideLoader();
		}
		
		sim(method: string, entity: string, params: any, success: (result: any) => void, failure?: (error: any) => void) {
			console.log('sim(' + method + "," + entity + ')', params);
			method = method ? method.toLowerCase() : 'get';
			this.before();
			setTimeout(() => {
				this.after();
				let d = null;
				if(this.mres) {
					let r = this.mres[method + "_" + entity];
					if(!r) r = this.mres[method];
					d = (typeof r === 'function') ? r(entity, params) : r;
				}
				if(d != null && d != undefined) {
					if(success) success(d);
				}
				else {
					if(failure) {
						failure({"message": 'No mock data for ' + method + ' ' + entity});
					}
					else {
						showError('No mock data for ' + method + ' ' + entity, 'Errore simulazione');
					}
				}
			}, 500);
		}
		
		get(entity: string, params: { [key: string]: any }, success: (result: any) => void, failure?: (error: any) => void) {
			if(this.mock) {
				this.sim('get', entity, params, success, failure);
				return;
			}
			this._get('GET', entity, params, success, failure);
		}

		delete(entity: string, params: { [key: string]: any }, success: (result: any) => void, failure?: (error: any) => void) {
			if(this.mock) {
				this.sim('delete', entity, params, success, failure);
				return;
			}
			this._send('DELETE', entity, params, success, failure);
		}
		
		remove(entity: string, params: { [key: string]: any }, success: (result: any) => void, failure?: (error: any) => void) {
			if(this.mock) {
				this.sim('delete', entity, params, success, failure);
				return;
			}
			this._get('DELETE', entity, params, success, failure);
		}
		
		post(entity: string, data: object, success: (result: any) => void, failure?: (error: any) => void) {
			if(this.mock) {
				this.sim('post', entity, data, success, failure);
				return;
			}
			this._send('POST', entity, data, success, failure);
		}
		
		put(entity: string, data: object, success: (result: any) => void, failure?: (error: any) => void) {
			if(this.mock) {
				this.sim('put', entity, data, success, failure);
				return;
			}
			this._send('PUT', entity, data, success, failure);
		}
		
		patch(entity: string, data: object, success: (result: any) => void, failure?: (error: any) => void) {
			if(this.mock) {
				this.sim('patch', entity, data, success, failure);
				return;
			}
			this._send('PATCH', entity, data, success, failure);
		}
		
		_get(method: string, entity: string, params: { [key: string]: any }, success: (result: any) => void, failure?: (error: any) => void) {
			if (!method) method = 'GET';
			if (params) {
				for(let k in params) {
					if(params[k] == null) params[k] = '';
				}
			}
			let search = params ? new URLSearchParams(params).toString() : "";
			let requrl = search ? this.url + "/" + entity + "?" + search : this.url + "/" + entity;
			this.before();
			fetch(requrl, {
				"method" : method,
				"headers": {
					"Authorization": this.auth
				}
			})
			.then(response => {
				this.after();
				if (!response.ok) {
					console.error('[HttpClient] ' + method + ' ' + entity + ': HTTP ' + response.status);
				}
				return response.json().then(body => ({
					status: response.status,
					body: body
				}));
			})
			.then(data => {
				if (!data) return;
				let s = data.status;
				let b = data.body;
				if(s >= 200 && s < 300) {
					if(success) success(b);
				}
				else {
					if (!b) b = {};
					let m = b.message;
					if (!m) {
						m = 'Errore HTTP ' + s;
						b["message"] = m;
					}
					if(failure) {
						failure(b);
					}
					else {
						showError(m, 'Errore servizio');
					}
				}
			})
			.catch(error => {
				console.error('[HttpClient] ' + method + ' ' + entity + ':', error);
				this.after();
				if (failure) {
					failure(error);
				}
				else {
					showError('Servizio non disponibile.', 'Errore chiamata');
				}
			});
		}
		
		_send(method: string, entity: string, data: object, success: (result: any) => void, failure?: (error: any) => void) {
			if (!method) method = 'POST';
			let requrl = this.url + "/" + entity;
			this.before();
			fetch(requrl, {
				"method" : method,
				headers: {
					"Content-Type": 'application/json',
					"Authorization": this.auth
				},
				body: JSON.stringify(data)
			})
			.then(response => {
				this.after();
				if (!response.ok) {
					console.error('[HttpClient] ' + method + ' ' + entity + ': HTTP ' + response.status);
				}
				return response.json().then(body => ({
					status: response.status,
					body: body
				}));
			})
			.then(data => {
				if(!data) return;
				let s = data.status;
				let b = data.body;
				if(s >= 200 && s < 300) {
					if(success) success(b);
				}
				else {
					if(!b) b = {};
					let m = b.message;
					if(!m) {
						m = 'Errore HTTP ' + s;
						b["message"] = m;
					}
					if(failure) {
						failure(b);
					}
					else {
						showError(m, 'Errore servizio');
					}
				}
			})
			.catch(error => {
				console.error('[HttpClient] ' + method + ' ' + entity + ':', error);
				this.after();
				if(failure) {
					failure(error);
				}
				else {
					showError('Servizio non disponibile.', 'Errore chiamata');
				}
			});
		}
	}

	export let http = new HttpClient(getURLServices(), 'Basic dXNlcjpwYXNzd29yZA==');
}