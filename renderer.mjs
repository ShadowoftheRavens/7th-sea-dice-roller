import { findBestPartition } from './app-logic.mjs';
import { UI_LABELS, CSS_CLASSES, DOM_ELEMENT_IDS, GAME_CONFIG } from './constants.mjs';

export function renderApp({ state, dom }) {
    if (state.dice.length === 0) {
        dom.results.innerHTML = '';
        dom.rerollBtn.style.display = 'none';
        return;
    }

    const target = Number.parseInt(dom.target.value, 10);
    const result = findBestPartition(state.dice.map(die => die.val), target);

    dom.rerollBtn.style.display = state.rerollAvailable && state.dice.some(die => die.selected) ? 'block' : 'none';
    dom.results.innerHTML = buildResultsMarkup(state.dice, result);
}

function buildResultsMarkup(dice, result) {
    return [
        renderDiceSection(dice),
        renderSummarySection(result.totalIncrements),
        renderCombinationsSection(result.sets),
        renderLeftoversSection(result.leftovers),
    ].join('');
}

function renderDiceSection(dice) {
    return `<h3>${UI_LABELS.DICE_ROLLED}</h3><div class="${CSS_CLASSES.DICE_GRID}">${buildDiceMarkup(dice)}</div>`;
}

function renderSummarySection(totalIncrements) {
    const label = totalIncrements === 1 ? UI_LABELS.INCREMENT_SINGULAR : UI_LABELS.INCREMENT_PLURAL;
    return `<div class="${CSS_CLASSES.SUMMARY_BOX}">${totalIncrements} ${label}</div>`;
}

function renderCombinationsSection(sets) {
    if (sets.length === 0) {
        return '';
    }

    return `<h3>${UI_LABELS.COMBINATIONS}</h3>${buildSetMarkup(sets)}`;
}

function renderLeftoversSection(leftovers) {
    if (leftovers.length === 0) {
        return '';
    }

    return `<h3>${UI_LABELS.LEFTOVERS}</h3><div class="${CSS_CLASSES.WASTE_CONTAINER}">${UI_LABELS.LEFTOVERS_LABEL}${[...leftovers].sort((a, b) => b - a).join(', ')}</div>`;
}

function buildDiceMarkup(dice) {
    return dice
        .map((die, index) => {
            const selectedClass = die.selected ? CSS_CLASSES.DIE_SELECTED : '';
            const explosionMarkup = die.exploded ? `<span class="${CSS_CLASSES.EXPLOSION_BADGE}">EXT</span>` : '';
            return `<div class="${CSS_CLASSES.DIE} ${selectedClass}" data-index="${index}" data-die-id="${die.id}">${die.val}${explosionMarkup}</div>`;
        })
        .join('');
}

function buildSetMarkup(sets) {
    return sets
        .map(set => {
            const setClass = set.type === GAME_CONFIG.SET_VALUE_15 ? CSS_CLASSES.SET_15 : CSS_CLASSES.SET_10;
            return `<div class="${CSS_CLASSES.SET_CONTAINER} ${setClass}">
                        <span>${set.v.join(' + ')} = <b>${set.t}</b></span>
                        <span class="${CSS_CLASSES.INCREMENT_BADGE}">+${set.inc} INC</span>
                    </div>`;
        })
        .join('');
}
