import test from 'node:test';
import assert from 'node:assert/strict';
import { checkCapacity } from '../src/rules/capacity.js';

test('accepts an ordinary quantity', () => {
  const result = checkCapacity(2, 20);
  assert.equal(result.valid, true);
  assert.equal(result.reason, null);
  assert.equal(result.allowedMax, 6);
  assert.match(result.message, /up to 6 tickets/);
});

test('accepts exactly 6 tickets when seats allow', () => {
  const result = checkCapacity(6, 10);
  assert.equal(result.valid, true);
  assert.equal(result.allowedMax, 6);
});

test('rejects 7 tickets as over the booking limit', () => {
  const result = checkCapacity(7, 20);
  assert.equal(result.valid, false);
  assert.equal(result.reason, 'over_limit');
  assert.ok(result.allowedMax <= 6);
});

test('rejects more tickets than seats remaining', () => {
  const result = checkCapacity(4, 3);
  assert.equal(result.valid, false);
  assert.equal(result.reason, 'not_enough_seats');
  assert.equal(result.allowedMax, 3);
  assert.match(result.message, /Only 3 seats left/);
});

test('rejects a sold-out event', () => {
  const result = checkCapacity(1, 0);
  assert.equal(result.valid, false);
  assert.equal(result.reason, 'sold_out');
  assert.equal(result.allowedMax, 0);
});

test('rejects fewer than one ticket', () => {
  const result = checkCapacity(0, 10);
  assert.equal(result.valid, false);
  assert.equal(result.reason, 'too_few');
});

test('never allows more than the seats left when seats are below the limit', () => {
  const result = checkCapacity(5, 2);
  assert.equal(result.valid, false);
  assert.equal(result.allowedMax, 2);
});
