import { findBestPartition } from './app-logic.mjs';
import { UI_LABELS, CSS_CLASSES, DOM_ELEMENT_IDS, GAME_CONFIG } from './constants.mjs';
import { t } from './i18n.mjs';

export function renderApp({ state, dom }) {
    const historyHtml = renderHistorySection(state.history);
    
    // Always render history sidebar
    if (dom.historySidebar) {
        dom.historySidebar.innerHTML = historyHtml;
    }
    
    if (state.dice.length === 0) {
        dom.results.innerHTML = '';
        dom.rerollBtn.style.display = 'none';
        return;
    }

    const target = Number.parseInt(dom.target.value, 10);
    const result = findBestPartition(state.dice.map(die => die.val), target);

    dom.rerollBtn.style.display = state.rerollAvailable && state.dice.some(die => die.selected) ? 'block' : 'none';
    
    const resultsContent = [
        renderDiceSection(state.dice),
        renderSummarySection(result.totalIncrements),
        renderCombinationsSection(result.sets),
        renderLeftoversSection(result.leftovers),
    ].join('');
    
    dom.results.innerHTML = resultsContent;
}

function renderDiceSection(dice) {
    return `<h3>${t('DICE_ROLLED')}</h3><div class="${CSS_CLASSES.DICE_GRID}">${buildDiceMarkup(dice)}</div>`;
}

function renderSummarySection(totalIncrements) {
    const label = totalIncrements === 1 ? t('INCREMENT_SINGULAR') : t('INCREMENT_PLURAL');
    return `<div class="${CSS_CLASSES.SUMMARY_BOX}">${totalIncrements} ${label}</div>`;
}

function renderCombinationsSection(sets) {
    if (sets.length === 0) {
        return '';
    }

    return `<h3>${t('COMBINATIONS')}</h3>${buildSetMarkup(sets)}`;
}

function renderLeftoversSection(leftovers) {
    if (leftovers.length === 0) {
        return '';
    }

    return `<h3>${t('LEFTOVERS')}</h3><div class="${CSS_CLASSES.WASTE_CONTAINER}">${t('LEFTOVERS_LABEL')}${[...leftovers].sort((a, b) => b - a).join(', ')}</div>`;
}

function renderHistorySection(history) {
    return `<section class="${CSS_CLASSES.HISTORY_SECTION}">
        <h3>${t('HISTORY')}</h3>
        ${history.length === 0 ? `<div class="${CSS_CLASSES.HISTORY_EMPTY}">${t('HISTORY_EMPTY')}</div>` : history.slice().reverse().map(renderHistoryItem).join('')}
    </section>`;
}

function renderHistoryItem(entry) {
    const diceValues = entry.dice.map((die, idx) => {
        const isRerolled = entry.isReroll && idx === entry.rerolledDieIndex;
        const className = isRerolled ? 'rerolled-die' : '';
        return `<span class="${className}">${die.val}</span>`;
    }).join(', ');
    const targetResult = findBestPartition(entry.dice.map(die => die.val), entry.target);
    const summaryLabel = targetResult.totalIncrements === 1 ? t('INCREMENT_SINGULAR') : t('INCREMENT_PLURAL');
    const timestamp = new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const explosionLabel = entry.explosionsEnabled ? t('HISTORY_EXPLOSIONS_ON') : t('HISTORY_EXPLOSIONS_OFF');
    const rerollBadge = entry.isReroll ? '<span class="reroll-badge">REROLL</span>' : '';

    return `<article class="${CSS_CLASSES.HISTORY_ITEM}">
        <div class="${CSS_CLASSES.HISTORY_META}">
            <span>${timestamp}</span>
            <span>${entry.dice.length}d10${entry.bonus ? ` +${entry.bonus}` : ''} • ${explosionLabel} ${rerollBadge}</span>
        </div>
        <div class="${CSS_CLASSES.HISTORY_DICE}">${diceValues || '-'}</div>
        <div class="${CSS_CLASSES.SUMMARY_BOX}">${targetResult.totalIncrements} ${summaryLabel}</div>
    </article>`;
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
