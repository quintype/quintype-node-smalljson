// tslint:disable: readonly-keyword
/**
 * Options for {@link pack}ing objects.
 */
export interface SmallJsonOptions {
  /** List of keys to be deleted. Keys deleted this way cannot be recovered */
  readonly deleteKeys?: Set<string>;

  /** List of keys to be moved to the included section. A hashingFunction must be passed to use this. */
  readonly extractKeys?: Set<string>;

  /** Remove keys that are null. Keys deleted this way cannot be recovered */
  readonly deleteNulls?: boolean;

  /** randomString to be used as the type of included objects. Defaults to qTyp3 */
  readonly randomString?: string;

  /** Function for hashing */
  // tslint:disable-next-line: no-mixed-interface
  readonly hashingFunction?: (key: string, value: any) => string;
}

/**
 * Packs an object then converts it to a string with JSON.stringify. See [@link pack]
 *
 * ```javascript
 * const packedVersion = pack(object, {
 *   extractKeys: new Set(["sections", "authors"])
 * })
 * ```
 *
 * @param v Item to be stringified
 * @param options Options to pack
 */
export function stringify(v: any, packingOptions: SmallJsonOptions = {}): string {
  return JSON.stringify(pack(v, packingOptions));
}

/**
 * Packs an object using the provided options.
 * @param value Value to be packed
 * @param packingOptions Options
 */
export function pack(value: any, packingOptions: SmallJsonOptions = {}): SmallJson {
  const included: { readonly [key: string]: SmallJsonIncludedItem } = {};

  const randomString = packingOptions.randomString || 'qTyp3';
  const shrunkVersion = _pack(value, included, {
    ...packingOptions,
    randomString
  });

  return {
    data: shrunkVersion,
    id: '0',
    included: Object.entries(included).map(([id, v]) => ({
      data: v,
      id,
      type: randomString
    })),
    meta: {
      randomString
    },
    type: 'smalljson'
  };
}

/** @private */
function _pack(
  value: any,
  included: { [key: string]: SmallJsonIncludedItem },
  packingOptions: SmallJsonOptions
): any {
  // Please see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof for all possible responses for typeof
  // tslint:disable: no-if-statement
  if (Array.isArray(value)) {
    return value.map(v => _pack(v, included, packingOptions));
  } else if (value && typeof value === 'object') {
    // This handles objects, but skips null (typeof null === 'object')
    // Using a for loop because this is a hot path
    const ret = {};
    for (const [key, v] of Object.entries(value)) {
      if (packingOptions.deleteKeys && packingOptions.deleteKeys.has(key)) {
        continue;
      }

      if (packingOptions.deleteNulls && v === null) {
        continue;
      }

      const packedValue = _pack(v, included, packingOptions);
      // tslint:disable-next-line: prefer-conditional-expression
      if (
        packingOptions.extractKeys &&
        packingOptions.extractKeys.has(key) &&
        packingOptions.hashingFunction
      ) {
        // tslint:disable-next-line: no-object-mutation no-expression-statement
        ret[key] = addToIncluded(key, packedValue, included, packingOptions);
      } else {
        // tslint:disable-next-line: no-object-mutation no-expression-statement
        ret[key] = packedValue;
      }
    }
    return ret;
  } else {
    return value;
  }
}

/** @private */
function addToIncluded(
  key: string,
  value: any,
  included: { [x: string]: any },
  packingOptions: SmallJsonOptions
): any {
  if (!value) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(v => addToIncluded(key, v, included, packingOptions));
  }

  const objectHash = packingOptions.hashingFunction(key, value);

  if (!included[objectHash]) {
    // tslint:disable-next-line: no-expression-statement no-object-mutation
    included[objectHash] = _pack(value, included, packingOptions);
  }

  return { type: packingOptions.randomString, id: objectHash };
}
