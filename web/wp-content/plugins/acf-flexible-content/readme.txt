=== Advanced Custom Fields: Flexible Content Field ===
Contributors: elliotcondon
Requires at least: 3.6.0
Tested up to: 4.9.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Create unique page designs with a flexible layout!

== Description ==

= Create unique page designs with a flexible layout! =

The Flexible content field acts as a blank canvas to which you can add an unlimited number of layouts with full control over the order.

Similar to the repeater field, this field contains sub fields. However, instead of 1 set of sub fields, the flexible content field allows you to create an infinite set of sub field groups (called layouts). With these layouts predefined, you can then add them into your field when ever you want and where ever you want.

http://www.advancedcustomfields.com/add-ons/flexible-content-field/


== Installation ==

This software can be treated as both a WP plugin and a theme include.
However, only when activated as a plugin will updates be available/

= Plugin =
1. Copy the 'acf-flexible-content' folder into your plugins folder
2. Activate the plugin via the Plugins admin page

= Include =
1. Copy the 'acf-flexible-content' folder into your theme folder (can use sub folders)
   * You can place the folder anywhere inside the 'wp-content' directory
2. Edit your functions.php file and add the following code to include the field:

`
include_once('acf-flexible-content/acf-flexible-content.php');
`
3. Make sure the path is correct to include the acf-flexible-content.php file
4. Remove the acf-flexible-content-update.php file from the folder.


== Changelog ==

= 2.0.1 =
* Minor fixes and improvements

= 2.0.0 =
* Added support for ACF version 5

= 1.1.1 =
* Fixed bug causing a sub field default_value of "0" to be ignored
* Updated CSS for WP 3.8 compatibility
* Added filter to customize the no_value_message text

= 1.1.0 =
* Added Support for sub field conditional logic
* Added Support for sub field required validation
* Updated UI for each layout when editing the field group
* Added new options for min / max layouts
* Updated JS to use .on function instead of .live
* Added new update script allowing distribution in premium plugins / themes

= 1.0.2 =
* [Fixed] Fixed JS error appearing if repeater field add-on is not activated

= 1.0.1 =
* [Updated] Updated sub field type list to remove 'Tab' and 'Flexible Content' as these do not work as sub fields

= 1.0.0 =
* [Updated] Updated update_field parameters
* Official Release

= 0.1.7 =
* [IMPORTANT] This update requires the latest ACF v4 files available on GIT - https://github.com/elliotcondon/acf4
* [Added] Added category to field to appear in the 'Layout' optgroup
* [Updated] Updated dir / path code to use acf filter

= 0.1.6 =
* [Fixed] Fix JS bug preventing a new field to be added to a new field group - https://github.com/elliotcondon/acf4/issues/41

= 0.1.5 =
* [IMPORTANT] This update requires the latest ACF v4 files available on GIT - https://github.com/elliotcondon/acf4
* [Updated] Updated naming conventions in field group page

= 0.1.4 =
* [Fixed] Fix wrong str_replace in $dir

= 0.1.3 =
* [Fixed] Fix random code showing in bottom of flexible-content.php

= 0.1.2 =
* [Updated] Drop support of old filters / actions

= 0.1.1 =
* [Fixed] Fix bug causing sub fields to not display choices correctly

= 0.1.0 =
* [IMPORTANT] This update requires the latest ACF v4 files available on GIT - https://github.com/elliotcondon/acf4
* [Fixed] Fixed bug where field would appear empty after saving the page. This was caused by a cache conflict which has now been avoided by using the format_value filter to load sub field values instead of load_value

= 0.0.9 =
* [Fixed] Fix field key issues when duplicating a layout

= 0.0.8 =
* [Fixed] Fix PHP bug where clone_fields are not being unset

= 0.0.7 =
* [Updated] Update save method to use uniqid for field keys, not pretty field keys

= 0.0.6 =
* [Fixed] Fix wrong css / js urls on WINDOWS server.

= 0.0.5 =
* [Fixed] Fix bug preventing WYSIWYG sub fields to load.

= 0.0.4 =
* [Fixed] Fix load_field hook issues with nested fields.

= 0.0.3 =
* [Fixed] acf_load_field-${parent_hook}-${layout_name}-${child_hook} now works!

= 0.0.2 =
* [Fixed] get_field is returning array with sub field key's, not sub field names!

= 0.0.1 =
* Initial Release.
