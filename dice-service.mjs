import { addDie, createDie } from './app-state.mjs';
import { GAME_CONFIG } from './constants.mjs';

export function rollDie(state, bonus, isExtra = false) {
    const natural = Math.floor(Math.random() * 10) + 1;
    return createDie(state, natural, bonus, isExtra);
}

export function rollExplosionChain(state, bonus) {
    const extraDie = rollDie(state, bonus, true);
    addDie(state, extraDie);

    if (extraDie.natural === GAME_CONFIG.NATURAL_EXPLOSIVE) {
        rollExplosionChain(state, bonus);
    }
}
