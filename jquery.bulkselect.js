// jQuery Bulk Select: a jQuery plugin that activates selecting elements
// within a parent with Ctrl+Click, Command+Click and Shift+Click.
//
// Copyright 2013 Mike Angell
//
// Please see:
//
// https://github.com/evulse/bulkselect
//
// For complete documentation.

(function( $ ) {
    $.fn.bulk_select_highlight = function(cssClass) {
        if(cssClass === undefined) {
            cssClass = 'selected';
        }
        return $(this).addClass(cssClass);
    };

    $.fn.bulk_select_unhighlight = function(cssClass) {
        if(cssClass === undefined) {
            cssClass = 'selected';
        }
        return $(this).removeClass(cssClass);
    };

    $.fn.bulk_select_highlighted = function(cssClass) {
        if(cssClass === undefined) {
            cssClass = 'selected';
        }
        return $(this).hasClass(cssClass);
    };

    $.fn.bulk_select_between = function(a, b) {
        if(a > b) {
            return $(this).filter(':lt('+a+')').filter(':gt('+b+')');
        } else {
            return $(this).filter(':lt('+b+')').filter(':gt('+a+')');
        }
    };

    $.fn.bulk_select_disable_selection = function() {
        return $(this).css({'-moz-user-select':'-moz-none',
                '-moz-user-select':'none',
                '-o-user-select':'none',
                '-khtml-user-select':'none', /* you could also put this in a class */
                '-webkit-user-select':'none',/* and add the CSS class here instead */
                '-ms-user-select':'none',
                'user-select':'none'
            }).bind('selectstart', function(){ return false; });
    };

    $.fn.bulk_select = function(user) {

        var options = {
            'class': 'selected',
            'children': 'tr',
            'event': 'click',
            'cursor': 'pointer'
        };

        $.extend(options, user);

        $(this).bulk_select_disable_selection();

        $(this).find(options.children).css('cursor', options.cursor);

        return $(this).on(options.event, options.children, function(e){
            var selected = $(this)
            var parent = selected.parent();
            var last = parent.data('bulk_select');
            var siblings = parent.find(options.children);
            var index = siblings.index(this);


                if (e.shiftKey) {
                    if(last != null) {
                        selected.bulk_select_highlight(options.class);
                        siblings.bulk_select_between(index, last).bulk_select_highlight(options.class);
                    } else {
                        selected.bulk_select_highlight(options.class);
                    }
                    parent.data('bulk_select', index);
                } else {
                    if (e.ctrlKey || e.altKey | e.metaKey) {
                        if(selected.bulk_select_highlighted(options.class)) {
                            selected.bulk_select_unhighlight(options.class);
                            parent.data('bulk_select', null)
                        } else {
                            selected.bulk_select_highlight(options.class);
                            parent.data('bulk_select', index)
                        }

                    } else {
                        siblings.bulk_select_unhighlight(options.class);
                        selected.bulk_select_highlight(options.class);
                        parent.data('bulk_select', index)
                    }
                }

        });
    };
}( jQuery ));
