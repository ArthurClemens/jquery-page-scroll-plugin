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
	scroller: jQuery selector to scroll; default 'body'
	target: jQuery element to scroll to; default not set
	id: target id to scroll to; may be a url hash like '#bottom'; default not set
	event: event that triggers scrolling; may be a space-separated list of event names, like 'load hashchange'; default 'click'
	mayScroll: function called before any scrolling; the function is called with the "scroll options" object as parameter; return false to stop scrolling
	willScroll: function called just before scrolling will happen
	willScrollDelay: milliseconds to wait before scrolling actually happens
	didScroll: function called when scrolling is complete; the function is called with the "scroll options" object as parameter
	didScrollDelay: milliseconds to wait before calling didScroll; default 0

Reset default values by passing null.

*/

(function ($) {
	"use strict";

	var getIdFromAnchorUrl,
		getTargetOnThisPage,
		scroll,
		scrollToAnchor;

	getIdFromAnchorUrl = function (url) {
		if (!url) {
			return '';
		}
		return url.replace(/^[^#]*#?!?(.*)$/, '$1');
	};

	getTargetOnThisPage = function (elem) {
		var $target,
			id,
			targetEl;
			
		if (!elem.hash) {
			return undefined;
		}
		id = getIdFromAnchorUrl(elem.hash);
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

	scroll = function (elem, options, e) {
		var opts = $.extend({}, options), // copy to make sure each link has unique values
			target = opts.target || (opts.id ? $(document.getElementById(getIdFromAnchorUrl(opts.id))) : getTargetOnThisPage(elem));

		if (target && target.length) {
			if (e) {
				e.preventDefault();
			}
			opts.target = target;
			scrollToAnchor(opts);
		}
	};

	scrollToAnchor = function (opts) {

		var top,
			y,
			calculate,
			mayScroll,
			scrollOpts;

		scrollOpts = $.extend({}, opts);

		calculate = function () {
			top = scrollOpts.offset + scrollOpts.target.offset().top;
			if (opts.duration === undefined || opts.duration === null) {
				// calculate duration
				y = document.pageYOffset || document.body.scrollTop;
				scrollOpts.duration = Math.abs(y - top) / scrollOpts.speed * 1000;
				// limit duration to max duration
				if (opts.maxDuration !== undefined && opts.maxDuration !== null) {
					scrollOpts.duration = Math.min(scrollOpts.duration, opts.maxDuration);
				}
			}
		};

		setTimeout(function () {
			mayScroll = true;
			if (scrollOpts.mayScroll) {
				mayScroll = scrollOpts.mayScroll(scrollOpts);
			}
			if (mayScroll !== undefined && mayScroll === false) {
				return;
			}

			setTimeout(function () {
				calculate();
				if (scrollOpts.willScroll) {
					scrollOpts.willScroll(scrollOpts);
				}
				$(scrollOpts.scroller).animate({
					scrollTop: top
				}, {
					duration: scrollOpts.duration,
					easing: scrollOpts.easing,
					complete: function () {
						if (window.history && window.history.pushState) {
							var id = scrollOpts.target.attr('id') || scrollOpts.target.attr('name') || '';
							window.history.pushState('', 'anchor', '#' + id);
						}
						if (scrollOpts.didScroll) {
							setTimeout(function () {
								scrollOpts.didScroll(scrollOpts);
							}, scrollOpts.didScrollDelay);
						}
					}
				});
			}, scrollOpts.willScrollDelay);
		}, 1);
	};

	$.fn.pageScroll = function (options) {

		options = $.extend({}, $.fn.pageScroll.defaults, options);
		return this.each(function () {
			$(this).bind(options.event, function (e) {
				scroll(this, options, e);
			});
		});
	};

	$.fn.pageScroll.defaults = {
		scroller: 'body',
		target: undefined,
		id: undefined,
		event: 'click',
		duration: undefined,
		maxDuration: 450,
		speed: 900,
		offset: -15,
		easing: 'swing',
		mayScroll: undefined,
		willScroll: undefined,
		willScrollDelay: 0,
		didScroll: undefined,
		didScrollDelay: 0
    };

}(jQuery));