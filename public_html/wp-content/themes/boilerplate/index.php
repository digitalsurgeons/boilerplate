<?php

$context = Timber::get_context();
$post = Timber::get_post();
$context = [
  'post' => $post,
  // 'primary_nav' => new Timber\Menu('primary_nav'),
  // 'footer_nav' => new Timber\Menu('footer_nav'),
  'env' => WP_ENV
];

if(is_404()) {
  Timber::render('_404.twig', $context);
} else {
  Timber::render('_page.twig', $context);
}
