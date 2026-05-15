import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, addRollHistoryEntry } from '../app-state.mjs';

test('initial state includes an empty roll history', () => {
    const state = createInitialState();

    assert.deepEqual(state.history, []);
    assert.equal(state.nextHistoryId, 1);
});

test('roll history keeps only the most recent entries', () => {
    const state = createInitialState();

    for (let index = 0; index < 11; index++) {
        addRollHistoryEntry(state, {
            dice: [{ id: index + 1, val: index + 1, natural: index + 1, exploded: false, selected: false }],
            target: 10,
            bonus: 0,
            explosionsEnabled: false,
            createdAt: new Date().toISOString(),
        });
    }

    assert.equal(state.history.length, 10);
    assert.equal(state.history[0].id, 2);
    assert.equal(state.history.at(-1).id, 11);
});
