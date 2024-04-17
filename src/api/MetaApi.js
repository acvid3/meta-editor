export const deleteMeta = async (metaKey) => {
    try {
        const response = await fetch(metaEditor.ajax_url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'delete_meta_data',
                post_id: metaEditor.post_id,
                meta_key: metaKey,
                security: metaEditor.nonce
            })
        });
        
        console.log('Delete Response:', response.status);
    } catch (error) {
        console.error('Delete Error:', error);
    }
};

export const updateMeta = async (key) => {
    try {
        const metaValue = metaEditor.metaData[key];

        const response = await fetch(metaEditor.ajax_url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'update_meta_data',
                post_id: metaEditor.post_id,
                meta_key: key,
                meta_value: JSON.stringify(metaValue),
                security: metaEditor.nonce
            })
        });
    
        console.log('Update Response:', response);
    } catch (error) {
        console.error('Update Error:', error);
    }
};
