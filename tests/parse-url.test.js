import { it } from 'node:test';
import  assert  from 'node:assert';

import parse from '../src/parse-url.js';

it('should handle empty', () => {
  const url = '';
  const expected = [['/', []]];
  const actual = parse(url);
  assert.deepStrictEqual(actual, expected);
});

it('should handle /', () => {
  const url = '/';
  const expected = [['/', []]];
  const actual = parse(url);
  assert.deepStrictEqual(actual, expected);
});

it('should handle /a', () => {
  const url = '/a';
  const expected = [['/', ['a']], ['/a', []]];
  const actual = parse(url);
  assert.deepStrictEqual(actual, expected);
});

it('should handle /a/', () => {
  const url = '/a/';
  const expected = [['/', ['a']], ['/a', []]];
  const actual = parse(url);
  assert.deepStrictEqual(actual, expected);
});

it('should handle /a/b', () => {
  const url = '/a/b';
  const expected = [['/', ['a', 'b']], ['/a', ['b']], ['/a/b', []]];
  const actual = parse(url);
  assert.deepStrictEqual(actual, expected);
});

it('should handle /a/b/', () => {
  const url = '/a/b/';
  const expected = [['/', ['a','b']], ['/a', ['b']], ['/a/b', []]];
  const actual = parse(url);
  assert.deepStrictEqual(actual, expected);
});