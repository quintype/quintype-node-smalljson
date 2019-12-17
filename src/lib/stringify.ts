export function stringify(v: any, options: SmallJsonOptions = {}): string {
  return JSON.stringify(pack(v, options));
}

export function pack(value: any, packingOptions: SmallJsonOptions = {}): SmallJson {
  const included: { readonly [key: string]: any } = {};

  const shrunkVersion = _pack(value, included, packingOptions);

  return {
    data: shrunkVersion,
    id: '0',
    included: Object.entries(included).map(([id, v]) => ({
      data: v,
      id,
      type: 'included'
    })),
    meta: {
      packingOptions
    },
    type: 'smalljson'
  };
}

function _pack(
  value: any,
  included: { readonly [key: string]: any },
  packingOptions: SmallJsonOptions
): any {
  // Please see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof for all possible responses for typeof
  // tslint:disable: no-if-statement
  if (Array.isArray(value)) {
    return value.map(v => _pack(v, included, packingOptions));
  } else if (value && typeof value === 'object') {
    // This handles objects, but skips null (typeof null === 'object')
    return (Object as any).fromEntries(
      Object.entries(value).map(([key, v]) => [key, _pack(v, included, packingOptions)])
    );
  } else {
    return value;
  }
}
