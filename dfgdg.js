! function (a, b) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", b) : "object" == typeof module && module.exports ? module.exports = b() : a.EvEmitter = b()
}("undefined" == typeof window ? this : window, function () {
    function a() {}
    var b = a.prototype;
    return b.on = function (a, b) {
        if (a && b) {
            var c = this._events = this._events || {},
                d = c[a] = c[a] || [];
            return -1 == d.indexOf(b) && d.push(b), this
        }
    }, b.once = function (a, b) {
        if (a && b) {
            this.on(a, b);
            var c = this._onceEvents = this._onceEvents || {},
                d = c[a] = c[a] || {};
            return d[b] = !0, this
        }
    }, b.off = function (a, b) {
        var c = this._events && this._events[a];
        if (c && c.length) {
            var d = c.indexOf(b);
            return -1 != d && c.splice(d, 1), this
        }
    }, b.emitEvent = function (a, b) {
        var c = this._events && this._events[a];
        if (c && c.length) {
            c = c.slice(0), b = b || [];
            for (var d = this._onceEvents && this._onceEvents[a], e = 0; e < c.length; e++) {
                var f = c[e],
                    g = d && d[f];
                g && (this.off(a, f), delete d[f]), f.apply(this, b)
            }
            return this
        }
    }, b.allOff = function () {
        delete this._events, delete this._onceEvents
    }, a
}),
function (a, b) {
    "use strict";
    "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function (c) {
        return b(a, c)
    }) : "object" == typeof module && module.exports ? module.exports = b(a, require("ev-emitter")) : a.imagesLoaded = b(a, a.EvEmitter)
}("undefined" == typeof window ? this : window, function (b, c) {
    function f(a, b) {
        for (var c in b) a[c] = b[c];
        return a
    }

    function g(b) {
        if (Array.isArray(b)) return b;
        var c = "object" == typeof b && "number" == typeof b.length;
        return c ? a.call(b) : [b]
    }

    function j(a, b, c) {
        if (!(this instanceof j)) return new j(a, b, c);
        var d = a;
        return "string" == typeof a && (d = document.querySelectorAll(a)), d ? (this.elements = g(d), this.options = f({}, this.options), "function" == typeof b ? c = b : f(this.options, b), c && this.on("always", c), this.getImages(), l && (this.jqDeferred = new l.Deferred), void setTimeout(this.check.bind(this))) : void m.error("Bad element for imagesLoaded " + (d || a))
    }

    function i(a) {
        this.img = a
    }

    function k(a, b) {
        this.url = a, this.element = b, this.img = new Image
    }
    var l = b.jQuery,
        m = b.console,
        a = Array.prototype.slice;
    j.prototype = Object.create(c.prototype), j.prototype.options = {}, j.prototype.getImages = function () {
        this.images = [], this.elements.forEach(this.addElementImages, this)
    }, j.prototype.addElementImages = function (a) {
        "IMG" == a.nodeName && this.addImage(a), !0 === this.options.background && this.addElementBackgroundImages(a);
        var b = a.nodeType;
        if (b && d[b]) {
            for (var c, e = a.querySelectorAll("img"), f = 0; f < e.length; f++) c = e[f], this.addImage(c);
            if ("string" == typeof this.options.background) {
                var g = a.querySelectorAll(this.options.background);
                for (f = 0; f < g.length; f++) {
                    var h = g[f];
                    this.addElementBackgroundImages(h)
                }
            }
        }
    };
    var d = {
        1: !0,
        9: !0,
        11: !0
    };
    return j.prototype.addElementBackgroundImages = function (a) {
        var b = getComputedStyle(a);
        if (b)
            for (var c, d = /url\((['"])?(.*?)\1\)/gi, e = d.exec(b.backgroundImage); null !== e;) c = e && e[2], c && this.addBackground(c, a), e = d.exec(b.backgroundImage)
    }, j.prototype.addImage = function (a) {
        var b = new i(a);
        this.images.push(b)
    }, j.prototype.addBackground = function (a, b) {
        var c = new k(a, b);
        this.images.push(c)
    }, j.prototype.check = function () {
        function a(a, c, d) {
            setTimeout(function () {
                b.progress(a, c, d)
            })
        }
        var b = this;
        return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(function (b) {
            b.once("progress", a), b.check()
        }) : void this.complete()
    }, j.prototype.progress = function (a, b, c) {
        this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !a.isLoaded, this.emitEvent("progress", [this, a, b]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, a), this.progressedCount == this.images.length && this.complete(), this.options.debug && m && m.log("progress: " + c, a, b)
    }, j.prototype.complete = function () {
        var a = this.hasAnyBroken ? "fail" : "done";
        if (this.isComplete = !0, this.emitEvent(a, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
            var b = this.hasAnyBroken ? "reject" : "resolve";
            this.jqDeferred[b](this)
        }
    }, i.prototype = Object.create(c.prototype), i.prototype.check = function () {
        var a = this.getIsImageComplete();
        return a ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void(this.proxyImage.src = this.img.src))
    }, i.prototype.getIsImageComplete = function () {
        return this.img.complete && this.img.naturalWidth
    }, i.prototype.confirm = function (a, b) {
        this.isLoaded = a, this.emitEvent("progress", [this, this.img, b])
    }, i.prototype.handleEvent = function (a) {
        var b = "on" + a.type;
        this[b] && this[b](a)
    }, i.prototype.onload = function () {
        this.confirm(!0, "onload"), this.unbindEvents()
    }, i.prototype.onerror = function () {
        this.confirm(!1, "onerror"), this.unbindEvents()
    }, i.prototype.unbindEvents = function () {
        this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, k.prototype = Object.create(i.prototype), k.prototype.check = function () {
        this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url;
        var a = this.getIsImageComplete();
        a && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
    }, k.prototype.unbindEvents = function () {
        this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, k.prototype.confirm = function (a, b) {
        this.isLoaded = a, this.emitEvent("progress", [this, this.element, b])
    }, j.makeJQueryPlugin = function (a) {
        a = a || b.jQuery, a && (l = a, l.fn.imagesLoaded = function (a, b) {
            var c = new j(this, a, b);
            return c.jqDeferred.promise(l(this))
        })
    }, j.makeJQueryPlugin(), j
});
jQuery.easing.jswing = jQuery.easing.swing;
var pow = Math.pow;
jQuery.extend(jQuery.easing, {
    def: "easeOutExpo",
    easeInExpo: function (a) {
        return 0 === a ? 0 : pow(2, 10 * a - 10)
    },
    easeOutExpo: function (a) {
        return 1 === a ? 1 : 1 - pow(2, -10 * a)
    },
    easeInOutExpo: function (a) {
        return 0 === a ? 0 : 1 === a ? 1 : .5 > a ? pow(2, 20 * a - 10) / 2 : (2 - pow(2, -20 * a + 10)) / 2
    }
});
if (window.$us === undefined) {
    window.$us = {}
}
$us.mobileNavOpened = 0;
$us.header = {
    isVertical: jQuery.noop,
    isHorizontal: jQuery.noop,
    isFixed: jQuery.noop,
    isTransparent: jQuery.noop,
    isHidden: jQuery.noop,
    isStickyEnabled: jQuery.noop,
    isStickyAutoHideEnabled: jQuery.noop,
    isSticky: jQuery.noop,
    isStickyAutoHidden: jQuery.noop,
    getScrollDirection: jQuery.noop,
    getAdminBarHeight: jQuery.noop,
    getHeight: jQuery.noop,
    getCurrentHeight: jQuery.noop,
    getScrollTop: jQuery.noop
};
jQuery.fn.usMod = function (mod, value) {
    if (this.length == 0) {
        return this
    }
    if (value === !1) {
        this.get(0).className = this.get(0).className.replace(new RegExp('(^| )' + mod + '\_[a-zA-Z0-9\_\-]+( |$)'), '$2');
        return this
    }
    var pcre = new RegExp('^.*?' + mod + '\_([a-zA-Z0-9\_\-]+).*?$'),
        arr;
    if (value === undefined) {
        return (arr = pcre.exec(this.get(0).className)) ? arr[1] : !1
    } else {
        this.usMod(mod, !1).get(0).className += ' ' + mod + '_' + value;
        return this
    }
};
$us.toBool = function (value) {
    if (typeof value == 'string') {
        return (value == 'true' || value == 'True' || value == 'TRUE' || value == '1')
    }
    if (typeof value == 'boolean') {
        return value
    }
    return !!parseInt(value)
};
$us.getScript = function (url, callback) {
    if (!$us.ajaxLoadJs) {
        callback();
        return !1
    }
    if ($us.loadedScripts === undefined) {
        $us.loadedScripts = {};
        $us.loadedScriptsFunct = {}
    }
    if ($us.loadedScripts[url] === 'loaded') {
        callback();
        return
    } else if ($us.loadedScripts[url] === 'loading') {
        $us.loadedScriptsFunct[url].push(callback);
        return
    }
    $us.loadedScripts[url] = 'loading';
    $us.loadedScriptsFunct[url] = [];
    $us.loadedScriptsFunct[url].push(callback)
    var complete = function () {
        for (var i = 0; i < $us.loadedScriptsFunct[url].length; i++) {
            if (typeof $us.loadedScriptsFunct[url][i] === 'function') {
                $us.loadedScriptsFunct[url][i]()
            }
        }
        $us.loadedScripts[url] = 'loaded'
    };
    var options = {
        dataType: "script",
        cache: !0,
        url: url,
        complete: complete
    };
    return jQuery.ajax(options)
};
$us.detectIE = function () {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
    }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
    }
    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
    }
    return !1
};
$us.getAnimationName = function (animationName, defaultAnimationName) {
    if (jQuery.easing.hasOwnProperty(animationName)) {
        return animationName
    }
    return defaultAnimationName ? defaultAnimationName : jQuery.easing._default
};
$us.timeout = function (fn, delay) {
    var start = new Date().getTime(),
        handle = new Object();

    function loop() {
        var current = new Date().getTime(),
            delta = current - start;
        delta >= delay ? fn.call() : handle.value = window.requestAnimationFrame(loop)
    };
    handle.value = window.requestAnimationFrame(loop);
    return handle
};
$us.clearTimeout = function (handle) {
    if (handle) {
        window.cancelAnimationFrame(handle.value)
    }
};
$us.debounce = function (fn, wait, immediate) {
    var timeout, args, context, timestamp, result;
    if (null == wait) wait = 100;

    function later() {
        var last = Date.now() - timestamp;
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null;
            if (!immediate) {
                result = fn.apply(context, args);
                context = args = null
            }
        }
    }
    var debounced = function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = fn.apply(context, args);
            context = args = null
        }
        return result
    };
    debounced.prototype = {
        clear: function () {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null
            }
        },
        flush: function () {
            if (timeout) {
                result = fn.apply(context, args);
                context = args = null;
                clearTimeout(timeout);
                timeout = null
            }
        }
    };
    return debounced
};
$us.mixins = {};
$us.mixins.Events = {
    on: function (eventType, handler) {
        if (this.$$events === undefined) {
            this.$$events = {}
        }
        if (this.$$events[eventType] === undefined) {
            this.$$events[eventType] = []
        }
        this.$$events[eventType].push(handler);
        return this
    },
    off: function (eventType, handler) {
        if (this.$$events === undefined || this.$$events[eventType] === undefined) {
            return this
        }
        if (handler !== undefined) {
            var handlerPos = jQuery.inArray(handler, this.$$events[eventType]);
            if (handlerPos != -1) {
                this.$$events[eventType].splice(handlerPos, 1)
            }
        } else {
            this.$$events[eventType] = []
        }
        return this
    },
    trigger: function (eventType, extraParameters) {
        if (this.$$events === undefined || this.$$events[eventType] === undefined || this.$$events[eventType].length == 0) {
            return this
        }
        var params = (arguments.length > 2 || !jQuery.isArray(extraParameters)) ? Array.prototype.slice.call(arguments, 1) : extraParameters;
        params.unshift(this);
        for (var index = 0; index < this.$$events[eventType].length; index++) {
            this.$$events[eventType][index].apply(this.$$events[eventType][index], params)
        }
        return this
    }
};
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    jQuery.isMobile = !0
} else {
    jQuery.isMobile = (navigator.platform == 'MacIntel' && navigator.maxTouchPoints > 1);
    jQuery('html').toggleClass('ios-touch', !!jQuery.isMobile)
}
jQuery('html').toggleClass('no-touch', !jQuery.isMobile);
jQuery('html').toggleClass('ie11', $us.detectIE() == 11);
! function ($) {
    $us.$window = $(window);
    $us.$document = $(document);
    $us.$html = $('html');
    $us.$body = $('.l-body:first');
    $us.$htmlBody = $us.$html.add($us.$body);
    $us.$canvas = $('.l-canvas:first')
}(jQuery);
! function ($, undefined) {
    "use strict";

    function USCanvas(options) {
        var defaults = {
            disableEffectsWidth: 900,
            backToTopDisplay: 100
        };
        this.options = $.extend({}, defaults, options || {});
        this.$header = $('.l-header', $us.$canvas);
        this.$main = $('.l-main', $us.$canvas);
        this.$sections = $('.l-section', $us.$canvas);
        this.$firstSection = this.$sections.first();
        this.$firstStickySection = this.$sections.filter('.type_sticky:first:visible');
        this.$secondSection = this.$sections.eq(1);
        this.$fullscreenSections = this.$sections.filter('.height_full');
        this.$topLink = $('.w-toplink');
        this.type = $us.$canvas.usMod('type');
        this._headerPos = this.$header.usMod('pos');
        this.headerPos = this._headerPos;
        this.headerInitialPos = $us.$body.usMod('headerinpos');
        this.headerBg = this.$header.usMod('bg');
        this.rtl = $us.$body.hasClass('rtl');
        this.isScrolling = !1;
        this.isAndroid = /Android/i.test(navigator.userAgent);
        if (this.isStickySection()) {
            if (!!window.IntersectionObserver) {
                this.observer = (new IntersectionObserver(function (e) {
                    e[0].target.classList.toggle('is_sticky', e[0].intersectionRatio === 1)
                }.bind(this), {
                    threshold: [0, 1]
                })).observe(this.$firstStickySection[0])
            }
        }
        if ($us.$body.hasClass('us_iframe')) {
            $('a:not([target])').each(function () {
                $(this).attr('target', '_parent')
            });
            jQuery(function ($) {
                var $framePreloader = $('.l-popup-box-content .g-preloader', window.parent.document);
                $framePreloader.hide()
            })
        }
        $us.$window.on('scroll', this._events.scroll.bind(this)).on('resize load', this._events.resize.bind(this));
        $us.timeout(this._events.resize.bind(this), 25);
        $us.timeout(this._events.resize.bind(this), 75)
    }
    USCanvas.prototype = {
        isStickySection: function () {
            return !!this.$firstStickySection.length
        },
        hasStickySection: function () {
            if (this.isStickySection()) {
                return this.$firstStickySection.hasClass('is_sticky')
            }
            return !1
        },
        getHeightStickySection: function () {
            return this.isStickySection() ? Math.ceil(this.$firstStickySection.outerHeight(!0)) : 0
        },
        getHeightFirstSection: function () {
            return this.$firstSection.length ? parseInt(this.$firstSection.outerHeight(!0)) : 0
        },
        _events: {
            scroll: function () {
                var scrollTop = parseInt($us.$window.scrollTop());
                this.$topLink.toggleClass('active', (scrollTop >= this.winHeight * this.options.backToTopDisplay / 100));
                if (this.isAndroid) {
                    if (this.pid) {
                        $us.clearTimeout(this.pid)
                    }
                    this.isScrolling = !0;
                    this.pid = $us.timeout(function () {
                        this.isScrolling = !1
                    }.bind(this), 100)
                }
            },
            resize: function () {
                this.winHeight = parseInt($us.$window.height());
                this.winWidth = parseInt($us.$window.width());
                $us.$body.toggleClass('disable_effects', (this.winWidth < this.options.disableEffectsWidth));
                var ieVersion = $us.detectIE();
                if ((ieVersion !== !1 && ieVersion == 11) && (this.$fullscreenSections.length > 0 && !this.isScrolling)) {
                    this.$fullscreenSections.each(function (index, section) {
                        var $section = $(section),
                            sectionHeight = this.winHeight,
                            isFirstSection = (index == 0 && $section.is(this.$firstSection));
                        if (isFirstSection) {
                            sectionHeight -= $section.offset().top
                        } else {
                            sectionHeight -= $us.header.getCurrentHeight()
                        }
                        if ($section.hasClass('valign_center')) {
                            var $sectionH = $section.find('.l-section-h'),
                                sectionTopPadding = parseInt($section.css('padding-top')),
                                contentHeight = $sectionH.outerHeight(),
                                topMargin;
                            $sectionH.css('margin-top', '');
                            var sectionOverlapped = (isFirstSection && $us.header.isFixed() && !$us.header.isTransparent() && $us.header.isHorizontal());
                            if (sectionOverlapped) {
                                topMargin = Math.max(0, (sectionHeight - sectionTopPadding - contentHeight) / 2)
                            } else {
                                topMargin = Math.max(0, (sectionHeight - contentHeight) / 2 - sectionTopPadding)
                            }
                            $sectionH.css('margin-top', topMargin || '')
                        }
                    }.bind(this));
                    $us.$canvas.trigger('contentChange')
                }
                if ($us.$body.hasClass('us_iframe')) {
                    var $frameContent = $('.l-popup-box-content', window.parent.document),
                        outerHeight = $us.$body.outerHeight(!0);
                    if (outerHeight > 0 && $(window.parent).height() > outerHeight) {
                        $frameContent.css('height', outerHeight)
                    } else {
                        $frameContent.css('height', '')
                    }
                }
                this._events.scroll.call(this)
            }
        }
    };
    $us.canvas = new USCanvas($us.canvasOptions || {})
}(jQuery);
! function () {
    jQuery.fn.resetInlineCSS = function () {
        for (var index = 0; index < arguments.length; index++) {
            this.css(arguments[index], '')
        }
        return this
    };
    jQuery.fn.clearPreviousTransitions = function () {
        var prevTimers = (this.data('animation-timers') || '').split(',');
        if (prevTimers.length >= 2) {
            this.resetInlineCSS('transition');
            prevTimers.map(clearTimeout);
            this.removeData('animation-timers')
        }
        return this
    };
    jQuery.fn.performCSSTransition = function (css, duration, onFinish, easing, delay) {
        duration = duration || 250;
        delay = delay || 25;
        easing = easing || 'ease';
        var $this = this,
            transition = [];
        this.clearPreviousTransitions();
        for (var attr in css) {
            if (!css.hasOwnProperty(attr)) {
                continue
            }
            transition.push(attr + ' ' + (duration / 1000) + 's ' + easing)
        }
        transition = transition.join(', ');
        $this.css({
            transition: transition
        });
        var timer1 = setTimeout(function () {
            $this.css(css)
        }, delay);
        var timer2 = setTimeout(function () {
            $this.resetInlineCSS('transition');
            if (typeof onFinish == 'function') {
                onFinish()
            }
        }, duration + delay);
        this.data('animation-timers', timer1 + ',' + timer2)
    };
    jQuery.fn.slideDownCSS = function (duration, onFinish, easing, delay) {
        if (this.length == 0) {
            return
        }
        var $this = this;
        this.clearPreviousTransitions();
        this.resetInlineCSS('padding-top', 'padding-bottom');
        var timer1 = setTimeout(function () {
            var paddingTop = parseInt($this.css('padding-top')),
                paddingBottom = parseInt($this.css('padding-bottom'));
            $this.css({
                visibility: 'hidden',
                position: 'absolute',
                height: 'auto',
                'padding-top': 0,
                'padding-bottom': 0,
                display: 'block'
            });
            var height = $this.height();
            $this.css({
                overflow: 'hidden',
                height: '0px',
                opacity: 0,
                visibility: '',
                position: ''
            });
            $this.performCSSTransition({
                opacity: 1,
                height: height + paddingTop + paddingBottom,
                'padding-top': paddingTop,
                'padding-bottom': paddingBottom
            }, duration, function () {
                $this.resetInlineCSS('overflow').css('height', 'auto');
                if (typeof onFinish == 'function') {
                    onFinish()
                }
            }, easing, delay)
        }, 25);
        this.data('animation-timers', timer1 + ',null')
    };
    jQuery.fn.slideUpCSS = function (duration, onFinish, easing, delay) {
        if (this.length == 0) {
            return
        }
        this.clearPreviousTransitions();
        this.css({
            height: this.outerHeight(),
            overflow: 'hidden',
            'padding-top': this.css('padding-top'),
            'padding-bottom': this.css('padding-bottom')
        });
        var $this = this;
        this.performCSSTransition({
            height: 0,
            opacity: 0,
            'padding-top': 0,
            'padding-bottom': 0
        }, duration, function () {
            $this.resetInlineCSS('overflow', 'padding-top', 'padding-bottom').css({
                display: 'none'
            });
            if (typeof onFinish == 'function') {
                onFinish()
            }
        }, easing, delay)
    };
    jQuery.fn.fadeInCSS = function (duration, onFinish, easing, delay) {
        if (this.length == 0) {
            return
        }
        this.clearPreviousTransitions();
        this.css({
            opacity: 0,
            display: 'block'
        });
        this.performCSSTransition({
            opacity: 1
        }, duration, onFinish, easing, delay)
    };
    jQuery.fn.fadeOutCSS = function (duration, onFinish, easing, delay) {
        if (this.length == 0) {
            return
        }
        var $this = this;
        this.performCSSTransition({
            opacity: 0
        }, duration, function () {
            $this.css('display', 'none');
            if (typeof onFinish == 'function') {
                onFinish()
            }
        }, easing, delay)
    }
}();
jQuery(function ($) {
    "use strict";
    if (document.cookie.indexOf('us_cookie_notice_accepted=true') !== -1) {
        $('.l-cookie').remove()
    } else {
        $(document).on('click', '#us-set-cookie', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var d = new Date();
            d.setFullYear(d.getFullYear() + 1);
            document.cookie = 'us_cookie_notice_accepted=true; expires=' + d.toUTCString() + '; path=/;' + (location.protocol === 'https:' ? ' secure;' : '');
            $('.l-cookie').remove()
        })
    }
    if ($('a[ref=magnificPopup][class!=direct-link]').length != 0) {
        $us.getScript($us.templateDirectoryUri + '/common/js/vendor/magnific-popup.js', function () {
            $('a[ref=magnificPopup][class!=direct-link]').magnificPopup({
                type: 'image',
                removalDelay: 300,
                mainClass: 'mfp-fade',
                fixedContentPos: !0
            })
        })
    }
    jQuery('.l-section-img').each(function () {
        var $this = $(this),
            img = new Image(),
            bgImg = $this.css('background-image') || '';
        if (bgImg.match(/url\(['"]*(.*?)['"]*\)/i)) {
            img.onload = function () {
                if (!$this.hasClass('loaded')) {
                    $this.addClass('loaded')
                }
            };
            img.src = bgImg.replace(/url\(['"]*(.*?)['"]*\)/i, '$1')
        } else {
            $this.addClass('loaded')
        }
    });
    var $usSectionVideoContainer = $('.l-section-video');
    if ($usSectionVideoContainer.length) {
        $(window).on('resize load', function () {
            $usSectionVideoContainer.each(function () {
                var $container = $(this);
                if (!$container.data('video-disable-width')) {
                    return !1
                }
                if (window.innerWidth < parseInt($container.data('video-disable-width'))) {
                    $container.addClass('hidden')
                } else {
                    $container.removeClass('hidden')
                }
            })
        })
    }(function () {
        var $footer = $('.l-footer');
        if ($us.$body.hasClass('footer_reveal') && $footer.length && $footer.html().trim().length) {
            var usFooterReveal = function () {
                var footerHeight = $footer.innerHeight();
                if (window.innerWidth > parseInt($us.canvasOptions.columnsStackingWidth) - 1) {
                    $us.$canvas.css('margin-bottom', Math.round(footerHeight) - 1)
                } else {
                    $us.$canvas.css('margin-bottom', '')
                }
            }
            usFooterReveal();
            $us.$window.on('resize load', function () {
                usFooterReveal()
            })
        }
    })();
    var $usYTVimeoVideoContainer = $('.with_youtube, .with_vimeo');
    if ($usYTVimeoVideoContainer.length) {
        $(window).on('resize load', function () {
            $usYTVimeoVideoContainer.each(function () {
                var $container = $(this),
                    $frame = $container.find('iframe').first(),
                    cHeight = $container.innerHeight(),
                    cWidth = $container.innerWidth(),
                    fWidth = '',
                    fHeight = '';
                if (cWidth / cHeight < 16 / 9) {
                    fWidth = cHeight * (16 / 9);
                    fHeight = cHeight
                } else {
                    fWidth = cWidth;
                    fHeight = fWidth * (9 / 16)
                }
                $frame.css({
                    'width': Math.round(fWidth),
                    'height': Math.round(fHeight),
                })
            })
        })
    }
});
(function ($, undefined) {
    "use strict";

    function USWaypoints() {
        this.waypoints = [];
        $us.$canvas.on('contentChange', this._countAll.bind(this));
        $us.$window.on('resize load', this._events.resize.bind(this)).on('scroll scroll.waypoints', this._events.scroll.bind(this));
        $us.timeout(this._events.resize.bind(this), 75);
        $us.timeout(this._events.scroll.bind(this), 75)
    }
    USWaypoints.prototype = {
        _events: {
            scroll: function () {
                var scrollTop = parseInt($us.$window.scrollTop());
                scrollTop = (scrollTop >= 0) ? scrollTop : 0;
                for (var i = 0; i < this.waypoints.length; i++) {
                    if (this.waypoints[i].scrollPos < scrollTop) {
                        this.waypoints[i].fn(this.waypoints[i].$elm);
                        this.waypoints.splice(i, 1);
                        i--
                    }
                }
            },
            resize: function () {
                $us.timeout(function () {
                    this._countAll.call(this);
                    this._events.scroll.call(this)
                }.bind(this), 150);
                this._countAll.call(this);
                this._events.scroll.call(this)
            }
        },
        add: function ($elm, offset, fn) {
            $elm = ($elm instanceof $) ? $elm : $($elm);
            if ($elm.length == 0) {
                return
            }
            if (typeof offset != 'string' || offset.indexOf('%') == -1) {
                offset = parseInt(offset)
            }
            var waypoint = {
                $elm: $elm,
                offset: offset,
                fn: fn
            };
            this._count(waypoint);
            this.waypoints.push(waypoint)
        },
        _count: function (waypoint) {
            var elmTop = waypoint.$elm.offset().top,
                winHeight = $us.$window.height();
            if (typeof waypoint.offset == 'number') {
                waypoint.scrollPos = elmTop - winHeight + waypoint.offset
            } else {
                waypoint.scrollPos = elmTop - winHeight + winHeight * parseInt(waypoint.offset) / 100
            }
        },
        _countAll: function () {
            for (var i = 0; i < this.waypoints.length; i++) {
                this._count(this.waypoints[i])
            }
        }
    };
    $us.waypoints = new USWaypoints
})(jQuery);
(function () {
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function () {
                    callback(currTime + timeToCall)
                }, timeToCall);
            lastTime = currTime + timeToCall;
            return id
        }
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id)
        }
    }
}());
if ($us.$body.hasClass('single-format-video')) {
    figure = $us.$body.find('figure.wp-block-embed div.wp-block-embed__wrapper');
    if (figure.length) {
        figure.each(function () {
            if (this.firstElementChild === null) {
                this.remove()
            }
        })
    }
}! function ($, undefined) {
    "use strict";
    $us.ToggleMoreContent = function (container) {
        this.init(container)
    };
    $us.ToggleMoreContent.prototype = {
        init: function (container) {
            this.$container = $(container);
            this.$firstElm = $('> *:first', this.$container);
            this.toggleHeight = this.$container.data('toggle-height') || 200;
            this.$container.on('click', '.toggle-show-more, .toggle-show-less', this._events.elmToggleShowMore.bind(this));
            if (!this.$container.closest('.owl-carousel').length) {
                this.initHeightCheck.call(this)
            }
        },
        initHeightCheck: function () {
            var height = this.$firstElm.css('height', this.toggleHeight).height();
            this.$firstElm.css('height', '');
            var elmHeight = this.$firstElm.height();
            if (elmHeight && elmHeight <= height) {
                $('.toggle-links', this.$container).hide();
                this.$firstElm.css('height', '');
                this.$container.removeClass('with_show_more_toggle')
            } else {
                $('.toggle-links', this.$container).show();
                this.$firstElm.css('height', this.toggleHeight)
            }
        },
        _isVisible: function () {
            if (!this.$container.length) {
                return !1
            }
            var w = window,
                d = document,
                rect = this.$container[0].getBoundingClientRect(),
                containerPosition = {
                    top: w.pageYOffset + rect.top,
                    left: w.pageXOffset + rect.left,
                    right: w.pageXOffset + rect.right,
                    bottom: w.pageYOffset + rect.bottom
                },
                windowPosition = {
                    top: w.pageYOffset,
                    left: w.pageXOffset,
                    right: w.pageXOffset + d.documentElement.clientWidth,
                    bottom: w.pageYOffset + d.documentElement.clientHeight
                };
            return (containerPosition.bottom > windowPosition.top && containerPosition.top < windowPosition.bottom && containerPosition.right > windowPosition.left && containerPosition.left < windowPosition.right)
        },
        _events: {
            elmToggleShowMore: function (e) {
                e.preventDefault();
                e.stopPropagation();
                this.$container.toggleClass('show_content', $(e.target).hasClass('toggle-show-more'));
                $us.timeout(function () {
                    $us.$canvas.trigger('contentChange');
                    if ($.isMobile && !this._isVisible()) {
                        $us.$htmlBody.stop(!0, !1).scrollTop(this.$container.offset().top - $us.header.getCurrentHeight())
                    }
                }.bind(this), 1)
            }
        }
    };
    $.fn.usToggleMoreContent = function () {
        return this.each(function () {
            $(this).data('usToggleMoreContent', new $us.ToggleMoreContent(this))
        })
    };
    $('[data-toggle-height]').usToggleMoreContent()
}(jQuery);
! function ($, undefined) {
    "use strict";
    if ($us.detectIE() == 11) {
        if ($('.w-post-elm.has_ratio').length && !$('.w-grid').length) {
            $us.getScript($us.templateDirectoryUri + '/common/js/vendor/objectFitPolyfill.js', function () {
                objectFitPolyfill()
            })
        }
        $us.getScript($us.templateDirectoryUri + '/common/js/vendor/css-vars-ponyfill.js', function () {
            cssVars({})
        })
    }
}(jQuery);
! function ($, undefined) {
    $us.$window.on('us.wpopup.afterShow', function (_, WPopup) {
        if (WPopup instanceof $us.WPopup && $('video.wp-video-shortcode', WPopup.$box).length) {
            var handle = $us.timeout(function () {
                $us.clearTimeout(handle);
                window.dispatchEvent(new Event('resize'))
            }, 1)
        }
    })
}(jQuery);
! function ($, undefined) {
    "use strict";
    if ($us.detectIE() == 11 && $('.w-image.has_ratio').length) {
        $us.getScript($us.templateDirectoryUri + '/common/js/vendor/objectFitPolyfill.js', function () {
            objectFitPolyfill()
        })
    }
}(jQuery);
! function ($) {
    "use strict";

    function USScroll(options) {
        var defaults = {
            attachOnInit: '\
				.menu-item a[href*="#"],\
				.menu-item[href*="#"],\
				a.w-btn[href*="#"]:not([onclick]),\
				.w-text a[href*="#"],\
				.vc_icon_element a[href*="#"],\
				.vc_custom_heading a[href*="#"],\
				a.w-grid-item-anchor[href*="#"],\
				.w-toplink,\
				.w-image a[href*="#"]:not([onclick]),\
				.w-iconbox a[href*="#"],\
				.w-comments-title a[href*="#"],\
				a.smooth-scroll[href*="#"]',
            buttonActiveClass: 'active',
            menuItemActiveClass: 'current-menu-item',
            menuItemAncestorActiveClass: 'current-menu-ancestor',
            animationDuration: $us.canvasOptions.scrollDuration,
            animationEasing: $us.getAnimationName('easeInOutExpo'),
            endAnimationEasing: $us.getAnimationName('easeOutExpo')
        };
        this.options = $.extend({}, defaults, options || {});
        this.blocks = {};
        this.isScrolling = !1;
        this._events = {
            cancel: this.cancel.bind(this),
            scroll: this.scroll.bind(this),
            resize: this.resize.bind(this)
        };
        this._canvasTopOffset = 0;
        $us.$window.on('resize load', $us.debounce(this._events.resize, 10));
        $us.timeout(this._events.resize, 75);
        $us.$window.on('scroll', this._events.scroll);
        $us.timeout(this._events.scroll, 75);
        if (this.options.attachOnInit) {
            this.attach(this.options.attachOnInit)
        }
        $us.$canvas.on('contentChange', this._countAllPositions.bind(this));
        if (document.location.hash && document.location.hash.indexOf('#!') == -1) {
            var hash = document.location.hash,
                scrollPlace = (this.blocks[hash] !== undefined) ? hash : undefined;
            if (scrollPlace === undefined) {
                try {
                    var $target = $(hash);
                    if ($target.length != 0) {
                        scrollPlace = $target
                    }
                } catch (error) {}
            }
            if (scrollPlace !== undefined) {
                var keepScrollPositionTimer = setInterval(function () {
                    this.scrollTo(scrollPlace);
                    if (document.readyState !== 'loading') {
                        clearInterval(keepScrollPositionTimer)
                    }
                }.bind(this), 100);
                var clearHashEvents = function () {
                    $us.$window.off('load touchstart mousewheel DOMMouseScroll touchstart', clearHashEvents);
                    $us.timeout(function () {
                        $us.canvas._events.resize.call($us.canvas);
                        this._countAllPositions();
                        if ($us.hasOwnProperty('waypoints')) {
                            $us.waypoints._countAll()
                        }
                        this.scrollTo(scrollPlace)
                    }.bind(this), 100)
                }.bind(this);
                $us.$window.on('load touchstart mousewheel DOMMouseScroll touchstart', clearHashEvents)
            }
        }
        this.headerHeight = 0;
        this._hasHeaderTransitionEnd = !1;
        $us.header.on('transitionEnd', function (header) {
            this.headerHeight = header.getCurrentHeight() - header.getAdminBarHeight();
            this._hasHeaderTransitionEnd = !0
        }.bind(this))
    }
    USScroll.prototype = {
        _countPosition: function (hash) {
            var $target = this.blocks[hash].target,
                targetTop = $target.offset().top,
                state = $us.$body.usMod('state');
            this.blocks[hash].top = Math.ceil(targetTop - this._canvasTopOffset)
        },
        _countAllPositions: function () {
            this._canvasTopOffset = $us.$canvas.offset().top;
            for (var hash in this.blocks) {
                if (this.blocks[hash]) {
                    this._countPosition(hash)
                }
            }
        },
        _indicatePosition: function (activeHash) {
            for (var hash in this.blocks) {
                if (!this.blocks[hash]) {
                    continue
                }
                var block = this.blocks[hash];
                if (block.buttons !== undefined) {
                    block.buttons.toggleClass(this.options.buttonActiveClass, hash === activeHash)
                }
                if (block.menuItems !== undefined) {
                    block.menuItems.toggleClass(this.options.menuItemActiveClass, hash === activeHash)
                }
                if (block.menuAncestors !== undefined) {
                    block.menuAncestors.removeClass(this.options.menuItemAncestorActiveClass)
                }
            }
            if (this.blocks[activeHash] !== undefined && this.blocks[activeHash].menuAncestors !== undefined) {
                this.blocks[activeHash].menuAncestors.addClass(this.options.menuItemAncestorActiveClass)
            }
        },
        attach: function (anchors) {
            var locationPattern = new RegExp('^' + location.pathname.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + '#');
            var $anchors = $(anchors);
            if ($anchors.length == 0) {
                return
            }
            $anchors.each(function (index, anchor) {
                var $anchor = $(anchor),
                    href = $anchor.attr('href'),
                    hash = $anchor.prop('hash');
                if (hash.indexOf('#!') != -1) {
                    return
                }
                if (!(href.charAt(0) == '#' || (href.charAt(0) == '/' && locationPattern.test(href)) || href.indexOf(location.host + location.pathname + '#') > -1)) {
                    return
                }
                if (hash != '' && hash != '#') {
                    if (this.blocks[hash] === undefined) {
                        var $target = $(hash),
                            $type = '';
                        if ($target.length == 0) {
                            return
                        }
                        if ($target.hasClass('g-cols') && $target.parent().children().length == 1) {
                            $target = $target.closest('.l-section')
                        }
                        if ($target.hasClass('w-tabs-section')) {
                            var $newTarget = $target.closest('.w-tabs');
                            if (!$newTarget.hasClass('accordion')) {
                                $target = $newTarget
                            }
                            $type = 'tab'
                        } else if ($target.hasClass('w-tabs')) {
                            $type = 'tabs'
                        }
                        this.blocks[hash] = {
                            target: $target,
                            type: $type
                        };
                        this._countPosition(hash)
                    }
                    if ($anchor.parent().length > 0 && $anchor.parent().hasClass('menu-item')) {
                        var $menuIndicator = $anchor.closest('.menu-item');
                        this.blocks[hash].menuItems = (this.blocks[hash].menuItems || $()).add($menuIndicator);
                        var $menuAncestors = $menuIndicator.parents('.menu-item-has-children');
                        if ($menuAncestors.length > 0) {
                            this.blocks[hash].menuAncestors = (this.blocks[hash].menuAncestors || $()).add($menuAncestors)
                        }
                    } else {
                        this.blocks[hash].buttons = (this.blocks[hash].buttons || $()).add($anchor)
                    }
                }
                $anchor.on('click', function (event) {
                    event.preventDefault();
                    this.scrollTo(hash, !0);
                    if (typeof this.blocks[hash] !== 'undefined') {
                        var block = this.blocks[hash];
                        if ($.inArray(block.type, ['tab', 'tabs']) !== -1) {
                            var $linkedSection = block.target.find('.w-tabs-section[id="' + hash.substr(1) + '"]');
                            if (block.type === 'tabs') {
                                $linkedSection = block.target.find('.w-tabs-section:first')
                            } else if (block.target.hasClass('w-tabs-section')) {
                                $linkedSection = block.target
                            }
                            if ($linkedSection.length) {
                                $linkedSection.find('.w-tabs-section-header').trigger('click')
                            }
                        } else if (block.menuItems !== undefined && $.inArray($us.$body.usMod('state'), ['mobiles', 'tablets']) !== -1 && $us.$body.hasClass('header-show')) {
                            $us.$body.removeClass('header-show')
                        }
                    }
                }.bind(this))
            }.bind(this))
        },
        getPlacePosition: function (place) {
            var data = {
                newY: 0,
                type: ''
            };
            if (place === '' || place === '#') {
                data.newY = 0;
                data.placeType = 'top'
            } else if (this.blocks[place] !== undefined) {
                this._countPosition(place);
                data.newY = this.blocks[place].top;
                data.placeType = 'hash';
                place = this.blocks[place].target
            } else if (place instanceof $) {
                if (place.hasClass('w-tabs-section')) {
                    var newPlace = place.closest('.w-tabs');
                    if (!newPlace.hasClass('accordion')) {
                        place = newPlace
                    }
                }
                data.newY = Math.floor(place.offset().top - this._canvasTopOffset);
                data.placeType = 'element'
            } else {
                data.newY = Math.floor(place - this._canvasTopOffset)
            }
            if ($us.header.isHorizontal() && $us.canvas.hasStickySection()) {
                data.newY -= $us.canvas.getHeightStickySection()
            }
            return data
        },
        scrollTo: function (place, animate) {
            var offset = this.getPlacePosition.call(this, place),
                indicateActive = function () {
                    if (offset.type === 'hash') {
                        this._indicatePosition(place)
                    } else {
                        this.scroll()
                    }
                }.bind(this);
            if (animate) {
                if (navigator.userAgent.match(/iPad/i) != null && $('.us_iframe').length && offset.type == 'hash') {
                    $(place)[0].scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    })
                }
                var scrollTop = parseInt($us.$window.scrollTop()),
                    scrollDirections = scrollTop < offset.newY ? 'down' : 'up';
                if (scrollTop === offset.newY) {
                    return
                }
                if (!this.isScrolling && $us.header.isHorizontal() && !this._hasHeaderTransitionEnd) {
                    $us.header.trigger('transitionEnd');
                    this._hasHeaderTransitionEnd = !0
                }
                var animateOptions = {
                    duration: this.options.animationDuration,
                    easing: this.options.animationEasing,
                    start: function () {
                        this.isScrolling = !0
                    }.bind(this),
                    complete: function () {
                        this.cancel.call(this)
                    }.bind(this),
                    always: function () {
                        this.isScrolling = !1;
                        indicateActive()
                    }.bind(this),
                    step: function (now, fx) {
                        var newY = this.getPlacePosition(place).newY;
                        if ($us.header.isHorizontal() && $us.header.isStickyEnabled()) {
                            newY -= this.headerHeight
                        }
                        if (fx.end !== newY) {
                            $us.$htmlBody.stop(!0, !1).animate({
                                scrollTop: newY + 'px'
                            }, $.extend(animateOptions, {
                                easing: this.options.endAnimationEasing
                            }))
                        }
                    }.bind(this)
                };
                $us.$htmlBody.stop(!0, !1).animate({
                    scrollTop: offset.newY + 'px'
                }, animateOptions);
                $us.$window.on('keydown mousewheel DOMMouseScroll touchstart', this._events.cancel)
            } else {
                if ($us.header.isStickyEnabled()) {
                    $us.header.trigger('transitionEnd');
                    offset.newY -= this.headerHeight
                }
                $us.$htmlBody.stop(!0, !1).scrollTop(offset.newY);
                indicateActive()
            }
        },
        cancel: function () {
            $us.$htmlBody.stop(!0, !1);
            $us.$window.off('keydown mousewheel DOMMouseScroll touchstart', this._events.cancel);
            this.isScrolling = !1
        },
        scroll: function () {
            var scrollTop = $us.header.getScrollTop();
            scrollTop = (scrollTop >= 0) ? scrollTop : 0;
            if (!this.isScrolling) {
                var activeHash;
                for (var hash in this.blocks) {
                    if (!this.blocks[hash]) {
                        continue
                    }
                    var top = this.blocks[hash].top,
                        $target = this.blocks[hash].target;
                    if (!$us.header.isHorizontal()) {
                        top -= $us.header.getAdminBarHeight()
                    } else {
                        if ($us.header.isStickyEnabled()) {
                            top -= this.headerHeight
                        }
                        if ($us.canvas.hasStickySection()) {
                            top -= $us.canvas.getHeightStickySection()
                        }
                    }
                    if (scrollTop >= top && scrollTop <= (top + $target.outerHeight(!1))) {
                        activeHash = hash
                    }
                }
                $us.debounce(this._indicatePosition.bind(this, activeHash), 1)()
            }
        },
        resize: function () {
            $us.timeout(function () {
                this._countAllPositions();
                this.scroll()
            }.bind(this), 150);
            this._countAllPositions();
            this.scroll()
        }
    };
    $(function () {
        $us.scroll = new USScroll($us.scrollOptions || {})
    })
}(jQuery);
(function ($) {
    "use strict";
    var USAnimate = function (container) {
        this.$container = $(container);
        this.$items = $('.animate_fade, .animate_afc, .animate_afl, .animate_afr, .animate_aft, ' + '.animate_afb, .animate_wfc, .animate_hfc', this.$container).not('.animate_off_autostart');
        this.$items.each(function (_, item) {
            var $item = $(item);
            if ($item.data('_animate_inited') || $item.is('.animate_off_autostart')) {
                return
            }
            $item.data('_animate_inited', !0);
            $us.waypoints.add($item, '12%', function ($elm) {
                if (!$elm.hasClass('animate_start')) {
                    $us.timeout(function () {
                        $elm.addClass('animate_start')
                    }, 20)
                }
            })
        })
    };
    window.USAnimate = USAnimate;
    new USAnimate(document);
    $('.wpb_animate_when_almost_visible').each(function () {
        $us.waypoints.add($(this), '12%', function ($elm) {
            if (!$elm.hasClass('wpb_start_animation')) {
                $us.timeout(function () {
                    $elm.addClass('wpb_start_animation')
                }, 20)
            }
        })
    })
})(jQuery);
! function ($) {
    "use strict";
    $us.CommnentsForm = function (container, options) {
        this.init(container, options)
    };
    $us.CommnentsForm.prototype = {
        init: function (container, options) {
            this.$container = $(container);
            this.$form = this.$container.find('form.comment-form');
            if (!this.$form.length) {
                return
            }
            this.$jsonContainer = this.$container.find('.us-comments-json');
            if (!this.$jsonContainer.length) {
                return
            }
            this.jsonData = this.$jsonContainer[0].onclick() || {};
            this.$jsonContainer.remove();
            this.$fields = {
                content: {
                    field: this.$form.find('textarea'),
                    msg: this.jsonData.no_content_msg || 'Please enter a Message'
                },
                name: {
                    field: this.$form.find('.for_text input[type="text"]'),
                    msg: this.jsonData.no_name_msg || 'Please enter your Name'
                },
                email: {
                    field: this.$form.find('.for_email input[type="email"]'),
                    msg: this.jsonData.no_email_msg || 'Please enter a valid email address.'
                }
            };
            this._events = {
                formSubmit: this.formSubmit.bind(this)
            };
            this.$form.on('submit', this._events.formSubmit)
        },
        formSubmit: function (event) {
            this.$form.find('.w-form-row.check_wrong').removeClass('check_wrong');
            this.$form.find('.w-form-state').html('');
            for (var i in this.$fields) {
                if (this.$fields[i].field.length == 0) {
                    continue
                }
                if (this.$fields[i].field.val() == '' && this.$fields[i].field.attr('data-required')) {
                    this.$fields[i].field.closest('.w-form-row').toggleClass('check_wrong');
                    this.$fields[i].field.closest('.w-form-row').find('.w-form-row-state').html(this.$fields[i].msg);
                    event.preventDefault()
                }
            }
        }
    };
    $.fn.CommnentsForm = function (options) {
        return this.each(function () {
            $(this).data('CommnentsForm', new $us.CommnentsForm(this, options))
        })
    };
    $(function () {
        $('.w-post-elm.post_comments.layout_comments_template').CommnentsForm();
        $('.l-section.for_comments').CommnentsForm()
    })
}(jQuery);
! function ($) {
    var USCounterNumber = function (container) {
        this.$container = $(container);
        this.initialString = this.$container.html() + '';
        this.finalString = this.$container.data('final') + '';
        this.format = this.getFormat(this.initialString, this.finalString);
        if (this.format.decMark) {
            var pattern = new RegExp('[^0-9\/' + this.format.decMark + ']+', 'g');
            this.initial = parseFloat(this.initialString.replace(pattern, '').replace(this.format.decMark, '.'));
            this.final = parseFloat(this.finalString.replace(pattern, '').replace(this.format.decMark, '.'))
        } else {
            this.initial = parseInt(this.initialString.replace(/[^0-9]+/g, ''));
            this.final = parseInt(this.finalString.replace(/[^0-9]+/g, ''))
        }
        if (this.format.accounting) {
            if (this.initialString.length > 0 && this.initialString[0] == '(') {
                this.initial = -this.initial
            }
            if (this.finalString.length > 0 && this.finalString[0] == '(') {
                this.final = -this.final
            }
        }
    };
    USCounterNumber.prototype = {
        step: function (now) {
            var value = (1 - now) * this.initial + this.final * now,
                intPart = Math[this.format.decMark ? 'floor' : 'round'](value).toString(),
                result = '';
            if (this.format.zerofill) {
                intPart = '0'.repeat(this.format.intDigits - intPart.length) + intPart
            }
            if (this.format.groupMark) {
                if (this.format.indian) {
                    result += intPart.replace(/(\d)(?=(\d\d)+\d$)/g, '$1' + this.format.groupMark)
                } else {
                    result += intPart.replace(/\B(?=(\d{3})+(?!\d))/g, this.format.groupMark)
                }
            } else {
                result += intPart
            }
            if (this.format.decMark) {
                var decimalPart = (value % 1).toFixed(this.format.decDigits).substring(2);
                result += this.format.decMark + decimalPart
            }
            if (this.format.accounting && result.length > 0 && result[0] == '-') {
                result = '(' + result.substring(1) + ')'
            }
            this.$container.html(result)
        },
        getFormat: function (initial, final) {
            var iFormat = this._getFormat(initial),
                fFormat = this._getFormat(final),
                format = $.extend({}, iFormat, fFormat);
            if (format.groupMark == format.decMark) {
                delete format.groupMark
            }
            return format
        },
        _getFormat: function (str) {
            var marks = str.replace(/[0-9\(\)\-]+/g, ''),
                format = {};
            if (str.charAt(0) == '(') {
                format.accounting = !0
            }
            if (/^0[0-9]/.test(str)) {
                format.zerofill = !0
            }
            str = str.replace(/[\(\)\-]/g, '');
            if (marks.length != 0) {
                if (marks.length > 1) {
                    format.groupMark = marks.charAt(0);
                    if (marks.charAt(0) != marks.charAt(marks.length - 1)) {
                        format.decMark = marks.charAt(marks.length - 1)
                    }
                    if (str.split(format.groupMark).length > 2 && str.split(format.groupMark)[1].length == 2) {
                        format.indian = !0
                    }
                } else {
                    format[(((str.length - 1) - str.indexOf(marks)) == 3 && marks !== '.') ? 'groupMark' : 'decMark'] = marks
                }
                if (format.decMark) {
                    format.decDigits = str.length - str.indexOf(format.decMark) - 1
                }
            }
            if (format.zerofill) {
                format.intDigits = str.replace(/[^\d]+/g, '').length - (format.decDigits || 0)
            }
            return format
        }
    };
    var USCounterText = function (container) {
        this.$container = $(container);
        this.initial = this.$container.text() + '';
        this.final = this.$container.data('final') + '';
        this.partsStates = this.getStates(this.initial, this.final);
        this.len = 1 / (this.partsStates.length - 1);
        this.curState = 0
    };
    USCounterText.prototype = {
        step: function (now) {
            var state = Math.round(Math.max(0, now / this.len));
            if (state == this.curState) {
                return
            }
            this.$container.html(this.partsStates[state]);
            this.curState = state
        },
        getStates: function (initial, final) {
            var dist = [],
                i, j;
            for (i = 0; i <= initial.length; i++) {
                dist[i] = [i]
            }
            for (j = 1; j <= final.length; j++) {
                dist[0][j] = j;
                for (i = 1; i <= initial.length; i++) {
                    dist[i][j] = (initial[i - 1] === final[j - 1]) ? dist[i - 1][j - 1] : (Math.min(dist[i - 1][j], dist[i][j - 1], dist[i - 1][j - 1]) + 1)
                }
            }
            var states = [final];
            for (i = initial.length, j = final.length; i > 0 || j > 0; i--, j--) {
                var min = dist[i][j];
                if (i > 0) {
                    min = Math.min(min, dist[i - 1][j], (j > 0) ? dist[i - 1][j - 1] : min)
                }
                if (j > 0) {
                    min = Math.min(min, dist[i][j - 1])
                }
                if (min >= dist[i][j]) {
                    continue
                }
                if (min == dist[i][j - 1]) {
                    states.unshift(states[0].substring(0, j - 1) + states[0].substring(j));
                    i++
                } else if (min == dist[i - 1][j - 1]) {
                    states.unshift(states[0].substring(0, j - 1) + initial[i - 1] + states[0].substring(j))
                } else if (min == dist[i - 1][j]) {
                    states.unshift(states[0].substring(0, j) + initial[i - 1] + states[0].substring(j));
                    j++
                }
            }
            return states
        }
    };
    var USCounter = function (container) {
        this.$container = $(container);
        this.parts = [];
        this.duration = parseInt(this.$container.data('duration') || 2000);
        this.$container.find('.w-counter-value-part').each(function (index, part) {
            var $part = $(part);
            if ($part.html() + '' == $part.data('final') + '') {
                return
            }
            var type = $part.usMod('type');
            if (type == 'number') {
                this.parts.push(new USCounterNumber($part))
            } else {
                this.parts.push(new USCounterText($part))
            }
        }.bind(this));
        if (window.$us !== undefined && window.$us.scroll !== undefined) {
            $us.waypoints.add(this.$container, '15%', this.animate.bind(this))
        } else {
            this.animate()
        }
    };
    USCounter.prototype = {
        animate: function (duration) {
            this.$container.css('w-counter', 0).animate({
                'w-counter': 1
            }, {
                duration: this.duration,
                step: this.step.bind(this)
            })
        },
        step: function (now) {
            for (var i = 0; i < this.parts.length; i++) {
                this.parts[i].step(now)
            }
        }
    };
    $.fn.wCounter = function (options) {
        return this.each(function () {
            $(this).data('wItext', new USCounter(this, options))
        })
    };
    $(function () {
        $('.w-counter').wCounter()
    })
}(jQuery);
(function ($) {
    "use strict";
    $.fn.wDropdown = function () {
        return this.each(function () {
            var $this = $(this),
                $list = $this.find('.w-dropdown-list'),
                $current = $this.find('.w-dropdown-current'),
                $currentAnchor = $current.find('a'),
                $anchors = $this.find('a'),
                openEventName = 'click',
                closeEventName = 'mouseup touchstart mousewheel DOMMouseScroll touchstart',
                justOpened = !1;
            if ($this.hasClass('open_on_hover')) {
                openEventName = 'mouseenter';
                closeEventName = 'mouseleave'
            }
            var closeList = function () {
                $this.removeClass('opened');
                $us.$window.off(closeEventName, closeListEvent)
            };
            var closeListEvent = function (e) {
                if (closeEventName != 'mouseleave' && $this.has(e.target).length !== 0) {
                    return
                }
                e.stopPropagation();
                e.preventDefault();
                closeList()
            };
            var openList = function () {
                $this.addClass('opened');
                if (closeEventName == 'mouseleave') {
                    $this.on(closeEventName, closeListEvent)
                } else {
                    $us.$window.on(closeEventName, closeListEvent)
                }
                justOpened = !0;
                $us.timeout(function () {
                    justOpened = !1
                }, 500)
            };
            var openListEvent = function (e) {
                if (openEventName == 'click' && $this.hasClass('opened') && !justOpened) {
                    closeList();
                    return
                }
                openList()
            };
            $current.on(openEventName, openListEvent);
            $anchors.on('focus.upsolution', function () {
                openList()
            });
            $this.on('keydown', function (e) {
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9) {
                    var $target = $(e.target) || {},
                        index = $anchors.index($target);
                    if (e.shiftKey) {
                        if (index === 0) {
                            closeList()
                        }
                    } else {
                        if (index === $anchors.length - 1) {
                            closeList()
                        }
                    }
                }
            })
        })
    };
    $(function () {
        $('.w-dropdown').wDropdown()
    })
})(jQuery);
jQuery(function ($) {
    $('.w-form.for_cform').each(function () {
        var $form = $(this),
            $submitBtn = $form.find('.w-btn'),
            $resultField = $form.find('.w-form-message'),
            options = $form.find('.w-form-json')[0].onclick(),
            $dateField = $form.find('.w-form-row.for_date input'),
            jQueryDatePickerPath = $form.data('jquery-ui'),
            pickerOptions = {},
            $requiredCheckboxes = $form.find('.for_checkboxes.required');
        $form.find('.w-form-json').remove();
        if ($dateField.length) {
            if (jQueryDatePickerPath !== undefined) {
                $us.getScript(jQueryDatePickerPath, function () {
                    pickerOptions = $.extend(pickerOptions, options['jquery-ui-locale']);
                    initDateFields()
                })
            } else {
                initDateFields()
            }

            function initDateFields() {
                $dateField.each(function () {
                    pickerOptions.dateFormat = $(this).data('date-format');
                    pickerOptions.onClose = function () {
                        $(this).closest('.w-form-row').removeClass('focused')
                    };
                    $(this).datepicker(pickerOptions)
                })
            }
        }
        $form.submit(function (event) {
            event.preventDefault();
            if ($submitBtn.hasClass('loading')) {
                return
            }
            $resultField.usMod('type', !1).html('');
            var errors = 0;
            $form.find('[data-required="true"]').each(function () {
                var $input = $(this),
                    isEmpty = $input.is('[type="checkbox"]') ? (!$input.is(':checked')) : ($input.val() == ''),
                    $row = $input.closest('.w-form-row');
                if ($row.hasClass('for_checkboxes')) {
                    return !0
                }
                $row.toggleClass('check_wrong', isEmpty);
                if (isEmpty) {
                    errors++
                }
            });
            if ($requiredCheckboxes.length) {
                $requiredCheckboxes.each(function () {
                    var $input = $(this).find('input[type="checkbox"]'),
                        $row = $input.closest('.w-form-row'),
                        isEmpty = !$input.is(':checked') ? !0 : !1;
                    $row.toggleClass('check_wrong', isEmpty);
                    if (isEmpty) {
                        errors++
                    }
                })
            }
            if (errors !== 0) {
                return
            }
            $submitBtn.addClass('loading');
            $.ajax({
                type: 'POST',
                url: options.ajaxurl,
                dataType: 'json',
                data: $form.serialize(),
                success: function (result) {
                    if (result.success) {
                        $resultField.usMod('type', 'success').html(result.data);
                        $form.find('.w-form-row.check_wrong').removeClass('check_wrong');
                        $form.find('.w-form-row.not-empty').removeClass('not-empty');
                        $form.find('input[type="text"], input[type="email"], textarea').val('');
                        $form[0].reset();
                        $form.trigger('usCformSuccess')
                    } else {
                        $form.find('.w-form-row.check_wrong').removeClass('check_wrong');
                        if (result.data && typeof result.data == 'object') {
                            for (var fieldName in result.data) {
                                if (fieldName == 'empty_message') {
                                    $resultField.usMod('type', 'error');
                                    continue
                                }
                                if (!result.data.hasOwnProperty(fieldName)) {
                                    continue
                                }
                                fieldName = result.data[fieldName].name;
                                var $input = $form.find('[name="' + fieldName + '"]');
                                $input.closest('.w-form-row').addClass('check_wrong')
                            }
                        } else {
                            $resultField.usMod('type', 'error').html(result.data)
                        }
                    }
                },
                complete: function () {
                    $submitBtn.removeClass('loading')
                }
            })
        })
    })
});
jQuery(function ($) {
    $('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="date"], input[type="search"], input[type="url"], input[type="password"], textarea').each(function (index, input) {
        var $input = $(input),
            $row = $input.closest('.w-form-row');
        if ($input.attr('type') == 'hidden') {
            return
        }
        $row.toggleClass('not-empty', $input.val() != '');
        $input.on('input change', function () {
            $row.toggleClass('not-empty', $input.val() != '')
        })
    });
    $(document).on('focus', '.w-form-row-field input, .w-form-row-field textarea', function () {
        $(this).closest('.w-form-row').addClass('focused')
    });
    $(document).on('blur', '.w-form-row:not(.for_date) input, .w-form-row-field textarea', function () {
        $(this).closest('.w-form-row').removeClass('focused')
    })
});
! function ($) {
    "use strict";
    $us.WFlipBox = function (container) {
        this.$container = $(container);
        this.$front = this.$container.find('.w-flipbox-front');
        this.$frontH = this.$container.find('.w-flipbox-front-h');
        this.$back = this.$container.find('.w-flipbox-back');
        this.$backH = this.$container.find('.w-flipbox-back-h');
        this.$xFlank = this.$container.find('.w-flipbox-xflank');
        this.$yFlank = this.$container.find('.w-flipbox-yflank');
        this.$btn = this.$container.find('.w-btn');
        if (!!window.MSInputMethodContext && !!document.documentMode) {
            this.$container.usMod('animation', 'cardflip').find('.w-flipbox-h').css({
                'transition-duration': '0s',
                '-webkit-transition-duration': '0s'
            })
        }
        var isWebkit = 'WebkitAppearance' in document.documentElement.style;
        if (isWebkit && this.$container.usMod('animation') === 'cubeflip' && this.$btn.length) {
            this.$container.usMod('animation', 'cubetilt')
        }
        var animation = this.$container.usMod('animation'),
            direction = this.$container.usMod('direction');
        this.forceSquare = (animation == 'cubeflip' && ['ne', 'se', 'sw', 'nw'].indexOf(direction) != -1);
        this.autoSize = (this.$front[0].style.height == '' && !this.forceSquare);
        this.centerContent = (this.$container.usMod('valign') == 'center');
        if (this._events === undefined) {
            this._events = {}
        }
        $.extend(this._events, {
            resize: this.resize.bind(this)
        });
        if (this.centerContent || this.autoSize) {
            this.padding = parseInt(this.$front.css('padding-top'))
        }
        if (this.centerContent || this.forceSquare || this.autoSize) {
            $us.$window.bind('resize load', this._events.resize);
            this.resize()
        }
        this.makeHoverable('.w-btn');
        $us.timeout(function () {
            this.$back.css('display', '');
            this.$yFlank.css('display', '');
            this.$xFlank.css('display', '');
            this.resize()
        }.bind(this), 250)
    };
    $us.WFlipBox.prototype = {
        resize: function () {
            var width = this.$container.width(),
                height;
            if (this.autoSize || this.centerContent) {
                var frontContentHeight = this.$frontH.height(),
                    backContentHeight = this.$backH.height()
            }
            if (this.forceSquare || this.autoSize) {
                height = this.forceSquare ? width : (Math.max(frontContentHeight, backContentHeight) + 2 * this.padding);
                this.$front.css('height', height + 'px')
            } else {
                height = this.$container.height()
            }
            if (this.centerContent) {
                this.$front.css('padding-top', Math.max(this.padding, (height - frontContentHeight) / 2));
                this.$back.css('padding-top', Math.max(this.padding, (height - backContentHeight) / 2))
            }
        },
        makeHoverable: function (exclude) {
            if (this._events === undefined) {
                this._events = {}
            }
            if (jQuery.isMobile) {
                this._events.touchHoverStart = function () {
                    this.$container.toggleClass('hover')
                }.bind(this);
                this.$container.on('touchstart', this._events.touchHoverStart);
                if (exclude) {
                    this._events.touchHoverPrevent = function (e) {
                        e.stopPropagation()
                    };
                    this.$container.find(exclude).on('touchstart', this._events.touchHoverPrevent)
                }
            } else {
                this._mouseInside = !1;
                this._focused = !1;
                $.extend(this._events, {
                    mouseHoverStart: function () {
                        this.$container.addClass('hover');
                        this._mouseInside = !0
                    }.bind(this),
                    mouseHoverEnd: function () {
                        if (!this._focused) {
                            this.$container.removeClass('hover')
                        }
                        this._mouseInside = !1
                    }.bind(this),
                    focus: function () {
                        this.$container.addClass('hover');
                        this._focused = !0
                    }.bind(this),
                    blur: function () {
                        if (!this._mouseInside) {
                            this.$container.removeClass('hover')
                        }
                        this._focused = !1
                    }.bind(this)
                });
                this.$container.on('mouseenter', this._events.mouseHoverStart);
                this.$container.on('mouseleave', this._events.mouseHoverEnd);
                this.$focusable = this.$container.find('a').addBack('a');
                this.$focusable.on('focus', this._events.focus);
                this.$focusable.on('blur', this._events.blur)
            }
        }
    };
    $.fn.wFlipBox = function (options) {
        return this.each(function () {
            $(this).data('wFlipBox', new $us.WFlipBox(this, options))
        })
    };
    $(function () {
        $('.w-flipbox').wFlipBox()
    })
}(jQuery);
! function ($) {
    "use strict";
    $us.WMapsGeocodesCounter = 0;
    $us.WMapsGeocodesRunning = !1;
    $us.WMapsCurrentGeocode = 0;
    $us.WMapsGeocodesMax = 5;
    $us.WMapsGeocodesStack = {};
    $us.WMapsRunGeoCode = function () {
        if ($us.WMapsCurrentGeocode <= $us.WMapsGeocodesCounter) {
            $us.WMapsGeocodesRunning = !0;
            if ($us.WMapsGeocodesStack[$us.WMapsCurrentGeocode] != null) {
                $us.WMapsGeocodesStack[$us.WMapsCurrentGeocode]()
            }
        } else {
            $us.WMapsGeocodesRunning = !1
        }
    };
    $us.WMaps = function (container, options) {
        this.$container = $(container);
        if (this.$container.data('mapInit') == 1) {
            return
        }
        this.$container.data('mapInit', 1);
        var $jsonContainer = this.$container.find('.w-map-json'),
            jsonOptions = $jsonContainer[0].onclick() || {},
            $jsonStyleContainer = this.$container.find('.w-map-style-json'),
            jsonStyleOptions, shouldRunGeoCode = !1;
        $jsonContainer.remove();
        if ($jsonStyleContainer.length) {
            jsonStyleOptions = $jsonStyleContainer[0].onclick() || {};
            $jsonStyleContainer.remove()
        }
        var defaults = {};
        this.options = $.extend({}, defaults, jsonOptions, options);
        this._events = {
            redraw: this.redraw.bind(this)
        };
        var gmapsOptions = {
            el: '#' + this.$container.attr('id'),
            lat: 0,
            lng: 0,
            zoom: this.options.zoom,
            type: this.options.type,
            height: this.options.height + 'px',
            width: '100%',
            mapTypeId: google.maps.MapTypeId[this.options.maptype]
        };
        if (this.options.hideControls) {
            gmapsOptions.disableDefaultUI = !0
        }
        if (this.options.disableZoom) {
            gmapsOptions.scrollwheel = !1
        }
        if (this.options.disableDragging && (!$us.$html.hasClass('no-touch'))) {
            gmapsOptions.draggable = !1
        }
        if (this.options.mapBgColor) {
            gmapsOptions.backgroundColor = this.options.mapBgColor
        }
        this.GMapsObj = new GMaps(gmapsOptions);
        if (jsonStyleOptions != null && jsonStyleOptions != {}) {
            this.GMapsObj.map.setOptions({
                styles: jsonStyleOptions
            })
        }
        var matches = this.options.address.match(/^(-?\d+.\d+)\s?,?\s?(-?\d+.\d+)$/),
            that = this;
        if (matches) {
            this.options.latitude = matches[1];
            this.options.longitude = matches[2];
            this.GMapsObj.setCenter(this.options.latitude, this.options.longitude)
        } else {
            var mapGeoCode = function () {
                GMaps.geocode({
                    address: that.options.address,
                    callback: function (results, status) {
                        if (status == 'OK') {
                            var latlng = results[0].geometry.location;
                            that.options.latitude = latlng.lat();
                            that.options.longitude = latlng.lng();
                            that.GMapsObj.setCenter(that.options.latitude, that.options.longitude);
                            $us.WMapsCurrentGeocode++;
                            $us.WMapsRunGeoCode()
                        } else if (status == "OVER_QUERY_LIMIT") {
                            $us.timeout(function () {
                                $us.WMapsRunGeoCode()
                            }, 2000)
                        }
                    }
                })
            };
            shouldRunGeoCode = !0;
            $us.WMapsGeocodesStack[$us.WMapsGeocodesCounter] = mapGeoCode;
            $us.WMapsGeocodesCounter++
        }
        $.each(this.options.markers, function (i, val) {
            var markerOptions = {};
            if (that.options.icon != null || that.options.markers[i].marker_img != null) {
                var url, size, width, height;
                if (that.options.markers[i].marker_img != null) {
                    url = that.options.markers[i].marker_img[0];
                    width = parseInt(that.options.markers[i].marker_size[0]);
                    height = parseInt(that.options.markers[i].marker_size[1]);
                    size = new google.maps.Size(width, height)
                } else {
                    url = that.options.icon.url;
                    size = new google.maps.Size(that.options.icon.size[0], that.options.icon.size[1])
                }
                markerOptions.icon = {
                    url: url,
                    size: size,
                    scaledSize: size,
                }
            }
            if (that.options.markers[i] != null) {
                var matches = that.options.markers[i].address.match(/^(-?\d+.\d+)\s?,?\s?(-?\d+.\d+)$/);
                if (matches) {
                    markerOptions.lat = matches[1];
                    markerOptions.lng = matches[2];
                    if (that.options.markers[i].html) {
                        markerOptions.infoWindow = {
                            content: that.options.markers[i].html
                        }
                    }
                    var marker = that.GMapsObj.addMarker(markerOptions);
                    if (that.options.markers[i].infowindow) {
                        marker.infoWindow.open(that.GMapsObj.map, marker)
                    }
                } else {
                    var markerGeoCode = function () {
                        GMaps.geocode({
                            address: that.options.markers[i].address,
                            callback: function (results, status) {
                                if (status == 'OK') {
                                    var latlng = results[0].geometry.location;
                                    markerOptions.lat = latlng.lat();
                                    markerOptions.lng = latlng.lng();
                                    markerOptions.infoWindow = {
                                        content: that.options.markers[i].html
                                    };
                                    var marker = that.GMapsObj.addMarker(markerOptions);
                                    if (that.options.markers[i].infowindow) {
                                        marker.infoWindow.open(that.GMapsObj.map, marker)
                                    }
                                    $us.WMapsCurrentGeocode++;
                                    $us.WMapsRunGeoCode()
                                } else if (status == "OVER_QUERY_LIMIT") {
                                    $us.timeout(function () {
                                        $us.WMapsRunGeoCode()
                                    }, 2000)
                                }
                            }
                        })
                    };
                    shouldRunGeoCode = !0;
                    $us.WMapsGeocodesStack[$us.WMapsGeocodesCounter] = markerGeoCode;
                    $us.WMapsGeocodesCounter++
                }
            }
        });
        if (shouldRunGeoCode && (!$us.WMapsGeocodesRunning)) {
            $us.WMapsRunGeoCode()
        }
        $us.$canvas.on('contentChange', this._events.redraw);
        $us.$window.on('load', this._events.redraw)
    };
    $us.WMaps.prototype = {
        redraw: function () {
            if (this.$container.is(':hidden')) {
                return
            }
            this.GMapsObj.refresh();
            if (this.options.latitude != null && this.options.longitude != null) {
                this.GMapsObj.setCenter(this.options.latitude, this.options.longitude)
            }
        }
    };
    $.fn.wMaps = function (options) {
        return this.each(function () {
            $(this).data('wMaps', new $us.WMaps(this, options))
        })
    };
    $(function () {
        var $wMap = $('.w-map.provider_google');
        if ($wMap.length) {
            $us.getScript($us.templateDirectoryUri + '/common/js/vendor/gmaps.js', function () {
                $wMap.wMaps()
            })
        }
    })
}(jQuery);
(function ($, undefined) {
    "use strict";
    $us.WGrid = function (container, options) {
        this.init(container, options)
    };
    $us.WGrid.prototype = {
        init: function (container, options) {
            this.$container = $(container);
            this.$filters = $('.g-filters-item', this.$container);
            this.$items = $('.w-grid-item', this.$container);
            this.$list = $('.w-grid-list', this.$container);
            this.$loadmore = $('.g-loadmore', this.$container);
            this.$pagination = $('> .pagination', this.$container);
            this.$preloader = $('.w-grid-preloader', this.$container);
            this.$style = $('> style:first', this.$container);
            this.loading = !1;
            this.changeUpdateState = !1;
            this.gridFilter = null;
            this.curFilterTaxonomy = '';
            this.paginationType = this.$pagination.length ? 'regular' : (this.$loadmore.length ? 'ajax' : 'none');
            this.filterTaxonomyName = this.$list.data('filter_taxonomy_name') ? this.$list.data('filter_taxonomy_name') : 'category';
            if (this.$container.data('gridInit') == 1) {
                return
            }
            this.$container.data('gridInit', 1);
            var $jsonContainer = $('.w-grid-json', this.$container);
            if ($jsonContainer.length && $jsonContainer.is('[onclick]')) {
                this.ajaxData = $jsonContainer[0].onclick() || {};
                this.ajaxUrl = this.ajaxData.ajax_url || '';
                $jsonContainer.remove()
            } else {
                this.ajaxData = {};
                this.ajaxUrl = ''
            }
            this.carouselSettings = this.ajaxData.carousel_settings;
            this.breakpoints = this.ajaxData.carousel_breakpoints || {};
            if ($us.detectIE() == 11) {
                $us.getScript($us.templateDirectoryUri + '/common/js/vendor/objectFitPolyfill.js', function () {
                    objectFitPolyfill()
                })
            }
            if (this.$list.hasClass('owl-carousel')) {
                $us.getScript($us.templateDirectoryUri + '/common/js/vendor/owl.carousel.js', function () {
                    this.carouselOptions = {
                        autoHeight: this.carouselSettings.autoHeight,
                        autoplay: this.carouselSettings.autoplay,
                        autoplayHoverPause: !0,
                        autoplayTimeout: this.carouselSettings.timeout,
                        center: this.carouselSettings.center,
                        dots: this.carouselSettings.dots,
                        items: parseInt(this.carouselSettings.items),
                        loop: this.carouselSettings.loop,
                        mouseDrag: !jQuery.isMobile,
                        nav: this.carouselSettings.nav,
                        navElement: 'div',
                        navText: ['', ''],
                        responsive: {},
                        rewind: !this.carouselSettings.loop,
                        stagePadding: 0,
                        rtl: $('.l-body').hasClass('rtl'),
                        slideBy: this.carouselSettings.slideby,
                        slideTransition: this.carouselSettings.transition,
                        smartSpeed: this.carouselSettings.speed
                    };
                    if (this.carouselSettings.smooth_play == 1) {
                        this.carouselOptions.slideTransition = 'linear';
                        this.carouselOptions.autoplaySpeed = this.carouselSettings.timeout;
                        this.carouselOptions.slideBy = 1
                    }
                    if (this.carouselSettings.carousel_fade) {
                        $.extend(this.carouselOptions, {
                            animateOut: 'fadeOut',
                            animateIn: 'fadeIn',
                        })
                    }
                    $.each(this.breakpoints, function (breakpointWidth, breakpointArgs) {
                        if (breakpointArgs !== undefined && breakpointArgs.items !== undefined) {
                            this.carouselOptions.responsive[breakpointWidth] = breakpointArgs;
                            this.carouselOptions.responsive[breakpointWidth].items = parseInt(breakpointArgs.items)
                        }
                    }.bind(this));
                    this.$list.on('initialized.owl.carousel', function (e) {
                        var $list = $(this);
                        $('[data-toggle-height]', e.currentTarget).each(function (_, item) {
                            var usToggle = $(item).data('usToggleMoreContent');
                            if (usToggle instanceof $us.ToggleMoreContent) {
                                usToggle.initHeightCheck();
                                $us.timeout(function () {
                                    $list.trigger('refresh.owl.carousel')
                                }, 1)
                            }
                        });
                        if ($.isMobile && $list.closest('.w-tabs-section.active').length) {
                            $us.timeout(function () {
                                $list.trigger('refresh.owl.carousel')
                            }, 50)
                        }
                    }).on('mousedown.owl.core', function () {
                        var $target = $(this);
                        if ($('[data-toggle-height]', $target).length && !jQuery.isMobile) {
                            var owlCarousel = $target.data('owl.carousel');
                            owlCarousel.$stage.off('mousedown.owl.core')
                        }
                    });
                    this.$list.owlCarousel(this.carouselOptions)
                }.bind(this))
            }
            if (this.$container.hasClass('popup_page')) {
                if (this.ajaxData == undefined) {
                    return
                }
                this.lightboxTimer = null;
                this.$lightboxOverlay = this.$container.find('.l-popup-overlay');
                this.$lightboxWrap = this.$container.find('.l-popup-wrap');
                this.$lightboxBox = this.$container.find('.l-popup-box');
                this.$lightboxContent = this.$container.find('.l-popup-box-content');
                this.$lightboxContentPreloader = this.$lightboxContent.find('.g-preloader');
                this.$lightboxContentFrame = this.$container.find('.l-popup-box-content-frame');
                this.$lightboxNextArrow = this.$container.find('.l-popup-arrow.to_next');
                this.$lightboxPrevArrow = this.$container.find('.l-popup-arrow.to_prev');
                this.$container.find('.l-popup-closer').click(function () {
                    this.hideLightbox()
                }.bind(this));
                this.$container.find('.l-popup-box').click(function () {
                    this.hideLightbox()
                }.bind(this));
                this.$container.find('.l-popup-box-content').click(function (e) {
                    e.stopPropagation()
                }.bind(this));
                this.originalURL = window.location.href;
                this.lightboxOpened = !1;
                if (this.$list.hasClass('owl-carousel')) {
                    $us.getScript($us.templateDirectoryUri + '/common/js/vendor/owl.carousel.js', function () {
                        this.initLightboxAnchors()
                    }.bind(this))
                } else {
                    this.initLightboxAnchors()
                }
                $(window).on('resize', function () {
                    if (this.lightboxOpened && $us.$window.width() < $us.canvasOptions.disableEffectsWidth) {
                        this.hideLightbox()
                    }
                }.bind(this))
            }
            if (this.$list.hasClass('owl-carousel')) {
                return
            }
            if (this.paginationType != 'none' || this.$filters.length) {
                if (this.ajaxData == undefined) {
                    return
                }
                this.templateVars = this.ajaxData.template_vars || {};
                if (this.filterTaxonomyName) {
                    this.initialFilterTaxonomy = this.$list.data('filter_default_taxonomies') ? this.$list.data('filter_default_taxonomies').split(',') : '';
                    this.curFilterTaxonomy = this.initialFilterTaxonomy
                }
                this.curPage = this.ajaxData.current_page || 1;
                this.perpage = this.ajaxData.perpage || this.$items.length;
                this.infiniteScroll = this.ajaxData.infinite_scroll || 0
            }
            if (this.$container.hasClass('with_isotope')) {
                $us.getScript($us.templateDirectoryUri + '/common/js/vendor/isotope.js', function () {
                    this.$list.imagesLoaded(function () {
                        var smallestItemSelector, isotopeOptions = {
                            itemSelector: '.w-grid-item',
                            layoutMode: (this.$container.hasClass('isotope_fit_rows')) ? 'fitRows' : 'masonry',
                            isOriginLeft: !$('.l-body').hasClass('rtl'),
                            transitionDuration: 0
                        };
                        if (this.$list.find('.size_1x1').length) {
                            smallestItemSelector = '.size_1x1'
                        } else if (this.$list.find('.size_1x2').length) {
                            smallestItemSelector = '.size_1x2'
                        } else if (this.$list.find('.size_2x1').length) {
                            smallestItemSelector = '.size_2x1'
                        } else if (this.$list.find('.size_2x2').length) {
                            smallestItemSelector = '.size_2x2'
                        }
                        if (smallestItemSelector) {
                            smallestItemSelector = smallestItemSelector || '.w-grid-item';
                            isotopeOptions.masonry = {
                                columnWidth: smallestItemSelector
                            }
                        }
                        this.$list.on('layoutComplete', function () {
                            if (window.USAnimate) {
                                $('.w-grid-item.animate_off_autostart', this.$list).removeClass('animate_off_autostart');
                                new USAnimate(this.$list)
                            }
                            $us.$window.trigger('scroll.waypoints')
                        }.bind(this));
                        this.$list.isotope(isotopeOptions);
                        if (this.paginationType == 'ajax') {
                            this.initAjaxPagination()
                        }
                        $us.$canvas.on('contentChange', function () {
                            this.$list.imagesLoaded(function () {
                                this.$list.isotope('layout')
                            }.bind(this))
                        }.bind(this))
                    }.bind(this))
                }.bind(this))
            } else if (this.paginationType == 'ajax') {
                this.initAjaxPagination()
            }
            this.$filters.each(function (index, filter) {
                var $filter = $(filter),
                    taxonomy = $filter.data('taxonomy');
                $filter.on('click', function () {
                    if (taxonomy != this.curFilterTaxonomy) {
                        if (this.loading) {
                            return
                        }
                        this.setState(1, taxonomy);
                        this.$filters.removeClass('active');
                        $filter.addClass('active')
                    }
                }.bind(this))
            }.bind(this));
            if (this.$container.closest('.l-main').length) {
                $us.$body.on('us_grid.updateState', this._events.updateState.bind(this)).on('us_grid.updateOrderBy', this._events.updateOrderBy.bind(this))
            }
            this.$list.on('click', '[ref=magnificPopup]', this._events.initMagnificPopup.bind(this))
        },
        _events: {
            updateState: function (e, params, page, gridFilter) {
                if (!this.$container.is('[data-filterable="true"]') || !this.$container.hasClass('used_by_grid_filter')) {
                    return
                }
                page = page || 1;
                this.changeUpdateState = !0;
                this.gridFilter = gridFilter;
                if (this.ajaxData === undefined) {
                    this.ajaxData = {}
                }
                if (!this.hasOwnProperty('templateVars')) {
                    this.templateVars = this.ajaxData.template_vars || {
                        query_args: {}
                    }
                }
                this.templateVars.us_grid_filter_params = params;
                if (this.templateVars.query_args !== !1) {
                    this.templateVars.query_args.paged = page
                }
                this.templateVars.filters_args = gridFilter.filtersArgs || {};
                this.setState(page);
                if (this.paginationType === 'regular' && /page(=|\/)/.test(location.href)) {
                    var url = location.href.replace(/(page(=|\/))(\d+)(\/?)/, '$1' + page + '$2');
                    history.replaceState(document.title, document.title, url)
                }
            },
            updateOrderBy: function (e, orderby, page, gridOrder) {
                if (!this.$container.is('[data-filterable="true"]') || !this.$container.hasClass('used_by_grid_order')) {
                    return
                }
                page = page || 1;
                this.changeUpdateState = !0;
                if (!this.hasOwnProperty('templateVars')) {
                    this.templateVars = this.ajaxData.template_vars || {
                        query_args: {}
                    }
                }
                if (this.templateVars.query_args !== !1) {
                    this.templateVars.query_args.paged = page
                }
                this.templateVars.grid_orderby = orderby;
                this.setState(page)
            },
            initMagnificPopup: function (e) {
                e.stopPropagation();
                e.preventDefault();
                var $target = $(e.currentTarget);
                if ($target.data('magnificPopup') === undefined) {
                    $target.magnificPopup({
                        type: 'image',
                        mainClass: 'mfp-fade'
                    });
                    $target.trigger('click')
                }
            }
        },
        initLightboxAnchors: function () {
            this.$anchors = this.$list.find('.w-grid-item-anchor');
            this.$anchors.on('click', function (e) {
                var $clicked = $(e.target),
                    $item = $clicked.closest('.w-grid-item'),
                    $anchor = $item.find('.w-grid-item-anchor'),
                    itemUrl = $anchor.attr('href');
                if (!$item.hasClass('custom-link')) {
                    if ($us.$window.width() >= $us.canvasOptions.disableEffectsWidth) {
                        e.stopPropagation();
                        e.preventDefault();
                        this.openLightboxItem(itemUrl, $item)
                    }
                }
            }.bind(this))
        },
        initAjaxPagination: function () {
            this.$loadmore.on('click', function () {
                if (this.curPage < this.ajaxData.max_num_pages) {
                    this.setState(this.curPage + 1)
                }
            }.bind(this));
            if (this.infiniteScroll) {
                $us.waypoints.add(this.$loadmore, '-70%', function () {
                    if (!this.loading) {
                        this.$loadmore.click()
                    }
                }.bind(this))
            }
        },
        setState: function (page, taxonomy) {
            if (this.loading && !this.changeUpdateState) {
                return
            }
            if (page !== 1 && this.paginationType == 'ajax' && this.none !== undefined && this.none == !0) {
                return
            }
            this.none = !1;
            this.loading = !0;
            var $none = this.$container.find('> .w-grid-none');
            if ($none.length) {
                $none.hide()
            }
            if (this.$filters.length && !this.changeUpdateState) {
                taxonomy = taxonomy || this.curFilterTaxonomy;
                if (taxonomy == '*') {
                    taxonomy = this.initialFilterTaxonomy
                }
                if (taxonomy != '') {
                    var newTaxArgs = {
                            'taxonomy': this.filterTaxonomyName,
                            'field': 'slug',
                            'terms': taxonomy
                        },
                        taxQueryFound = !1;
                    if (this.templateVars.query_args.tax_query == undefined) {
                        this.templateVars.query_args.tax_query = []
                    } else {
                        $.each(this.templateVars.query_args.tax_query, function (index, taxArgs) {
                            if (taxArgs != null && taxArgs.taxonomy == this.filterTaxonomyName) {
                                this.templateVars.query_args.tax_query[index] = newTaxArgs;
                                taxQueryFound = !0;
                                return !1
                            }
                        }.bind(this))
                    }
                    if (!taxQueryFound) {
                        this.templateVars.query_args.tax_query.push(newTaxArgs)
                    }
                } else if (this.templateVars.query_args.tax_query != undefined) {
                    $.each(this.templateVars.query_args.tax_query, function (index, taxArgs) {
                        if (taxArgs != null && taxArgs.taxonomy == this.filterTaxonomyName) {
                            this.templateVars.query_args.tax_query[index] = null;
                            return !1
                        }
                    }.bind(this))
                }
            }
            this.templateVars.query_args.paged = page;
            if (this.paginationType == 'ajax') {
                if (page == 1) {
                    this.$loadmore.addClass('done')
                } else {
                    this.$loadmore.addClass('loading')
                }
                if (!this.infiniteScroll) {
                    this.prevScrollTop = $us.$window.scrollTop()
                }
            }
            if (this.paginationType != 'ajax' || page == 1) {
                this.$preloader.addClass('active');
                if (this.$list.data('isotope')) {
                    this.$list.isotope('remove', this.$container.find('.w-grid-item'));
                    this.$list.isotope('layout')
                } else {
                    this.$container.find('.w-grid-item').remove()
                }
            }
            this.ajaxData.template_vars = JSON.stringify(this.templateVars);
            var isotope = this.$list.data('isotope');
            if (isotope && page == 1) {
                this.$list.html('');
                isotope.remove(isotope.items);
                isotope.reloadItems()
            }
            if (this.xhr !== undefined) {
                this.xhr.abort()
            }
            this.xhr = $.ajax({
                type: 'post',
                url: this.ajaxData.ajax_url,
                data: this.ajaxData,
                success: function (html) {
                    var $result = $(html),
                        $container = $('.w-grid-list', $result),
                        $pagination = $('.pagination > *', $result),
                        $items = $container.children(),
                        smallestItemSelector;
                    $container.imagesLoaded(function () {
                        this.beforeAppendItems($items);
                        $items.appendTo(this.$list);
                        $container.html('');
                        var $sliders = $items.find('.w-slider');
                        this.afterAppendItems($items);
                        if (isotope) {
                            isotope.insert($items);
                            isotope.reloadItems()
                        }
                        if ($sliders.length) {
                            $us.getScript($us.templateDirectoryUri + '/common/js/vendor/royalslider.js', function () {
                                $sliders.each(function (index, slider) {
                                    $(slider).wSlider().find('.royalSlider').data('royalSlider').ev.on('rsAfterInit', function () {
                                        if (isotope) {
                                            this.$list.isotope('layout')
                                        }
                                    })
                                }.bind(this))
                            }.bind(this))
                        }
                        if (isotope) {
                            if (this.$list.find('.size_1x1').length) {
                                smallestItemSelector = '.size_1x1'
                            } else if (this.$list.find('.size_1x2').length) {
                                smallestItemSelector = '.size_1x2'
                            } else if (this.$list.find('.size_2x1').length) {
                                smallestItemSelector = '.size_2x1'
                            } else if (this.$list.find('.size_2x2').length) {
                                smallestItemSelector = '.size_2x2'
                            }
                            if (isotope.options.masonry) {
                                isotope.options.masonry.columnWidth = smallestItemSelector || '.w-grid-item'
                            }
                            this.$list.isotope('layout');
                            this.$list.trigger('layoutComplete')
                        }
                        if (this.paginationType == 'ajax') {
                            if ($items.find('.w-tabs').length > 0) {
                                $('.w-tabs', $items).each(function () {
                                    $(this).wTabs()
                                })
                            }
                            if (page == 1) {
                                var $jsonContainer = $result.find('.w-grid-json');
                                if ($jsonContainer.length) {
                                    var ajaxData = $jsonContainer[0].onclick() || {};
                                    this.ajaxData.max_num_pages = ajaxData.max_num_pages || this.ajaxData.max_num_pages
                                } else {
                                    this.ajaxData.max_num_pages = 1
                                }
                            }
                            if (this.templateVars.query_args.paged >= this.ajaxData.max_num_pages || !$items.length) {
                                this.$loadmore.addClass('done')
                            } else {
                                this.$loadmore.removeClass('done');
                                this.$loadmore.removeClass('loading')
                            }
                            if (this.infiniteScroll) {
                                $us.waypoints.add(this.$loadmore, '-70%', function () {
                                    if (!this.loading) {
                                        this.$loadmore.click()
                                    }
                                }.bind(this))
                            } else if (Math.round(this.prevScrollTop) != Math.round($us.$window.scrollTop())) {
                                $us.$window.scrollTop(this.prevScrollTop)
                            }
                            if ($us.detectIE() == 11) {
                                objectFitPolyfill()
                            }
                        } else if (this.paginationType === 'regular' && this.changeUpdateState) {
                            $('a[href]', $pagination).each(function (_, item) {
                                var $item = $(item),
                                    pathname = location.pathname.replace(/((\/page.*)?)\/$/, '');
                                $item.attr('href', pathname + $item.attr('href'))
                            });
                            this.$pagination.html($pagination)
                        }
                        if (this.$container.hasClass('popup_page')) {
                            $.each($items, function (index, item) {
                                var $loadedItem = $(item),
                                    $anchor = $loadedItem.find('.w-grid-item-anchor'),
                                    itemUrl = $anchor.attr('href');
                                if (!$loadedItem.hasClass('custom-link')) {
                                    $anchor.click(function (e) {
                                        if ($us.$window.width() >= $us.canvasOptions.disableEffectsWidth) {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            this.openLightboxItem(itemUrl, $loadedItem)
                                        }
                                    }.bind(this))
                                }
                            }.bind(this))
                        }
                        if (this.changeUpdateState && $result.find('.w-grid-none').length) {
                            if (!$none.length) {
                                this.$container.prepend($result.find('.w-grid-none'))
                            } else {
                                $none.show()
                            }
                            this.none = !0
                        }
                        if (this.changeUpdateState && this.gridFilter) {
                            var $jsonData = $result.filter('.w-grid-filter-json-data:first');
                            if ($jsonData.length) {
                                this.gridFilter.trigger('us_grid_filter.update-items-amount', $jsonData[0].onclick() || {})
                            }
                            $jsonData.remove()
                        }
                        var customStyles = $('style#grid-post-content-css', $result).html() || '';
                        if (customStyles) {
                            if (!this.$style.length) {
                                this.$style = $('<style></style>');
                                this.$container.append(this.$style)
                            }
                            this.$style.text(this.$style.text() + customStyles)
                        }
                        $us.$canvas.resize();
                        this.$preloader.removeClass('active');
                        if (window.USAnimate && this.$container.is('.with_css_animation')) {
                            new USAnimate(this.$container)
                        }
                    }.bind(this));
                    this.loading = !1
                }.bind(this),
                error: function () {
                    this.$loadmore.removeClass('loading')
                }.bind(this)
            });
            this.curPage = page;
            this.curFilterTaxonomy = taxonomy
        },
        _hasScrollbar: function () {
            return document.documentElement.scrollHeight > document.documentElement.clientHeight
        },
        _getScrollbarSize: function () {
            if ($us.scrollbarSize === undefined) {
                var scrollDiv = document.createElement('div');
                scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
                document.body.appendChild(scrollDiv);
                $us.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                document.body.removeChild(scrollDiv)
            }
            return $us.scrollbarSize
        },
        openLightboxItem: function (itemUrl, $item) {
            this.showLightbox();
            var $nextItem = $item.nextAll('article:visible:not(.custom-link)').first(),
                $prevItem = $item.prevAll('article:visible:not(.custom-link)').first();
            if ($nextItem.length != 0) {
                this.$lightboxNextArrow.show();
                this.$lightboxNextArrow.attr('title', $nextItem.find('.w-grid-item-title').text());
                this.$lightboxNextArrow.off('click').click(function (e) {
                    var $nextItemAnchor = $nextItem.find('.w-grid-item-anchor'),
                        nextItemUrl = $nextItemAnchor.attr('href');
                    e.stopPropagation();
                    e.preventDefault();
                    this.openLightboxItem(nextItemUrl, $nextItem)
                }.bind(this))
            } else {
                this.$lightboxNextArrow.attr('title', '');
                this.$lightboxNextArrow.hide()
            }
            if ($prevItem.length != 0) {
                this.$lightboxPrevArrow.show();
                this.$lightboxPrevArrow.attr('title', $prevItem.find('.w-grid-item-title').text());
                this.$lightboxPrevArrow.off('click').on('click', function (e) {
                    var $prevItemAnchor = $prevItem.find('.w-grid-item-anchor'),
                        prevItemUrl = $prevItemAnchor.attr('href');
                    e.stopPropagation();
                    e.preventDefault();
                    this.openLightboxItem(prevItemUrl, $prevItem)
                }.bind(this))
            } else {
                this.$lightboxPrevArrow.attr('title', '');
                this.$lightboxPrevArrow.hide()
            }
            if (itemUrl.indexOf('?') !== -1) {
                this.$lightboxContentFrame.attr('src', itemUrl + '&us_iframe=1')
            } else {
                this.$lightboxContentFrame.attr('src', itemUrl + '?us_iframe=1')
            }
            if (history.replaceState) {
                history.replaceState(null, null, itemUrl)
            }
            this.$lightboxContentFrame.off('load').on('load', function () {
                this.lightboxContentLoaded()
            }.bind(this))
        },
        lightboxContentLoaded: function () {
            this.$lightboxContentPreloader.css('display', 'none');
            this.$lightboxContentFrame.contents().find('body').off('keyup.usCloseLightbox').on('keyup.usCloseLightbox', function (e) {
                if (e.key === "Escape") {
                    this.hideLightbox()
                }
            }.bind(this))
        },
        showLightbox: function () {
            clearTimeout(this.lightboxTimer);
            this.$lightboxOverlay.appendTo($us.$body).show();
            this.$lightboxWrap.appendTo($us.$body).show();
            this.lightboxOpened = !0;
            this.$lightboxContentPreloader.css('display', 'block');
            $us.$html.addClass('usoverlay_fixed');
            if (!$.isMobile) {
                this.windowHasScrollbar = this._hasScrollbar();
                if (this.windowHasScrollbar && this._getScrollbarSize()) {
                    $us.$html.css('margin-right', this._getScrollbarSize())
                }
            }
            this.lightboxTimer = setTimeout(function () {
                this.afterShowLightbox()
            }.bind(this), 25)
        },
        afterShowLightbox: function () {
            clearTimeout(this.lightboxTimer);
            this.$container.on('keyup', function (e) {
                if (this.$container.hasClass('popup_page')) {
                    if (e.key === "Escape") {
                        this.hideLightbox()
                    }
                }
            }.bind(this));
            this.$lightboxOverlay.addClass('active');
            this.$lightboxBox.addClass('active');
            $us.$canvas.trigger('contentChange');
            $us.$window.trigger('resize')
        },
        hideLightbox: function () {
            clearTimeout(this.lightboxTimer);
            this.lightboxOpened = !1;
            this.$lightboxOverlay.removeClass('active');
            this.$lightboxBox.removeClass('active');
            if (history.replaceState) {
                history.replaceState(null, null, this.originalURL)
            }
            this.lightboxTimer = setTimeout(function () {
                this.afterHideLightbox()
            }.bind(this), 500)
        },
        afterHideLightbox: function () {
            this.$container.off('keyup');
            clearTimeout(this.lightboxTimer);
            this.$lightboxOverlay.appendTo(this.$container).hide();
            this.$lightboxWrap.appendTo(this.$container).hide();
            this.$lightboxContentFrame.attr('src', 'about:blank');
            $us.$html.removeClass('usoverlay_fixed');
            if (!$.isMobile) {
                if (this.windowHasScrollbar) {
                    $us.$html.css('margin-right', '')
                }
            }
        },
        beforeAppendItems: function ($items) {
            if ($('[data-toggle-height]', $items).length) {
                var handle = $us.timeout(function () {
                    $('[data-toggle-height]', $items).usToggleMoreContent();
                    $us.clearTimeout(handle)
                }, 1)
            }
        },
        afterAppendItems: function ($items) {}
    };
    $.fn.wGrid = function (options) {
        return this.each(function () {
            $(this).data('wGrid', new $us.WGrid(this, options))
        })
    };
    $(function () {
        $('.w-grid').wGrid()
    });
    $('.w-grid-list').each(function () {
        var $list = $(this);
        if (!$list.find('[ref=magnificPopupGrid]').length) {
            return
        }
        $us.getScript($us.templateDirectoryUri + '/common/js/vendor/magnific-popup.js', function () {
            var delegateStr = 'a[ref=magnificPopupGrid]:visible',
                popupOptions;
            if ($list.hasClass('owl-carousel')) {
                delegateStr = '.owl-item:not(.cloned) a[ref=magnificPopupGrid]'
            }
            popupOptions = {
                type: 'image',
                delegate: delegateStr,
                gallery: {
                    enabled: !0,
                    navigateByImgClick: !0,
                    preload: [0, 1],
                    tPrev: $us.langOptions.magnificPopup.tPrev,
                    tNext: $us.langOptions.magnificPopup.tNext,
                    tCounter: $us.langOptions.magnificPopup.tCounter
                },
                removalDelay: 300,
                mainClass: 'mfp-fade',
                fixedContentPos: !0,
                callbacks: {
                    beforeOpen: function () {
                        var owlCarousel = $list.data('owl.carousel');
                        if (owlCarousel && owlCarousel.settings.autoplay) {
                            $list.trigger('stop.owl.autoplay')
                        }
                    },
                    beforeClose: function () {
                        var owlCarousel = $list.data('owl.carousel');
                        if (owlCarousel && owlCarousel.settings.autoplay) {
                            $list.trigger('play.owl.autoplay')
                        }
                    }
                }
            };
            $list.magnificPopup(popupOptions);
            if ($list.hasClass('owl-carousel')) {
                $list.on('initialized.owl.carousel', function (initEvent) {
                    var $currentList = $(initEvent.currentTarget),
                        items = {};
                    $('.owl-item:not(.cloned)', $currentList).each(function (_, item) {
                        var $item = $(item),
                            id = $item.find('[data-id]').data('id');
                        if (!items.hasOwnProperty(id)) {
                            items[id] = $item
                        }
                    });
                    $currentList.on('click', '.owl-item.cloned', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var $target = $(e.currentTarget),
                            id = $target.find('[data-id]').data('id');
                        if (items.hasOwnProperty(id)) {
                            $('a[ref=magnificPopupGrid]', items[id]).trigger('click')
                        }
                    })
                })
            }
        })
    })
})(jQuery);
(function ($, undefined) {
    "use strict";
    $us.WGridFilter = function (container, options) {
        this.init(container, options)
    };
    $.extend($us.WGridFilter.prototype, $us.mixins.Events, {
        init: function (container, options) {
            this.defaultOptions = {
                filterPrefix: 'filter',
                gridNotFoundMessage: !1,
                gridPaginationSelector: '.w-grid-pagination',
                gridSelector: '.w-grid[data-filterable="true"]:first',
                layout: 'hor',
                mobileWidth: 600
            };
            this.options = $.extend(this.defaultOptions, options);
            this.filtersArgs = {};
            this.$container = $(container);
            this.$filtersItem = $('.w-filter-item', this.$container);
            this.$grid = $(this.options.gridSelector, $us.$canvas.find('.l-main'));
            if (this.$container.is('[onclick]')) {
                $.extend(this.options, this.$container[0].onclick() || {});
                this.$container.removeAttr('onclick')
            }
            var $filtersArgs = this.$container.find('.w-filter-json-filters-args:first');
            if ($filtersArgs.length) {
                this.filtersArgs = $filtersArgs[0].onclick() || {};
                $filtersArgs.remove()
            }
            if (!this.$grid.length && this.options.gridNotFoundMessage) {
                this.$container.prepend('<div class="w-filter-message">' + this.options.gridNotFoundMessage + '</div>')
            }
            this.$grid.addClass('used_by_grid_filter');
            this.$container.on('click', '.w-filter-opener', this._events.filterOpener.bind(this)).on('click', '.w-filter-list-closer, .w-filter-list-panel > a', this._events.filterListCloser.bind(this));
            this.$filtersItem.on('change', 'input, select', this._events.changeFilter.bind(this)).on('click', '.w-filter-item-reset', this._events.resetItem.bind(this));
            $(this.options.gridPaginationSelector, this.$grid).on('click', '.page-numbers', this._events.loadPageNumber.bind(this));
            $us.$window.on('resize load', $us.debounce(this._events.resize.bind(this), 100));
            this.on('changeItemValue', this._events.toggleItemValue.bind(this));
            if (this.$container.hasClass('show_on_click')) {
                this.$filtersItem.on('click', '.w-filter-item-title', this._events.showItem.bind(this));
                $(document).mouseup(this._events.hideItem.bind(this))
            }
            $('form.woocommerce-ordering', $us.$canvas).off('change', 'select.orderby').on('change', 'select.orderby', this._events.woocommerceOrdering.bind(this));
            this.checkItemValues.call(this);
            this.$container.toggleClass('active', this.$filtersItem.is('.has_value'));
            this.on('us_grid_filter.update-items-amount', this._events.updateItemsAmount.bind(this));
            this._events.resize.call(this)
        },
        isMobile: function () {
            return parseInt($us.$window.width()) < parseInt(this.options.mobileWidth)
        },
        _events: {
            changeFilter: function (e) {
                var $target = $(e.currentTarget),
                    $item = $target.closest('.w-filter-item'),
                    uiType = $item.data('ui_type');
                $item.removeClass('disabled');
                this.$filtersItem.not($item).addClass('disabled');
                if (['radio', 'checkbox'].indexOf(uiType) !== -1) {
                    if (uiType === 'radio') {
                        $('.w-filter-item-value', $item).removeClass('selected')
                    }
                    $target.closest('.w-filter-item-value').toggleClass('selected', $target.is(':checked '))
                } else if (uiType === 'range') {
                    var $inputs = $('input[type!=hidden]', $item),
                        rangeValues = [];
                    $inputs.each(function (i, input) {
                        var $input = $(input),
                            value = input.value || 0;
                        if (!value && $input.hasClass('type_' + ['min', 'max'][i]) && rangeValues.length == i) {
                            value = $input.attr('placeholder') || 0
                        }
                        value = parseInt(value);
                        rangeValues.push(!isNaN(value) ? value : 0)
                    });
                    rangeValues = rangeValues.join('-');
                    $('input[type="hidden"]', $item).val(rangeValues !== '0-0' ? rangeValues : '')
                }
                var value = this.getValue();
                $us.debounce(this.URLSearchParams.bind(this, value), 1)();
                this.triggerGrid('us_grid.updateState', [value, 1, this]);
                this.trigger('changeItemValue', $item);
                this.$container.toggleClass('active', this.$filtersItem.is('.has_value'))
            },
            loadPageNumber: function (e) {
                e.stopPropagation();
                e.preventDefault();
                var $target = $(e.currentTarget),
                    href = $target.attr('href') || '',
                    matches = (href.match(/page(=|\/)(\d+)(\/?)/) || []),
                    page = parseInt(matches[2] || 1);
                history.replaceState(document.title, document.title, href);
                this.triggerGrid('us_grid.updateState', [this.getValue(), page, this])
            },
            resetItem: function (e) {
                var $item = $(e.currentTarget).closest('.w-filter-item'),
                    uiType = $item.data('ui_type');
                if (!uiType) {
                    return
                }
                if ('checkbox|radio'.indexOf(uiType) !== -1) {
                    $('input:checked', $item).prop('checked', !1);
                    $('input[value="*"]:first', $item).each(function (_, input) {
                        $(input).prop('checked', !0).closest('.w-filter-item').addClass('selected')
                    })
                }
                if (uiType === 'range') {
                    $('input', $item).val('')
                }
                if (uiType === 'dropdown') {
                    $('option', $item).prop('selected', !1)
                }
                $('.w-filter-item-value', $item).removeClass('selected');
                this.trigger('changeItemValue', $item);
                this.$container.toggleClass('active', this.$filtersItem.is('.has_value'));
                var value = this.getValue();
                $us.debounce(this.URLSearchParams.bind(this, value), 1)();
                this.URLSearchParams(value);
                this.triggerGrid('us_grid.updateState', [value, 1, this])
            },
            toggleItemValue: function (_, item) {
                var $item = $(item),
                    title = '',
                    hasValue = !1,
                    uiType = $item.data('ui_type'),
                    $selected = $('input:not([value="*"]):checked', $item);
                if (!uiType) {
                    return
                }
                if ('checkbox|radio'.indexOf(uiType) !== -1) {
                    hasValue = $selected.length;
                    if (this.options.layout == 'hor') {
                        var title = '';
                        if ($selected.length === 1) {
                            title += ': ' + $selected.nextAll('.w-filter-item-value-label:first').text()
                        } else if ($selected.length > 1) {
                            title += ': ' + $selected.length
                        }
                    }
                }
                if (uiType === 'dropdown') {
                    var value = $('select:first', $item).val();
                    hasValue = (value !== '*') ? !!value : ''
                }
                if (uiType === 'range') {
                    var value = $('input[type="hidden"]:first', $item).val();
                    hasValue = !!value;
                    if (this.options.layout == 'hor' && value) {
                        title += ': ' + value
                    }
                }
                $item.toggleClass('has_value', !!hasValue);
                $('> .w-filter-item-title:first > span', item).html(title)
            },
            resize: function () {
                this.$container.usMod('state', this.isMobile() ? 'mobile' : 'desktop');
                if (!this.isMobile()) {
                    $us.$body.removeClass('us_filter_open');
                    this.$container.removeClass('open')
                }
            },
            filterOpener: function () {
                $us.$body.addClass('us_filter_open');
                this.$container.addClass('open')
            },
            filterListCloser: function () {
                $us.$body.removeClass('us_filter_open');
                this.$container.removeClass('open')
            },
            showItem: function (e) {
                var $target = $(e.currentTarget),
                    $item = $target.closest('.w-filter-item');
                $item.addClass('show')
            },
            hideItem: function (e) {
                if (!this.$filtersItem.hasClass('show')) {
                    return
                }
                this.$filtersItem.filter('.show').each(function (_, item) {
                    var $item = $(item);
                    if (!$item.is(e.target) && $item.has(e.target).length === 0) {
                        $item.removeClass('show')
                    }
                })
            },
            woocommerceOrdering: function (e) {
                e.stopPropagation();
                var $form = $(e.currentTarget).closest('form');
                $('input[name^="' + this.options.filterPrefix + '"]', $form).remove();
                $.each(this.getValue().split('&'), function (_, item) {
                    var value = item.split('=');
                    if (value.length === 2) {
                        $form.append('<input type="hidden" name="' + value[0] + '" value="' + value[1] + '"/>')
                    }
                });
                $form.trigger('submit')
            },
            updateItemsAmount: function (_, data) {
                this.$filtersItem.removeClass('disabled');
                $.each((data.taxonomies_query_args || {}), function (key, items) {
                    var $item = this.$filtersItem.filter('[data-source="' + key + '"]'),
                        uiType = $item.data('ui_type'),
                        showCount = 0;
                    $.each(items, function (value, amount) {
                        var disabled = !amount;
                        if (!disabled) {
                            showCount++
                        }
                        if (uiType === 'dropdown') {
                            var $option = $('select:first option[value="' + value + '"]', $item),
                                template = $option.data('template') || '';
                            if (template) {
                                template = template.replace('%s', (amount ? amount : '')).trim()
                                $option.text(template)
                            }
                            $option.prop('disabled', disabled).toggleClass('disabled', disabled)
                        } else {
                            var $input = $('input[value="' + value + '"]', $item);
                            $input.prop('disabled', disabled).nextAll('.w-filter-item-value-amount').text(amount);
                            $input.closest('.w-filter-item-value').toggleClass('disabled', disabled);
                            if (disabled && $input.is(':checked')) {
                                $input.prop('checked', !1)
                            }
                        }
                    }.bind(this));
                    if (!showCount && this.options.hideDisabledValues) {
                        $item.addClass('disabled')
                    }
                }.bind(this));
                if (data.hasOwnProperty('wc_min_max_price') && data.wc_min_max_price instanceof Object) {
                    var $price = this.$filtersItem.filter('[data-source$="|_price"]');
                    $.each((data.wc_min_max_price || {}), function (name, value) {
                        var $input = $('input.type_' + name, $price);
                        $input.attr('placeholder', value ? value : $input.attr('aria-label'))
                    })
                }
                if (!$.isEmptyObject(data)) {
                    if (this.handle) {
                        $us.clearTimeout(this.handle)
                    }
                    this.handle = $us.timeout(function () {
                        $us.debounce(this.URLSearchParams.bind(this, this.getValue()), 1)();
                        this.checkItemValues.call(this)
                    }.bind(this), 100)
                }
            }
        },
        triggerGrid: function (eventType, extraParameters) {
            $us.debounce(function () {
                $us.$body.trigger(eventType, extraParameters)
            }, 10)()
        },
        checkItemValues: function () {
            this.$filtersItem.each(function (_, item) {
                this.trigger('changeItemValue', item)
            }.bind(this))
        },
        getValue: function () {
            var value = '',
                filters = {};
            $.each(this.$container.serializeArray(), function (_, filter) {
                if (filter.value === '*' || !filter.value) {
                    return
                }
                if (!filters.hasOwnProperty(filter.name)) {
                    filters[filter.name] = []
                }
                filters[filter.name].push(filter.value)
            });
            for (var k in filters) {
                if (value) {
                    value += '&'
                }
                if ($.isArray(filters[k])) {
                    value += k + '=' + filters[k].join(',')
                }
            }
            return encodeURI(value);
        },
        URLSearchParams: function (params) {
            var url = location.origin + location.pathname + (location.pathname.slice(-1) != '/' ? '/' : ''),
                search = location.search.replace(new RegExp(this.options.filterPrefix + "(.+?)(&|$)", "g"), '');
            if (!search || search.substr(0, 1) !== '?') {
                search += '?'
            } else if ('?&'.indexOf(search.slice(-1)) === -1) {
                search += '&'
            }
            if (!params && '?&'.indexOf(search.slice(-1)) !== -1) {
                search = search.slice(0, -1)
            }
            history.replaceState(document.title, document.title, url + search + params)
        }
    });
    $.fn.wGridFilter = function (options) {
        return this.each(function () {
            $(this).data('wGridFilter', new $us.WGridFilter(this, options))
        })
    };
    $(function () {
        $('.w-filter', $us.$canvas).wGridFilter()
    })
})(jQuery);
(function ($, undefined) {
    "use strict";
    $us.WGridOrder = function (container) {
        this.init(container)
    };
    $.extend($us.WGridOrder.prototype, $us.mixins.Events, {
        init: function (container) {
            this.$container = $(container);
            this.$select = $('select', this.$container);
            this.$grid = $('.w-grid[data-filterable="true"]:first', $us.$canvas.find('.l-main'));
            this.name = this.$select.attr('name') || 'order';
            this.$container.on('change', 'select', this._events.changeSelect.bind(this));
            this.$grid.addClass('used_by_grid_order')
        },
        _events: {
            changeSelect: function () {
                var value = this.$select.val() || '';
                this.URLSearchValue(value);
                this.triggerGrid('us_grid.updateOrderBy', [value, 1, this])
            }
        },
        triggerGrid: function (eventType, extraParameters) {
            $us.debounce(function () {
                $us.$body.trigger(eventType, extraParameters)
            }, 10)()
        },
        URLSearchValue: function (value) {
            var orderby_search = '',
                url = location.origin + location.pathname + (location.pathname.slice(-1) != '/' ? '/' : ''),
                search = location.search.replace(new RegExp('[?&]' + this.name + '=[^&#]*(#.*)?$'), '$1').replace(new RegExp('([?&])' + this.name + '=[^&]*&'), '$1');
            if (search && search.substr(0, 1) === '?') {
                search = search.slice(1)
            }
            if (value) {
                orderby_search += this.name + '=' + value
            }
            if (orderby_search && search) {
                orderby_search += '&'
            }
            orderby_search += search;
            history.replaceState(document.title, document.title, url + (orderby_search ? '?' + orderby_search : ''))
        }
    });
    $.fn.wGridOrder = function (options) {
        return this.each(function () {
            $(this).data('wGridOrder', new $us.WGridOrder(this))
        })
    };
    $(function () {
        $('.w-order', $us.$canvas).wGridOrder()
    })
})(jQuery);
! function ($, undefined) {
    "use strict";

    function USHeader(settings) {
        this.$container = $('.l-header', $us.$canvas);
        this.$showBtn = $('.w-header-show:first', $us.$body);
        this.settings = settings || {};
        this.state = 'default';
        this.$elms = {};
        if (this.$container.length === 0) {
            return
        }
        this.$places = {
            hidden: $('.l-subheader.for_hidden', this.$container)
        };
        this._states = {
            sticky: !1,
            sticky_auto_hide: !1,
            scroll_direction: 'down',
            vertical_scrollable: !1,
            init_height: this.getHeight()
        };
        this.pos = this.$container.usMod('pos');
        this.bg = this.$container.usMod('bg');
        this.shadow = this.$container.usMod('shadow');
        this.orientation = $us.$body.usMod('header');
        this.tabletsBreakpoint = parseInt(settings.tablets && settings.tablets.options && settings.tablets.options.breakpoint) || 900;
        this.mobilesBreakpoint = parseInt(settings.mobiles && settings.mobiles.options && settings.mobiles.options.breakpoint) || 600;
        $('.l-subheader-cell', this.$container).each(function (_, place) {
            var $place = $(place),
                key = $place.parent().parent().usMod('at') + '_' + $place.usMod('at');
            this.$places[key] = $place
        }.bind(this));
        $('[class*=ush_]', this.$container).each(function (_, elm) {
            var $elm = $(elm),
                matches = /(^| )ush_([a-z_]+)_([0-9]+)(\s|$)/.exec(elm.className);
            if (!matches) {
                return
            }
            var id = matches[2] + ':' + matches[3];
            this.$elms[id] = $elm;
            if ($elm.is('.w-vwrapper, .w-hwrapper')) {
                this.$places[id] = $elm
            }
        }.bind(this));
        $us.$window.on('scroll', $us.debounce(this._events.scroll.bind(this), 10)).on('resize load', $us.debounce(this._events.resize.bind(this), 10));
        this.$container.on('contentChange', this._events.contentChange.bind(this));
        this.$showBtn.on('click', this._events.showBtn.bind(this));
        this.on('changeSticky', this._events._changeSticky.bind(this)).on('swichVerticalScrollable', this._events._swichVerticalScrollable.bind(this));
        this._events.resize.call(this);
        if (this.isStickyAutoHideEnabled()) {
            this.$container.addClass('sticky_auto_hide')
        }
        this.$container.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
            $us.debounce(this.trigger.bind(this, 'transitionEnd'), 1)()
        }.bind(this))
    }
    $.extend(USHeader.prototype, $us.mixins.Events, {
        prevScrollTop: 0,
        currentStateIs: function (state) {
            return (state && ['default', 'tablets', 'mobiles'].indexOf(state) !== -1 && this.state === state)
        },
        isVertical: function () {
            return this.orientation === 'ver'
        },
        isHorizontal: function () {
            return this.orientation === 'hor'
        },
        isFixed: function () {
            return this.pos === 'fixed'
        },
        isTransparent: function () {
            return this.bg === 'transparent'
        },
        _isWithinScrollBoundaries: function (scrollTop) {
            scrollTop = parseInt(scrollTop);
            return (scrollTop + window.innerHeight >= $us.$document.height()) || scrollTop <= 0
        },
        isHidden: function () {
            return !!$us.header.settings.is_hidden
        },
        isStickyEnabled: function () {
            return this.settings[this.state].options.sticky || !1
        },
        isStickyAutoHideEnabled: function () {
            return this.isStickyEnabled() && (this.settings[this.state].options.sticky_auto_hide || !1)
        },
        isSticky: function () {
            return this._states.sticky || !1
        },
        isStickyAutoHidden: function () {
            return this._states.sticky_auto_hide || !1
        },
        getScrollDirection: function () {
            return this._states.scroll_direction || 'down'
        },
        getAdminBarHeight: function () {
            var $wpAdminBar = $('#wpadminbar', $us.$body);
            return $wpAdminBar.length ? parseInt($wpAdminBar.height()) : 0
        },
        getHeight: function () {
            var height = 0,
                beforeContent = getComputedStyle(this.$container.get(0), ':before').content;
            if (beforeContent && ['none', 'auto'].indexOf(beforeContent) === -1) {
                height = beforeContent.replace(/[^+\d]/g, '')
            }
            if (!height) {
                height = this.$container.outerHeight()
            }
            return !isNaN(height) ? parseInt(height) : 0
        },
        getInitHeight: function () {
            return parseInt(this._states.init_height) || this.getHeight()
        },
        getCurrentHeight: function () {
            var height = 0,
                adminBarHeight = this.getAdminBarHeight();
            if (this.isHorizontal() && (!this.currentStateIs('mobiles') || (adminBarHeight && adminBarHeight >= this.getScrollTop()))) {
                height += adminBarHeight
            }
            if (!this.isStickyAutoHidden()) {
                height += this.getHeight()
            }
            return height
        },
        getScrollTop: function () {
            return parseInt($us.$window.scrollTop()) || this.prevScrollTop
        },
        getOffsetTop: function () {
            var top = parseInt(this.$container.css('top'));
            return !isNaN(top) ? top : 0
        },
        isScrollAtTopPosition: function () {
            return parseInt($us.$window.scrollTop()) === 0
        },
        setState: function (state) {
            if (this.currentStateIs(state)) {
                return
            }
            var options = this.settings[state].options || {},
                orientation = options.orientation || 'hor',
                pos = ($us.toBool(options.sticky) ? 'fixed' : 'static'),
                bg = ($us.toBool(options.transparent) ? 'transparent' : 'solid'),
                shadow = options.shadow || 'thin';
            if (orientation === 'ver') {
                pos = 'fixed';
                bg = 'solid'
            }
            this._setOrientation(orientation);
            this._setPos(pos);
            this._setBg(bg);
            this._setShadow(shadow);
            this._setLayout(this.settings[state].layout || {});
            $us.$body.usMod('state', this.state = state);
            if (this.currentStateIs('default')) {
                $us.$body.removeClass('header-show')
            }
            if ($us.nav !== undefined) {
                $us.nav.resize()
            }
            if (this.isStickyAutoHideEnabled()) {
                this.$container.removeClass('down')
            }
        },
        _setPos: function (pos) {
            if (pos === this.pos) {
                return
            }
            this.$container.usMod('pos', this.pos = pos);
            if (this.pos === 'static') {
                this.trigger('changeSticky', !1)
            }
        },
        _setBg: function (bg) {
            if (bg != this.bg) {
                this.$container.usMod('bg', this.bg = bg)
            }
        },
        _setShadow: function (shadow) {
            if (shadow != this.shadow) {
                this.$container.usMod('shadow', this.shadow = shadow)
            }
        },
        _setLayout: function (layout) {
            for (var place in layout) {
                if (!layout[place] || !this.$places[place]) {
                    continue
                }
                this._placeElements(layout[place], this.$places[place])
            }
        },
        _setOrientation: function (orientation) {
            if (orientation != this.orientation) {
                $us.$body.usMod('header', this.orientation = orientation)
            }
        },
        _placeElements: function (elms, $place) {
            for (var i = 0; i < elms.length; i++) {
                var elmId;
                if (typeof elms[i] == 'object') {
                    elmId = elms[i][0];
                    if (!this.$places[elmId] || !this.$elms[elmId]) {
                        continue
                    }
                    this.$elms[elmId].appendTo($place);
                    this._placeElements(elms[i].shift(), this.$places[elmId])
                } else {
                    elmId = elms[i];
                    if (!this.$elms[elmId]) {
                        continue
                    }
                    this.$elms[elmId].appendTo($place)
                }
            }
        },
        _isVerticalScrollable: function () {
            if (!this.isVertical()) {
                return
            }
            if (this.currentStateIs('default') && this.isFixed()) {
                this.$container.addClass('scrollable');
                var headerHeight = this.getHeight(),
                    canvasHeight = parseInt($us.canvas.winHeight),
                    documentHeight = parseInt($us.$document.height());
                this.$container.removeClass('scrollable');
                if (headerHeight > canvasHeight) {
                    this.trigger('swichVerticalScrollable', !0)
                } else if (this._states.vertical_scrollable) {
                    this.trigger('swichVerticalScrollable', !1)
                }
                if (headerHeight > documentHeight) {
                    this.$container.css({
                        position: 'absolute',
                        top: 0
                    })
                }
            } else if (this._states.vertical_scrollable) {
                this.trigger('swichVerticalScrollable', !1)
            }
        },
        _events: {
            _swichVerticalScrollable: function (_, state) {
                this.$container.toggleClass('scrollable', this._states.vertical_scrollable = !!state);
                if (!this._states.vertical_scrollable) {
                    this.$container.resetInlineCSS('position', 'top', 'bottom');
                    delete this._headerScrollRange
                }
            },
            _changeSticky: function (_, state) {
                this._states.sticky = !!state;
                var currentHeight = this.getCurrentHeight();
                $us.debounce(function () {
                    this.$container.toggleClass('sticky', this._states.sticky).resetInlineCSS('position', 'top', 'bottom');
                    if (currentHeight == this.getCurrentHeight()) {
                        this.trigger('transitionEnd')
                    }
                }.bind(this), 10)()
            },
            contentChange: function () {
                this._isVerticalScrollable.call(this)
            },
            showBtn: function (e) {
                if ($us.$body.hasClass('header-show')) {
                    return
                }
                e.stopPropagation();
                $us.$body.addClass('header-show').on(($.isMobile ? 'touchstart' : 'click'), this._events.hideMobileVerticalHeader.bind(this))
            },
            hideMobileVerticalHeader: function (e) {
                if ($.contains(this.$container[0], e.target)) {
                    return
                }
                $us.$body.off(($.isMobile ? 'touchstart' : 'click'), this._events.hideMobileVerticalHeader.bind(this));
                $us.timeout(function () {
                    $us.$body.removeClass('header-show')
                }, 10)
            },
            scroll: function () {
                var scrollTop = this.getScrollTop(),
                    headerAbovePosition = ($us.canvas.headerInitialPos === 'above');
                if (this.prevScrollTop != scrollTop) {
                    this._states.scroll_direction = (this.prevScrollTop <= scrollTop) ? 'down' : 'up'
                }
                this.prevScrollTop = scrollTop;
                if (this.isScrollAtTopPosition()) {
                    this._states.scroll_direction = 'up'
                }
                if (this.isStickyAutoHideEnabled() && this.isSticky() && !this._isWithinScrollBoundaries(scrollTop) && !headerAbovePosition) {
                    this._states.sticky_auto_hide = (this.getScrollDirection() === 'down');
                    this.$container.toggleClass('down', this._states.sticky_auto_hide)
                }
                if (!this.isFixed()) {
                    return
                }
                var headerAttachedFirstSection = ['bottom', 'below'].indexOf($us.canvas.headerInitialPos) !== -1;
                if (this.isHorizontal() && (headerAbovePosition || (headerAttachedFirstSection && !this.currentStateIs('default')) || !headerAttachedFirstSection)) {
                    if (this.isStickyEnabled()) {
                        var scrollBreakpoint = parseInt(this.settings[this.state].options.scroll_breakpoint) || 100,
                            isSticky = scrollTop >= scrollBreakpoint;
                        if (isSticky != this.isSticky()) {
                            this.trigger('changeSticky', isSticky)
                        }
                    }
                    if (this.isSticky()) {
                        $us.debounce(function () {
                            if (!$us.$window.scrollTop()) {
                                this.trigger('changeSticky', !1)
                            }
                        }.bind(this), 1)()
                    }
                }
                if (this.isHorizontal() && headerAttachedFirstSection && !headerAbovePosition && this.currentStateIs('default')) {
                    var top = ($us.canvas.getHeightFirstSection() + this.getAdminBarHeight());
                    if ($us.canvas.headerInitialPos == 'bottom') {
                        top -= this.getInitHeight()
                    }
                    if (this.isStickyEnabled()) {
                        var isSticky = scrollTop >= top;
                        if (isSticky != this.isSticky()) {
                            $us.debounce(function () {
                                this.trigger('changeSticky', isSticky)
                            }.bind(this), 1)()
                        }
                    }
                    if (!this.isSticky() && top != this.getOffsetTop()) {
                        this.$container.css('top', top)
                    }
                }
                var headerHeight = this.getHeight(),
                    documentHeight = parseInt($us.$document.height());
                if (this.isVertical() && !headerAttachedFirstSection && !headerAbovePosition && !jQuery.isMobile && this._states.vertical_scrollable && documentHeight > headerHeight) {
                    var canvasHeight = parseInt($us.canvas.winHeight),
                        scrollRangeDiff = (headerHeight - canvasHeight),
                        cssProps;
                    if (this._headerScrollRange === undefined) {
                        this._headerScrollRange = [0, scrollRangeDiff]
                    }
                    if (scrollTop <= this._headerScrollRange[0]) {
                        this._headerScrollRange[0] = Math.max(0, scrollTop);
                        this._headerScrollRange[1] = (this._headerScrollRange[0] + scrollRangeDiff);
                        cssProps = {
                            position: 'fixed',
                            top: this.getAdminBarHeight()
                        }
                    } else if (this._headerScrollRange[0] < scrollTop && scrollTop < this._headerScrollRange[1]) {
                        cssProps = {
                            position: 'absolute',
                            top: this._headerScrollRange[0]
                        }
                    } else if (this._headerScrollRange[1] <= scrollTop) {
                        this._headerScrollRange[1] = Math.min(documentHeight - canvasHeight, scrollTop);
                        this._headerScrollRange[0] = (this._headerScrollRange[1] - scrollRangeDiff);
                        cssProps = {
                            position: 'fixed',
                            top: (canvasHeight - headerHeight)
                        }
                    }
                    if (cssProps) {
                        this.$container.css(cssProps)
                    }
                }
            },
            resize: function () {
                var newState = 'default';
                if (window.innerWidth < this.tabletsBreakpoint) {
                    newState = (window.innerWidth < this.mobilesBreakpoint) ? 'mobiles' : 'tablets'
                }
                this.setState(newState);
                if (this.isFixed() && this.isHorizontal()) {
                    this.$container.addClass('notransition')
                    $us.timeout(function () {
                        this.$container.removeClass('notransition')
                    }.bind(this), 50)
                }
                this._isVerticalScrollable.call(this);
                this._events.scroll.call(this)
            }
        }
    });
    $us.header = new USHeader($us.headerSettings || {})
}(window.jQuery);
! function ($) {
    var Horparallax = function (container, options) {
        var that = this;
        this.$window = $(window);
        this.container = $(container);
        if (container.onclick != undefined) {
            options = $.extend({}, container.onclick() || {}, typeof options == 'object' && options);
            this.container.removeProp('onclick')
        }
        options = $.extend({}, $.fn.horparallax.defaults, typeof options == 'object' && options);
        this.options = options;
        this.bg = this.container.find(options.bgSelector);
        this.containerWidth = this.container.outerWidth();
        this.containerHeight = this.container.outerHeight();
        this.bgWidth = this.bg.outerWidth();
        this.windowHeight = this.$window.height();
        this._frameRate = Math.round(1000 / this.options.fps);
        this.mouseInside = !1;
        if (!('ontouchstart' in window) || !('DeviceOrientationEvent' in window)) {
            this.container.mouseenter(function (e) {
                that.mouseInside = !0;
                var offset = that.container.offset(),
                    coord = (e.pageX - offset.left) / that.containerWidth;
                that.cancel();
                that._hoverAnimation = !0;
                that._hoverFrom = that.now;
                that._hoverTo = coord;
                that.start(that._hoverTo)
            }).mousemove(function (e) {
                if (!that.mouseInside) {
                    return
                }
                if (that._lastFrame + that._frameRate > Date.now()) {
                    return
                }
                var offset = that.container.offset(),
                    coord = (e.pageX - offset.left) / that.containerWidth;
                if (that._hoverAnimation) {
                    that._hoverTo = coord;
                    return
                }
                that.set(coord);
                that._lastFrame = Date.now()
            }).mouseleave(function (e) {
                that.mouseInside = !1;
                that.cancel();
                that.start(that.options.basePoint)
            })
        }
        this.$window.resize(function () {
            that.handleResize()
        });
        this._orientationDriven = ('ontouchstart' in window && 'DeviceOrientationEvent' in window);
        if (this._orientationDriven) {
            this._checkIfVisible();
            window.addEventListener("deviceorientation", function (e) {
                if (!that.visible || that._lastFrame + that._frameRate > Date.now()) {
                    return
                }
                that._deviceOrientationChange(e);
                that._lastFrame = Date.now()
            });
            this.$window.resize(function () {
                that._checkIfVisible()
            });
            this.$window.scroll(function () {
                that._checkIfVisible()
            })
        }
        this.set(this.options.basePoint);
        this._lastFrame = Date.now()
    };
    Horparallax.prototype = {
        _deviceOrientationChange: function (e) {
            var gamma = e.gamma,
                beta = e.beta,
                x, y;
            switch (window.orientation) {
                case -90:
                    beta = Math.max(-45, Math.min(45, beta));
                    x = (beta + 45) / 90;
                    break;
                case 90:
                    beta = Math.max(-45, Math.min(45, beta));
                    x = (45 - beta) / 90;
                    break;
                case 180:
                    gamma = Math.max(-45, Math.min(45, gamma));
                    x = (gamma + 45) / 90;
                    break;
                case 0:
                default:
                    if (gamma < -90 || gamma > 90) {
                        gamma = Math.abs(e.gamma) / e.gamma * (180 - Math.abs(e.gamma))
                    }
                    gamma = Math.max(-45, Math.min(45, gamma));
                    x = (45 - gamma) / 90;
                    break
            }
            this.set(x)
        },
        handleResize: function () {
            this.containerWidth = this.container.outerWidth();
            this.containerHeight = this.container.outerHeight();
            this.bgWidth = this.bg.outerWidth();
            this.windowHeight = this.$window.height();
            this.set(this.now)
        },
        _checkIfVisible: function () {
            var scrollTop = this.$window.scrollTop(),
                containerTop = this.container.offset().top;
            this.visible = (containerTop + this.containerHeight > scrollTop && containerTop < scrollTop + this.windowHeight)
        },
        set: function (x) {
            this.bg.css('left', (this.containerWidth - this.bgWidth) * x);
            this.now = x;
            return this
        },
        compute: function (from, to, delta) {
            if (this._hoverAnimation) {
                return (this._hoverTo - this._hoverFrom) * delta + this._hoverFrom
            }
            return (to - from) * delta + from
        },
        start: function (to) {
            var from = this.now,
                that = this;
            this.container.css('delta', 0).animate({
                delta: 1
            }, {
                duration: this.options.duration,
                easing: this.options.easing,
                complete: function () {
                    that._hoverAnimation = !1
                },
                step: function (delta) {
                    that.set(that.compute(from, to, delta))
                },
                queue: !1
            });
            return this
        },
        cancel: function () {
            this._hoverAnimation = !1;
            this.container.stop(!0, !1);
            return this
        }
    };
    if ($.easing.easeOutElastic == undefined) {
        $.easing.easeOutElastic = function (x, t, b, c, d) {
            var s = 1.70158,
                p = 0,
                a = c;
            if (t == 0) {
                return b
            }
            if ((t /= d) == 1) {
                return b + c
            }
            if (!p) {
                p = d * .3
            }
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4
            } else {
                var s = p / (2 * Math.PI) * Math.asin(c / a)
            }
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
        }
    }
    $.fn.horparallax = function (options) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('horparallax');
            if (!data) {
                $this.data('horparallax', (data = new Horparallax(this, options)))
            }
        })
    };
    $.fn.horparallax.defaults = {
        fps: 60,
        basePoint: .5,
        duration: 500,
        bgSelector: '.l-section-img',
        easing: $us.getAnimationName('swing')
    };
    $.fn.horparallax.Constructor = Horparallax;
    $(function () {
        jQuery('.parallax_hor').horparallax()
    })
}(jQuery);
jQuery(function ($) {
    $('.w-gallery.link_file .w-gallery-list').each(function () {
        $us.getScript($us.templateDirectoryUri + '/common/js/vendor/magnific-popup.js', function () {
            $(this).magnificPopup({
                type: 'image',
                delegate: 'a.w-gallery-item',
                gallery: {
                    enabled: !0,
                    navigateByImgClick: !0,
                    preload: [0, 1],
                    tPrev: $us.langOptions.magnificPopup.tPrev,
                    tNext: $us.langOptions.magnificPopup.tNext,
                    tCounter: $us.langOptions.magnificPopup.tCounter
                },
                removalDelay: 300,
                mainClass: 'mfp-fade',
                fixedContentPos: !0
            })
        }.bind(this))
    });
    $('.w-gallery.type_masonry').each(function (index, gallery) {
        $us.getScript($us.templateDirectoryUri + '/common/js/vendor/isotope.js', function () {
            var $container = $('.w-gallery-list', gallery),
                isotopeOptions = {
                    layoutMode: 'masonry',
                    isOriginLeft: !$('body').hasClass('rtl')
                };
            if ($container.parents('.w-tabs-section-content-h').length) {
                isotopeOptions.transitionDuration = 0
            }
            $container.imagesLoaded(function () {
                $container.isotope(isotopeOptions);
                $container.isotope()
            });
            $us.$canvas.on('contentChange', function () {
                $container.imagesLoaded(function () {
                    $container.isotope()
                })
            })
        })
    })
});
(function ($) {
    $.fn.wSlider = function () {
        return this.each(function () {
            $us.getScript($us.templateDirectoryUri + '/common/js/vendor/royalslider.js', function () {
                var $this = $(this),
                    $frame = $this.find('.w-slider-h'),
                    $slider = $this.find('.royalSlider'),
                    $options = $this.find('.w-slider-json'),
                    options = $options[0].onclick() || {};
                if ($this.data('sliderInit') == 1) {
                    return
                }
                $this.data('sliderInit', 1);
                $options.remove();
                if (!$.fn.royalSlider) {
                    return
                }
                if ($this.parent().hasClass('w-post-elm')) {
                    options.imageScaleMode = 'fill'
                }
                options.usePreloader = !1;
                $slider.royalSlider(options);
                var slider = $slider.data('royalSlider');
                if (options.fullscreen && options.fullscreen.enabled) {
                    var rsEnterFullscreen = function () {
                        $slider.appendTo($('body'));
                        slider.ev.off('rsEnterFullscreen', rsEnterFullscreen);
                        slider.ev.on('rsExitFullscreen', rsExitFullscreen);
                        slider.updateSliderSize()
                    };
                    slider.ev.on('rsEnterFullscreen', rsEnterFullscreen);
                    var rsExitFullscreen = function () {
                        $slider.prependTo($frame);
                        slider.ev.off('rsExitFullscreen', rsExitFullscreen);
                        slider.ev.on('rsEnterFullscreen', rsEnterFullscreen)
                    }
                }
                slider.ev.on('rsAfterContentSet', function () {
                    slider.slides.forEach(function (slide) {
                        $(slide.content.find('img')[0]).attr('alt', slide.caption.attr('data-alt'))
                    })
                });
                $us.$canvas.on('contentChange', function () {
                    $slider.parent().imagesLoaded(function () {
                        slider.updateSliderSize()
                    })
                })
            }.bind(this))
        })
    };
    $(function () {
        jQuery('.w-slider').wSlider()
    })
})(jQuery);
! function ($) {
    "use strict";
    $us.WItext = function (container) {
        var defaultOptions = {
            html_nbsp_char: !0
        };
        this.$container = $(container);
        var $parts = this.$container.find('.w-itext-part');
        if ($parts.length === 0) {
            return
        }
        var options = $.extend(defaultOptions, this.$container[0].onclick() || {});
        this.$container.removeAttr('onclick');
        var type = this.$container.usMod('type');
        this.animateChars = (type.substring(type.length - 'chars'.length).toLowerCase() === 'chars');
        this.duration = parseInt(options.duration) || 1000;
        this.delay = parseInt(options.delay) || 5000;
        this.dynamicColor = (options.dynamicColor || '');
        this.disablePartAnimation = options.disablePartAnimation || !1;
        this.animateDurations = [];
        this.type = this.animateChars ? type.substring(0, type.length - 'chars'.length) : type;
        this.nbsp_char = options.html_nbsp_char ? '&nbsp;' : ' ';
        this.parts = [];
        $parts.css({
            transitionDuration: this.duration + 'ms'
        }).each(function (index, part) {
            var part = {
                $node: $(part),
                currentState: 0,
                states: part.onclick() || []
            };
            part.$node.removeAttr('onclick');
            if (this.dynamicColor) {
                part.$node.css('color', this.dynamicColor)
            }
            this.parts[index] = part
        }.bind(this));
        var timer = $us.timeout(function () {
            this.parts.map(function (part) {
                this._events.startAnimate.call(this, part)
            }.bind(this));
            $us.clearTimeout(timer)
        }.bind(this), this.delay)
    };
    $us.WItext.prototype = {
        _events: {
            startAnimate: function (part) {
                part.currentState = (part.currentState === part.states.length - 1) ? 0 : (part.currentState + 1);
                this.render.call(this, part)
            },
            restartAnimate: function (part) {
                $us.timeout(this._events.startAnimate.bind(this, part), this.delay)
            },
            clearAnimation: function (part) {
                var text = part.states[part.currentState].replace(' ', this.nbsp_char);
                part.$node.html(text).css('width', '');
                if (this.type === 'typing' && $.trim(text) && text !== this.nbsp_char) {
                    part.$node.append('<i class="w-itext-cursor"></i>')
                }
                if (part.curDuration === Math.max.apply(null, this.animateDurations)) {
                    this.animateDurations = [];
                    this.parts.map(function (_part) {
                        this._events.restartAnimate.call(this, _part)
                    }.bind(this))
                }
            }
        },
        render: function (part) {
            var nextValue = part.states[part.currentState],
                $curSpan = part.$node.wrapInner('<span></span>').children('span'),
                $nextSpan = $('<span class="measure"></span>').html(nextValue.replace(' ', this.nbsp_char)).appendTo(part.$node),
                nextWidth = $nextSpan.width(),
                outType = 'fadeOut',
                startDelay = 0;
            part.curDuration = this.duration;
            if (this.type === 'typing') {
                var oldValue = $.trim($curSpan.text()) + ' ',
                    removeDuration = Math.floor(part.curDuration / 3);
                startDelay = Math.max.apply(null, [startDelay, (removeDuration * oldValue.length)]);
                for (var i = 0; i < oldValue.length; i++) {
                    $curSpan.text(oldValue);
                    $us.timeout(function () {
                        var text = $curSpan.text();
                        $curSpan.text(text.substring(0, text.length - 1))
                    }.bind(this), removeDuration * i)
                }
            }
            $us.timeout(function () {
                part.$node.addClass('notransition');
                if (!this.disablePartAnimation) {
                    part.$node.css('width', part.$node.width())
                }
                $us.timeout(function () {
                    part.$node.removeClass('notransition');
                    if (!this.disablePartAnimation) {
                        part.$node.css('width', nextWidth)
                    }
                }.bind(this), 25);
                if (this.type !== 'typing') {
                    $curSpan.css({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: !this.disablePartAnimation ? nextWidth : '',
                        transitionDuration: (this.duration / 5) + 'ms'
                    }).addClass('animated_' + outType)
                }
                if (!this.disablePartAnimation) {
                    $nextSpan.css('width', nextWidth)
                }
                $nextSpan.removeClass('measure').prependTo(part.$node);
                if (this.animateChars) {
                    $nextSpan.empty();
                    if (this.type === 'typing') {
                        $nextSpan.append('<span class="w-itext-part-nospan"></span>')
                    }
                    for (var i = 0; i < nextValue.length; i++) {
                        var $char = ((nextValue[i] !== ' ') ? nextValue[i] : this.nbsp_char);
                        if (this.type !== 'typing') {
                            $char = $('<span>' + $char + '</span>');
                            $char.css('transition-duration', part.curDuration + 'ms').appendTo($nextSpan);
                            $char.appendTo($nextSpan)
                        }
                        $us.timeout(function ($char) {
                            if (this.type !== 'typing') {
                                $char.addClass('animated_' + this.type)
                            } else {
                                var $text = $('> span:first', $nextSpan);
                                $text.html($text.html() + $char)
                            }
                        }.bind(this, $char), part.curDuration * i)
                    }
                    if (this.type === 'typing' && $.trim(nextValue) && nextValue !== this.nbsp_char) {
                        $nextSpan.append('<i class="w-itext-cursor"></i>')
                    }
                    part.curDuration *= (nextValue.length + 1)
                } else {
                    $nextSpan.wrapInner('<span></span>').children('span').css({
                        'animation-duration': this.duration + 'ms'
                    }).addClass('animated_' + this.type)
                }
                this.animateDurations.push(part.curDuration);
                $us.timeout(this._events.clearAnimation.bind(this, part), part.curDuration + Math.floor(this.delay / 3))
            }.bind(this), startDelay)
        }
    };
    $.fn.wItext = function (options) {
        return this.each(function () {
            $(this).data('wItext', new $us.WItext(this, options))
        })
    };
    $(function () {
        $('.w-itext').wItext()
    })
}(jQuery);
! function ($) {
    "use strict";
    $us.WLogin = function (container, options) {
        this.init(container, options)
    };
    $us.WLogin.prototype = {
        init: function (container, options) {
            this.$container = $(container);
            if (this.$container.data('loginInit') == 1) {
                return
            }
            this.$container.data('loginInit', 1);
            this.$submitBtn = this.$container.find('.w-btn');
            this.$username = this.$container.find('.for_text input[type="text"]');
            this.$password = this.$container.find('.for_password input[type="password"]');
            this.$preloader = this.$container.siblings('.g-preloader');
            this.$nonceVal = this.$container.find('#us_login_nonce').val();
            this.$resultField = this.$container.find('.w-form-message');
            this.$jsonContainer = this.$container.find('.w-form-json');
            this.jsonData = this.$jsonContainer[0].onclick() || {};
            this.$jsonContainer.remove();
            this.ajaxUrl = this.jsonData.ajaxurl || '';
            this.loginRedirect = this.jsonData.login_redirect || '';
            this.logoutRedirect = this.jsonData.logout_redirect || window.location.href;
            this.use_ajax = !!this.jsonData.use_ajax;
            this._events = {
                formSubmit: this.formSubmit.bind(this)
            };
            this.$container.on('submit', this._events.formSubmit);
            if (this.use_ajax) {
                $.ajax({
                    type: 'post',
                    url: this.ajaxUrl,
                    data: {
                        action: 'us_ajax_user_info',
                        logout_redirect: this.logoutRedirect
                    },
                    success: function (result) {
                        if (result.success) {
                            this.$container.closest('.w-login').html(result.data)
                        } else {
                            this.$container.removeClass('hidden')
                        }
                        this.$preloader.addClass('hidden')
                    }.bind(this)
                })
            }
        },
        formSubmit: function (event) {
            event.preventDefault();
            if (this.$submitBtn.hasClass('loading')) {
                return
            }
            this.$resultField.usMod('type', !1).html('');
            this.$container.find('.w-form-row.check_wrong').removeClass('check_wrong');
            this.$container.find('.w-form-state').html('');
            if (this.$container.find('.for_text input[type="text"]').val() == '') {
                this.$username.closest('.w-form-row').toggleClass('check_wrong');
                return
            }
            this.$submitBtn.addClass('loading');
            $.ajax({
                type: 'post',
                url: this.ajaxUrl,
                dataType: 'json',
                data: {
                    action: 'us_ajax_login',
                    username: this.$username.val(),
                    password: this.$password.val(),
                    us_login_nonce: this.$nonceVal
                },
                success: function (result) {
                    if (result.success) {
                        document.location.href = this.loginRedirect
                    } else {
                        if (result.data.code == 'invalid_username') {
                            var $rowLog = this.$username.closest('.w-form-row');
                            $rowLog.toggleClass('check_wrong');
                            $rowLog.find('.w-form-row-state').html(result.data.message ? result.data.message : '')
                        } else if (result.data.code == 'incorrect_password' || result.data.code == 'empty_password') {
                            var $rowPwd = this.$password.closest('.w-form-row');
                            $rowPwd.toggleClass('check_wrong');
                            $rowPwd.find('.w-form-row-state').html(result.data.message ? result.data.message : '')
                        } else {
                            this.$resultField.usMod('type', 'error').html(result.data.message)
                        }
                        this.$submitBtn.removeClass('loading')
                    }
                }.bind(this),
            })
        }
    };
    $.fn.wUsLogin = function (options) {
        return this.each(function () {
            $(this).data('wUsLogin', new $us.WLogin(this, options))
        })
    };
    $(function () {
        $('.w-login > .w-form').wUsLogin()
    })
}(jQuery);
! function ($) {
    $us.Nav = function (container, options) {
        this.init(container, options)
    };
    $us.mobileNavOpened = 0;
    $us.Nav.prototype = {
        init: function (container, options) {
            this.$nav = $(container);
            if (this.$nav.length == 0) {
                return
            }
            this.$control = this.$nav.find('.w-nav-control');
            this.$close = this.$nav.find('.w-nav-close');
            this.$items = this.$nav.find('.menu-item');
            this.$list = this.$nav.find('.w-nav-list.level_1');
            this.$subItems = this.$list.find('.menu-item-has-children');
            this.$subAnchors = this.$list.find('.menu-item-has-children > .w-nav-anchor');
            this.$subLists = this.$list.find('.menu-item-has-children > .w-nav-list');
            this.$anchors = this.$nav.find('.w-nav-anchor');
            this.$arrows = $('.w-nav-arrow');
            this.options = this.$nav.find('.w-nav-options:first')[0].onclick() || {};
            if (this.$nav.length == 0) {
                return
            }
            this.type = this.$nav.usMod('type');
            this.layout = this.$nav.usMod('layout');
            this.mobileOpened = !1;
            if ($.isMobile && this.type == 'desktop') {
                this.$list.on('click', '.w-nav-anchor[class*="level_"]', function (e) {
                    var $target = $(e.currentTarget),
                        $item = $target.closest('.menu-item');
                    if ($target.usMod('level') > 1 && !$item.hasClass('menu-item-has-children')) {
                        $target.parents('.menu-item.opened').removeClass('opened')
                    }
                })
            }
            this.$control.on('click', function () {
                this.mobileOpened = !this.mobileOpened;
                this.setTabIndex(!0);
                this.$anchors.each(function () {
                    if ($(this).attr('href') == undefined) {
                        $(this).attr('href', 'javascript:void(0)')
                    }
                });
                if (this.layout != 'dropdown') {
                    this.$anchors.removeAttr('tabindex')
                }
                if (this.mobileOpened) {
                    $('.l-header .w-nav').not(container).each(function () {
                        $(this).trigger('USNavClose')
                    });
                    this.$control.addClass('active');
                    this.$items.filter('.opened').removeClass('opened');
                    this.$subLists.resetInlineCSS('display', 'height');
                    if (this.layout == 'dropdown') {
                        this.$list.slideDownCSS(250, this._events.contentChanged)
                    }
                    $us.mobileNavOpened++
                } else {
                    this.$control.removeClass('active');
                    if (this.layout == 'dropdown') {
                        this.$list.slideUpCSS(250, this._events.contentChanged)
                    }
                    this.setTabIndex();
                    if (this.layout != 'dropdown') {
                        this.$anchors.attr('tabindex', -1)
                    }
                    $us.mobileNavOpened--
                }
                $us.$canvas.trigger('contentChange')
            }.bind(this));
            this.$control.on('focusin', function (e) {
                if (this.type != 'mobile' || this.layout == 'dropdown') {
                    return
                }
                this.$anchors.attr('tabindex', -1)
            }.bind(this));
            this.$close.on('click', function () {
                this.mobileOpened = !1;
                this.$control.removeClass('active');
                $us.mobileNavOpened--;
                $us.$canvas.trigger('contentChange')
            }.bind(this));
            $us.$document.keyup(function (e) {
                if (e.keyCode == 27) {
                    if (this.mobileOpened) {
                        if (this.layout == 'dropdown') {
                            this.$list.slideUpCSS(250, this._events.contentChanged)
                        }
                        this.mobileOpened = !1;
                        this.$control.removeClass('active');
                        this.setTabIndex();
                        if (this.layout != 'dropdown') {
                            this.$anchors.attr('tabindex', -1)
                        }
                        $us.mobileNavOpened--;
                        $us.$canvas.trigger('contentChange')
                    }
                }
            }.bind(this));
            this._events = {
                menuToggler: function ($item, show) {
                    if (this.type != 'mobile') {
                        return
                    }
                    var $sublist = $item.children('.w-nav-list');
                    if (show) {
                        $item.addClass('opened');
                        $sublist.slideDownCSS(250, this._events.contentChanged)
                    } else {
                        $item.removeClass('opened');
                        $sublist.slideUpCSS(250, this._events.contentChanged)
                    }
                }.bind(this),
                focusHandler: function (e) {
                    if (this.type == 'mobile') {
                        return
                    }
                    var $item = $(e.target).closest('.menu-item'),
                        $target = $(e.target);
                    $item.parents('.menu-item').addClass('opened');
                    $item.on('mouseleave', function () {
                        $target.blur()
                    })
                }.bind(this),
                blurHandler: function (e) {
                    if (this.type == 'mobile') {
                        return
                    }
                    var $item = $(e.target).closest('.menu-item');
                    $item.parents('.menu-item').removeClass('opened')
                }.bind(this),
                clickHandler: function (e) {
                    if (this.type != 'mobile') {
                        return
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    var $item = $(e.currentTarget).closest('.menu-item'),
                        isOpened = $item.hasClass('opened');
                    this._events.menuToggler($item, !isOpened)
                }.bind(this),
                keyDownHandler: function (e) {
                    if (this.type != 'mobile') {
                        return
                    }
                    var keyCode = e.keyCode || e.which;
                    if (keyCode == 13) {
                        var $target = $(e.target),
                            $item = $target.closest('.menu-item'),
                            isOpened = $item.hasClass('opened');
                        if (!$target.is(this.$arrows)) {
                            return
                        }
                        e.stopPropagation();
                        e.preventDefault();
                        this._events.menuToggler($item, !isOpened)
                    }
                    if (keyCode == 9) {
                        var $target = $(e.target) ? $(e.target) : {},
                            i = this.$anchors.index($target),
                            isDropdownLayout = this.layout == 'dropdown' ? !0 : !1,
                            closeMenu = function () {
                                if (this.mobileOpened) {
                                    if (isDropdownLayout) {
                                        this.$list.slideUpCSS(250, this._events.contentChanged)
                                    }
                                    this.mobileOpened = !1;
                                    this.$control.removeClass('active');
                                    $us.mobileNavOpened--;
                                    $us.$canvas.trigger('contentChange');
                                    this.setTabIndex();
                                    if (this.layout != 'dropdown') {
                                        this.$anchors.attr('tabindex', -1)
                                    }
                                }
                            }.bind(this);
                        if (e.shiftKey) {
                            if ((i === this.$anchors.length - 1) && this.layout != 'dropdown') {
                                this.$anchors.attr('tabindex', -1)
                            }
                            if (i === 0) {
                                closeMenu()
                            }
                        } else {
                            if (i === this.$anchors.length - 1) {
                                closeMenu()
                            }
                        }
                    }
                }.bind(this),
                resize: this.resize.bind(this),
                contentChanged: function () {
                    if (this.type == 'mobile' && $us.header.isHorizontal() && $us.canvas.headerPos == 'fixed' && this.layout == 'fixed') {
                        this.setFixedMobileMaxHeight()
                    }
                    $us.header.$container.trigger('contentChange')
                }.bind(this),
                close: function () {
                    if (this.$list != undefined && jQuery.fn.slideUpCSS != undefined && this.mobileOpened && this.type == 'mobile') {
                        this.mobileOpened = !1;
                        if (this.layout == 'dropdown' && this.headerOrientation == 'hor') {
                            this.$list.slideUpCSS(250)
                        }
                        $us.mobileNavOpened--;
                        $us.$canvas.trigger('contentChange')
                    }
                }.bind(this)
            };
            this.$subItems.each(function (index) {
                var $item = $(this.$subItems[index]),
                    $arrow = $item.find('.w-nav-arrow').first(),
                    $subAnchor = $item.find('.w-nav-anchor').first(),
                    dropByLabel = $item.hasClass('mobile-drop-by_label') || $item.parents('.menu-item').hasClass('mobile-drop-by_label'),
                    dropByArrow = $item.hasClass('mobile-drop-by_arrow') || $item.parents('.menu-item').hasClass('mobile-drop-by_arrow');
                if (dropByLabel || (this.options.mobileBehavior && !dropByArrow)) {
                    $subAnchor.on('click', this._events.clickHandler)
                } else if (dropByArrow || (!this.options.mobileBehavior && !dropByLabel)) {
                    $arrow.on('click', this._events.clickHandler);
                    $arrow.on('click', this._events.keyDownHandler)
                }
            }.bind(this));
            this.$subItems.each(function () {
                var $this = $(this),
                    $parentItem = $this.parent().closest('.menu-item');
                if ($parentItem.length == 0 || $parentItem.usMod('columns') === !1) {
                    $this.addClass('togglable')
                }
            });
            if (!$us.$html.hasClass('no-touch')) {
                this.$list.find('.menu-item-has-children.togglable > .w-nav-anchor').on('click', function (e) {
                    if (this.type == 'mobile') {
                        return
                    }
                    e.preventDefault();
                    var $this = $(e.currentTarget),
                        $item = $this.parent();
                    if ($item.hasClass('opened')) {
                        return location.assign($this.attr('href'))
                    }
                    $item.addClass('opened');
                    var outsideClickEvent = function (e) {
                        if ($.contains($item[0], e.target)) {
                            return
                        }
                        $item.removeClass('opened');
                        $us.$body.off('touchstart', outsideClickEvent)
                    };
                    $us.$body.on('touchstart', outsideClickEvent)
                }.bind(this))
            }
            $($us.$document).on('mouseup touchend', function (e) {
                if (this.mobileOpened && this.type == 'mobile') {
                    if (!this.$control.is(e.target) && this.$control.has(e.target).length === 0 && !this.$list.is(e.target) && this.$list.has(e.target).length === 0) {
                        this.mobileOpened = !1;
                        this.$control.removeClass('active');
                        this.$items.filter('.opened').removeClass('opened');
                        this.$subLists.slideUpCSS(250);
                        if (this.layout == 'dropdown' && this.headerOrientation == 'hor') {
                            this.$list.slideUpCSS(250)
                        }
                        $us.mobileNavOpened--;
                        $us.$canvas.trigger('contentChange')
                    }
                }
            }.bind(this));
            this.$anchors.on('focus.upsolution', this._events.focusHandler);
            this.$anchors.on('blur.upsolution', this._events.blurHandler);
            this.$nav.on('keydown.upsolution', this._events.keyDownHandler);
            this.$anchors.on('click', function (e) {
                var $item = $(e.currentTarget).closest('.menu-item'),
                    dropByLabel = $item.hasClass('mobile-drop-by_label') || $item.parents('.menu-item').hasClass('mobile-drop-by_label'),
                    dropByArrow = $item.hasClass('mobile-drop-by_arrow') || $item.parents('.menu-item').hasClass('mobile-drop-by_arrow');
                if (this.type != 'mobile' || $us.header.isVertical()) {
                    return
                }
                if (dropByLabel || (this.options.mobileBehavior && $item.hasClass('menu-item-has-children') && !dropByArrow)) {
                    return
                }
                this.mobileOpened = !1;
                this.$control.removeClass('active');
                if (this.layout == 'dropdown') {
                    this.$list.slideUpCSS(250)
                }
                $us.mobileNavOpened--;
                $us.$canvas.trigger('contentChange')
            }.bind(this));
            $us.$window.on('resize', $us.debounce(this._events.resize, 5));
            $us.timeout(function () {
                this.resize();
                $us.header.$container.trigger('contentChange')
            }.bind(this), 50);
            this.$nav.on('USNavClose', this._events.close)
        },
        setTabIndex: function (add) {
            this.$subItems.each(function (index) {
                var $item = $(this.$subItems[index]);
                if ($item.hasClass('mobile-drop-by_arrow') || $item.parents('.menu-item').hasClass('mobile-drop-by_arrow') || (!$item.hasClass('mobile-drop-by_label') && !this.options.mobileBehavior)) {
                    if (add) {
                        $item.find('.w-nav-arrow').attr('tabindex', 0)
                    } else {
                        $item.find('.w-nav-arrow').removeAttr('tabindex')
                    }
                }
            }.bind(this))
        },
        setFixedMobileMaxHeight: function () {
            this.$list.css('max-height', $us.canvas.winHeight - $us.header.getCurrentHeight() + 'px')
        },
        resize: function () {
            if (this.$nav.length == 0) {
                return
            }
            var nextType = (window.innerWidth < this.options.mobileWidth) ? 'mobile' : 'desktop';
            if ($us.header.orientation != this.headerOrientation || nextType != this.type) {
                this.$subLists.resetInlineCSS('display', 'height');
                if (this.headerOrientation == 'hor' && this.type == 'mobile') {
                    this.$list.resetInlineCSS('display', 'height', 'max-height', 'opacity')
                }
                this.$items.removeClass('opened');
                this.headerOrientation = $us.header.orientation;
                this.type = nextType;
                this.$nav.usMod('type', nextType);
                this.setTabIndex();
                if (this.layout != 'dropdown') {
                    this.$anchors.removeAttr('tabindex')
                }
            }
            if ($us.header.isHorizontal() && this.type == 'mobile' && this.layout == 'dropdown' && $us.header.isFixed()) {
                this.setFixedMobileMaxHeight()
            }
            this.$list.removeClass('hide_for_mobiles')
        }
    };
    $.fn.usNav = function (options) {
        return this.each(function () {
            $(this).data('usNav', new $us.Nav(this, options))
        })
    };
    $('.l-header .w-nav').usNav()
}(jQuery);
(function ($) {
    "use strict";
    $.fn.usMessage = function () {
        return this.each(function () {
            var $this = $(this),
                $closer = $this.find('.w-message-close');
            $closer.click(function () {
                $this.wrap('<div></div>');
                var $wrapper = $this.parent();
                $wrapper.css({
                    overflow: 'hidden',
                    height: $this.outerHeight(!0)
                });
                $wrapper.performCSSTransition({
                    height: 0
                }, 300, function () {
                    $wrapper.remove();
                    $us.$canvas.trigger('contentChange')
                }, 'cubic-bezier(.4,0,.2,1)')
            })
        })
    };
    $(function () {
        $('.w-message').usMessage()
    })
})(jQuery);
! function ($) {
    "use strict";
    $us.WLmaps = function (container, options) {
        this.init(container, options)
    };
    $us.WLmaps.prototype = {
        init: function (container, options) {
            this.$container = $(container);
            this.mapId = this.$container.attr('id');
            var $jsonContainer = this.$container.find('.w-map-json'),
                jsonOptions = $jsonContainer[0].onclick() || {},
                defaults = {};
            $jsonContainer.remove();
            this.options = $.extend({}, defaults, jsonOptions, options);
            this._events = {
                redraw: this.redraw.bind(this),
            };
            $us.$canvas.on('contentChange', this._events.redraw);
            this.beforeRender()
        },
        beforeRender: function () {
            var matches = this.options.address.match(/^(\d+.\d+)\s?,?\s?(\d+.\d+)$/);
            if (matches) {
                this.center = [matches[1], matches[2]];
                this.renderMap()
            } else {
                this.geocoder(this.options.address)
            }
        },
        redraw: function () {
            if (!this.lmap || this.$container.is(':hidden')) {
                return
            }
            this.lmap.invalidateSize(!0)
        },
        geocoder: function (request, markerOptions, popup) {
            var endPoint = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=",
                that = this;
            $.getJSON(endPoint + encodeURI(request), function (json) {}).done(function (json) {
                if (!json.length) {
                    return
                }
                var bBox = json[0].boundingbox;
                if (!markerOptions) {
                    that.center = [bBox[1], bBox[3]];
                    that.renderMap()
                } else {
                    that.marker = L.marker([bBox[1], bBox[3]], markerOptions).addTo(that.lmap);
                    if (popup) {
                        that.marker.bindPopup(popup)
                    }
                }
            })
        },
        renderMap: function () {
            var lmapsOptions = {
                center: this.center,
                zoom: this.options.zoom,
            };
            if (this.options.hideControls) {
                lmapsOptions.zoomControl = !1
            }
            if (this.options.disableZoom) {
                lmapsOptions.scrollWheelZoom = !1
            }
            this.lmap = L.map(this.mapId, lmapsOptions);
            L.tileLayer(this.options.style, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.lmap);
            this.renderMarkers();
            if (this.options.disableDragging && (!$us.$html.hasClass('no-touch'))) {
                this.lmap.dragging.disable()
            }
        },
        renderMarkers: function () {
            if (this.options.markers.length) {
                var mainOptions = {};
                for (var i = 0; i < this.options.markers.length; i++) {
                    if (i == 0) {
                        if (this.options.icon != null) {
                            var mainMarkerSizes = this.options.icon.size[0],
                                markerImg = L.icon({
                                    iconUrl: this.options.icon.url,
                                    iconSize: mainMarkerSizes,
                                });
                            markerImg.options.iconAnchor = [mainMarkerSizes / 2, mainMarkerSizes];
                            markerImg.options.popupAnchor = [0, -mainMarkerSizes];
                            mainOptions.icon = markerImg
                        }
                        var marker = L.marker(this.center, mainOptions).addTo(this.lmap);
                        if (this.options.markers[i].html) {
                            if (this.options.markers[i].infowindow) {
                                marker.bindPopup(this.options.markers[i].html).openPopup()
                            } else {
                                marker.bindPopup(this.options.markers[i].html)
                            }
                        }
                    } else {
                        var markerOptions = {};
                        if (this.options.markers[i].marker_img != null) {
                            var markerSizes = this.options.markers[i].marker_size[0],
                                markerImg = L.icon({
                                    iconUrl: this.options.markers[i].marker_img[0],
                                    iconSize: markerSizes,
                                });
                            markerImg.options.iconAnchor = [markerSizes / 2, markerSizes];
                            markerImg.options.popupAnchor = [0, -markerSizes];
                            markerOptions.icon = markerImg
                        } else {
                            markerOptions = mainOptions
                        }
                        var matches = this.options.markers[i].address.match(/^(-?\d+.\d+)\s?,?\s?(-?\d+.\d+)$/);
                        if (matches) {
                            this.marker = L.marker([matches[1], matches[2]], markerOptions).addTo(this.lmap);
                            if (this.options.markers[i].html) {
                                this.marker.bindPopup(this.options.markers[i].html)
                            }
                        } else {
                            this.geocoder(this.options.markers[i].address, markerOptions, this.options.markers[i].html)
                        }
                    }
                }
            }
        }
    };
    $.fn.WLmaps = function (options) {
        return this.each(function () {
            $(this).data('wLmaps', new $us.WLmaps(this, options))
        })
    };
    $(function () {
        var $wLmap = $('.w-map.provider_osm');
        if ($wLmap.length) {
            $us.getScript($us.templateDirectoryUri + '/common/js/vendor/leaflet.js', function () {
                $wLmap.WLmaps()
            })
        }
    })
}(jQuery);
(function ($, undefined) {
    "use strict";
    $us.PageScroller = function (container, options) {
        this.init(container, options)
    };
    $us.PageScroller.prototype = {
        init: function (container, options) {
            var defaults = {
                coolDown: 100,
                animationDuration: 1000,
                animationEasing: $us.getAnimationName('easeInOutExpo'),
                endAnimationEasing: $us.getAnimationName('easeOutExpo')
            };
            this.options = $.extend({}, defaults, options);
            this.$container = $(container);
            this._canvasTopOffset = $us.$canvas.offset().top;
            this.activeSection = 0;
            this.sections = [];
            this.initialSections = [];
            this.hiddenSections = [];
            this.currHidden = [];
            this.dots = [];
            this.scrolls = [];
            this.usingDots = !1;
            this.footerReveal = $us.$body.hasClass('footer_reveal');
            this.isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
            this.disableWidth = (this.$container.data('disablewidth') !== undefined) ? this.$container.data('disablewidth') : 768;
            this.hiddenClasses = {
                'uvc_hidden-xs': [0, 479],
                'uvc_hidden-xsl': [480, 767],
                'uvc_hidden-sm': [768, 991],
                'uvc_hidden-md': [992, 1199],
                'uvc_hidden-ml': [1200, 1823],
                'uvc_hidden-lg': [1824, 99999],
                'vc_hidden-xs': [0, 767],
                'vc_hidden-sm': [768, 991],
                'vc_hidden-md': [992, 1199],
                'vc_hidden-lg': [1200, 99999]
            };
            if (this.$container.data('speed') !== undefined) {
                this.options.animationDuration = this.$container.data('speed')
            }
            this._attachEvents();
            this._events = {
                scroll: this.scroll.bind(this),
                resize: this.resize.bind(this)
            };
            $us.$canvas.on('contentChange', $us.debounce(this._events.resize, 5));
            $us.$window.on('resize', function (e, stop) {
                if (stop !== undefined) {
                    $us.debounce(this._events.resize, 5)
                }
            }.bind(this));
            $us.$window.on('scroll', $us.debounce(this._events.scroll, 5));
            $us.timeout(this._init.bind(this), 100);
            this.headerHeight = 0;
            $us.header.on('transitionEnd', function (header) {
                this.headerHeight = header.getCurrentHeight() - header.getAdminBarHeight()
            }.bind(this))
        },
        is_popup: function () {
            return $us.$html.hasClass('usoverlay_fixed')
        },
        _init: function () {
            if ($us.canvas.headerPos === 'static' && $us.header.isHorizontal() && !$us.header.isTransparent()) {
                $us.canvas.$header.each(function () {
                    var $section = $us.canvas.$header,
                        section = {
                            $section: $section,
                            area: 'header',
                        };
                    this._countPosition(section);
                    this.sections.push(section);
                    this.initialSections.push(section)
                }.bind(this))
            }
            $us.$canvas.find('> *:not(.l-header) .l-section').each(function (key, elm) {
                if ($('.l-section', elm).length) {
                    return
                }
                var $section = $(elm),
                    section = {
                        $section: $section,
                        hiddenBoundaries: [],
                        area: 'content',
                        isSticky: $section.hasClass('type_sticky')
                    },
                    addedWidths = [];
                hidden: for (var i in this.hiddenClasses) {
                    if (this.hiddenClasses.hasOwnProperty(i)) {
                        var low = this.hiddenClasses[i][0],
                            high = this.hiddenClasses[i][1];
                        if ($section.hasClass(i)) {
                            var addedWidthLength = addedWidths.length,
                                j;
                            addedWidths.push([low, high]);
                            for (j = 0; j < addedWidthLength; j++) {
                                if (addedWidths[j][0] === low && addedWidths[j][1] === high) {
                                    break hidden
                                }
                            }
                            section.hiddenBoundaries.push([low, high]);
                            if (this.hiddenSections.indexOf(key) === -1) {
                                this.hiddenSections.push(key)
                            }
                        }
                    }
                }
                this._countPosition(section, key);
                this.sections.push(section);
                this.initialSections.push(section)
            }.bind(this));
            this.lastContentSectionIndex = this.sections.length - 1;
            $('.l-footer > .l-section').each(function (key, elm) {
                var $section = $(elm),
                    section = {
                        $section: $section,
                        area: 'footer',
                        isSticky: $section.hasClass('type_sticky')
                    };
                this._countPosition(section, key);
                this.sections.push(section);
                this.initialSections.push(section)
            }.bind(this));
            this.$dotsContainer = this.$container.find('.w-scroller-dots');
            if (this.$dotsContainer.length) {
                this.usingDots = !0;
                this.$firstDot = this.$dotsContainer.find('.w-scroller-dot').first();
                this.redrawDots(!0);
                this.scroll()
            }
        },
        isSectionHidden: function (section) {
            if (!this.initialSections[section].hiddenBoundaries || !this.initialSections[section].hiddenBoundaries.length) {
                return !1
            }
            var currWidth = window.innerWidth,
                isHidden = !1;
            for (var i = 0; i < this.initialSections[section].hiddenBoundaries.length; i++) {
                var low = this.initialSections[section].hiddenBoundaries[i][0],
                    high = this.initialSections[section].hiddenBoundaries[i][1];
                if (currWidth >= low && currWidth <= high) {
                    isHidden = !0;
                    break
                }
            }
            return isHidden
        },
        redrawDots: function (inited) {
            if (!this.$dotsContainer.length || !this.usingDots) {
                return !1
            }
            this.$dotsContainer.html('');
            for (var i = 0; i < this.sections.length; i++) {
                if (this.sections[i].area === 'footer' && !this.$container.data('footer-dots')) {
                    continue
                }
                this.$firstDot.clone().appendTo(this.$dotsContainer)
            }
            this.$dots = this.$dotsContainer.find('.w-scroller-dot');
            this.$dots.each(function (key, elm) {
                var $dot = $(elm);
                this.dots[key] = $dot;
                $dot.click(function () {
                    this.scrollTo(key);
                    this.$dots.removeClass('active');
                    $dot.addClass('active')
                }.bind(this)).toggleClass('hidden', this.sections[key].isSticky && $us.$window.width() > $us.canvas.options.columnsStackingWidth)
            }.bind(this));
            if (!!inited) {
                this.dots[this.activeSection].addClass('active')
            }
            this.$dotsContainer.addClass('show')
        },
        recountSections: function () {
            if (this.currHidden) {
                for (var initialSection in this.initialSections) {
                    this.sections[initialSection] = this.initialSections[initialSection]
                }
            }
            for (var i = this.hiddenSections.length - 1; i >= 0; i--) {
                var indexOfTheItem = this.currHidden.indexOf(this.hiddenSections[i]);
                if (this.isSectionHidden(this.hiddenSections[i])) {
                    if (indexOfTheItem === -1) {
                        this.currHidden.push(this.hiddenSections[i])
                    }
                    this.sections.splice(this.hiddenSections[i], 1)
                } else {
                    this.currHidden.splice(indexOfTheItem, 1)
                }
            }
            this.redrawDots()
        },
        getScrollSpeed: function (number) {
            var sum = 0,
                lastElements = this.scrolls.slice(Math.max(this.scrolls.length - number, 1));
            for (var i = 0; i < lastElements.length; i++) {
                sum = sum + lastElements[i]
            }
            return Math.ceil(sum / number)
        },
        _attachEvents: function () {
            var that = this;

            function mouseWheelHandler(e) {
                if (that.is_popup()) {
                    return
                }
                e.preventDefault();
                var currentTime = new Date().getTime(),
                    target = that.activeSection,
                    direction = e.wheelDelta || -e.detail,
                    speedEnd, speedMiddle, isAccelerating;
                if (that.scrolls.length > 149) {
                    that.scrolls.shift()
                }
                that.scrolls.push(Math.abs(direction));
                if ((currentTime - that.previousMouseWheelTime) > that.options.coolDown) {
                    that.scrolls = []
                }
                that.previousMouseWheelTime = currentTime;
                speedEnd = that.getScrollSpeed(10);
                speedMiddle = that.getScrollSpeed(70);
                isAccelerating = speedEnd >= speedMiddle;
                if (isAccelerating) {
                    if (direction < 0) {
                        target++
                    } else if (direction > 0) {
                        target--
                    }
                    if (that.sections[target] === undefined) {
                        return
                    }
                    that.scrollTo(target);
                    that.lastScroll = currentTime
                }
            }
            $us.$document.off('mousewheel DOMMouseScroll MozMousePixelScroll');
            document.removeEventListener('mousewheel', mouseWheelHandler);
            document.removeEventListener('DOMMouseScroll', mouseWheelHandler);
            document.removeEventListener('MozMousePixelScroll', mouseWheelHandler);
            $us.$canvas.off('touchstart touchmove');
            if ($us.$window.width() > this.disableWidth && $us.mobileNavOpened <= 0 && (!$us.$html.hasClass('cloverlay_fixed'))) {
                document.addEventListener('mousewheel', mouseWheelHandler, {
                    passive: !1
                });
                document.addEventListener('DOMMouseScroll', mouseWheelHandler, {
                    passive: !1
                });
                document.addEventListener('MozMousePixelScroll', mouseWheelHandler, {
                    passive: !1
                });
                if ($.isMobile || this.isTouch) {
                    $us.$canvas.on('touchstart', function (event) {
                        var e = event.originalEvent;
                        if (typeof e.pointerType === 'undefined' || e.pointerType !== 'mouse') {
                            this.touchStartY = e.touches[0].pageY
                        }
                    }.bind(this));
                    $us.$canvas.on('touchmove', function (event) {
                        event.preventDefault();
                        var currentTime = new Date().getTime(),
                            e = event.originalEvent,
                            target = this.activeSection;
                        this.touchEndY = e.touches[0].pageY;
                        if (Math.abs(this.touchStartY - this.touchEndY) > ($us.$window.height() / 50)) {
                            if (this.touchStartY > this.touchEndY) {
                                target++
                            } else if (this.touchEndY > this.touchStartY) {
                                target--
                            }
                            if (this.sections[target] === undefined) {
                                return
                            }
                            this.scrollTo(target);
                            this.lastScroll = currentTime
                        }
                    }.bind(this))
                }
            }
        },
        _countPosition: function (section, key) {
            section.top = section.$section.offset().top - this._canvasTopOffset;
            if (this.footerReveal && section.area === 'footer' && key !== undefined) {
                if (window.innerWidth > parseInt($us.canvasOptions.columnsStackingWidth) - 1) {
                    if (this.sections[key - 1] !== undefined && this.sections[key - 1].area === 'footer') {
                        section.top = this.sections[key - 1].bottom
                    } else {
                        var rowIndex = (this.sections[this.lastContentSectionIndex + key] !== undefined) ? this.lastContentSectionIndex + key : key - 1;
                        section.top = this.sections[rowIndex].bottom
                    }
                }
            }
            section.bottom = section.top + section.$section.outerHeight(!1)
        },
        _countAllPositions: function () {
            var counter = 0;
            for (var section in this.sections) {
                if (this.sections[section].$section.length) {
                    this._countPosition(this.sections[section], counter)
                }
                counter++
            }
        },
        scrollTo: function (target) {
            var currentTime = new Date().getTime();
            if (this.previousScrollTime !== undefined && (currentTime - this.previousScrollTime < this.options.animationDuration)) {
                return
            }
            this.previousScrollTime = currentTime;
            if (this.sections[target].isSticky && $us.$window.width() > $us.canvas.options.columnsStackingWidth) {
                if (target > this.activeSection) {
                    target += 1
                } else {
                    target -= 1
                }
            }
            if (this.usingDots) {
                this.$dots.removeClass('active');
                if (this.dots[target] !== undefined) {
                    this.dots[target].addClass('active')
                }
            }
            var top = parseInt(this.sections[target].top || 0);
            if (top === $us.header.getScrollTop()) {
                return
            }
            var animateOptions = {
                duration: this.options.animationDuration,
                easing: this.options.animationEasing,
                start: function () {
                    this.isScrolling = !0
                }.bind(this),
                always: function () {
                    this.isScrolling = !1;
                    this.activeSection = target
                }.bind(this),
                step: function (now, fx) {
                    var newTop = top;
                    if ($us.header.isStickyEnabled()) {
                        newTop -= this.headerHeight
                    }
                    if (fx.end !== newTop) {
                        $us.$htmlBody.stop(!0, !1).animate({
                            scrollTop: newTop
                        }, $.extend(animateOptions, {
                            easing: this.options.endAnimationEasing
                        }))
                    }
                }.bind(this)
            };
            $us.$htmlBody.stop(!0, !1).animate({
                scrollTop: top
            }, animateOptions)
        },
        resize: function (e) {
            if (this.is_popup()) {
                return !1
            }
            this._attachEvents();
            this.recountSections();
            $us.timeout(this._countAllPositions.bind(this), 150)
        },
        scroll: function () {
            if (this.is_popup()) {
                return !1
            }
            var currentTime = new Date().getTime();
            if ((currentTime - this.lastScroll) < (this.options.coolDown + this.options.animationDuration)) {
                return
            }
            $us.debounce(function () {
                var scrollTop = parseInt($us.$window.scrollTop() || 0);
                if ($us.header.isSticky()) {
                    scrollTop += $us.header.getCurrentHeight()
                }
                for (var index in this.sections) {
                    var section = this.sections[index];
                    if (scrollTop >= parseInt(section.top - 1) && scrollTop < parseInt(section.bottom - 1) && section.area === 'content' && this.activeSection !== index) {
                        this.activeSection = index
                    }
                }
                if (this.usingDots) {
                    this.$dots.removeClass('active');
                    if (this.dots[this.activeSection] !== undefined) {
                        this.dots[this.activeSection].addClass('active')
                    }
                }
            }.bind(this), 500)()
        }
    };
    $.fn.usPageScroller = function (options) {
        return this.each(function () {
            $(this).data('usPageScroller', new $us.PageScroller(this, options))
        })
    };
    $(function () {
        $us.timeout(function () {
            $('.w-scroller').usPageScroller()
        }, 0)
    })
})(jQuery);
! function ($) {
    "use strict";
    if ($('.l-preloader').length) {
        $('document').ready(function () {
            $us.timeout(function () {
                $('.l-preloader').addClass('done')
            }, 500);
            $us.timeout(function () {
                $('.l-preloader').addClass('hidden')
            }, 1000)
        })
    }
}(jQuery);
! function ($) {
    "use strict";
    $us.WPopup = function (container) {
        this.$container = $(container);
        this._events = {
            show: this.show.bind(this),
            afterShow: this.afterShow.bind(this),
            hide: this.hide.bind(this),
            preventHide: function (e) {
                e.stopPropagation()
            },
            afterHide: this.afterHide.bind(this),
            keyup: function (e) {
                if (e.key == "Escape") {
                    this.hide()
                }
            }.bind(this),
            scroll: function () {
                $us.$document.trigger('scroll')
            }
        };
        this.transitionEndEvent = (navigator.userAgent.search(/webkit/i) > 0) ? 'webkitTransitionEnd' : 'transitionend';
        this.isFixed = !jQuery.isMobile;
        this.$trigger = this.$container.find('.w-popup-trigger');
        this.triggerType = this.$trigger.usMod('type');
        if (this.triggerType == 'load') {
            var delay = this.$trigger.data('delay') || 2;
            $us.timeout(this.show.bind(this), delay * 1000)
        } else if (this.triggerType == 'selector') {
            var selector = this.$trigger.data('selector');
            if (selector) {
                $us.$body.on('click', selector, this._events.show)
            }
        } else {
            this.$trigger.on('click', this._events.show)
        }
        this.$wrap = this.$container.find('.w-popup-wrap').usMod('pos', this.isFixed ? 'fixed' : 'absolute').on('click', this._events.hide);
        this.$box = this.$container.find('.w-popup-box');
        this.$overlay = this.$container.find('.w-popup-overlay').usMod('pos', this.isFixed ? 'fixed' : 'absolute').on('click', this._events.hide);
        this.$container.find('.w-popup-closer').on('click', this._events.hide);
        this.$box.on('click', this._events.preventHide);
        this.$media = $('video,audio', this.$box);
        this.timer = null
    };
    $us.WPopup.prototype = {
        _hasScrollbar: function () {
            return document.documentElement.scrollHeight > document.documentElement.clientHeight
        },
        _getScrollbarSize: function () {
            if ($us.scrollbarSize === undefined) {
                var scrollDiv = document.createElement('div');
                scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
                document.body.appendChild(scrollDiv);
                $us.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                document.body.removeChild(scrollDiv)
            }
            return $us.scrollbarSize
        },
        show: function () {
            clearTimeout(this.timer);
            this.$overlay.appendTo($us.$body).show();
            this.$wrap.appendTo($us.$body).css('display', 'flex');
            if (this.isFixed) {
                $us.$html.addClass('usoverlay_fixed');
                this.windowHasScrollbar = this._hasScrollbar();
                if (this.windowHasScrollbar && this._getScrollbarSize()) {
                    $us.$html.css('margin-right', this._getScrollbarSize())
                }
            } else {
                this.$overlay.css({
                    height: $us.$document.height()
                });
                this.$wrap.css('top', $us.$window.scrollTop())
            }
            $us.$body.on('keyup', this._events.keyup);
            this.$wrap.on('scroll', this._events.scroll);
            this.timer = setTimeout(this._events.afterShow, 25)
        },
        afterShow: function () {
            clearTimeout(this.timer);
            this.$overlay.addClass('active');
            this.$box.addClass('active');
            if (window.$us !== undefined && $us.$canvas !== undefined) {
                $us.$canvas.trigger('contentChange')
            }
            $us.$window.trigger('resize').trigger('us.wpopup.afterShow', this)
        },
        hide: function () {
            clearTimeout(this.timer);
            $us.$body.off('keyup', this._events.keyup);
            this.$box.on(this.transitionEndEvent, this._events.afterHide);
            this.$overlay.removeClass('active');
            this.$box.removeClass('active');
            this.$wrap.off('scroll', this._events.scroll);
            this.timer = setTimeout(this._events.afterHide, 1000)
        },
        afterHide: function () {
            clearTimeout(this.timer);
            this.$box.off(this.transitionEndEvent, this._events.afterHide);
            this.$overlay.appendTo(this.$container).hide();
            this.$wrap.appendTo(this.$container).hide();
            if (this.isFixed) {
                $us.$html.removeClass('usoverlay_fixed');
                if (this.windowHasScrollbar) {
                    $us.$html.css('margin-right', '')
                }
                $us.$window.trigger('resize', !0).trigger('us.wpopup.afterHide', this)
            }
            if (this.$media.length) {
                this.$media.trigger('pause')
            }
        },
    };
    $.fn.wPopup = function (options) {
        return this.each(function () {
            $(this).data('wPopup', new $us.WPopup(this, options))
        })
    };
    $(function () {
        $('.w-popup').wPopup()
    })
}(jQuery);
(function ($, undefined) {
    "use strict";
    $us.WProgbar = function (container, options) {
        this.$container = $(container);
        this.$bar = $('.w-progbar-bar-h', this.$container);
        this.$count = $('.w-progbar-title-count, .w-progbar-bar-count', this.$container);
        this.$title = $('.w-progbar-title', this.$container);
        this.options = {
            delay: 100,
            duration: 800,
            finalValue: 100,
            offset: '10%',
            startValue: 0,
            value: 50
        };
        if (this.$container.is('[onclick]')) {
            $.extend(this.options, this.$container[0].onclick() || {});
            this.$container.removeAttr('onclick')
        }
        $.extend(this.options, options || {});
        if (/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)) {
            this.$container.removeClass('initial')
        }
        this.$count.text('');
        $us.waypoints.add(this.$container, this.options.offset, this.init.bind(this))
    };
    $.extend($us.WProgbar.prototype, {
        init: function () {
            if (this.running) {
                return
            }
            this.running = !0;
            if (this.$container.hasClass('initial')) {
                this.$container.removeClass('initial')
            }
            var loops = Math.ceil(this.options.duration / this.options.delay),
                increment = parseFloat(this.options.value) / loops,
                loopCount = 0,
                handle = null,
                startValue = 0;
            var funLoop = function () {
                startValue += increment;
                loopCount++;
                if (handle) {
                    $us.clearTimeout(handle)
                }
                if (loopCount >= loops) {
                    var result = this.options.template;
                    if (this.options.hasOwnProperty('showFinalValue')) {
                        result += ' ' + this.options.showFinalValue
                    }
                    this.$count.text(result);
                    return
                }
                this.render.call(this, startValue);
                handle = $us.timeout(funLoop.bind(this), this.options.delay)
            };
            funLoop.call(this);
            var finalValue = parseFloat(this.options.finalValue),
                width = ((parseFloat(parseFloat(this.options.value)) / parseFloat(finalValue)) * 100).toFixed(0);
            this.$bar.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', this._events.transitionEnd.bind(this)).css({
                width: width + '%',
                transitionDuration: parseInt(this.options.duration) + 'ms'
            })
        },
        _events: {
            transitionEnd: function () {
                var result = this.options.template;
                if (this.options.hasOwnProperty('showFinalValue')) {
                    result += ' ' + this.options.showFinalValue
                }
                this.$count.text(result);
                this.running = !1
            }
        },
        render: function (value) {
            var index = 0,
                result = ('' + this.options.template).replace(/([\-\d\.])/g, function (match) {
                    value += '';
                    if (index === 0 && match === '0') {
                        if (value.charAt(index + 1) === '.' || match === '.') {
                            index++
                        }
                        return match
                    }
                    return value.charAt(index++) || ''
                }.bind(this));
            if (result.charAt(index - 1) === '.') {
                result = result.substr(0, index - 1) + result.substr(index)
            }
            if (this.options.hasOwnProperty('showFinalValue')) {
                result += ' ' + this.options.showFinalValue
            }
            this.$count.text(result)
        }
    });
    $.fn.wProgbar = function (options) {
        this.each(function () {
            $(this).data('wProgbar', new $us.WProgbar(this, options))
        })
    };
    $(function () {
        jQuery('.w-progbar').wProgbar()
    })
})(jQuery);
! function ($) {
    "use strict";
    $.fn.wSearch = function () {
        return this.each(function () {
            var $container = $(this),
                $form = $container.find('.w-search-form'),
                $btnOpen = $container.find('.w-search-open'),
                $btnClose = $container.find('.w-search-close'),
                $input = $form.find('[name="s"]'),
                $overlay = $container.find('.w-search-background'),
                $window = $(window),
                searchOverlayInitRadius = 25,
                isFullScreen = $container.hasClass('layout_fullscreen'),
                isWithRipple = $container.hasClass('with_ripple'),
                searchHide = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $container.removeClass('active');
                    $input.blur();
                    if (isWithRipple && isFullScreen) {
                        $form.css({
                            transition: 'opacity 0.4s'
                        });
                        $us.timeout(function () {
                            $overlay.removeClass('overlay-on').addClass('overlay-out').css({
                                'transform': 'scale(0.1)'
                            });
                            $form.css('opacity', 0);
                            $us.debounce(function () {
                                $form.css('display', 'none');
                                $overlay.css('display', 'none')
                            }, 600)()
                        }, 25)
                    }
                },
                searchShow = function () {
                    $container.addClass('active');
                    if (isWithRipple && isFullScreen) {
                        var searchPos = $btnOpen.offset(),
                            searchWidth = $btnOpen.width(),
                            searchHeight = $btnOpen.height();
                        searchPos.top -= $window.scrollTop();
                        searchPos.left -= $window.scrollLeft();
                        var overlayX = searchPos.left + searchWidth / 2,
                            overlayY = searchPos.top + searchHeight / 2,
                            winWidth = $us.canvas.winWidth,
                            winHeight = $us.canvas.winHeight,
                            overlayRadius = Math.sqrt(Math.pow(Math.max(winWidth - overlayX, overlayX), 2) + Math.pow(Math.max(winHeight - overlayY, overlayY), 2)),
                            overlayScale = (overlayRadius + 15) / searchOverlayInitRadius;
                        $overlay.css({
                            width: searchOverlayInitRadius * 2,
                            height: searchOverlayInitRadius * 2,
                            left: overlayX,
                            top: overlayY,
                            "margin-left": -searchOverlayInitRadius,
                            "margin-top": -searchOverlayInitRadius
                        });
                        $overlay.removeClass('overlay-out').show();
                        $form.css({
                            opacity: 0,
                            display: 'block',
                            transition: 'opacity 0.4s 0.3s'
                        });
                        $us.timeout(function () {
                            $overlay.addClass('overlay-on').css({
                                "transform": "scale(" + overlayScale + ")"
                            });
                            $form.css('opacity', 1)
                        }, 25);
                        $input.trigger('focus')
                    } else {
                        $input.trigger('focus')
                    }
                };
            $btnOpen.on('click', searchShow);
            $btnClose.on('click touchstart', searchHide);
            $input.keyup(function (e) {
                if (e.keyCode === 27) {
                    searchHide(e)
                }
            })
        })
    };
    $(function () {
        jQuery('.l-header .w-search').wSearch()
    })
}(jQuery);
! function ($) {
    "use strict";

    function WShare(selector) {
        var $this = $(selector),
            $parent = $this.parent(),
            first_image_src, opt = {
                url: window.location,
                text: document.title,
                lang: document.documentElement.lang,
                image: $('meta[name="og:image"]').attr('content') || ''
            };
        if (window.selectedText) {
            opt.text = window.selectedText
        }
        if ($parent.attr('data-sharing-url') !== undefined && $parent.attr('data-sharing-url') !== '') {
            opt.url = $parent.attr('data-sharing-url')
        }
        if ($parent.attr('data-sharing-image') !== undefined && $parent.attr('data-sharing-image') !== '') {
            opt.image = $parent.attr('data-sharing-image')
        }
        if (opt.image === '' || opt.image === undefined) {
            first_image_src = $('img').first().attr('src');
            if (first_image_src !== undefined && first_image_src !== '') {
                opt.image = first_image_src
            }
        }
        if ($this.hasClass('facebook')) {
            window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(opt.url) + "&quote=" + encodeURIComponent(opt.text) + "", "facebook", "toolbar=0, status=0, width=900, height=500")
        } else if ($this.hasClass('twitter')) {
            window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(opt.text) + "&url=" + encodeURIComponent(opt.url), "twitter", "toolbar=0, status=0, width=650, height=360")
        } else if ($this.hasClass('linkedin')) {
            window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(opt.url), 'linkedin', 'toolbar=no,width=550,height=550')
        } else if ($this.hasClass('whatsapp')) {
            if (jQuery.isMobile) {
                window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(opt.text + ' ' + opt.url), "whatsapp", "toolbar=0, status=0, width=900, height=500")
            } else {
                window.open("https://web.whatsapp.com/send?text=" + encodeURIComponent(opt.text + ' ' + opt.url), "whatsapp", "toolbar=0, status=0, width=900, height=500")
            }
        } else if ($this.hasClass('xing')) {
            window.open("https://www.xing.com/spi/shares/new?url=" + encodeURIComponent(opt.url), "xing", "toolbar=no, status=0, width=900, height=500")
        } else if ($this.hasClass('reddit')) {
            window.open("https://www.reddit.com/submit?url=" + encodeURIComponent(opt.url) + "&title=" + encodeURIComponent(opt.text), "reddit", "toolbar=no, status=0, width=900, height=500")
        } else if ($this.hasClass('pinterest')) {
            window.open('https://www.pinterest.com/pin/create/button/?url=' + encodeURIComponent(opt.url) + '&media=' + encodeURIComponent(opt.image) + '&description=' + encodeURIComponent(opt.text), 'pinterest', 'toolbar=no,width=700,height=300')
        } else if ($this.hasClass('vk')) {
            window.open('https://vk.com/share.php?url=' + encodeURIComponent(opt.url) + '&title=' + encodeURIComponent(opt.text) + '&description=&image=' + encodeURIComponent(opt.image), 'vk', 'toolbar=no,width=700,height=300')
        } else if ($this.hasClass('telegram')) {
            window.open('https://t.me/share/url?url=' + encodeURIComponent(opt.url) + '&text=' + encodeURIComponent(opt.text), 'telegram', 'toolbar=no,width=600,height=450')
        } else if ($this.hasClass('email')) {
            window.location = 'mailto:?subject=' + opt.text + '&body=' + encodeURIComponent(opt.url)
        }
    }
    if ($('.w-sharing-tooltip').length) {
        var activeArea = '.l-main';
        if ($('.w-sharing-tooltip').attr('data-sharing-area') === 'post_content') {
            activeArea = '.w-post-elm.post_content'
        }
        $('body').not(activeArea).bind('mouseup', function () {
            var selection;
            if (window.getSelection) {
                selection = window.getSelection()
            } else if (document.selection) {
                selection = document.selection.createRange()
            }
            if (selection.toString() === '') {
                $(".w-sharing-tooltip.active:visible").hide()
            }
        });
        $(activeArea).bind('mouseup', function (e) {
            var selection, tooltip = '',
                url, $copy2clipboard = $('.w-sharing-item.copy2clipboard');
            if (window.getSelection) {
                selection = window.getSelection()
            } else if (document.selection) {
                selection = document.selection.createRange()
            }
            $(".w-sharing-tooltip").each(function () {
                if ($(this).hasClass('active')) {
                    tooltip = this
                }
            });
            if (tooltip === '') {
                $(".w-sharing-tooltip:first").addClass('active');
                $(".w-sharing-tooltip.active").appendTo("body");
                tooltip = ".w-sharing-tooltip.active"
            }
            if (selection.toString() !== '') {
                window.selectedText = selection.toString();
                $(tooltip).css({
                    "display": "inline-block",
                    "left": e.pageX,
                    "top": e.pageY - 50,
                })
            } else {
                window.selectedText = '';
                $(tooltip).hide()
            }
            $copy2clipboard.on('click', function () {
                if ($copy2clipboard.parent().attr('data-sharing-url') !== undefined && $copy2clipboard.parent().attr('data-sharing-url') !== '') {
                    url = $copy2clipboard.parent().attr('data-sharing-url')
                } else {
                    url = window.location
                }
                var el = document.createElement('textarea');
                el.value = window.selectedText + ' ' + url;
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                $(tooltip).hide()
            })
        })
    }
    $('.w-sharing-item').on('click', function () {
        WShare(this);
        $('.w-sharing-tooltip').hide()
    })
}(jQuery);
! function ($) {
    "use strict";
    $us.WTabs = function (container, options) {
        this.init(container, options)
    };
    $us.WTabs.prototype = {
        init: function (container, options) {
            var defaults = {
                duration: 300,
                easing: 'cubic-bezier(.78,.13,.15,.86)'
            };
            this.options = $.extend({}, defaults, options);
            this.isRtl = $('.l-body').hasClass('rtl');
            this.$container = $(container);
            this.$tabsList = this.$container.find('> .w-tabs-list:first');
            this.$tabs = this.$tabsList.find('.w-tabs-item');
            this.$sectionsWrapper = this.$container.find('> .w-tabs-sections:first');
            this.$sectionsHelper = this.$sectionsWrapper.children();
            this.$sections = this.$sectionsHelper.find('> .w-tabs-section');
            this.$headers = this.$sections.children('.w-tabs-section-header');
            this.$contents = this.$sections.children('.w-tabs-section-content');
            this.$line_charts = this.$container.find(".vc_line-chart");
            this.$round_charts = this.$container.find(".vc_round-chart");
            if (this.$container.hasClass('accordion')) {
                this.$tabs = this.$headers
            }
            this.width = 0;
            this.tabWidths = [];
            this.tabHeights = [];
            this.tabTops = [];
            this.tabLefts = [];
            this.isScrolling = !1;
            this.hasScrolling = this.$container.hasClass('has_scrolling') || !1;
            this.isTogglable = (this.$container.usMod('type') === 'togglable');
            this.isStretched = this.$tabsList.hasClass('stretch');
            this.minWidth = 0;
            this.count = this.$tabs.length;
            if (this.count === 0) {
                return
            }
            this.basicLayout = this.$container.hasClass('accordion') ? 'accordion' : (this.$container.usMod('layout') || 'hor');
            this.curLayout = this.basicLayout;
            this.active = [];
            this.activeOnInit = [];
            this.definedActive = [];
            this.isTrendy = this.$container.hasClass('style_trendy');
            if (this.isTrendy) {
                this.$tabsBar = $()
            }
            this.tabs = $.map(this.$tabs.toArray(), $);
            this.sections = $.map(this.$sections.toArray(), $);
            this.headers = $.map(this.$headers.toArray(), $);
            this.contents = $.map(this.$contents.toArray(), $);
            if (!this.sections.length) {
                return
            }
            $.each(this.tabs, function (index) {
                if (this.sections[index].hasClass('content-empty')) {
                    this.tabs[index].hide();
                    this.sections[index].hide()
                }
                if (this.tabs[index].hasClass('active')) {
                    this.active.push(index);
                    this.activeOnInit.push(index)
                }
                if (this.tabs[index].hasClass('defined-active')) {
                    this.definedActive.push(index)
                }
                this.tabs[index].add(this.headers[index]).on('click mouseover', function (e) {
                    var $link = this.tabs[index];
                    if (!$link.is('a')) {
                        $link = $link.find('a')
                    }
                    if (!$link.length || ($link.is('[href]') && $link.attr('href').indexOf('http') === -1)) {
                        e.preventDefault()
                    }
                    if (e.type == 'mouseover' && (this.$container.hasClass('accordion') || !this.$container.hasClass('switch_hover'))) {
                        return
                    }
                    if (this.curLayout === 'accordion' && this.isTogglable) {
                        this.toggleSection(index)
                    } else {
                        if (index != this.active[0]) {
                            this.headerClicked = !0;
                            this.openSection(index)
                        } else if (this.curLayout === 'accordion') {
                            this.contents[index].css('display', 'block').attr('aria-expanded', 'true').slideUp(this.options.duration, this._events.contentChanged);
                            this.tabs[index].removeClass('active');
                            this.sections[index].removeClass('active');
                            this.active[0] = undefined
                        }
                    }
                }.bind(this))
            }.bind(this));
            this._events = {
                resize: this.resize.bind(this),
                hashchange: this.hashchange.bind(this),
                contentChanged: function () {
                    $.each(this.contents, function (_, item) {
                        var $content = $(item);
                        $content.attr('aria-expanded', $content.is(':visible'))
                    })
                    $us.$canvas.trigger('contentChange');
                    this.$line_charts.length && jQuery.fn.vcLineChart && this.$line_charts.vcLineChart({
                        reload: !1
                    });
                    this.$round_charts.length && jQuery.fn.vcRoundChart && this.$round_charts.vcRoundChart({
                        reload: !1
                    })
                }.bind(this),
                wheel: function () {
                    if (this.isScrolling) {
                        $us.$htmlBody.stop(!0, !1)
                    }
                }
            };
            this.switchLayout(this.curLayout);
            $us.$window.on('resize', $us.debounce(this._events.resize, 5)).on('hashchange', this._events.hashchange).on('wheel', $us.debounce(this._events.wheel.bind(this), 5))
            $us.$document.ready(function () {
                this.resize();
                $us.timeout(this._events.resize, 50);
                $us.timeout(function () {
                    if (window.location.hash) {
                        var hash = window.location.hash.substr(1),
                            $linkedSection = this.$sectionsWrapper.find('.w-tabs-section[id="' + hash + '"]');
                        if ($linkedSection.length && (!$linkedSection.hasClass('active'))) {
                            $linkedSection.find('.w-tabs-section-header').trigger('click')
                        }
                    }
                }.bind(this), 150)
            }.bind(this));
            $.each(this.tabs, function (index) {
                if (this.headers.length && this.headers[index].attr('href') != undefined) {
                    var tabHref = this.headers[index].attr('href'),
                        tabHeader = this.headers[index];
                    $('a[href="' + tabHref + '"]', this.$container).on('click', function (e) {
                        e.preventDefault();
                        if ($(this).hasClass('w-tabs-section-header', 'w-tabs-item')) {
                            return
                        }
                        if (!$(tabHeader).parent('.w-tabs-section').hasClass('active')) {
                            tabHeader.trigger('click')
                        }
                    })
                }
            }.bind(this));
            this.$container.addClass('initialized');
            this.headerHeight = 0;
            $us.header.on('transitionEnd', function (header) {
                this.headerHeight = header.getCurrentHeight()
            }.bind(this))
        },
        hashchange: function () {
            if (window.location.hash) {
                var hash = window.location.hash.substr(1),
                    $linkedSection = this.$sectionsWrapper.find('.w-tabs-section[id="' + hash + '"]');
                if ($linkedSection.length && (!$linkedSection.hasClass('active'))) {
                    var $header = $linkedSection.find('.w-tabs-section-header');
                    $header.click()
                }
            }
        },
        switchLayout: function (to) {
            this.cleanUpLayout(this.curLayout);
            this.prepareLayout(to);
            this.curLayout = to
        },
        cleanUpLayout: function (from) {
            if (from === 'hor') {
                this.$sectionsWrapper.clearPreviousTransitions().resetInlineCSS('width', 'height');
                this.$sectionsHelper.clearPreviousTransitions().resetInlineCSS('position', 'width', 'left');
                this.$sections.resetInlineCSS('width', 'display');
                this.$container.removeClass('autoresize')
            } else if (from === 'accordion') {
                this.$container.removeClass('accordion');
                this.$sections.resetInlineCSS('display');
                this.$contents.resetInlineCSS('height', 'padding-top', 'padding-bottom', 'display', 'opacity')
            } else if (from === 'ver') {
                this.$contents.resetInlineCSS('height', 'padding-top', 'padding-bottom', 'display', 'opacity')
            }
            if (this.isTrendy && (from === 'hor' || from === 'ver')) {
                this.$tabsBar.remove()
            }
        },
        prepareLayout: function (to) {
            if (to !== 'accordion' && this.active[0] === undefined) {
                this.active[0] = this.activeOnInit[0];
                if (this.active[0] !== undefined) {
                    this.tabs[this.active[0]].addClass('active');
                    this.sections[this.active[0]].addClass('active')
                }
            }
            if (to === 'hor') {
                this.$container.addClass('autoresize');
                this.$sectionsHelper.css('position', 'absolute')
            } else if (to === 'accordion') {
                this.$container.addClass('accordion');
                this.$contents.hide();
                if (this.curLayout !== 'accordion' && this.active[0] !== undefined && this.active[0] !== this.definedActive[0]) {
                    this.tabs[this.active[0]].removeClass('active');
                    this.sections[this.active[0]].removeClass('active');
                    this.active[0] = this.definedActive[0]
                }
                for (var i = 0; i < this.active.length; i++) {
                    if (this.contents[this.active[i]] !== undefined) {
                        this.tabs[this.active[i]].addClass('active');
                        this.sections[this.active[i]].addClass('active');
                        this.contents[this.active[i]].attr('aria-expanded', 'true').show()
                    }
                }
            } else if (to === 'ver') {
                this.$contents.hide();
                this.contents[this.active[0]].attr('aria-expanded', 'true').show()
            }
            if (this.isTrendy && (to === 'hor' || to === 'ver')) {
                this.$tabsBar = $('<div class="w-tabs-list-bar"></div>').appendTo(this.$tabsList)
            }
        },
        measure: function () {
            if (this.basicLayout === 'ver') {
                this.$tabsList.css('width', 0);
                var minTabWidth = this.$tabsList.outerWidth(!0);
                this.$tabsList.css('width', '');
                this.$container.addClass('measure');
                var minContentWidth = this.$sectionsWrapper.outerWidth(!0);
                this.$container.removeClass('measure');
                var navWidth = this.$container.usMod('navwidth');
                if (navWidth !== 'auto') {
                    minTabWidth = Math.max(minTabWidth, minContentWidth * parseInt(navWidth) / (100 - parseInt(navWidth)))
                }
                var width = (!window.ontouchstart && this.$container.closest('.vc_col-sm-6').parent('.type_boxes').length) ? 480 - (parseInt(this.$container.closest('.vc_col-sm-6').width()) - this.$container.width()) : 480;
                this.minWidth = Math.max(width, minContentWidth + minTabWidth + 1);
                if (this.isTrendy) {
                    this.tabHeights = [];
                    this.tabTops = [];
                    for (var index = 0; index < this.tabs.length; index++) {
                        this.tabHeights.push(this.tabs[index].outerHeight(!0));
                        this.tabTops.push(index ? (this.tabTops[index - 1] + this.tabHeights[index - 1]) : 0)
                    }
                }
            } else {
                if (this.basicLayout === 'hor') {
                    this.$container.addClass('measure');
                    this.minWidth = 0;
                    for (var index = 0; index < this.tabs.length; index++) {
                        this.minWidth += this.tabs[index].outerWidth(!0)
                    }
                    this.$container.removeClass('measure')
                }
                if (this.isTrendy) {
                    this.tabWidths = [];
                    this.tabLefts = [];
                    for (var index = 0; index < this.tabs.length; index++) {
                        this.tabWidths.push(this.tabs[index].outerWidth(!0));
                        this.tabLefts.push(index ? (this.tabLefts[index - 1] + this.tabWidths[index - 1]) : 0)
                    }
                }
            }
        },
        barPosition: function (index) {
            if (this.curLayout === 'hor') {
                var result = {
                    width: this.tabWidths[index]
                };
                result[this.isRtl ? 'right' : 'left'] = this.tabLefts[index];
                return result
            } else if (this.curLayout === 'ver') {
                return {
                    top: this.tabTops[index],
                    height: this.tabHeights[index]
                }
            } else {
                return {}
            }
        },
        openSection: function (index) {
            if (this.sections[index] === undefined) {
                return
            }
            if (this.curLayout === 'hor') {
                this.$container.addClass('autoresize');
                this.$sections.removeClass('active').css('display', 'none');
                this.sections[index].stop(!0, !0).fadeIn(this.options.duration, function () {
                    $(this).addClass('active')
                })
            } else if (this.curLayout === 'accordion') {
                if (this.contents[this.active[0]] !== undefined) {
                    this.contents[this.active[0]].css('display', 'block').attr('aria-expanded', 'true').stop(!0, !1).slideUp(this.options.duration)
                }
                this.contents[index].css('display', 'none').attr('aria-expanded', 'false').stop(!0, !1).slideDown(this.options.duration, function () {
                    this._events.contentChanged.call(this);
                    if (this.basicLayout != 'accordion' && this.curLayout == 'accordion') {
                        this.hasScrolling = !0
                    }
                    if (this.hasScrolling && this.curLayout === 'accordion' && this.headerClicked == !0) {
                        var top = this.headers[index].offset().top;
                        if (!jQuery.isMobile) {
                            top -= $us.$canvas.offset().top || 0
                        }
                        var $prevStickySection = this.$container.closest('.l-section').prevAll('.l-section.type_sticky');
                        if ($prevStickySection.length) {
                            top -= parseInt($prevStickySection.outerHeight(!0))
                        }
                        var animateOptions = {
                            duration: $us.canvasOptions.scrollDuration,
                            easing: $us.getAnimationName('easeInOutExpo'),
                            start: function () {
                                this.isScrolling = !0
                            }.bind(this),
                            always: function () {
                                this.isScrolling = !1
                            }.bind(this),
                            step: function (now, fx) {
                                var newTop = top;
                                if ($us.header.isStickyEnabled()) {
                                    newTop -= this.headerHeight
                                }
                                if (fx.end !== newTop) {
                                    $us.$htmlBody.stop(!0, !1).animate({
                                        scrollTop: newTop
                                    }, $.extend(animateOptions, {
                                        easing: $us.getAnimationName('easeOutExpo')
                                    }))
                                }
                            }.bind(this)
                        };
                        $us.$htmlBody.stop(!0, !1).animate({
                            scrollTop: top
                        }, animateOptions);
                        this.headerClicked = !1
                    }
                }.bind(this));
                this.$sections.removeClass('active');
                this.sections[index].addClass('active')
            } else if (this.curLayout === 'ver') {
                if (this.contents[this.active[0]] !== undefined) {
                    this.contents[this.active[0]].css('display', 'none').attr('aria-expanded', 'false')
                }
                this.contents[index].css('display', 'none').attr('aria-expanded', 'false').stop(!0, !0).fadeIn(this.options.duration, this._events.contentChanged);
                this.$sections.removeClass('active');
                this.sections[index].addClass('active')
            }
            this._events.contentChanged();
            this.$tabs.removeClass('active');
            this.tabs[index].addClass('active');
            this.active[0] = index;
            if (this.isTrendy && (this.curLayout === 'hor' || this.curLayout === 'ver')) {
                this.$tabsBar.performCSSTransition(this.barPosition(index), this.options.duration, null, this.options.easing)
            }
        },
        toggleSection: function (index) {
            var indexPos = $.inArray(index, this.active);
            if (indexPos != -1) {
                this.contents[index].css('display', 'block').attr('aria-expanded', 'true').slideUp(this.options.duration, this._events.contentChanged);
                this.tabs[index].removeClass('active');
                this.sections[index].removeClass('active');
                this.active.splice(indexPos, 1)
            } else {
                this.contents[index].css('display', 'none').attr('aria-expanded', 'false').slideDown(this.options.duration, this._events.contentChanged);
                this.tabs[index].addClass('active');
                this.sections[index].addClass('active');
                this.active.push(index)
            }
        },
        resize: function () {
            this.width = this.$container.innerWidth();
            this.$tabsList.removeClass('hidden');
            if (this.curLayout !== 'accordion' && !this.width && this.$container.closest('.w-nav').length && !jQuery.isMobile) {
                return
            }
            var nextLayout = (this.width < this.minWidth) ? 'accordion' : this.basicLayout;
            if (nextLayout !== this.curLayout) {
                this.switchLayout(nextLayout)
            }
            if (this.curLayout !== 'accordion') {
                this.measure()
            }
            if (this.curLayout === 'hor') {
                this.$container.addClass('autoresize');
                this.$sectionsWrapper.css('width', this.width);
                this.$sectionsHelper.css('width', this.count * this.width);
                this.$sections.css('width', this.width);
                if (this.contents[this.active[0]] !== undefined) {
                    this.$sectionsHelper.css('left', -this.width * (this.isRtl ? (this.count - this.active[0] - 1) : this.active[0]));
                    var height = this.sections[this.active[0]].height();
                    this.$sectionsWrapper.css('height', height)
                }
            }
            this._events.contentChanged();
            if (this.isTrendy && (this.curLayout === 'hor' || this.curLayout === 'ver')) {
                this.$tabsBar.css(this.barPosition(this.active[0]), this.options.duration, null, this.options.easing)
            }
        }
    };
    $.fn.wTabs = function (options) {
        return this.each(function () {
            $(this).data('wTabs', new $us.WTabs(this, options))
        })
    };
    jQuery('.w-tabs').wTabs()
}(jQuery);
jQuery(function ($) {
    $('.w-tabs .rev_slider').each(function () {
        var $slider = $(this);
        $slider.bind("revolution.slide.onloaded", function (e) {
            $us.$canvas.on('contentChange', function () {
                $slider.revredraw()
            })
        })
    })
});
(function ($, undefined) {
    "use strict";
    $us.wVideo = function (container) {
        this.$container = $(container);
        this.$videoH = $('.w-video-h', this.$container);
        this.$template = $('script[type="us-template/html"]:first', this.$videoH);
        this.template = this.$template.html();
        this.$template.remove();
        if (this.$container.hasClass('with_overlay')) {
            this.$container.one('click', this._events.overlayClick.bind(this))
        }
    };
    $.extend($us.wVideo.prototype, {
        _events: {
            overlayClick: function (e) {
                e.preventDefault();
                this.$container.removeClass('with_overlay').css('background-image', 'none');
                this.$videoH.html(this.template)
            }
        }
    });
    $.fn.wVideo = function (options) {
        return this.each(function () {
            $(this).data('wVideo', new $us.wVideo(this, options))
        })
    };
    $(function () {
        $('.w-video').wVideo()
    })
})(jQuery);
(function ($) {
    var $window = $(window),
        windowHeight = $window.height();
    $.fn.parallax = function (xposParam) {
        this.each(function () {
            var $container = $(this),
                $this = $container.children('.l-section-img'),
                speedFactor, offsetFactor = 0,
                getHeight, topOffset = 0,
                containerHeight = 0,
                containerWidth = 0,
                disableParallax = !1,
                parallaxIsDisabled = !1,
                baseImgHeight = 0,
                baseImgWidth = 0,
                isBgCover = ($this.css('background-size') == 'cover'),
                originalBgPos = $this.css('background-position'),
                curImgHeight = 0,
                reversed = $container.hasClass('parallaxdir_reversed'),
                baseSpeedFactor = reversed ? -0.1 : 0.61,
                xpos, outerHeight = !0;
            if ($this.length == 0) {
                return
            }
            if (xposParam === undefined) {
                xpos = "50%"
            } else {
                xpos = xposParam
            }
            if ($container.hasClass('parallax_xpos_right')) {
                xpos = "100%"
            } else if ($container.hasClass('parallax_xpos_left')) {
                xpos = "0%"
            }
            if (outerHeight) {
                getHeight = function (jqo) {
                    return jqo.outerHeight(!0)
                }
            } else {
                getHeight = function (jqo) {
                    return jqo.height()
                }
            }

            function getBackgroundSize(callback) {
                var img = new Image(),
                    width, height, backgroundSize = ($this.css('background-size') || ' ').split(' '),
                    backgroundWidthAttr = $this.attr('data-img-width'),
                    backgroundHeightAttr = $this.attr('data-img-height');
                if (backgroundWidthAttr != '') {
                    width = parseInt(backgroundWidthAttr)
                }
                if (backgroundHeightAttr != '') {
                    height = parseInt(backgroundHeightAttr)
                }
                if (width !== undefined && height !== undefined) {
                    return callback({
                        width: width,
                        height: height
                    })
                }
                if (/px/.test(backgroundSize[0])) {
                    width = parseInt(backgroundSize[0])
                }
                if (/%/.test(backgroundSize[0])) {
                    width = $this.parent().width() * (parseInt(backgroundSize[0]) / 100)
                }
                if (/px/.test(backgroundSize[1])) {
                    height = parseInt(backgroundSize[1])
                }
                if (/%/.test(backgroundSize[1])) {
                    height = $this.parent().height() * (parseInt(backgroundSize[0]) / 100)
                }
                if (width !== undefined && height !== undefined) {
                    return callback({
                        width: width,
                        height: height
                    })
                }
                img.onload = function () {
                    if (typeof width == 'undefined') {
                        width = this.width
                    }
                    if (typeof height == 'undefined') {
                        height = this.height
                    }
                    callback({
                        width: width,
                        height: height
                    })
                };
                img.src = ($this.css('background-image') || '').replace(/url\(['"]*(.*?)['"]*\)/g, '$1')
            }

            function update() {
                if (disableParallax) {
                    if (!parallaxIsDisabled) {
                        $this.css('backgroundPosition', originalBgPos);
                        $container.usMod('parallax', 'fixed');
                        parallaxIsDisabled = !0
                    }
                    return
                } else {
                    if (parallaxIsDisabled) {
                        $container.usMod('parallax', 'ver');
                        parallaxIsDisabled = !1
                    }
                }
                if (isNaN(speedFactor)) {
                    return
                }
                var pos = $window.scrollTop();
                if ((topOffset + containerHeight < pos) || (pos < topOffset - windowHeight)) {
                    return
                }
                $this.css('backgroundPosition', xpos + " " + (offsetFactor + speedFactor * (topOffset - pos)) + "px")
            }

            function resize() {
                $us.timeout(function () {
                    windowHeight = $window.height();
                    containerHeight = getHeight($this);
                    containerWidth = $this.width();
                    if ($window.width() < $us.canvasOptions.disableEffectsWidth) {
                        disableParallax = !0
                    } else {
                        disableParallax = !1;
                        if (isBgCover) {
                            if (baseImgWidth / baseImgHeight <= containerWidth / containerHeight) {
                                curImgHeight = baseImgHeight * ($this.width() / baseImgWidth);
                                disableParallax = !1
                            } else {
                                disableParallax = !0
                            }
                        }
                    }
                    if (curImgHeight !== 0) {
                        if (baseSpeedFactor >= 0) {
                            speedFactor = Math.min(baseSpeedFactor, curImgHeight / windowHeight);
                            offsetFactor = Math.min(0, .5 * (windowHeight - curImgHeight - speedFactor * (windowHeight - containerHeight)))
                        } else {
                            speedFactor = Math.min(baseSpeedFactor, (windowHeight - containerHeight) / (windowHeight + containerHeight));
                            offsetFactor = Math.max(0, speedFactor * containerHeight)
                        }
                    } else {
                        speedFactor = baseSpeedFactor;
                        offsetFactor = 0
                    }
                    topOffset = $this.offset().top;
                    update()
                }, 10)
            }
            getBackgroundSize(function (sz) {
                curImgHeight = baseImgHeight = sz.height;
                baseImgWidth = sz.width;
                resize()
            });
            $window.bind({
                scroll: update,
                load: resize,
                resize: resize
            });
            resize()
        })
    };
    jQuery('.parallax_ver').parallax('50%')
})(jQuery);
jQuery(function ($) {
    "use strict";
    jQuery('.upb_bg_img, .upb_color, .upb_grad, .upb_content_iframe, .upb_content_video, .upb_no_bg').each(function () {
        var $bg = jQuery(this),
            $prev = $bg.prev();
        if ($prev.length == 0) {
            var $parent = $bg.parent(),
                $parentParent = $parent.parent(),
                $prevParentParent = $parentParent.prev();
            if ($prevParentParent.length) {
                $bg.insertAfter($prevParentParent);
                if ($parent.children().length == 0) {
                    $parentParent.remove()
                }
            }
        }
    });
    $('.g-cols > .ult-item-wrap').each(function (index, elm) {
        var $elm = jQuery(elm);
        $elm.replaceWith($elm.children())
    });
    jQuery('.overlay-show').click(function () {
        window.setTimeout(function () {
            $us.$canvas.trigger('contentChange')
        }, 1000)
    })
});
jQuery(function ($) {
    var $cart = $('.w-cart');
    if ($cart.length == 0) {
        return
    }
    var $quantity = $cart.find('.w-cart-quantity');
    var us_accessibility = function () {
        $cart.find('a').on('focus.upsolution', function () {
            $(this).closest('.w-cart').addClass('opened')
        });
        $cart.find('a').on('blur.upsolution', function () {
            $(this).closest('.w-cart').removeClass('opened')
        })
    };
    us_accessibility();
    var updateCart = function () {
        if ($cart.hasClass('opened')) {
            $cart.removeClass('opened')
        }
        var $mini_cart_amount = $cart.find('.us_mini_cart_amount').first(),
            mini_cart_amount = $mini_cart_amount.text();
        if (mini_cart_amount !== undefined) {
            mini_cart_amount = mini_cart_amount + '';
            mini_cart_amount = mini_cart_amount.match(/\d+/g);
            if (mini_cart_amount > 0) {
                $quantity.html(mini_cart_amount);
                $cart.removeClass('empty')
            } else {
                $quantity.html('0');
                $cart.addClass('empty')
            }
        } else {
            var $quantities = $cart.find('.quantity'),
                total = 0;
            $quantities.each(function () {
                var quantity, text = $(this).text() + '',
                    matches = text.match(/\d+/g);
                if (matches) {
                    quantity = parseInt(matches[0], 10);
                    total += quantity
                }
            });
            if (total > 0) {
                $quantity.html(total);
                $cart.removeClass('empty')
            } else {
                $quantity.html('0');
                $cart.addClass('empty')
            }
        }
    };
    updateCart();
    $(document.body).bind('wc_fragments_loaded', function () {
        updateCart();
        us_accessibility()
    });
    $(document.body).bind('wc_fragments_refreshed', function () {
        updateCart();
        us_accessibility()
    });
    var $notification = $cart.find('.w-cart-notification'),
        $productName = $notification.find('.product-name'),
        $cartLink = $cart.find('.w-cart-link'),
        $dropdown = $cart.find('.w-cart-dropdown'),
        $quantity = $cart.find('.w-cart-quantity'),
        productName = $productName.text(),
        showFn = 'fadeInCSS',
        hideFn = 'fadeOutCSS',
        opened = !1;
    $notification.on('click', function () {
        $notification[hideFn]()
    });
    jQuery('body').bind('added_to_cart', function (event, fragments, cart_hash, $button) {
        if (event === undefined) {
            return
        }
        updateCart();
        productName = $button.closest('.product').find('.woocommerce-loop-product__title').text();
        $productName.html(productName);
        $notification.addClass('shown');
        $notification.on('mouseenter', function () {
            $notification.removeClass('shown')
        });
        var newTimerId = setTimeout(function () {
            $notification.removeClass('shown');
            $notification.off('mouseenter')
        }, 3000)
    });
    if ($.isMobile) {
        var outsideClickEvent = function (e) {
            if (jQuery.contains($cart[0], e.target)) {
                return
            }
            $cart.removeClass('opened');
            $us.$body.off('touchstart', outsideClickEvent);
            opened = !1
        };
        $cartLink.on('click', function (e) {
            if (!opened) {
                e.preventDefault();
                $cart.addClass('opened');
                $us.$body.on('touchstart', outsideClickEvent)
            } else {
                $cart.removeClass('opened');
                $us.$body.off('touchstart', outsideClickEvent)
            }
            opened = !opened
        })
    }
})