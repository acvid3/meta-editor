<?php
if (!defined('ABSPATH')) {
    exit;
}
/**
 * Plugin Name: MetaEditor
 * Description: Plugin for editing and removing post metadata in WordPress.
 * Version: 1.0
 * Author: Andrew Chekh
 */

require_once plugin_dir_path(__FILE__) . 'includes/metaboxes.php';
require_once plugin_dir_path(__FILE__) . 'includes/ajax-handlers.php';

function meta_editor_enqueue_scripts() {
    global $post;
    wp_enqueue_script('meta-editor-script', plugin_dir_url(__FILE__) . 'assets/js/script.js', null, false, true);
    wp_enqueue_style('meta-editor-style', plugin_dir_url(__FILE__) . 'assets/css/style.css');

    $meta_data = get_post_meta($post->ID);

    $meta_data_array = [];
    foreach ($meta_data as $key => $value) {
        $meta_data_array[$key] = maybe_unserialize($value[0]);
    }

    $script_data = [
        'ajax_url' => admin_url('admin-ajax.php'),
        'post_id'  => $post->ID,
        'nonce'    => wp_create_nonce('meta_editor_nonce'),
        'metaData' => $meta_data_array
    ];

    wp_localize_script('meta-editor-script', 'metaEditor', $script_data);
}
add_action('admin_enqueue_scripts', 'meta_editor_enqueue_scripts');



