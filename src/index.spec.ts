// tslint:disable:no-expression-statement
import hash from 'object-hash';
import { pack, parse, stringify, unpack } from './index';

function hashingFunction(_, value): string {
  return hash(value, { encoding: 'base64' }).substring(0, 5);
}

const SIMPLE_OBJECT: ReadonlyArray<any> = [
  4,
  'string',
  ['array'],
  { foo: 'bar' },
  { outer: { inner: 'value' } },
  [{ array: { of: 'objects' } }],
  null,
  { foo: null },
  undefined
].map(i => Object.freeze(i));

SIMPLE_OBJECT.forEach(i => {
  test(`packing and unpacking retains the original value without options: ${JSON.stringify(
    i
  )}`, () => {
    expect(unpack(pack(i))).toEqual(i);
    expect(parse(stringify(i))).toEqual(i);
  });

  test(`packing and unpacking retains the original value with irrelevant options: ${JSON.stringify(
    i
  )}`, () => {
    expect(unpack(pack(i, { extractKeys: new Set(['unused']), hashingFunction }))).toEqual(i);
  });
});

test('removes common sections from the same story 10 times', () => {
  const r = {
    stories: new Array(20).fill({
      sections: [
        {
          collection: { slug: 'opinion', name: 'Opinion', id: 1013 },
          data: null,
          'display-name': 'Opinion',
          'domain-slug': null,
          id: 2794,
          name: 'Opinion',
          'parent-id': 2779,
          'section-url': 'https://www.mysite.com/voices/my/opinion',
          slug: 'opinion'
        }
      ]
    })
  };

  const originalJson = JSON.stringify(r);
  const stringified = stringify(r, { extractKeys: new Set(['sections']), hashingFunction });
  expect(stringified.length).toBeLessThan(originalJson.length / 3);
  expect(parse(stringified)).toEqual(r);

  // Just confirming r was not mutated
  expect(JSON.stringify(r)).toEqual(originalJson);
});

test('it can also handle nested items', () => {
  const r = {
    stories: new Array(20).fill({
      sections: [
        {
          collection: { slug: 'opinion', name: 'Opinion', id: 1013 },
          data: null,
          'display-name': 'Opinion',
          'domain-slug': null,
          id: 2794,
          name: 'Opinion',
          'parent-id': 2779,
          'section-url': 'https://www.mysite.com/voices/my/opinion',
          slug: 'opinion'
        }
      ]
    })
  };

  const originalJson = JSON.stringify(r);
  const stringified = stringify(r, { extractKeys: new Set(['sections']), hashingFunction });
  expect(stringified.length).toBeLessThan(originalJson.length / 3);
  expect(parse(stringified)).toEqual(r);

  // Just confirming r was not mutated
  expect(JSON.stringify(r)).toEqual(originalJson);
});

test('it is able to pack and unpack simple objects when key matches', () => {
  expect(unpack(pack({ foo: 'bar' }, { extractKeys: new Set(['foo']), hashingFunction }))).toEqual({
    foo: 'bar'
  });
  expect(unpack(pack({ foo: 4 }, { extractKeys: new Set(['foo']), hashingFunction }))).toEqual({
    foo: 4
  });
  expect(unpack(pack({ foo: null }, { extractKeys: new Set(['foo']), hashingFunction }))).toEqual({
    foo: null
  });
});

test('it can delete keys', () => {
  expect(unpack(pack({ foo: 'bar' }, { deleteKeys: new Set(['foo']) }))).toEqual({});
});

test('it can delete nulls', () => {
  expect(unpack(pack({ foo: null }, { deleteNulls: true }))).toEqual({});
});
