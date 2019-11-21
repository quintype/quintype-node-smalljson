// tslint:disable:no-expression-statement
import test from 'ava';
import { parse, stringify } from './index';

test('parsing and stringifying a number remains the same', t => {
  t.is(4, parse(stringify(4)));
});
