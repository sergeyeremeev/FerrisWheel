;(function ($, global, document, undefined) {
    'use strict';

    function FerrisWheel(element, options) {

        this.$element = $(element);
        this.options = $.extend({}, options);

        this.setup();
        this.initialize();
    }

    FerrisWheel.prototype.setup = function () {
        var elementWidth;

        elementWidth = this.$element.children().width();
    };

    FerrisWheel.prototype.initialize = function () {

    };

})(window.Zepto || window.jQuery, window, document);