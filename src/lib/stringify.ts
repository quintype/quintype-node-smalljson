// tslint:disable: readonly-keyword
import hash from 'object-hash';

export function stringify(v: any, options: SmallJsonOptions = {}): string {
  return JSON.stringify(pack(v, options));
}

export function pack(value: any, packingOptions: SmallJsonOptions = {}): SmallJson {
  const included: { readonly [key: string]: SmallJsonIncludedItem } = {};

  const randomString = packingOptions.randomString || 'qTyp3';
  const shrunkVersion = _pack(value, included, { ...packingOptions, randomString });

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
    return (Object as any).fromEntries(
      Object.entries(value).map(([key, v]) => {
        const packedValue = _pack(v, included, packingOptions);
        if (packingOptions.extractKeys && packingOptions.extractKeys.has(key)) {
          return [key, addToIncluded(packedValue, included, packingOptions)];
        } else {
          return [key, packedValue];
        }
      })
    );
  } else {
    return value;
  }
}

function addToIncluded(
  value: any,
  included: { [x: string]: any },
  packingOptions: SmallJsonOptions
): any {
  if (!value) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(v => addToIncluded(v, included, packingOptions));
  }

  const objectHash = hash(value, { encoding: 'base64' }).substring(0, 5);

  if (!included[objectHash]) {
    // tslint:disable-next-line: no-expression-statement no-object-mutation
    included[objectHash] = _pack(value, included, packingOptions);
  }

  return { type: packingOptions.randomString, id: objectHash };
}
