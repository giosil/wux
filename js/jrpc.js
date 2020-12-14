function JRPC(s){this.urlEndPoint=s;this.authUserName=null;this.authPassword=null;this.authToken=null;this.callId=0;}
JRPC.prototype.setURL=function(s){
	this.urlEndPoint=s;
}
JRPC.prototype.setUserName=function(s){
	this.authUserName=s;
}
JRPC.prototype.setPassword=function(s){
	this.authPassword=s;
}
JRPC.prototype.setToken=function(s){
	this.authToken=s;
}
JRPC.prototype.upgradeValues=function(obj){
	var m,useHasOwn={}.hasOwnProperty?true:false;
	for(var key in obj){
		if(!useHasOwn || obj.hasOwnProperty(key)){
			if(typeof obj[key]=='string'){
				if(m=obj[key].match(/(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)\.(\d\d\d)./)){
					obj[key]=new Date(0);
					if(m[1])obj[key].setUTCFullYear(parseInt(m[1]));
					if(m[2])obj[key].setUTCMonth(parseInt(m[2])-1);
					if(m[3])obj[key].setUTCDate(parseInt(m[3]));
					if(m[4])obj[key].setUTCHours(parseInt(m[4]));
					if(m[5])obj[key].setUTCMinutes(parseInt(m[5]));
					if(m[6])obj[key].setUTCSeconds(parseInt(m[6]));
					if(m[7])obj[key].setUTCMilliseconds(parseInt(m[7]));
				}
				else if(m=obj[key].match(/^\/Date\((\d+)\)\/$/)){
					obj[key]=new Date(parseInt(m[1]));
				}
			}
			else if(obj[key] instanceof Object){
				this.upgradeValues(obj[key]);
			}
		}
	}
}
JRPC.prototype.beforeExecute = function(m){
	$("#page-wrapper").toggleClass('sk-loading');
	Pace.restart();
}
JRPC.prototype.afterExecute = function(m){
	$("#page-wrapper").toggleClass('sk-loading');
	Pace.stop();
}
JRPC.prototype.execute = function(methodName, params, successHandler, exceptionHandler, opt){
	this.callId++;
	var request, postData;
	request = {
		jsonrpc: "2.0",
		method: methodName,
		id: this.callId
	};
	if (params) request.params = params;
	postData = JSON.stringify(request);
	var xhr = null;
	if (window.XMLHttpRequest)
		xhr = new XMLHttpRequest();
	else if(window.ActiveXObject) {
		try{
			xhr = new ActiveXObject('Msxml2.XMLHTTP');
		}
		catch (err) {
			xhr = new ActiveXObject('Microsoft.XMLHTTP');
		}
	}
	if(successHandler && opt != '!') this.beforeExecute(methodName);
	var _this = this;
	xhr.open('POST', this.urlEndPoint, true, this.authUserName, this.authPassword);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Accept', 'application/json');
	if(this.authToken) {
		xhr.setRequestHeader('Authorization','Bearer '+this.authToken);
	}
	else if(this.authUserName) {
		xhr.setRequestHeader('Authorization','Basic '+btoa(this.authUserName+":"+this.authPassword));
	}
	xhr.send(postData);
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4){
			if(successHandler && opt != '!') _this.afterExecute(methodName);
			switch(xhr.status){
				case 200:
					var response = JSON.parse(xhr.responseText);
					if (response.error !== undefined){
						if (typeof exceptionHandler == 'function'){
							exceptionHandler(response.error);
						}
						else {
							_onRpcError(response.error);
						}
					} 
					else if (typeof successHandler == 'function'){
						var result = response.result;
						_this.upgradeValues(result);
						successHandler(result);
					}
					break;
				case 403:
					location.reload(true);
					break;
				default:
					console.log('JRPC.execute("' + methodName + '") -> HTTP ' + xhr.status);
					break;
			}
		}
	};
}
JRPC.prototype.executeSync = function(methodName, params){
	this.callId++;
	var request, postData;
	request = {
		jsonrpc : "2.0",
		method : methodName,
		id : this.callId
	};
	if(params) request.params = params;
	postData = JSON.stringify(request);
	var xhr = null;
	if (window.XMLHttpRequest)
		xhr = new XMLHttpRequest();
	else if(window.ActiveXObject) {
		try{
			xhr = new ActiveXObject('Msxml2.XMLHTTP');
		}
		catch (err) {
			xhr = new ActiveXObject('Microsoft.XMLHTTP');
		}
	}
	xhr.open('POST', this.urlEndPoint, false, this.authUserName, this.authPassword);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Accept', 'application/json');
	if(this.authToken) {
		xhr.setRequestHeader('Authorization','Bearer '+this.authToken);
	}
	else if(this.authUserName) {
		xhr.setRequestHeader('Authorization','Basic '+btoa(this.authUserName+":"+this.authPassword));
	}
	xhr.send(postData);
	if(xhr.status==200) {
		var response = JSON.parse(xhr.responseText);
		if(response.error !== undefined){
			_onRpcError(response.error);
			return null;
		} 
		return response.result;
	}
	else {
		console.log('JRPC.execute("' + methodName + '") -> HTTP ' + xhr.status);
	}
	return null;
}

function _onRpcError(error){
	console.log(error.message);
	toastr.error("Errore: " + error.message,"Errore di servizio");
}
