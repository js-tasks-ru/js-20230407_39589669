/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let result = '';

  let tmp = [];

  let prev = '';
  let pos = -1;

  for (let i of string) {
    if (i !== prev) {
      pos++;
      prev = i;
    }
    tmp[pos] = (tmp[pos] ?? '') + i;
  }
  for (let i of tmp) {
    result += '' + i.slice(0, size);
  }
  return result;
}
