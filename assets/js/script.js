const { metaData, ajax_url, nonce, post_id } = metaEditor;

const deleteMeta = async (metaKey) => {
    try {
        const response = await fetch(ajax_url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'delete_meta_data',
                post_id: post_id,
                meta_key: metaKey,
                security: nonce
            })
        });
        
        console.log('Delete Response:', response.status);
    } catch (error) {
        console.error('Delete Error:', error);
    }
};

const updateMeta = async (key) => {
    try {
        const metaValue = metaData[key];

        const response = await fetch(ajax_url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'update_meta_data',
                post_id: post_id,
                meta_key: key,
                meta_value: JSON.stringify(metaValue),
                security: nonce
            })
        });
    
        console.log('Update Response:', response);
    } catch (error) {
        console.error('Update Error:', error);
    }
};

const updateMetaDataValue = (keyPath, value) => {
    const keys = keyPath.split('.');
    console.log(keyPath, value);

    const updateRecursively = (keys, value, currentObj) => {
        const key = keys[0];
        const remainingKeys = keys.slice(1);

        if (key.includes('[')) {
            const match = key.match(/(\w+)\[(\d+)\]/);
            const arrayKey = match[1];
            const arrayIndex = parseInt(match[2], 10);

            if (remainingKeys.length === 0) {
                currentObj[arrayKey][arrayIndex] = value;
                return;
            }

            if (!currentObj[arrayKey]) {
                currentObj[arrayKey] = [];
            }

            if (!currentObj[arrayKey][arrayIndex]) {
                currentObj[arrayKey][arrayIndex] = {};
            }

            updateRecursively(remainingKeys, value, currentObj[arrayKey][arrayIndex]);
        } else {
            if (remainingKeys.length === 0) {
                currentObj[key] = value;
                return;
            }

            if (!currentObj[key]) {
                currentObj[key] = {};
            }

            updateRecursively(remainingKeys, value, currentObj[key]);
        }
    };

    updateRecursively(keys, value, metaData);
};


const createComponent = (key, value) => {
    const element = document.createElement('div');

    const addLabel = (textContent, parent) => {

        const label = document.createElement('strong');
        label.textContent = textContent.indexOf('.') ? textContent.split('.')[textContent.split('.').length - 1] + ':' : textContent + ':';
        parent.appendChild(label);

        element.classList.add('meta-item');
    };

    if (typeof value === 'string' || typeof value === 'number') {
        addLabel(key, element);
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.addEventListener('input', (event) => {
            updateMetaDataValue(key, event.target.value);
        });
        element.appendChild(textarea);
    } else if (typeof value === 'boolean') {
        addLabel(key, element);
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = value;
        checkbox.addEventListener('change', (event) => {
            updateMetaDataValue(key, event.target.checked);
        });

        element.classList.add('meta-item');
        element.appendChild(checkbox);
    } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
            const compoundKey = `${key}[${index}]`;
            if (typeof item === 'string' || typeof item === 'boolean') {

                const control = typeof item === 'string' ? document.createElement('textarea') : document.createElement('input');
                if (typeof item === 'boolean') {
                    control.type = 'checkbox';
                    control.checked = item;
                } else {
                    control.value = item;
                }
                control.addEventListener('input', (event) => {
                    updateMetaDataValue(compoundKey, event.target.value);
                });

                element.classList.add('meta-items');
                element.appendChild(control);
            } else if (typeof item === 'object') {
                const subComponent = createComponent(compoundKey, item);
                element.appendChild(subComponent);
            }
        });
    } else if (typeof value === 'object') {
        for (const [subKey, subValue] of Object.entries(value)) {
            const compoundKey = `${key}.${subKey}`;
            const subComponent = createComponent(compoundKey, subValue);

            element.classList.add('meta-object');
            element.appendChild(subComponent);
        }
    }

    if (element.classList.length === 0) {
        element.classList.add('meta-wrap');
    }
    
    return element;
};

const render = (metaData) => {
    const mainContainer = document.getElementById('main');

    for (const [key, value] of Object.entries(metaData)) {
        const metaBox = document.createElement('div');
        metaBox.classList.add('meta-box');

        const component = createComponent(key, value);
        metaBox.appendChild(component);

        const controlButtons = document.createElement('div');
        controlButtons.classList.add('control-buttons');

        const deleteMetaData = document.createElement('button');
        deleteMetaData.textContent = 'Delete';
        deleteMetaData.classList.add('delete');
        deleteMetaData.addEventListener('click', () => deleteMeta(key));
        controlButtons.appendChild(deleteMetaData);

        const updateMetaData = document.createElement('button');
        updateMetaData.textContent = 'Update';
        updateMetaData.classList.add('update');
        updateMetaData.addEventListener('click', () => updateMeta(key));
        controlButtons.appendChild(updateMetaData);

        metaBox.appendChild(controlButtons);
        mainContainer.appendChild(metaBox);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    render(metaData);
});