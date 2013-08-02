// jQuery finderSelect: a jQuery plugin that activates selecting elements
// within a parent with Ctrl+Click, Command+Click and Shift+Click.
//
// Copyright 2013 Mike Angell
//
// Please see:
//
// https://github.com/evulse/finderselect
//
// For complete documentation.

(function( $ ) {
    $.fn.finderSelectHighlight = function(cssClass) {
        if(cssClass === undefined) {
            cssClass = 'selected';
        }
        return $(this).addClass(cssClass);
    };

    $.fn.finderSelectUnHighlight = function(cssClass) {
        if(cssClass === undefined) {
            cssClass = 'selected';
        }
        return $(this).removeClass(cssClass);
    };

    $.fn.finderSelectHighlighted = function(cssClass) {
        if(cssClass === undefined) {
            cssClass = 'selected';
        }
        return $(this).hasClass(cssClass);
    };

    $.fn.finderSelectToggleHighlight = function(cssClass) {
        if(cssClass === undefined) {
            cssClass = 'selected';
        }
        return $(this).toggleClass(cssClass);
    };

    $.fn.finderSelectBetween = function(a, b) {
        if(a > b) {
            return $(this).filter(':lt('+a+')').filter(':gt('+b+')');
        } else {
            return $(this).filter(':lt('+b+')').filter(':gt('+a+')');
        }
    };

    $.fn.finderSelectDisableSelection = function() {
        return $(this).css({'-moz-user-select':'-moz-none',
            '-moz-user-select':'none',
            '-o-user-select':'none',
            '-khtml-user-select':'none', /* you could also put this in a class */
            '-webkit-user-select':'none',/* and add the CSS class here instead */
            '-ms-user-select':'none',
            'user-select':'none'
        }).bind('selectstart', function(){ return false; });
    };

    $.fn.finderSelect = function(user) {

        var options = {
            class: 'selected',
            children: 'tr',
            event: 'mousedown',
            cursor: 'pointer'
        };

        $.extend(options, user);

        $(this).finderSelectDisableSelection();

        $(this).find(options.children).css('cursor', options.cursor);

        var parent = $(this);
        parent.data('down', false);

        parent.mousedown(function() {
            parent.data('down', true);
        }).mouseup(function() {
                parent.data('down', false);
            });

        $(this).on('mouseenter', options.children, function(e){
            if (parent.data('down') && (e.ctrlKey || e.metaKey)) {
                $(this).finderSelectToggleHighlight(options.class);
                parent.trigger('finderSelectUpdate');
            }
        });

        $(this).on(options.event, options.children, function(e){
            var selected = $(this);
            var last = parent.data('finderSelectPrimary');
            var shift = parent.data('finderSelectSecondary');
            var siblings = parent.find(options.children);
            var clicked = siblings.index(this);
            var next = siblings.index(siblings.eq(last).nextAll('.'+options.class).first());
            if(!siblings.eq(last).finderSelectHighlighted(options.class)) {
                last = next;
            }


            if (e.shiftKey) {
                if(last == null) { last = 0;}
                if(shift != null) {
                    selected.finderSelectHighlight(options.class);

                    if(last < shift && last < clicked && clicked > shift) {
                        siblings.finderSelectBetween(shift, clicked).finderSelectHighlight(options.class);
                    }
                    if(last < shift && last < clicked && clicked < shift) {
                        siblings.eq(shift).finderSelectUnHighlight(options.class);
                        siblings.finderSelectBetween(shift, clicked).finderSelectUnHighlight(options.class);
                    }
                    if(last < shift && last > clicked && clicked < shift) {
                        siblings.eq(shift).finderSelectUnHighlight(options.class);
                        siblings.finderSelectBetween(shift, last).finderSelectUnHighlight(options.class);
                        siblings.finderSelectBetween(clicked, last).finderSelectHighlight(options.class);
                    }
                    if(last > shift && last < clicked && clicked > shift) {
                        siblings.eq(shift).finderSelectUnHighlight(options.class);
                        siblings.finderSelectBetween(shift, last).finderSelectUnHighlight(options.class);
                        siblings.finderSelectBetween(clicked, last).finderSelectHighlight(options.class);
                    }
                    if(last > shift && last > clicked && clicked > shift) {
                        siblings.eq(shift).finderSelectUnHighlight(options.class);
                        siblings.finderSelectBetween(shift, clicked).finderSelectUnHighlight(options.class);
                    }
                    if(last > shift && last > clicked && clicked < shift) {
                        siblings.finderSelectBetween(shift, clicked).finderSelectHighlight(options.class);
                    }

                    if(last == shift && shift > clicked) {
                        siblings.finderSelectBetween(shift, clicked).finderSelectHighlight(options.class);
                    }

                    if(last == shift && shift < clicked) {
                        siblings.finderSelectBetween(shift, clicked).finderSelectHighlight(options.class);
                    }

                } else {

                    siblings.finderSelectBetween(clicked, last).finderSelectHighlight(options.class);

                    selected.finderSelectHighlight(options.class);
                }
                parent.data('finderSelectPrimary', last);
                parent.data('finderSelectSecondary', clicked);
            } else {
                if (e.ctrlKey || e.metaKey) {
                    if(selected.finderSelectHighlighted(options.class)) {
                        selected.finderSelectUnHighlight(options.class);
                        parent.data('finderSelectPrimary', clicked)
                        parent.data('finderSelectSecondary', null);
                    } else {
                        selected.finderSelectHighlight(options.class);
                        parent.data('finderSelectPrimary', clicked)
                        parent.data('finderSelectSecondary', null);
                    }

                } else {
                    siblings.finderSelectUnHighlight(options.class);
                    selected.finderSelectHighlight(options.class);
                    parent.data('finderSelectPrimary', clicked)
                    parent.data('finderSelectSecondary', null)
                }
            }
            parent.trigger('finderSelectUpdate');
        });
    };
}( jQuery ));
