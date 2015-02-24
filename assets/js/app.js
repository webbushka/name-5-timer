(function (win, doc, $) {
	var $timer,
		$container,
		alarm;

	var resizeTimer = function () {
		var height = $timer.height() / 2;
		$timer.css('margin-top', -height);
	};

	var startStop = function (e) {
		var status = myCounter.status();
		var $target = $(e.target);

		if ($target.hasClass('navbar-header') || $target.hasClass('navbar-toggle') || $target.hasClass('navbar-nav') || $target.is('li') || $target.is('a')) {
			// Don't do anything when the navbar is clicked
		}
		else if (status === 'stopped') {
			myCounter.start();
		}
		else {
			myCounter.restart();
		}
	};

	var startOver = function () {
		myCounter.reset();
		$timer
			.text(' to start the timer')
			.prepend($('<span />', {
				'class': 'hidden-md hidden-lg',
				text: 'Tap'
			}))
			.prepend($('<span />', {
				'class': 'hidden-xs hidden-sm',
				text: 'Click'
			}));

		$container.removeClass(function(){
			var classList = '',
			classes = this.className.split(' ');
			for (var i = 0; i < classes.length; i++) {
				if((/(bg-)\w+/).test(classes[i])) {
					classList += classes[i] + ' ';
				}
			}
			return classList;
		});
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
		resizeTimer();
	};

	var counterFinished = function () {
		var times = 0;

		alarm.volume = 0.3;
		alarm.load();
		alarm.play();

		$timer.addClass('blink').html($('<span />', {
			text: 'TIME\'S UP!',
			'class': 'text-danger'
		}));

		setTimeout(function(){
			alarm.pause();
		}, 1500);
	};

	var myCounter = new Countdown({
		seconds: 2,
		onUpdateStatus: counterUpdate,
		onCounterEnd: counterFinished,
		onCounterReset: counterUpdate
	});

	// On load
	$(function () {
		$timer = $('.timer');
		$container = $('.timer-container');
		alarm = $('audio')[0];

		win.fitText($timer, 0.6);
		resizeTimer();

		$(win).on('resize', resizeTimer);
		$container.on('click', startStop);
		$container.on('dblclick', startOver);
	});

})(window, document, jQuery);
