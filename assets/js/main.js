;(function ($, global, document, undefined) {
    'use strict';

    var extendHelper = function (result) {
        result = result || {};

        for (var i = 0; i < arguments.length; i++) {
            // if (!arguments[i]) {
            //     continue;
            // }

            if (arguments[i]) {
                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        result[key] = arguments[i][key];
                    }
                }
            }
        }

        return result;
    };

    function FerrisWheel(element, options) {

        this.element = element;
        this.options = extendHelper({}, FerrisWheel.defaults, options);

        this._containerWidth = null;
        this._containerHeight = null;
        this._itemWidth = null;
        this._items = [];
        this._controls = {
            dots: [],
            buttons: {},
            arrows: {}
        };

        this.setup();
        this.initialize();
    }

    FerrisWheel.defaults = {
        navigation: true,
        navigationDots: true,

        fixedHeight: false,

        loadingClass: 'ferris-loading',
        readyClass: 'ferris-ready'
    };

    FerrisWheel.prototype.setup = function () {
        var itemsLength, i;

        // cache carousel items length to be used in loop
        itemsLength = this.element.children.length;

        // store carousel items in this._items property
        for (i = 0; i < itemsLength; i++) {
            this._items.push(this.element.children[i]);
        }

        // get carousel items width and store in this._itemWidth property
        this._itemWidth = this._items[0].offsetWidth;
    };

    FerrisWheel.prototype.initialize = function () {

        // add class to target element
        this.element.classList.add('ferris-wheel');

        // wrap carousel items in wrapper div
        this.wrapItems();

        // create carousel controls if navigation is set to true
        if (this.options.navigation) {
            this.createControls();
        }
    };

    FerrisWheel.prototype.wrapItems = function () {

        // create carousel wrapper
        this.mainWrapper = document.createElement('div');
        this.mainWrapper.className = 'ferris-items';

        // wrap all items in created wrapper
        // TODO: add JS helper to substitute wrapAll()
        $(this.element.children).wrapAll(this.mainWrapper);
    };

    FerrisWheel.prototype.createControls = function () {
        var controlsWrapper, dotsHTML;

        // create carousel controls wrapper div
        controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'ferris-controls';

        if (this.options.navigationDots) {
            dotsHTML = this.createControlsDots();

            // append resulting div to controlsWrapper div
            controlsWrapper.appendChild(dotsHTML);
        }

        // append finalized controlsWrapper to target element
        this.element.appendChild(controlsWrapper);
    };

    FerrisWheel.prototype.createControlsDots = function () {
        var dotsControls, dotsLength, singleDot;

        // create dots controls wrapper div
        dotsControls = document.createElement('div');
        dotsControls.className = 'ferris-controls__dots';

        // check how many dots need to be created
        dotsLength = this._items.length;

        // single dot element
        singleDot = document.createElement('span');
        singleDot.className = 'ferris-dot';

        // append dots to dotsControls wrapper div
        while (dotsLength--) {
            dotsControls.appendChild(singleDot.cloneNode(false));
        }

        return dotsControls;
    };

    // jQuery plugin
    $.fn.ferrisWheel = function (options) {
        return this.each(function () {
            if (!$.data(this, 'ferris.wheel')) {
                $.data(this, 'ferris.wheel', new FerrisWheel(this, options));
            }
        });
    };

})(window.jQuery, window, document);

// Initialize our script for testing
;(function ($) {

    $(function () {
        $('.target-element').ferrisWheel();
    });

})(window.jQuery);