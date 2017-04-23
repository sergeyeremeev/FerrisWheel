var jQuery = require('jquery');

(function ($, global, document, undefined) {
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
        // this._containerWidth = null;
        // this._containerHeight = null;

        this._items = [];
        this._itemsLength = null;
        this._itemWidth = null;
        this._itemHeight = null;

        this._dotsControls = null;

        this.setup();
        this.initialize();
    }

    FerrisWheel.defaults = {
        navigation: true,
        navigationDots: true,
        navigationButtons: true,
        navigationArrows: true,

        fixedHeight: false,

        cycleDuration: 400,

        loadingClass: 'ferris-loading',
        readyClass: 'ferris-ready'
    };

    FerrisWheel.prototype.setup = function () {
        var i;

        // cache carousel items length to be used in loop
        this._itemsLength = this.element.children.length;

        // store carousel items in this._items property, add class and data attr to each element
        for (i = 0; i < this._itemsLength; i++) {
            this._items.push(this.element.children[i]);
            this._items[i].classList.add('ferris-item');
            this._items[i].setAttribute('data-ferris-item', i.toString());
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
        var controlsWrapper, dotsHTML, buttonsHTML;

        // create carousel controls wrapper div
        controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'ferris_controls';

        if (this.options.navigationButtons) {
            buttonsHTML = this.createControlsButtons();

            // append resulting div to controlsWrapper div
            controlsWrapper.appendChild(buttonsHTML);
        }

        if (this.options.navigationDots) {
            dotsHTML = this.createControlsDots();

            // append resulting div to controlsWrapper div
            controlsWrapper.appendChild(dotsHTML);

            // set active dot class
            this.setDotsClass();
        }

        // append finalized controlsWrapper to target element
        this.element.appendChild(controlsWrapper);
    };

    FerrisWheel.prototype.setDotsClass = function () {
        var activeDot = this.element.getElementsByClassName('ferris-dot--active')[0];
        if (activeDot) {
            activeDot.classList.remove('ferris-dot--active');
        }
        this._dotsControls[this.getCurrent()].className += ' ferris-dot--active';
    };

    FerrisWheel.prototype.createControlsDots = function () {
        var dotsControls, dotsLength, singleDot, i, that;

        // create dots controls wrapper div
        dotsControls = document.createElement('div');
        dotsControls.className = 'ferris-controls__dots';

        // check how many dots need to be created
        dotsLength = this._itemsLength;

        // single dot element
        singleDot = document.createElement('span');
        singleDot.className = 'ferris-dot';

        // append dots to dotsControls wrapper div
        while (dotsLength--) {
            dotsControls.appendChild(singleDot.cloneNode(false));
        }

        // add event listeners to each dot control
        this._dotsControls = dotsControls.getElementsByClassName('ferris-dot');

        that = this;

        for (i = 0; i < this._itemsLength; i++) {
            (function (i) {
                that._dotsControls[i].addEventListener('click', function () {
                    that.goTo(that._items[i]);
                });
            })(i);
        }

        return dotsControls;
    };

    FerrisWheel.prototype.createControlsButtons = function () {
        var buttonsControls, buttonNext, buttonPrev, that;

        // create dots controls wrapper div
        buttonsControls = document.createElement('div');
        buttonsControls.className = 'ferris-controls__buttons';

        // create next and prev buttons
        buttonNext = document.createElement('span');
        buttonNext.className = 'ferris-button ferris-button--next';
        buttonNext.textContent = 'next';

        buttonPrev = document.createElement('span');
        buttonPrev.className = 'ferris-button ferris-button--prev';
        buttonPrev.textContent = 'prev';

        // add event listeners to buttons
        that = this;

        buttonNext.addEventListener('click', that.goToNext.bind(this));
        buttonPrev.addEventListener('click', that.goToPrev.bind(this));

        // append buttons to buttonsControls wrapper div
        buttonsControls.appendChild(buttonPrev);
        buttonsControls.appendChild(buttonNext);

        return buttonsControls;
    };

    /**
     * @property {string} ferrisItem - data-attribute of individual item representing its position.
     */
    FerrisWheel.prototype.getCurrent = function () {
        return this._items.indexOf(this.element.querySelector('[data-ferris-item="0"]'));
    };

    FerrisWheel.prototype.calculateSteps = function (selected, total) {
        var difference = total - selected;

        return difference <= total / 2 ? difference : total - difference;
    };

    FerrisWheel.prototype.setDirection = function (selected, total) {
        return selected <= total / 2 ? 'anticlockwise' : 'clockwise';
    };

    FerrisWheel.prototype.spinWheel = function (direction) {
        var i, thisItem, currentIndex, newIndex;

        for (i = 0; i < this._itemsLength; i++) {
            thisItem = this._items[i];
            currentIndex = +thisItem.dataset.ferrisItem;

            if (direction === 'clockwise') {
                newIndex = currentIndex === this._itemsLength - 1 ? 0 : currentIndex + 1;
            } else if (direction === 'anticlockwise') {
                newIndex = currentIndex === 0 ? this._itemsLength - 1 : currentIndex - 1;
            }

            thisItem.setAttribute('data-ferris-item', newIndex);
        }
    };

    FerrisWheel.prototype.goTo = function (item) {
        var selected, total, steps, direction, animationSpeed, i;

        selected = +item.dataset.ferrisItem;
        total = this._items.length;

        // calculate number of steps needed and direction of rotation to reach selected item
        steps = this.calculateSteps(selected, total);
        direction = this.setDirection(selected, total);

        // calculate and set duration of each rotation cycle to match the overall timing of the rotation
        animationSpeed = (this.options.cycleDuration / steps / 1000).toFixed(1) + 's';

        for (i = 0; i < this._itemsLength; i++) {
            this._items[i].setAttribute('style', 'transition-duration: ' + animationSpeed);
        }

        for (i = 0; i < steps; i++) {
            this.spinWheel(direction);
        }

        // update current dot control
        this.setDotsClass();
    };

    FerrisWheel.prototype.goToNext = function () {
        var currentItem = this.getCurrent();
        var item = currentItem === this._itemsLength - 1 ?
            this._items[0] :
            this._items[currentItem + 1];

        this.goTo(item);
    };

    FerrisWheel.prototype.goToPrev = function () {
        var currentItem = this.getCurrent();
        var item = currentItem === 0 ?
            this._items[this._itemsLength - 1] :
            this._items[currentItem - 1];

        this.goTo(item);
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
(function ($) {

    $(function () {
        $('.target-element').ferrisWheel();
    });

})(jQuery);