export const updateMetaDataValue = (keyPath, value) => {
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

    updateRecursively(keys, value, metaEditor.metaData);
};
