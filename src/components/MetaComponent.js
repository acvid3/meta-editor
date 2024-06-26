import { updateMeta, deleteMeta } from '../api/MetaApi';
import { updateMetaDataValue, getItemsFromPath } from '../utils/utilities';



const createElement = (type, props = {}, children = []) => {
    const element = document.createElement(type);
    Object.keys(props).forEach(key => {
        if (key.startsWith('on') && typeof props[key] === 'function') {
            element.addEventListener(key.substring(2).toLowerCase(), props[key]);
        } else {
            element[key] = props[key];
        }
    });

    children.forEach(child => {
        const nodeToAppend = child instanceof Node ? child : document.createTextNode(String(child));

        try {
            element.appendChild(nodeToAppend);
        } catch (error) {
            console.error('Error appending child:', nodeToAppend, error);
        }
    });

    return element;
}

const createLabel = (textContent) => {
    const label = createElement('strong', {}, []);
    const textNode = document.createTextNode(textContent);
    label.appendChild(textNode);
    return label;
}

const createControlButtons = (pathKey, value) => {
    const pathParts = pathKey.split('.');

    const deleteButton = createElement('button', {
        innerText: 'Remove item',
        className: 'delete',
        onclick: (event) => {
            event.preventDefault();
            const result = getItemsFromPath(pathParts);

            const indexToDelete = result.findIndex(subValue => subValue === value);
            result.splice(indexToDelete, 1);
            updateMeta(pathKey.split('.')[0]);
        }
    });

    const duplicateButton = createElement('button', {
        innerText: 'Duplicate item',
        className: 'update',
        onclick: (event) => {
            event.preventDefault();
            const result = getItemsFromPath(pathParts);
            const indexToDelete = result.findIndex(subValue => subValue === value);
            result.splice(indexToDelete, 0, value);
            updateMeta(pathKey.split('.')[0]);
        }
    });

    const controlButtons = createElement('div', { className: 'control-buttons' }, [deleteButton, duplicateButton]);
    return controlButtons;
}

const handleCreateDuplicateItem = (key, value) => {
    console.log(key, value);
}

const handleDeleteItem = (key, value) => {
    console.log(key, value);
}

const createComponent = (key, value, isControllButtons = false, onDelete, onUpdate) => {
    const className = typeof value === 'object' && Array.isArray(value) ? 'meta-items' : 'meta-box';
    const element = createElement('div', { className });

    let inputElement;
    if (typeof value === 'string' || typeof value === 'number') {
        inputElement = createElement('textarea', {
            value: value,
            oninput: (event) => updateMetaDataValue(key, event.target.value),
            className: 'meta-box-' + typeof value
        });

        if (isControllButtons) {
            inputElement.appendChild(createControlButtons(key, value, true, handleDelete, updateMeta));
        }

        element.appendChild(createLabel(key));
        element.appendChild(inputElement);
        
    } else if (typeof value === 'boolean') {
        inputElement = createElement('input', {
            type: 'checkbox',
            checked: value,
            onchange: (event) => updateMetaDataValue(key, event.target.checked),
            className: 'meta-box-' + typeof value
        });

        if (isControllButtons) {
            inputElement.appendChild(createControlButtons(key, value, true, handleDeleteItem, handleCreateDuplicateItem));
        }

        element.appendChild(createLabel(key));
        element.appendChild(inputElement);
       
    } else if (typeof value === 'object' && value !== null) {
        
        Object.entries(value).forEach(([subKey, subValue]) => {
            inputElement = createComponent(key + '.' + subKey, subValue, Array.isArray(subValue));

            if (isControllButtons) {
                inputElement.appendChild(createControlButtons(key, subValue, true, handleDelete, updateMeta));
            }

            element.appendChild(inputElement);
        });
    };

    return element;
}

const handleDelete = (metaKey, isElement) => {
    if (isElement) {
        const pathParts = metaKey.split('.');
        const metaKeyRoot = pathParts.shift();
        deleteElementAtPath(metaEditor.metaData, metaKey);
        updateMeta(metaKeyRoot);
    } else {
        deleteMeta(metaKey);
    }
}

const deleteElementAtPath = (data, path) => {
    const parts = path.split('.');
    const indexToRemove = parseInt(parts.pop().match(/\d+/)[0], 10);
    let arr = parts.reduce((acc, cur) => acc[cur], data);
    arr.splice(indexToRemove, 1);
}

export const render = (metaData, containerId) => {
    const mainContainer = document.getElementById(containerId);
    mainContainer.innerHTML = '';

    Object.entries(metaData).forEach(([key, value]) => {
        const metaBox = createElement('div', { className: 'meta-box' });
        const component = createComponent(key, value);

        const control = createElement('div', { className: 'meta-control' });
        const deleteMetaButton = createElement('button', { 
            innerText: 'Remove meta',
            className: 'delete',
            onclick: (event) => {
                event.preventDefault();
                deleteMeta(key);
            } 
        });
        const updateMetaButton = createElement('button', { 
            innerText: 'Update meta',
            className: 'update',
            onclick: (event) => {
                event.preventDefault();
                updateMeta(key);
            } 
        });
        control.appendChild(deleteMetaButton);
        control.appendChild(updateMetaButton);

        metaBox.appendChild(control);
        metaBox.appendChild(component);
        mainContainer.appendChild(metaBox);
    });
};

