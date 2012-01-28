/*
Page scroll plugin for jquery
Version 0.1.0
(c) 2012 Arthur Clemens arthur@visiblearea.com
Released under MIT licence
*/

/*
Options:

	speed: pixels per second; calculates the duration
	maxDuration: (only used with speed) maximum scroll duration in milliseconds; overrides speed
	offset: pixels
	duration: explicitly set scroll duration in milliseconds; 0 means immediate (no scrolling easing); overrides speed
	easing: easing name, like 'swing' (default) (use jquery.easing for more easing possibilities)
	beforeScroll: function called when scrolling is complete; the function is called with the "scroll options" object as parameter; return false to stop scrolling.
	beforeScrollDelay: milliseconds to wait before scrolling
	afterScroll: function called when scrolling is complete; the function is called with the "scroll options" object as parameter
	afterScrollDelay: milliseconds to wait before calling afterScroll; default 0
	scroller: jQuery selector to scroll; default 'body'
	target: jQuery element to scroll to; default not set

Scroll options can conditionally be changed.
The beforeScroll function acts as a delegate: pass 'false' to stop scrolling.

*/

(function ($) {
	"use strict";

	var getIdFromAnchorUrl,
		getTargetOnThisPage,
		scrollToAnchor;

	getIdFromAnchorUrl = function (url) {
		return url.replace(/^[^#]*#?!?(.*)$/, '$1');
	};

	getTargetOnThisPage = function (elem) {
		var $target,
			id = getIdFromAnchorUrl(elem.hash),
			targetEl = document.getElementById(id);
		if (location.pathname.replace(/^\//, '') === elem.pathname.replace(/^\//, '') && location.hostname === elem.hostname) {
			if (!targetEl) {
				// try named link
				$target = $('[name="' + id + '"]');
			} else {
				$target = $(targetEl);
			}
			if ($target && $target.length) {
				return $target;
			}
		}
		return undefined;
	};

	scrollToAnchor = function (opts) {

		var top,
			y,
			animate,
			scrollOpts;

		scrollOpts = $.extend({}, opts);
		top = scrollOpts.offset + scrollOpts.target.offset().top;

		if (scrollOpts.duration === undefined) {
			// calculate duration
			y = document.pageYOffset || document.body.scrollTop;
			scrollOpts.duration = Math.abs(y - top) / scrollOpts.speed * 1000;
			if (opts.maxDuration !== undefined) {
				scrollOpts.duration = Math.min(scrollOpts.duration, opts.maxDuration);
			}
		}

		animate = function () {
			var doScroll = true;
			if (scrollOpts.beforeScroll) {
				doScroll = scrollOpts.beforeScroll(scrollOpts);
			}
			if (doScroll !== undefined && doScroll === false) {
				return;
			}

			$(scrollOpts.scroller).animate({
				scrollTop: top
			}, {
				duration: scrollOpts.duration,
				easing: scrollOpts.easing,
				complete: function () {
					if (scrollOpts.afterScroll !== undefined) {
						setTimeout(function () {
							scrollOpts.afterScroll(scrollOpts);
						}, scrollOpts.afterScrollDelay);
					}
				}
			});
		};
		setTimeout(function () {
			animate();
		}, scrollOpts.beforeScrollDelay);
	};

	$.fn.pageScroll = function (options) {

		options = $.extend({}, $.fn.pageScroll.defaults, options);

		return this.each(function () {

			$(this).click(function (e) {
				var opts = $.extend({}, options), // copy to make sure each link has unique values
					target = opts.target;

				if (!target) {
					target = getTargetOnThisPage(this);
				}
				if (target) {
					e.preventDefault();
					opts.target = target;
					scrollToAnchor(opts);
				}
			});
		});
	};

	$.fn.pageScroll.defaults = {
		scroller: 'body',
		target: undefined,
		duration: undefined,
		maxDuration: 450,
		speed: 900,
		offset: -20,
		easing: 'swing',
		beforeScroll: undefined,
		beforeScrollDelay: 0,
		afterScroll: undefined,
		afterScrollDelay: 0
    };

}(jQuery));