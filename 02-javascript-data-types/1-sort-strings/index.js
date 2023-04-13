/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let result = [];
  
  for (let i = 0; i < arr.length; i++) {
    result[result.length] = arr[i];
  }

  for (let i = 0; i < result.length; i++) {
    for (let y = i + 1; y < result.length; y++) {
      const comp = result[i].localeCompare(result[y], 'ru', {'caseFirst': 'upper'});
      if (param === 'asc' && comp > 0) {

        const tmp = result[i];
        result[i] = result[y];
        result[y] = tmp;

      } else if (param === 'desc' && comp < 0) {

        const tmp = result[i];
        result[i] = result[y];
        result[y] = tmp;

      }
    }
  }

  return result;

}
