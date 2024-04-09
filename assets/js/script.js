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

        if (remainingKeys.length === 0) {
            currentObj[key] = value;
            return;
        }

        const nextKey = remainingKeys[0];
        const isArrayIndex = nextKey.endsWith(']');

        if (isArrayIndex) {
            const arrayKey = key;
            const arrayIndex = parseInt(nextKey.match(/\d+/)[0], 10);

            if (!Array.isArray(currentObj[arrayKey])) {
                currentObj[arrayKey] = [];
            }

            if (typeof currentObj[arrayKey][arrayIndex] !== 'object') {
                currentObj[arrayKey][arrayIndex] = {};
            }

            updateRecursively(remainingKeys, value, currentObj[arrayKey][arrayIndex]);
        } else {
            if (typeof currentObj[key] !== 'object') {
                currentObj[key] = {};
            }

            updateRecursively(remainingKeys, value, currentObj[key]);
        }
    };

    updateRecursively(keys, value, metaData);
};

const createComponent = (key, value) => {
    const element = document.createElement('div');
    element.classList.add('meta-items');

    if (typeof value === 'string') {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.addEventListener('input', (event) => {
            updateMetaDataValue(key, event.target.value);
        });
        element.appendChild(textarea);
    } else if (typeof value === 'boolean') {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = value;
        checkbox.addEventListener('change', (event) => {
            updateMetaDataValue(key, event.target.checked);
        });
        element.appendChild(checkbox);
    } else if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
        value.forEach((item, index) => {
            const textarea = document.createElement('textarea');
            textarea.value = item;
            textarea.addEventListener('input', (event) => {
                updateMetaDataValue(`${key}.${index}`, event.target.value);
            });
            element.appendChild(textarea);
        });
    } else if (Array.isArray(value) && value.every(item => typeof item === 'object')) {

        value.forEach((item, index) => {
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('meta-item-container');
            for (const [subKey, subValue] of Object.entries(item)) {
                const compoundKey = `${key}.${index}.${subKey}`;
                const subComponent = createComponent(compoundKey, subValue);
                itemContainer.appendChild(subComponent);
            }
            element.appendChild(itemContainer);
        });
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