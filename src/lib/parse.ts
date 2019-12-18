/**
 * Parses a json string then unpacks it
 * @param value Packed string
 */
export function parse(value: string): any {
  return unpack(JSON.parse(value) as SmallJson);
}

/**
 * Unpacks the given value
 * @param value Value to unpack
 */
export function unpack(value: SmallJson): any {
  return _unpack(value.data, value.meta.randomString, fromArray(value.included));
}

/** @private */
function fromArray(included: readonly SmallJsonIncludedItem[]): { readonly [key: string]: any } {
  const acc = {};
  for (const { id, data } of included) {
    // tslint:disable-next-line: no-object-mutation no-expression-statement
    acc[id] = data;
  }
  return acc;
}

/** @private */
function _unpack(value: any, randomString: string, included: { readonly [key: string]: any }): any {
  // Please see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof for all possible responses for typeof
  // tslint:disable: no-if-statement
  if (Array.isArray(value)) {
    return value.map(v => _unpack(v, randomString, included));
  } else if (value && typeof value === 'object' && value.type === randomString) {
    return _unpack(included[value.id], randomString, included);
  } else if (value && typeof value === 'object') {
    const ret = {};
    const valueToUnpack = value.type === randomString ? included[value.id] : value;
    for (const key in valueToUnpack) {
      if (!value.hasOwnProperty(key)) {
        continue;
      }
      // tslint:disable-next-line: no-object-mutation no-expression-statement
      ret[key] = _unpack(valueToUnpack[key], randomString, included);
    }
    return ret;
  } else {
    return value;
  }
}
