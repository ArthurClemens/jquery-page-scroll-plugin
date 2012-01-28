window.onload = function() {
    $('a.normal').pageScroll();
				
	$('a.special').pageScroll({
		duration: 1500,
	});
	
	$('a.target').pageScroll({
		target: $('#target'),
		duration: 100
	});
	
	$('a.beforeafter').pageScroll({
		beforeScroll: function(opts) {
			alert("before scroll; duration=" + opts.duration);
			// speed up
			opts.duration = 100;
		},
		afterScroll: function(opts) {
			alert("after scroll; duration=" + opts.duration);
		},
		beforeScrollDelay: 500,
		afterScrollDelay: 500
	});
	
	$('a.stop').pageScroll({
		beforeScroll: function(opts) {
			var stop = confirm("Stop scrolling?");
			if (stop) {
				return false;
			} else {
				return true;
			}
		}
	});
};