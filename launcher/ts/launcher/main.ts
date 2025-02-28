function wlaunch(script: string, loading: string | Element, callback: () => any) {
	console.log('wlaunch(' + script + ', ' + loading + ', callback)...');
	let l = new WLaucher();
	// Configurazione
	l.config = '/webapp/config.js';
	// Feedback caricamento
	l.loading = loading;
	// Fogli di stile
	l.css('/webapp/devextreme/css/dx.common.css');
	l.css('/webapp/devextreme/css/dx.light.compact.css');
	// Script
	l.js('/webapp/js/plugins/filesaver/FileSaver.min.js');
	l.js('/webapp/cldr/cldr.min.js');
	l.js('/webapp/cldr/cldr/event.min.js');
	l.js('/webapp/cldr/cldr/supplemental.min.js');
	l.js('/webapp/cldr/cldr/unresolved.min.js');
	l.js('/webapp/globalize/globalize.min.js');
	l.js('/webapp/globalize/globalize/message.min.js');
	l.js('/webapp/globalize/globalize/number.min.js');
	l.js('/webapp/globalize/globalize/date.min.js');
	l.js('/webapp/globalize/globalize/currency.min.js');
	l.js('/webapp/devextreme/js/jszip.min.js');
	l.js('/webapp/devextreme/js/dx.web.js?');
	l.js('/webapp/devextreme/dx.messages.it.min.js');
	// WUX
	l.js('/webapp/wux/js/wux.min.js', 'appVersion');
	if(script) {
		l.js('/webapp/wux/js/' + script, 'appVersion');
	}
	// Elementi
	l.create(document.body, 'div', 'wux-waitpls', 'waitpls');
	// Avvio
	l.start(callback);
}