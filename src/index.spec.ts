// tslint:disable:no-expression-statement
import { pack, parse, stringify, unpack } from './index';

const SIMPLE_OBJECTS: ReadonlyArray<any> = [
  4,
  'string',
  ['array'],
  { foo: 'bar' },
  { outer: { inner: 'value' } },
  [{ array: { of: 'objects' } }],
  null,
  { foo: null },
  undefined,
];

SIMPLE_OBJECTS.forEach(i =>
  test(`packing and unpacking retains the original value: ${JSON.stringify(i)}`, () => {
    expect(unpack(pack(i))).toEqual(i);
    expect(parse(stringify(i))).toEqual(i);
  })
);
