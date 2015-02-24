var Countdown = function (options) {
	var timer,
		instance = this,
		status = 'stopped',
		seconds = options.seconds || 10,
		updateStatus = options.onUpdateStatus || function () {},
		counterEnd = options.onCounterEnd || function () {},
		counterReset = options.onCounterReset || function () {};

	function decrementCounter() {
		updateStatus(seconds);
		if (seconds === 0) {
			counterEnd();
			instance.stop('finished');
		}
		seconds--;
	}

	this.start = function () {
		decrementCounter();
		timer = setInterval(decrementCounter, 1000);
		status = 'running';
	};

	this.stop = function (status) {
		clearInterval(timer);
		status = status || 'stopped';
	};

	this.restart = function () {
		instance.reset();
		instance.start();
	};

	this.reset = function () {
		clearInterval(timer);
		seconds = options.seconds || 10;
		counterReset(seconds);
		instance.stop();
	};

	this.status = function () {
		return status;
	};
};
