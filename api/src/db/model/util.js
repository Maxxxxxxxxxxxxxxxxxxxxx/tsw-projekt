// @ts-nocheck
function isObject(variable) {
  if (variable !== null && typeof variable === "object") {
    return true;
  }
  return false;
}

function trimPattern(input) {
  const patternRegex = /(\w+)\.(\w+)/;
  const trimmed = input.replace(patternRegex, "$2");

  return trimmed;
}

export function _mapRecordsToObject(records) {
  return records.map((record) => {
    const newRecord = {};

    record.keys.forEach((key, index) => {
      newRecord[trimPattern(key)] = isObject(record._fields[index])
        ? record._fields[index].properties
        : record._fields[index];
    });

    return Object.keys(newRecord).reduce((acc, key) => {
      const property = newRecord[key];
      if (isObject(property)) {
        return { ...acc, ...property };
      } else {
        let newAcc = acc;
        newAcc[key] = property;
        return newAcc;
      }
    }, {});
  });
}
