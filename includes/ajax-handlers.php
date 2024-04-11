<?php
add_action('wp_ajax_update_meta_data', 'update_meta_data_handler');
function update_meta_data_handler() {
    check_ajax_referer('meta_editor_nonce', 'security');

    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    $meta_key = isset($_POST['meta_key']) ? $_POST['meta_key'] : '';
    $meta_value = isset($_POST['meta_value']) ? json_decode(stripslashes($_POST['meta_value']), true) : '';

    error_log(print_r($meta_value, true));

    if ($post_id && $meta_key) {
        update_post_meta($post_id, $meta_key, $meta_value);

        wp_send_json_success(['message' => array('success' => true)]);
    } else {
        wp_send_json_error(['message' => array('success' => false)]);
    }

    wp_die();
}

add_action('wp_ajax_delete_meta_data', 'delete_meta_data_handler');
function delete_meta_data_handler() {
    check_ajax_referer('meta_editor_nonce', 'security');
    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    $meta_key = isset($_POST['meta_key']) ? $_POST['meta_key'] : '';

    if ($post_id && $meta_key) {
        delete_post_meta($post_id, $meta_key);

        wp_send_json_success(['message' => array('success' => true)]);
    } else {
        wp_send_json_error(['message' => array('success' => false)]);
    }

    wp_die();
}
