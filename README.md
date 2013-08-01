# jQuery Bulk Select

[jQuery Bulk Select](http://github.com/evulse/bulkselect) Adds the ability to highlight table rows based on the standard single click, command/ctrl+click and shift+click methods. This plugin will add a `selected` class to all active rows. It also is fully compatiable with Jquery UI draggable.

## How to Use

To enable selecting on all tables simply call

    $('table').bulk_select();

If you do not want to allow selecting of headers and footers use

    $('table tbody').bulk_select();

If you want to use a custom class for highlighting such as using Twitter Bootstrap

    $('table tbody').bulk_select({'class':'warning'}); // Will Highlight Yellow in Twitter Bootstrap 3 RC1

To allow Bulk Select to work on other children elements other than tr specify the children setting.

    $('div').bulk_select({'class':'label-success','children':'span'});

All available settings

    var options = {
        'class': 'selected',
        'children': 'tr',
        'event': 'click',
        'cursor': 'pointer'
    };

## Change Log

0.1.3: Fix Incorrect URL's in jQuery Plugin Manifest
0.1.2: Rename Plugin
0.1.1: Use the original parent rather than relying on .parent()
0.1.0: Initial Commit


## Live Demos
*    [Basic Demo](http://evulse.github.io/bulkselect "jQuery Bulk Select - Demo")

