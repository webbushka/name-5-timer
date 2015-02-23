(function (win, doc, $) {
	var $timer,
		$container;

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

	var resizeTimer = function () {
		var height = $timer.height() / 2;
		$timer.css('margin-top', -height);
	};

	var startStop = function (e) {
		var status = myCounter.status();
		var $target = $(e.target);

		if ($target.hasClass('navbar-header') || $target.hasClass('navbar-toggle') || $target.hasClass('navbar-nav') || $target.is('li') || $target.is('a')) {
			// console.log('Don\'t do anything when the navbar is clicked');
		}
		else if (status === 'stopped') {
			myCounter.start();
		}
		else {
			myCounter.restart();
		}
	};

	var startOver = function () {
		console.log('startOver');
		myCounter.reset();
	};

	var counterUpdate = function (seconds) {
		var klass = 'success';
		if (seconds <= 3) {
			klass = 'danger';
		}
		else if (seconds <= 5) {
			klass = 'warning';
		}

		$timer.html($('<span />', {
			text: seconds + ' seconds',
			'class': 'text-' + klass
		}));

		$container.addClass('bg-' + klass);
	};

	var counterFinished = function () {
		var times = 0;
		$timer.html($('<span />', {
			text: 'TIME\'S UP!',
			'class': 'text-danger'
		}));

		var hide = setInterval(function(){
			$timer.hide();
		},500);
		var show = setTimeout(setInterval(function(){
			$timer.show();
			times++;
			if(times === 3) {
				clearInterval(hide);
				clearInterval(show);
			}
		}, 500), 500);
	};

	var myCounter = new Countdown({
		onUpdateStatus: counterUpdate,
		onCounterEnd: counterFinished,
		onCounterReset: counterUpdate
	});

	// On load
	$(function () {
		$timer = $('.timer');
		$container = $('.fittext');

		win.fitText($timer, 0.6);
		resizeTimer();

		$(win).on('resize', resizeTimer);
		$(win).on('rotate', resizeTimer);

		$container.on('click', startStop);
		$container.on('tap', startStop);

		$container.on('dblclick', startOver);
		$container.on('press', startOver);
	});

})(window, document, jQuery);
