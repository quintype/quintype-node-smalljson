export function stringify(v: any, options: SmallJsonOptions = {}): string {
  return JSON.stringify(pack(v, options));
}

export function pack(v: any, packingOptions: SmallJsonOptions = {}): SmallJson {
  return {
    data: v,
    meta: {
      packingOptions
    }
  };
}
