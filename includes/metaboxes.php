<?php

add_action('add_meta_boxes', 'custom_meta_boxes');
function custom_meta_boxes() {
    add_meta_box(
        'custom_meta_box',          
        'Custom Meta Box',          
        'meta_box',                 
        'post',                     
        'normal',                   
        'high'                      
    );
}

function meta_box() {
    echo '<div id="main"></div>';
    wp_nonce_field('meta_editor_action', 'meta_editor_nonce');
}