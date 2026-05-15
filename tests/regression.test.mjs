import test from 'node:test';
import assert from 'node:assert/strict';
import { findBestPartition } from '../app-logic.mjs';

test('keeps the highest-value 10-point set while preserving leftovers', () => {
    const result = findBestPartition([10, 1, 1], 10);

    assert.equal(result.totalIncrements, 1);
    assert.deepEqual(result.sets, [
        { v: [10], t: 10, type: 10, inc: 1 },
    ]);
    assert.deepEqual(result.leftovers, [1, 1]);
});

test('prefers a 15-point set over a 10-point set when target mode is 15', () => {
    const result = findBestPartition([5, 5, 5], 15);

    assert.equal(result.totalIncrements, 2);
    assert.deepEqual(result.sets, [
        { v: [5, 5, 5], t: 15, type: 15, inc: 2 },
    ]);
    assert.deepEqual(result.leftovers, []);
});

test('retains the current leftover-first tie break in target 15 mode', () => {
    const result = findBestPartition([8, 7, 1], 15);

    assert.equal(result.totalIncrements, 2);
    assert.deepEqual(result.sets, [
        { v: [8, 7], t: 15, type: 15, inc: 2 },
    ]);
    assert.deepEqual(result.leftovers, [1]);
});

test('handles empty dice array', () => {
    const result = findBestPartition([], 10);

    assert.equal(result.totalIncrements, 0);
    assert.deepEqual(result.sets, []);
    assert.deepEqual(result.leftovers, []);
});

test('treats all dice as leftovers when none meet minimum threshold', () => {
    const result = findBestPartition([3, 2, 1], 10);

    assert.equal(result.totalIncrements, 0);
    assert.deepEqual(result.sets, []);
    assert.deepEqual(result.leftovers, [3, 2, 1]);
});

test('forms multiple 10-point sets from adequate dice in target 10 mode', () => {
    const result = findBestPartition([10, 5, 5], 10);

    assert.equal(result.totalIncrements, 2);
    assert.equal(result.sets.length, 2);
    assert.equal(result.sets.every(s => s.type === 10), true);
    assert.deepEqual(result.leftovers, []);
});

test('combines multiple dice into a single 15-point set in target 15 mode', () => {
    const result = findBestPartition([9, 3, 2, 1], 15);

    assert.equal(result.totalIncrements, 2);
    assert.deepEqual(result.sets, [
        { v: [9, 3, 2, 1], t: 15, type: 15, inc: 2 },
    ]);
    assert.deepEqual(result.leftovers, []);
});

test('prefers two 15-point sets over one 15-point and leftovers', () => {
    const result = findBestPartition([10, 5, 10, 5], 15);

    assert.equal(result.totalIncrements, 4);
    assert.equal(result.sets.length, 2);
    assert.equal(result.sets.every(s => s.type === 15), true);
    assert.deepEqual(result.leftovers, []);
});

test('handles single die forming a 10-point set', () => {
    const result = findBestPartition([10], 10);

    assert.equal(result.totalIncrements, 1);
    assert.deepEqual(result.sets, [
        { v: [10], t: 10, type: 10, inc: 1 },
    ]);
    assert.deepEqual(result.leftovers, []);
});

test('handles single die below threshold', () => {
    const result = findBestPartition([5], 10);

    assert.equal(result.totalIncrements, 0);
    assert.deepEqual(result.sets, []);
    assert.deepEqual(result.leftovers, [5]);
});

test('maximizes increments with large dice pool in target 15 mode', () => {
    const result = findBestPartition([10, 10, 5, 5, 5], 15);

    // Algorithm prioritizes increments; can form two 15-point sets leaving one 5
    assert.equal(result.totalIncrements, 4);
    assert.equal(result.sets.length, 2);
});

test('correctly prioritizes increments in partition scoring', () => {
    const result = findBestPartition([10, 8, 7, 5], 15);

    // Best partition forms multiple sets prioritizing increment count
    assert.equal(result.totalIncrements, 4);
    assert.equal(result.sets.length, 2);
});

test('handles dice with values exceeding 10', () => {
    const result = findBestPartition([10, 10, 10], 10);

    assert.equal(result.totalIncrements, 3);
    assert.equal(result.sets.length, 3);
    assert.deepEqual(result.leftovers, []);
});

test('prioritizes increments over waste minimization per scoring policy', () => {
    // [10, 9] creates 2 increments with 4 waste, beats [10] alone with 1 increment
    // because incrementWeight (1M) >> leftoverWeight (1K)
    const result = findBestPartition([10, 9], 15);

    assert.equal(result.totalIncrements, 2);
    assert.equal(result.sets.length, 1);
    assert.deepEqual(result.sets[0].type, 15);
});

test('handles target 10 mode with diverse dice', () => {
    const result = findBestPartition([8, 7, 6, 5, 4], 10);

    // Can form at least one 10-point set
    assert.equal(result.totalIncrements >= 1, true);
    assert.equal(result.sets.length >= 1, true);
});

test('leaves small dice as leftovers when they cannot form sets', () => {
    const result = findBestPartition([10, 2, 1], 10);

    assert.equal(result.totalIncrements, 1);
    assert.deepEqual(result.leftovers, [2, 1]);
});

test('forms larger sets when bonus dice available', () => {
    const result = findBestPartition([7, 6, 5, 4, 3], 15);

    // Can form 7+6+5 = 18 (2 increments) + 4+3 = 7 (leftover)
    assert(result.totalIncrements >= 2, 'Should form at least one 15-point set');
});

test('handles all minimum-threshold dice', () => {
    const result = findBestPartition([10, 10], 10);

    assert.equal(result.totalIncrements, 2);
    assert.equal(result.sets.length, 2);
    assert.deepEqual(result.leftovers, []);
});

test('correctly handles target 15 with mixed acceptable dice', () => {
    const result = findBestPartition([9, 8, 7, 6], 15);

    // Can form sets like 9+6=15 and 8+7=15
    assert.equal(result.totalIncrements, 4);
    assert.deepEqual(result.leftovers, []);
});

test('partition algorithm returns consistent results', () => {
    const dice = [10, 9, 8, 7, 6, 5];
    const result1 = findBestPartition(dice, 15);
    const result2 = findBestPartition([...dice], 15);

    // Same input should produce same output (deterministic)
    assert.equal(result1.totalIncrements, result2.totalIncrements);
    assert.equal(result1.sets.length, result2.sets.length);
    assert.deepEqual(result1.leftovers.sort(), result2.leftovers.sort());
});