// tslint:disable:no-expression-statement
import { pack, parse, stringify, unpack } from './index';

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
];

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
    expect(unpack(pack(i, { extractKeys: new Set(['unused']) }))).toEqual(i);
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

  const stringified = stringify(r, { extractKeys: new Set(['sections']) });
  expect(stringified.length).toBeLessThan(JSON.stringify(r).length / 3);
  expect(parse(stringified)).toEqual(r);
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

  const stringified = stringify(r, { extractKeys: new Set(['sections', 'collection']) });
  expect(stringified.length).toBeLessThan(JSON.stringify(r).length / 3);
  expect(parse(stringified)).toEqual(r);
});
