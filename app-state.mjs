const HISTORY_LIMIT = 10;

export function createInitialState() {
    return {
        dice: [],
        history: [],
        rerollAvailable: true,
        nextDieId: 1,
        nextHistoryId: 1,
    };
}

export function resetRollSession(state) {
    state.dice = [];
    state.rerollAvailable = true;
}

export function addRollHistoryEntry(state, entry) {
    state.history = [
        ...state.history,
        {
            id: state.nextHistoryId++,
            ...entry,
        },
    ].slice(-HISTORY_LIMIT);
}

export function createDie(state, natural, bonus, isExtra = false) {
    return {
        id: state.nextDieId++,
        val: natural + bonus,
        natural,
        exploded: isExtra,
        selected: false,
    };
}

export function addDie(state, die) {
    state.dice.push(die);
}

export function toggleExclusiveSelection(state, dieId) {
    if (!state.rerollAvailable) {
        return;
    }

    state.dice = state.dice.map(die => ({
        ...die,
        selected: die.id === dieId ? !die.selected : false,
    }));
}

export function disableReroll(state) {
    state.rerollAvailable = false;
}
