<?php
/*
Plugin Name: Advanced Custom Fields: Flexible Content Field
Plugin Slug: acf-flexible-content
Plugin URI: http://www.advancedcustomfields.com/
Description: This premium Add-on adds a flexible content field type for the Advanced Custom Fields plugin
Version: 2.0.1
Author: Elliot Condon
Author URI: http://www.elliotcondon.com/
License: GPL
Copyright: Elliot Condon
*/

if( !class_exists('acf_plugin_flexible_content') ):

class acf_plugin_flexible_content {
	
	// vars
	var $settings;
	
	
	/*
	*  __construct
	*
	*  This function will setup the class functionality
	*
	*  @type	function
	*  @date	5/03/2014
	*  @since	5.0.0
	*
	*  @param	n/a
	*  @return	n/a
	*/
	
	function __construct() {
		
		// vars
		$this->settings = array(
			
			// basic
			'name'				=> __('Advanced Custom Fields: Flexible Content Field', 'acf'),
			'version'			=> '2.0.1',
						
			// urls
			'slug'				=> dirname(plugin_basename( __FILE__ )),
			'basename'			=> plugin_basename( __FILE__ ),
			'path'				=> plugin_dir_path( __FILE__ ),
			'dir'				=> plugin_dir_url( __FILE__ ),
			
		);
		
		
		// include v5 field
		add_action('acf/include_field_types', array($this, 'include_field_types'));
		
		
		// include v4 field
		add_action('acf/register_fields', array($this, 'register_fields'));
		
		
		// include updates
		if( is_admin() ) {
			
			$this->include_file('acf-flexible-content-update.php');
			
		}
		
	}
	
	
	/*
	*  include_file
	*
	*  This function will check if a file exists before including it
	*
	*  @type	function
	*  @date	22/2/17
	*  @since	5.5.8
	*
	*  @param	$file (string)
	*  @return	n/a
	*/
	
	function include_file( $file = '' ) {
		
		$file = dirname(__FILE__) . '/'. $file;
		
		if( file_exists($file) ) include_once( $file );
		
	}
	
	
	/*
	*  include_field_types
	*
	*  This function will include the v5 field type
	*
	*  @type	function
	*  @date	12/06/2015
	*  @since	5.2.3
	*
	*  @param	n/a
	*  @return	n/a
	*/
	
	function include_field_types() {
		
		$this->include_file('5/flexible-content.php');
		
	}
	
	
	/*
	*  register_fields
	*
	*  This function will include the v4 field type
	*
	*  @type	function
	*  @date	12/06/2015
	*  @since	5.2.3
	*
	*  @param	n/a
	*  @return	n/a
	*/
	
	function register_fields() {
		
		$this->include_file('4/flexible-content.php');
		
	}
	
}


// globals
global $acf_plugin_flexible_content;


// instantiate
$acf_plugin_flexible_content = new acf_plugin_flexible_content();


// end class
endif;

?>