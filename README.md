# jQuery finderSelect

[jQuery finderSelect](http://github.com/evulse/finderselect) Adds the ability to highlight table rows based on the standard single click, command/ctrl+click, command+drag/ctrl+drag and shift+click methods. This plugin will add a `selected` class to all active rows.

## How to Use

To enable selecting on all tables simply call

    $('table').finderSelect();

If you do not want to allow selecting of headers and footers use

    $('table tbody').finderSelect();

If you want to use a custom class for highlighting such as using Twitter Bootstrap

    $('table tbody').finderSelect({class:'warning'}); // Will Highlight Yellow in Twitter Bootstrap 3 RC1

To allow finderSelect to work on other children elements other than tr specify the children setting.

    $('div').finderSelect({class:'label-success',children:'span'});

All available settings

    var options = {
        class: 'selected',
        children: 'tr',
        event: 'click',
        cursor: 'pointer'
    };

Also the following event is omitted whenever an update occurs.

    finderSelectUpdate

This can be used to show total selected items

    $('.table-select tbody').finderSelect({class:'warning'});

    $(".table-select tbody").on("finderSelectUpdate", function(event){
        $('.selected-count').html($(this).find('tr.warning').length)
    });

## Change Log

*    0.1.5: Add "finderSelectUpdate" event so external code can be aware of updates.
*    0.1.4: Change to match Finder highlighting and rename from Batch Select to finderSelect.
*    0.1.3: Fix Incorrect URL's in jQuery Plugin Manifest
*    0.1.2: Rename Plugin
*    0.1.1: Use the original parent rather than relying on .parent()
*    0.1.0: Initial Commit


## Live Demos
*    [Basic Demo](http://evulse.github.io/bulkselect "jQuery finderSelect - Demo")

