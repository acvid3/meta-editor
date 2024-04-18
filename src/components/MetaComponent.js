import { updateMetaDataValue } from '../utils/utilities';
import { deleteMeta, updateMeta } from '../api/MetaApi';

export const createComponent = (key, value) => {
    const element = document.createElement('div');

    const addLabel = (textContent, parent) => {

        const label = document.createElement('strong');
        label.textContent = textContent.indexOf('.') ? textContent.split('.')[textContent.split('.').length - 1] + ':' : textContent + ':';
        parent.appendChild(label);

        element.classList.add('meta-item');
    };

    const createSubcomponentControls = (onDelete, onDuplicate) => {
        const wrapper = document.createElement('div');
        const duplicateButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        duplicateButton.textContent = 'Duplicate';
        deleteButton.textContent = 'Delete';

        deleteButton.addEventListener('click', onDelete);
        duplicateButton.addEventListener('click', onDuplicate)

        wrapper.appendChild(duplicateButton);
        wrapper.appendChild(deleteButton);
        return wrapper;
    }

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
                const handleSubcomponent = (subKey, subValue) => {
                    const subComponentWrapper = document.createElement('div');
                    const subComponentControls = createSubcomponentControls(
                        () => {
                            subComponentWrapper.remove();
                            deleteMeta(compoundKey)
                        },
                        () => {
                            value.push(subValue);
                            handleSubcomponent(`${key}[${value.length - 1}]`, subValue)
                        }
                    );
                    const subComponent = createComponent(subKey, subValue);

                    subComponentWrapper.appendChild(subComponentControls)
                    subComponentWrapper.appendChild(subComponent)
                    element.appendChild(subComponentWrapper);
                }

                handleSubcomponent(compoundKey, item);

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

export const render = (metaData) => {
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
