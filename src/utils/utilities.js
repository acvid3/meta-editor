export const updateMetaDataValue = (keyPath, value) => {
    const keys = keyPath.split('.');
    console.log(keyPath, value);

    const updateRecursively = (keys, value, currentObj) => {
        const key = keys[0];
        const remainingKeys = keys.slice(1);

        if (typeof value === 'object' && value !== null) {
            
            updateRecursively(remainingKeys, value, currentObj[key]);
        } else {
            currentObj[key] = value;
        }
    };

    updateRecursively(keys, value, metaEditor.metaData);
};

export const getItemsFromPath = ( pathParts ) => {
    let result = metaEditor.metaData;
    for (const key of pathParts) {
        result = result[key];
    }

    return result;
}