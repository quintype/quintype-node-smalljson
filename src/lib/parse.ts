export function parse(value: string): any {
  return unpack(JSON.parse(value) as SmallJson);
}

export function unpack(value: SmallJson): any {
  return value.data;
}
