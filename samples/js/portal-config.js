window.BSIT={
	counter: 0,
	triggerReadyState: (info) => {
		console.log(`${info.appName} ready!`);
		window.dispatchEvent(new CustomEvent('erpb:app-ready', info));
		let cc = new CustomEvent('config-change', {detail: {baseUrl:"https://gwapi.dew.org/appbe"}});
		window.dispatchEvent(cc);
		let sc = new CustomEvent('session-change', {detail: {accessToken:"1", userInfo:null, isClientCredentials:true }});
		window.dispatchEvent(sc);
	},
	showLoader: () => {
		window.BSIT.counter++;
		document.body.classList.add('loading');
	},
	hideLoader: () => {
		if (--window.BSIT.counter <= 0) {
			document.body.classList.remove('loading');
			if (window.BSIT.counter < 0) {
				window.BSIT.counter = 0;
			}
		}
	},
	notify: (notification) => {
		const div = document.createElement('div');
		const counterId = Number($("[id*='api-notification-'").last().attr("data-id")) + 1 || 0;
		if (notification.dismissable == null || notification.dismissable == undefined) {
			notification.dismissable = true;
		}
		switch (notification.state) {
			case 'error':
				notification.icon = "fa-circle-stop";
				break;
			case 'success':
				notification.icon = "fa-circle-info";
				break;
			case 'warning':
				notification.icon = "fa-circle-exclamation";
				break;
			default:
				notification.icon = "fa-circle-user";
				break;
		}
		const element = `<div role="alert" class="notification with-icon mt-3 ${!notification.dismissable ? '' : 'dismissable'} ${notification.state || 'info'} show"
			style="display: block;" id="api-notification-${counterId}" data-bs-toggle="notification" data-bs-target="#api-notification-${counterId}" data-id="${counterId}" data-bs-timeout="5000">
			<h5>
				${notification.title}
				<i class="fa ${notification.icon}"></i>
			</h5>
			<p>${notification.message}</p>
			<button type="button" class="notification-close btn btn- ${!notification.dismissable ? 'd-none' : ''}" onclick="document.getElementById('notification-center').innerHTML=''">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon" role="img">
					<path d="M12.7 12l3.7 3.6-.8.8-3.6-3.7-3.6 3.7-.8-.8 3.7-3.6-3.7-3.6.8-.8 3.6 3.7 3.6-3.7.8.8z"></path>
					<path fill="none" d="M0 0h24v24H0z"></path>
				</svg>
				<span class="sr-only">Close: ${notification.title}</span>
			</button>
		</div>`;
		div.innerHTML = element;
		document.getElementById('notification-center').append(div.firstChild);
		setTimeout(() => {
			document.getElementById('notification-center').innerHTML = '';
		}, notification.duration || 5000);
	}
};
