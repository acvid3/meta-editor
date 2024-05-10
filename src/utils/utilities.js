const setItemsAtPath = (pathParts, value) => {
    let obj = metaEditor.metaData;
    for (let i = 0; i < pathParts.length - 1; i++) {
        obj = obj[pathParts[i]];
    }
    obj[pathParts[pathParts.length - 1]] = value;
}

export const updateMetaDataValue = (keyPath, value) => {
    const keys = keyPath.split('.');
    
    setItemsAtPath(keys, value);

    console.log(metaEditor.metaData);
};

export const getItemsFromPath = ( pathParts ) => {
    let result = metaEditor.metaData;
    for (const key of pathParts) {
        result = result[key];
    }

    return result;
}