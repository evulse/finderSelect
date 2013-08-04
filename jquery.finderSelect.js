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

    var d = $(document);
    var b = $('body');

    var f = $.fn.finderSelect = function(options) {

        var p = $(this);
        var o = {
            selectClass: "selected",
            unSelectClass: "un-selected",
            currentClass: "selected-current",
            lastClass: "selected-last",
            shiftClass: "selected-shift",
            ctrlClass: "selected-ctrl",
            triggerUpdate: "finderSelectUpdate",
            children: false,
            event: "mousedown",
            cursor: "pointer",
            dragEvent: "mouseenter",
            enableClickDrag: true,
            enableShiftClick: true,
            enableCtrlClick: true,
            enableSingleClick: true,
            enableSelectAll: true,
            enableDisableSelection: true,
            enableTouchCtrlDefault: true,
            totalSelector: false,
            menuSelector: false,
            menuXOffset: 0,
            menuYOffset: 0

        };

        $.extend(o, options);

        if(!o.children) {
            o.children = f.detect.children(p);
        }

        f.h.off(f.get.siblings(p,o), o);

        if(o.cursor) {
            f.set.cursor(p,o);
        }
        if(o.enableDisableSelection) {
            f.core.disableSelection(p,o);
        }
        if(o.enableClickDrag) {
            f.core.clickDrag(p,o);
        }
        if(o.enableSelectAll) {
            f.core.selectAll(p,o);
        }
        if(o.enableShiftClick || o.enableCtrlClick || o.enableSingleClick) {
            f.core.click(p,o);
        }
        if(o.totalSelector) {
            f.core.totalUpdate(p,o);
        }
        if(o.menuSelector) {
            f.core.loadMenu(p,o);
        }
    };

    f.core = {
        clickDrag: function(p,o) {
            f.set.mouseDown(false);
            b.mousedown(function(e) {
                if(f.detect.leftMouse(e)) { f.set.mouseDown(true);}
            });
            b.mouseup(function(e) {
                if(f.detect.leftMouse(e)) { f.set.mouseDown(false);}
            });
            p.on(o.dragEvent, o.children, function(e){
                var c = f.get.clicks(p,o,$(this));

                if (f.get.mouseDown() && f.detect.ctrl(e)) {
                    f.t.deleteSelection(o);
                    f.t.toggleDrag(p,c,o);
                    f.set.clicks(c.hard.v, null, c.current.v, p, o);
                }
            });

            return p;
        },
        click: function(p,o) {
            p.on(o.event, o.children, function(e){
                if(f.detect.leftMouse(e)) {
                    var c = f.get.clicks(p,o,$(this));

                    if (!(f.detect.ctrl(e) && o.enableCtrlClick) && (f.detect.shift(e) && o.enableShiftClick)) {
                        f.t.deleteSelection(o);
                        f.t.shiftClick(p,c,o);
                        f.set.clicks(c.hard.v, c.current.v, null, p, o);
                    }

                    if (((f.detect.ctrl(e) && o.enableCtrlClick) || (f.detect.touch() && o.enableTouchCtrlDefault)) && !(f.detect.shift(e) && o.enableShiftClick)) {
                        f.t.toggleClick(p,c,o);
                        f.set.clicks(c.current.v, null, null, p, o);
                    }

                    if (!(f.detect.ctrl(e) && o.enableCtrlClick) && !(f.detect.shift(e) && o.enableShiftClick) && o.enableSingleClick) {
                        f.t.singleClick(p,c,o);
                        f.set.clicks(c.current.v, null, null, p, o);
                    }
                }
            });
        },
        selectAll: function(p,o) {
            p.on('mouseenter', function(){
                d.on("keydown", turnOff);
            });
            p.on('mouseleave', function(){
                d.off("keydown", turnOff);
            });

            function turnOff(e) {
                if (f.detect.ctrl(e)) {
                    if (e.keyCode == 65) {
                        e.preventDefault();
                        if(f.detect.alt(e)) {
                            f.t.unHAll(p, o);
                        } else {
                            f.t.hAll(p,o);
                        }
                    }
                }
            }

        },
        totalUpdate: function(p,o) {
            p.on(o.triggerUpdate, function(){
                $(o.totalSelector).html($(this).find(o.children).filter('.'+o.selectClass).length)
            });
        },
        loadMenu: function(p, o) {
            p.bind("contextmenu",function(e){
                $(o.menuSelector).css({left:(e.pageX+o.menuXOffset),top:(e.pageY+o.menuYOffset)}).show();
                return false;
            }).bind("mousedown",function(){
                $(o.menuSelector).hide();
            });
            $(o.menuSelector).bind("click",function(){
                $(this).hide();
            });
        },
        disableSelection: function(p, o) {
            b.on('keydown', function(){
                p.on("selectstart", o.children, turnOffSelection);
            }).on('keyup', function(){
                p.off("selectstart", o.children, turnOffSelection);
            });

            function turnOffSelection() {
                return false;
            }
        }
    };


    f.h = {
        on: function(el, o) {
            el.removeClass(o.unSelectClass);
            el.addClass(o.selectClass);
        },
        off: function(el,o) {
            el.removeClass(o.selectClass);
            el.addClass(o.unSelectClass);
        },
        tog: function(el,o) {
            if(f.detect.h(el, o)) {
                f.h.off(el, o);
            } else {
                f.h.on(el, o);
            }
        }
    };

    f.detect = {
        leftMouse: function(e) {
            return (e.which == 1);
        },
        shift: function(e) {
            return e.shiftKey;
        },
        alt: function(e) {
            return e.altKey;
        },
        ctrl: function(e) {
            return (e.ctrlKey || e.metaKey);
        },
        h: function(el,o) {
            return el.hasClass(o.selectClass);
        },
        touch: function() {
            return !!('ontouchstart' in window) // works on most browsers
                || !!('onmsgesturechange' in window); // works on ie10
        },
        children: function(el) {
            return el.children().get(0).tagName;
        }
    };

    f.set = {
        clicks: function(curr, shif, ctrl, p, o) {
            f.set.click(p, false, o.currentClass);
            f.set.click(p, curr, o.lastClass);
            f.set.click(p, shif,o.shiftClass);
            f.set.click(p, ctrl,o.ctrlClass);
            f.t.update(p, o);
        },
        click: function(p,el,c) {
            f.get.click(p,c).removeClass(c);
            if(el) { el.addClass(c); }
        },
        mouseDown: function(bool) {
            return b.data('down', bool);
        },
        cursor: function(p,o) {
            var s = f.get.siblings(p,o);
            return s.css('cursor', o.cursor);
        }
    };

    f.get = {
        clicks: function(p, o, curr) {
            var c = {};
            f.set.click(p, curr, o.currentClass);
            c.current = {v:curr,c: o.currentClass};
            c.hard = {v:f.get.click(p, o.lastClass),c:o.lastClass};
            c.shift = {v:f.get.click(p, o.shiftClass),c:o.shiftClass};
            c.ctrl = {v:f.get.click(p, o.ctrlClass),c:o.ctrlClass};
            return c;
        },
        click: function(p,c) {
            return p.find('.'+c);
        },
        mouseDown: function() {
            return b.data('down');
        },
        siblings: function(p, o) {
            return p.find(o.children);
        },
        between: function(s,y, z) {
            if(s.index(y.v) < s.index(z.v)) {

                return f.get.elem(true, y.v, false, z.c);
            } else {
                return f.get.elem(false, y.v, false, z.c);
            }
        },
        elem: function(d, el, s, u) {
            var $els = [], $el = (d) ? el.next() : el.prev();
            while( $el.length ) {
                if(typeof u === 'undefined' || !u || !$el.hasClass(u)) {
                if(typeof s === 'undefined' || !s || $el.hasClass(s)) {
                    $els.push($el[0]);
                }
                    $el = (d) ? $el.next() : $el.prev();
                } else {
                    $el = {};
                }
            }
            return $($els)
        }

    };

    f.t = {
        update: function(el, o) {
            return el.trigger(o.triggerUpdate);
        },
        deleteSelection: function(o) {
            if(o.enableDisableSelection) {
                if(document.getSelection) {
                    var sel = document.getSelection();
                    if(sel.removeAllRanges) {
                        sel.removeAllRanges();
                    }
                }
            }
        },
        singleClick: function(p,c,o) {
            var s = f.get.siblings(p,o);
            f.h.off(s, o);
            f.h.on(c.current.v, o);
        },
        toggleClick: function(p,c,o) {
            f.h.tog(c.current.v, o);
        },
        toggleDrag: function(p,c,o) {
            var s = f.get.siblings(p,o);
            var x = s.index(c.hard.v);
            var y = s.index(c.ctrl.v);
            var z = s.index(c.current.v);


            if(c.ctrl.v.length != 0) {
                if((z >= x && z < y) || (z <= x && z > y)) {
                    f.h.tog(c.ctrl.v, o);
                } else {
                    f.h.tog(c.current.v, o);
                }
                f.h.tog(f.get.between(s, c.current, c.ctrl), o);
            } else {
                if(c.current.v != c.hard.v) {
                    f.h.tog(f.get.between(s, c.current, c.hard), o);
                }

                f.h.tog(c.current.v, o);
            }
        },
        shiftClick: function(p, c, o) {
            var s = f.get.siblings(p,o);
            var z = s.index(c.current.v);
            var x = s.index(c.hard.v);
            if(c.hard.v.length != 0 && !f.detect.h(c.hard.v, o)) {
                var start = f.get.elem(true, c.hard.v, o.selectClass);
                if(start.length > 0) {
                    c.hard.v = $(start[0]);
                    f.set.click(p, c.hard.v, o.lastClass);
                } else {
                    var start = f.get.elem(z < x, c.hard.v, o.selectClass);
                    if(start.length > 0) {
                    start = (z > x ) ? $(start[0]) : $(start[start.length-1]);
                    c.hard.v = start;
                    f.set.click(p, c.hard.v, o.lastClass);
                    } else {
                        c.hard.v = s.first();
                        f.set.click(p, c.hard.v, o.lastClass);
                        f.t.singleClick(s,{current:{v:s.first()}},o);
                    }

                }

            }

            var x = s.index(c.hard.v);
            var y = s.index(c.shift.v);
            var z = s.index(c.current.v);


            if(c.hard.v.length == 0){
                f.t.singleClick(s,{current:{v:s.first()}},o);
            }

            if(c.shift.v.length != 0) {
                if((x < y && x < z && z < y) || (x > y && x > z && z > y)) {
                    f.h.off(f.get.between(s, c.shift, c.current), o);
                }
                if((x < y && x > z && z < y) || (x > y && x < z && z > y)) {
                    f.h.off(f.get.between(s, c.shift, c.hard), o);
                    f.h.on(f.get.between(s, c.current, c.hard), o);
                }
                if((x > y && x > z && z < y) || (x < y && x < z && z > y) || (x == y)) {
                    f.h.on(f.get.between(s, c.shift, c.current), o);
                } else {
                    f.h.off(c.shift.v, o);
                    f.t.unHExist(z>y, c.shift.v,o);
                }
            } else {
                f.t.unHExist(z>x,c.hard.v,o);
                f.h.on(f.get.between(s, c.current, c.hard), o);
            }

            f.h.on(c.current.v, o);

        },
        unHAll: function(p,o) {
                f.h.off(p.find(o.children), o);
        },
        hAll: function(p,o) {
                f.h.on(p.find(o.children), o);
        },
        unHExist: function(bool,el,o) {
            if(bool) {
                f.h.off(f.get.elem(false, el, false, o.unSelectClass), o);
            } else {

                f.h.off(f.get.elem(true, el, false, o.unSelectClass), o);
            }
        }

    };

})(window.jQuery || window.Zepto);
