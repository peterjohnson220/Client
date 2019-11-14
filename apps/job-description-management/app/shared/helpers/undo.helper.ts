import * as cloneDeep from 'lodash.clonedeep';
import * as isEqual from 'lodash.isequal';
import * as transform from 'lodash/transform';
import * as isObject from 'lodash/isObject';
import * as mergeWith from 'lodash/mergeWith';

export class UndoHelper {
    // Certain operations trigger saves where everything is the same except a date field.
    // This is to avoid creating undo points that won't actually change anything for the user.
    static needsUndoPoint = (prop) => {
      for (const propName in prop) {
          if (prop.hasOwnProperty(propName) && !ignoredColumn(propName)) {
              return true;
          }
      }
      return false;
    }

    static getUndoPoint = (source, dest) => {
      return deepCompareWithExclusions(source, dest);
    }

    // Elements in source are considered changes in dest object. Everything found in source will be treated as an add, remove, or update for dest.
    // Undefined in arrays are considered deletion operations. Elements of arrays passed in will be considered additions. Values will be considered updates.
    static applyUndo = (source, dest) => {
      for (const propName in source) {
        // CreatedDate is not relevant for undo as a save is triggered after undo operation, causing it to be generated then.
        if (source.hasOwnProperty(propName) && propName !== 'CreatedDate' && typeof source[propName] !== 'undefined') {
          if (typeof (source[propName]) !== 'object') {
            dest[propName] = cloneDeep(source[propName]);
          } else if (propName === 'Controls') {
            // Changes happen in the Data layer but the Controls layer needs to be regenerated due to the way OnPush strategy is used
            const mergeArr = mergeWith(cloneDeep(source[propName]), dest[propName], mergeCopyArrays);
            mergeDelete(source[propName], mergeArr);
            dest[propName] = cloneDeep(mergeArr);
          } else {
            UndoHelper.applyUndo(source[propName], dest[propName]);
          }
        }
      }
    }
}

const ignoredColumns = ['PublishDate', 'CreatedDate', 'LastUpdatedDate', 'JobDescriptionRevision', 'JobDescriptionStatus', 'DraftNumber'];

// Used in conjunction with lodash mergeWith to return value changes after deep searching the object
function mergeCopyArrays(objValue, srcValue) {
    if (typeof (objValue) !== 'object' && objValue !== undefined && objValue !== srcValue) {
        return objValue;
    }
}

// Searches through object and compares every property with base. Items found in object that are not in base will be returned in the result set.
// The result set being passed through an undo function will consider such differences additions to an array.
function deepCompareWithInclusions(object, base) {
  function changes(objectParam, baseParam) {
    return transform(objectParam, function (result, value, key) {
        if (!isEqual(value, baseParam[key])) {
            result[key] = (isObject(value) && isObject(baseParam[key])) ? changes(value, baseParam[key]) : value;
        }
    });
  }
  return changes(object, base);
}

// Searches through object and compares every property with base. Items found in object that are not in base will be considered deletions and
// returned as undefined in the result set. Undefined elements in the array will function as deletions when passed through the undo function.
// Non modified array objects are passed in as empty and not included in the array keys. If there are values modified, such as text or integers,
// they will be included in the result set. When passed through the undo function they will be considered updates.
function deepCompareWithExclusions(object, base) {
    function changes(objectParam, baseParam) {
        return transform(objectParam, function (result, value, key) {
            if (Array.isArray(value) && value.length < baseParam[key].length) {
                result[key] = deepCompareWithInclusions(baseParam[key], value);
            } else if (!isEqual(value, baseParam[key]) && !ignoredColumn(key)) {
                result[key] = (isObject(value) && isObject(base[key])) ? changes(value, baseParam[key]) : baseParam[key];
            }
        });
    }
    return changes(object, base);
}

// Detects and processes deletions in undo (passed in as undefined in array elements)
function mergeDelete(source, dest) {
    for (const propName in source) {
        if (source.hasOwnProperty(propName)) {
            let removed = false;
            if (Array.isArray(source[propName])) {
                const toBeRemoved = [];
                for (const key in source[propName]) {
                    if (source[propName][key] === undefined) {
                        toBeRemoved.push(key);
                    }
                }
                if (toBeRemoved.length > 0) {
                    const propArray = cloneDeep(dest[propName]);
                    // Deletes processed in reverse because iterating forward while doing deletes causes the indexes to be moved
                    for (let i = toBeRemoved.length - 1; i >= 0; i--) {
                        propArray.splice(toBeRemoved[i], 1);
                    }
                    dest[propName] = propArray;
                    removed = true;
                }
            }
            if (!removed && typeof (source[propName]) !== 'object') {
            } else {
                mergeDelete(source[propName], dest[propName]);
            }
        }
    }
}

function ignoredColumn(key) {
    return ignoredColumns.indexOf(key) > -1;
}
