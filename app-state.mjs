export function createInitialState() {
    return {
        dice: [],
        rerollAvailable: true,
        nextDieId: 1,
    };
}

export function resetRollSession(state) {
    state.dice = [];
    state.rerollAvailable = true;
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
