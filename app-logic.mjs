import { SCORING_WEIGHTS, GAME_CONFIG } from './constants.mjs';

export function findBestPartition(dice, targetMode) {
    const searchState = {
        best: {
            sets: [],
            leftovers: [...dice],
            totalIncrements: 0,
            score: -Infinity,
        },
    };

    searchBestPartitionIterative([...dice].sort((a, b) => b - a), targetMode, searchState);
    return searchState.best;
}

function searchBestPartitionIterative(initialRemainingDice, targetMode, searchState) {
    const stack = [{ remainingDice: initialRemainingDice, currentSets: [] }];

    while (stack.length > 0) {
        const { remainingDice, currentSets } = stack.pop();

        updateBestResult(currentSets, remainingDice, searchState);

        for (let size = 1; size <= remainingDice.length; size++) {
            const combinations = generateCombos(remainingDice, size);

            for (const combination of combinations) {
                const classifiedCombination = classifyCombination(combination, targetMode);

                if (classifiedCombination === null) {
                    continue;
                }

                stack.push({
                    remainingDice: removeComboFromDice(remainingDice, combination),
                    currentSets: [...currentSets, classifiedCombination],
                });
            }
        }
    }
}

function classifyCombination(combination, targetMode) {
    const total = combination.reduce((sum, value) => sum + value, 0);

    if (targetMode === GAME_CONFIG.TARGET_MODE_15) {
        if (total >= GAME_CONFIG.SET_VALUE_15) return createCombination(combination, total, GAME_CONFIG.SET_VALUE_15, 2);
        if (total >= GAME_CONFIG.SET_VALUE_10) return createCombination(combination, total, GAME_CONFIG.SET_VALUE_10, 1);
        return null;
    }

    if (total >= GAME_CONFIG.SET_VALUE_10) {
        return createCombination(combination, total, GAME_CONFIG.SET_VALUE_10, 1);
    }

    return null;
}

function createCombination(values, total, type, increments) {
    return { v: [...values], t: total, type, inc: increments };
}

function removeComboFromDice(remainingDice, combination) {
    const nextRemainingDice = [...remainingDice];

    combination.forEach(value => {
        const index = nextRemainingDice.indexOf(value);
        nextRemainingDice.splice(index, 1);
    });

    return nextRemainingDice;
}

function updateBestResult(currentSets, remainingDice, searchState) {
    const totalIncrements = currentSets.reduce((sum, set) => sum + set.inc, 0);
    const totalWaste = currentSets.reduce((sum, set) => sum + (set.t - set.type), 0);
    const score = calculatePartitionScore(totalIncrements, remainingDice.length, totalWaste);

    if (score <= searchState.best.score) {
        return;
    }

    searchState.best = {
        score,
        sets: currentSets.map(set => ({ ...set, v: [...set.v] })),
        leftovers: [...remainingDice],
        totalIncrements,
    };
}

function calculatePartitionScore(totalIncrements, leftoverCount, totalWaste) {
    return (totalIncrements * SCORING_WEIGHTS.incrementWeight)
        + (leftoverCount * SCORING_WEIGHTS.leftoverWeight)
        - totalWaste;
}

function generateCombos(values, size) {
    const combinations = [];
    buildCombos(values, size, 0, [], combinations);
    return combinations;
}

function buildCombos(values, targetSize, startIndex, currentCombo, combinations) {
    if (currentCombo.length === targetSize) {
        combinations.push([...currentCombo]);
        return;
    }

    for (let index = startIndex; index < values.length; index++) {
        currentCombo.push(values[index]);
        buildCombos(values, targetSize, index + 1, currentCombo, combinations);
        currentCombo.pop();
    }
}
