function wlaunch(script: string, loading: string | Element, callback: () => any) {
	console.log('wlaunch(' + script + ', ' + loading + ', callback)...');
	let l = new WLaucher();
	// Configurazione
	l.config = '/push-ana/config.js';
	// Feedback caricamento
	l.loading = loading;
	// Fogli di stile
	l.css('/push-ana/css/plugins/sweetalert/sweetalert.css');
	l.css('/push-ana/css/plugins/toastr/toastr.min.css');
	l.css('/push-ana/css/plugins/select2/select2.min.css');
	l.css('/push-ana/devextreme/css/dx.common.css');
	l.css('/push-ana/devextreme/css/dx.light.compact.css');
	l.css('/push-ana/css/wux.css', 'pushAnaAppVersion');
	// Script
	l.js('/push-ana/js/plugins/select2/select2.full.min.js');
	l.js('/push-ana/js/plugins/filesaver/FileSaver.min.js');
	l.js('/push-ana/js/plugins/wow/wow.min.js');
	l.js('/push-ana/js/plugins/sweetalert/sweetalert.min.js');
	l.js('/push-ana/js/plugins/toastr/toastr.min.js');
	l.js('/push-ana/cldr/cldr.min.js');
	l.js('/push-ana/cldr/cldr/event.min.js');
	l.js('/push-ana/cldr/cldr/supplemental.min.js');
	l.js('/push-ana/cldr/cldr/unresolved.min.js');
	l.js('/push-ana/globalize/globalize.min.js');
	l.js('/push-ana/globalize/globalize/message.min.js');
	l.js('/push-ana/globalize/globalize/number.min.js');
	l.js('/push-ana/globalize/globalize/date.min.js');
	l.js('/push-ana/globalize/globalize/currency.min.js');
	l.js('/push-ana/devextreme/js/jszip.min.js');
	l.js('/push-ana/devextreme/js/dx.web.js?');
	l.js('/push-ana/devextreme/dx.messages.it.min.js');
	l.js('/push-ana/js/jrpc.js');
	l.js('/push-ana/js/main-it.js');
	l.js('/push-ana/js/b2x.js');
	l.js('/push-ana/js/b2x-sticky/b2x-sticky.js');
	// WUX
	l.js('/push-ana/wux/js/wux.min.js', 'pushAnaAppVersion');
	if(script) {
		l.js('/push-ana/wux/js/' + script, 'pushAnaAppVersion');
	}
	// Elementi
	l.create(document.body, 'div', 'wux-waitpls', 'waitpls');
	
	l.start(callback);
}