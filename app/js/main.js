var jQuery = require('jquery');

;(function ($, global, document, undefined) {
    'use strict';

    var extendHelper = function (result) {
        result = result || {};

        for (var i = 0; i < arguments.length; i++) {
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

        this._container = null;
        this._containerWidth = null;
        this._containerHeight = null;
        this._itemWidth = null;
        this._itemHeight = null;
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

        // store carousel items in this._items property, add class and data attr to each element
        for (i = 0; i < itemsLength; i++) {
            this._items.push(this.element.children[i]);
            this._items[i].classList.add('ferris-item');
            this._items[i].setAttribute('data-ferris-item', i);
        }

        // get carousel items width/height and store in this._itemWidth/this._itemHeight properties
        this._itemWidth = this._items[0].offsetWidth;
        this._itemHeight = this._items[0].offsetHeight;
    };

    FerrisWheel.prototype.initialize = function () {

        // add class to target element
        this.element.classList.add('ferris-wheel');

        // wrap carousel items in wrapper div
        this.wrapItems();

        // set container class based on the number of items and container dimensions
        this.setContainerClass();
        this.setContainerDimensions();

        // create carousel controls if navigation is set to true
        if (this.options.navigation) {
            this.createControls();
        }
    };

    FerrisWheel.prototype.wrapItems = function () {
        var mainWrapper;

        // create carousel wrapper
        mainWrapper = document.createElement('div');
        mainWrapper.className = 'ferris-items';

        // wrap all items in created wrapper
        // TODO: add JS helper to substitute wrapAll()
        $(this.element.children).wrapAll(mainWrapper);
    };

    FerrisWheel.prototype.setContainerClass = function () {
        this._container = this.element.querySelector('.ferris-items');
        this._container.className += ' ferris-items--' + this._items.length;
    };

    FerrisWheel.prototype.setContainerDimensions = function () {

        // set container's height to 1.5 item height
        var containerHeight = Math.round(this._itemHeight * 1.5);

        // * Use paddings for centering to reserve transforms for actual animations

        // set container's padding-top to half the space underneath the primary item
        var containerPaddingTop = Math.round((containerHeight - this._itemHeight) / 3);

        // center main item horizontally with padding-left
        var containerPaddingLeft = Math.round((this._container.offsetWidth - this._itemWidth) / 2);

        this._container.setAttribute('style', 'height: ' + containerHeight + 'px; '
                                           + 'padding-top: ' + containerPaddingTop + 'px; '
                                           + 'padding-left: ' + containerPaddingLeft + 'px; '
        );
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

})(jQuery, window, document);

// Initialize our script for testing
;(function ($) {

    $(function () {
        $('.target-element').ferrisWheel();
    });

})(jQuery);