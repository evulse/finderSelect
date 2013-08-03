# jQuery finderSelect

[jQuery finderSelect](http://github.com/evulse/finderselect) Adds the ability to highlight table rows based on the standard single click, command/ctrl+click, command+drag/ctrl+drag and shift+click methods. This plugin will add a `selected` class to all active rows.

## How to Use

To enable selecting on all tables simply call

    $('table').finderSelect();

If you do not want to allow selecting of headers and footers use

    $('table tbody').finderSelect();

If you want to use a custom class for highlighting such as using Twitter Bootstrap

    $('table tbody').finderSelect({selectClass:'warning'}); // Will Highlight Yellow in Twitter Bootstrap 3 RC1

To allow finderSelect to work on other children elements other than tr specify the children setting.

    $('div').finderSelect({selectClass:'label-success',children:'span'});

All available settings

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

Also the following event is omitted whenever an update occurs.

    finderSelectUpdate

This can be used to show total selected items

    $('.table-select tbody').finderSelect({selectClass:'warning'});

    $(".table-select tbody").on("finderSelectUpdate", function(event){
        $('.selected-count').html($(this).find('tr.warning').length)
    });

## Change Log

*    0.3.0: Touch devices will now default to Ctrl + Click functionality allowing them to make multiple selections.
*    0.3.0: Firefox will now auto scroll when using Ctrl + Click + Drag
*    0.3.0: Rewrite Ctrl + Click + Drag functionality which now also allows text selection on all rows.
*    0.2.2: Make IE6+ Compatible required renaming option 'class' to 'selectClass'
*    0.2.1: Bring Menu and Highlight count from example into the core system.
*    0.2.0: Refactor code base to make core plugin easily extendable.
*    0.1.9: Make plugin only work on left click so that a custom context menu can be used.
*    0.1.7: Auto detect child element type if none specified.
*    0.1.5: Add "finderSelectUpdate" event so external code can be aware of updates.
*    0.1.4: Change to match Finder highlighting and rename from Batch Select to finderSelect.
*    0.1.3: Fix Incorrect URL's in jQuery Plugin Manifest
*    0.1.2: Rename Plugin
*    0.1.1: Use the original parent rather than relying on .parent()
*    0.1.0: Initial Commit


## Live Demos
*    [Basic Demo](http://evulse.github.io/finderSelect "jQuery finderSelect - Demo")

