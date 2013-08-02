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
    $.fn.finderSelect = function(user) {

        var options = {
            selectClass: "selected",
            children: false,
            event: "mousedown",
            cursor: "pointer",
            dragEvent: "mouseenter",
            enableClickDrag: true,
            enableShiftClick: true,
            enableCtrlClick: true,
            enableSingleClick: true,
            enableDisableSelection: true,
            totalSelector: false,
            menuSelector: false,
            menuXOffset: 0,
            menuYOffset: 0

        };

        var parent = $(this);

        $.extend(options, user);

        if(options.children === false) {
            options.children = $.fn.finderSelect.detectChildType(parent);
        }

        var children = parent.find(options.children);

        if(options.cursor !== false) {
            $.fn.finderSelect.applyCursor(children, options.cursor);
        }

        if(options.enableDisableSelection) {
            $.fn.finderSelect.disableSelection(parent);
        }

        if(options.enableClickDrag) {
            $.fn.finderSelect.enableClickDrag(parent, options);
        }

        if(options.enableShiftClick || options.enableCtrlClick || options.enableSingleClick) {
            $.fn.finderSelect.enableClick(parent, options);
        }

        if(options.totalSelector) {
            $.fn.finderSelect.totalUpdate(parent, options);
        }

        if(options.menuSelector) {
            $.fn.finderSelect.loadMenu(parent, options);
        }



    };

    $.fn.finderSelect.highlight = function(el, cssClass) {
        if(cssClass === undefined) {
            cssClass = 'selected';
        }
        return el.addClass(cssClass);
    };

    $.fn.finderSelect.unHighlight = function(el,cssClass) {
        if(cssClass === undefined) {
            cssClass = 'selected';
        }
        return el.removeClass(cssClass);
    };

    $.fn.finderSelect.isHighlighted = function(el,cssClass) {
        if(cssClass === undefined) {
            cssClass = 'selected';
        }
        return el.hasClass(cssClass);
    };

    $.fn.finderSelect.toggleHighlight = function(el,cssClass) {
        if(cssClass === undefined) {
            cssClass = 'selected';
        }
        return el.toggleClass(cssClass);
    };

    $.fn.finderSelect.between = function(el,a, b) {
        if(a > b) {
            return el.filter(':lt('+a+')').filter(':gt('+b+')');
        } else {
            return el.filter(':lt('+b+')').filter(':gt('+a+')');
        }
    };

    $.fn.finderSelect.disableSelection = function(el) {
        return el.css({'-moz-user-select':'-moz-none',
            '-moz-user-select':'none',
            '-o-user-select':'none',
            '-khtml-user-select':'none', /* you could also put this in a class */
            '-webkit-user-select':'none',/* and add the CSS class here instead */
            '-ms-user-select':'none',
            'user-select':'none'
        }).bind('selectstart', function(){ return false; });
    };

    $.fn.finderSelect.detectChildType = function(el) {

        return el.children().get(0).tagName;
    };

    $.fn.finderSelect.applyCursor = function(el,cursor) {

        return el.css('cursor', cursor);
    };

    $.fn.finderSelect.enableClickDrag = function(parent,options) {

        $.fn.finderSelect.setMouseDown(parent, false);

        parent.mousedown(function(e) {
            if($.fn.finderSelect.detectLeftMouse(e)) {
                $.fn.finderSelect.setMouseDown(parent, true);
            }
        }).mouseup(function(e) {
                if($.fn.finderSelect.detectLeftMouse(e)) {
                    $.fn.finderSelect.setMouseDown(parent, false);
                }
            });

        parent.on(options.dragEvent, options.children, function(e){
            if ($.fn.finderSelect.getMouseDown(parent) && $.fn.finderSelect.detectCtrl(e)) {
                $.fn.finderSelect.toggleHighlight($(this), options.selectClass);
                $.fn.finderSelect.triggerUpdate(parent);
            }
        });

        return parent;
    };

    $.fn.finderSelect.enableClick = function(parent,options) {

        parent.on(options.event, options.children, function(e){
            if($.fn.finderSelect.detectLeftMouse(e)) {
                var selected = $(this);
                var last = $.fn.finderSelect.getPrimary(parent);
                var shift = $.fn.finderSelect.getSecondary(parent);
                var siblings = parent.find(options.children);
                var clicked = siblings.index(this);
                var next = siblings.index(siblings.eq(last).nextAll('.'+options.selectClass).first());
                if(!$.fn.finderSelect.isHighlighted(siblings.eq(last), options.selectClass)) {
                    last = next;
                }

                if ($.fn.finderSelect.detectShift(e) && options.enableShiftClick) {
                    if(last == null) { last = 0;}
                    if(shift != null) {
                        if((last < shift && last < clicked && clicked < shift) || (last > shift && last > clicked && clicked > shift)) {
                            $.fn.finderSelect.unHighlight($.fn.finderSelect.between(siblings, shift, clicked), options.selectClass);
                        }
                        if((last < shift && last > clicked && clicked < shift) || (last > shift && last < clicked && clicked > shift)) {
                            $.fn.finderSelect.unHighlight($.fn.finderSelect.between(siblings, shift, last), options.selectClass);
                            $.fn.finderSelect.highlight($.fn.finderSelect.between(siblings, clicked, last), options.selectClass);
                        }
                        if((last > shift && last > clicked && clicked < shift) || (last < shift && last < clicked && clicked > shift) || (last == shift)) {
                            $.fn.finderSelect.highlight($.fn.finderSelect.between(siblings, shift, clicked), options.selectClass);
                        } else {
                            $.fn.finderSelect.unHighlight(siblings.eq(shift), options.selectClass);
                        }
                    } else {
                        $.fn.finderSelect.highlight($.fn.finderSelect.between(siblings, clicked, last), options.selectClass);
                    }

                    $.fn.finderSelect.highlight(selected, options.selectClass);
                    $.fn.finderSelect.setPrimary(parent, last);
                    $.fn.finderSelect.setSecondary(parent, clicked);
                } else {
                    if ($.fn.finderSelect.detectCtrl(e) && options.enableCtrlClick) {
                        if($.fn.finderSelect.isHighlighted(selected, options.selectClass)) {
                            $.fn.finderSelect.unHighlight(selected, options.selectClass);
                        } else {
                            $.fn.finderSelect.highlight(selected, options.selectClass);
                        }

                    } else {
                        if(options.enableSingleClick) {
                            $.fn.finderSelect.unHighlight(siblings, options.selectClass);
                            $.fn.finderSelect.highlight(selected, options.selectClass);
                        }
                    }
                    $.fn.finderSelect.setPrimary(parent, clicked);
                    $.fn.finderSelect.setSecondary(parent, null);
                }

                $.fn.finderSelect.triggerUpdate(parent);
            }
        });

        return parent;
    };

    $.fn.finderSelect.getMouseDown = function(el) {
        return el.data('down');
    }

    $.fn.finderSelect.setMouseDown = function(el,bool) {
        return el.data('down', bool);
    }

    $.fn.finderSelect.detectLeftMouse = function(e) {
        return (e.which == 1);
    }

    $.fn.finderSelect.detectShift = function(e) {
        return e.shiftKey;
    }

    $.fn.finderSelect.detectCtrl = function(e) {
        return (e.ctrlKey || e.metaKey);
    }

    $.fn.finderSelect.setPrimary = function(el,value) {
        return el.data('finderSelectPrimary', value);
    }

    $.fn.finderSelect.getPrimary = function(el) {
        return el.data('finderSelectPrimary');
    }

    $.fn.finderSelect.triggerUpdate = function(el) {
        return el.trigger('finderSelectUpdate');
    }

    $.fn.finderSelect.setSecondary = function(el,value) {
        return el.data('finderSelectSecondary', value);
    }

    $.fn.finderSelect.getSecondary = function(el) {
        return el.data('finderSelectSecondary');
    }

    $.fn.finderSelect.totalUpdate = function(el, options) {

        el.on('finderSelectUpdate', function(){
            $(options.totalSelector).html($(this).find(options.children).filter('.'+options.selectClass).length)
        });

        return el;

    };

    $.fn.finderSelect.loadMenu = function(el, options) {

        el.bind("contextmenu",function(e){
            $(options.menuSelector).css({left:(e.pageX+options.menuXOffset),top:(e.pageY+options.menuYOffset)}).show();
            return false;
        });
        el.bind("mousedown",function(e){
            $(options.menuSelector).hide();
        });
        $(options.menuSelector).bind("click",function(e){
            $(this).hide();
        });

        return el;

    };



}( jQuery ));
