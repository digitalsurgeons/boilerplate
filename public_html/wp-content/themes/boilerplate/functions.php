<?php

add_theme_support('title-tag');
add_theme_support( 'post-thumbnails' );

if (function_exists('acf_add_options_page')) {
	acf_add_options_page();
}


add_filter('get_twig', 'add_to_twig');

function add_to_twig($twig) {
  /* this is where you can add your own fuctions to twig */
  $twig->addExtension(new Twig_Extension_StringLoader());
  return $twig;
}
