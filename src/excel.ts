export async function setCustomProperties(properties: {key: string, value: string}[]) {
    return await Excel.run(async function (context) {
        let customProperties = context.workbook.properties.custom;
        customProperties.load();
        await context.sync();
        for (let i = 0; i < properties.length; i++) {
            customProperties.add(properties[i].key, properties[i].value);
        }
        return await context.sync();
    });
}

export async function getCustomProperties(propertyKeys: string[]) {
    return await Excel.run(async function (context) {
        let customProperties = context.workbook.properties.custom;
        let propertiesToReturn = [];
        customProperties.load();
        await context.sync();
        for (let i = 0; i < customProperties.items.length; i++) {
            if (propertyKeys.includes(customProperties.items[i].key)) {
                propertiesToReturn.push(customProperties.items[i]);
            }
        }
        return propertiesToReturn;
    });
}

export async function writeToSpreadSheet() {
    await Excel.run(async (context) => {
        let sheet = context.workbook.worksheets.getItem("Sheet1");
    
        let range = sheet.getRange("C3");
        range.values = [[ 5 ]];
    
        await context.sync();
    });
}
