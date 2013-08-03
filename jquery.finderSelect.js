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
            enableTouchCtrlDefault: true,
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
            $.fn.finderSelect.disableSelection(parent, options);
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

    $.fn.finderSelect.isTouchDevice = function() {
        return !!('ontouchstart' in window) // works on most browsers
            || !!('onmsgesturechange' in window); // works on ie10
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
        if($.fn.finderSelect.isHighlighted(el, cssClass)) {
            $.fn.finderSelect.unHighlight(el, cssClass);
        } else {
            $.fn.finderSelect.highlight(el, cssClass);
        }

        return el;
    };

    $.fn.finderSelect.between = function(el,a, b) {
        if(a > b) {
            return el.filter(':lt('+a+')').filter(':gt('+b+')');
        } else {
            return el.filter(':lt('+b+')').filter(':gt('+a+')');
        }
    };

    $.fn.finderSelect.disableSelection = function(el, options) {

        var pageBody = $("body")

        pageBody.on('keydown', function(){
            el.on("selectstart", options.children, turnOffSelection);
        });
        pageBody.on('keyup', function(){
            el.off("selectstart", options.children, turnOffSelection);
        });

        function turnOffSelection() {
            return false;
        }
    };

    $.fn.finderSelect.detectChildType = function(el) {

        return el.children().get(0).tagName;
    };

    $.fn.finderSelect.applyCursor = function(el,cursor) {

        return el.css('cursor', cursor);
    };

    $.fn.finderSelect.enableClickDrag = function(parent,options) {

        $.fn.finderSelect.setMouseDown(false);


        $('body').mousedown(function(e) {
            if($.fn.finderSelect.detectLeftMouse(e)) {
                $.fn.finderSelect.setMouseDown(true);
            }
        }).mouseup(function(e) {
                if($.fn.finderSelect.detectLeftMouse(e)) {
                    $.fn.finderSelect.setMouseDown(false);
                }
            });

        parent.on(options.dragEvent, options.children, function(e){
            var siblings = parent.find(options.children);
            var first = $.fn.finderSelect.getPrimary(parent);
            var last = $.fn.finderSelect.getTertiary(parent);
            var clicked = siblings.index(this);
            var selected = $(this);
            if ($.fn.finderSelect.getMouseDown() && $.fn.finderSelect.detectCtrl(e)) {

                $.fn.finderSelect.ctrlSelection(siblings, selected, first, last, clicked, options);
                $.fn.finderSelect.setPrimary(parent, first);
                $.fn.finderSelect.setSecondary(parent, null);
                $.fn.finderSelect.setTertiary(parent, clicked);
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

                    if(options.enableDisableSelection) {
                        $.fn.finderSelect.deleteSelection();
                    }

                    if(last == null) { last = 0;}

                    $.fn.finderSelect.shiftSelection(siblings, selected, last, shift, clicked, options);
                    $.fn.finderSelect.highlight(selected, options.selectClass);
                    $.fn.finderSelect.setPrimary(parent, last);
                    $.fn.finderSelect.setSecondary(parent, clicked);
                } else {
                    if (($.fn.finderSelect.detectCtrl(e) && options.enableCtrlClick) || ($.fn.finderSelect.isTouchDevice() && options.enableTouchCtrlDefault)) {

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
                $.fn.finderSelect.setTertiary(parent, null);
            }
        });

        return parent;
    };

    $.fn.finderSelect.deleteSelection = function() {
        if(document.getSelection) {
            var selection = document.getSelection();
            if(selection.removeAllRanges) {
                selection.removeAllRanges();
            }
        }
    }

    $.fn.finderSelect.ctrlSelection = function(siblings,selected, first, last, current, options) {
        if(last != null) {
            if((current >= first && current < last) || (current <= first && current > last)) {
                $.fn.finderSelect.toggleHighlight(siblings.eq(last), options.selectClass);
            } else {
                $.fn.finderSelect.toggleHighlight(selected, options.selectClass);
            }
            $.fn.finderSelect.toggleHighlight($.fn.finderSelect.between(siblings, current, last), options.selectClass);
        } else {
            $.fn.finderSelect.toggleHighlight($.fn.finderSelect.between(siblings, current, first), options.selectClass);
            $.fn.finderSelect.toggleHighlight(selected, options.selectClass);
        }

    }

    $.fn.finderSelect.shiftSelection = function(siblings,selected, last, shift, clicked, options) {
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
                if(clicked > shift) {
                    $.fn.finderSelect.unHighlight(siblings.eq(shift).prevUntil(options.children+':not(.'+options.selectClass+')'), options.selectClass);
                } else {
                    $.fn.finderSelect.unHighlight(siblings.eq(shift).nextUntil(options.children+':not(.'+options.selectClass+')'), options.selectClass);
                }
            }



        } else {
            if(last < clicked) {
                $.fn.finderSelect.unHighlight(siblings.eq(last).prevUntil(options.children+':not(.'+options.selectClass+')'), options.selectClass);
            } else {
                $.fn.finderSelect.unHighlight(siblings.eq(last).nextUntil(options.children+':not(.'+options.selectClass+')'), options.selectClass);
            }

            $.fn.finderSelect.highlight($.fn.finderSelect.between(siblings, clicked, last), options.selectClass);
        }

        $.fn.finderSelect.highlight(selected, options.selectClass);


    }

    $.fn.finderSelect.getMouseDown = function() {
        return $('body').data('down');
    }

    $.fn.finderSelect.setMouseDown = function(bool) {
        return $('body').data('down', bool);
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

    $.fn.finderSelect.setTertiary = function(el,value) {
        return el.data('finderSelectTertiary', value);
    }

    $.fn.finderSelect.getTertiary = function(el) {
        return el.data('finderSelectTertiary');
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
