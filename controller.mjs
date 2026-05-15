import { createInitialState, resetRollSession, toggleExclusiveSelection, disableReroll, addDie } from './app-state.mjs';
import { rollDie, rollExplosionChain } from './dice-service.mjs';
import { renderApp } from './renderer.mjs';
import { DOM_ELEMENT_IDS, DOM_ATTRIBUTES, GAME_CONFIG, CSS_CLASSES } from './constants.mjs';

const elements = {};
const appState = createInitialState();

function cacheDom() {
    elements.body = document.body;
    elements.themeToggle = document.getElementById(DOM_ELEMENT_IDS.THEME_TOGGLE);
    elements.target = document.getElementById(DOM_ELEMENT_IDS.TARGET);
    elements.count = document.getElementById(DOM_ELEMENT_IDS.COUNT);
    elements.bonusValue = document.getElementById(DOM_ELEMENT_IDS.BONUS_VALUE);
    elements.expl = document.getElementById(DOM_ELEMENT_IDS.EXPLOSION_CHECKBOX);
    elements.tile2 = document.getElementById(DOM_ELEMENT_IDS.EXPLOSION_TILE);
    elements.rollBtn = document.getElementById(DOM_ELEMENT_IDS.ROLL_BUTTON);
    elements.rerollBtn = document.getElementById(DOM_ELEMENT_IDS.REROLL_BUTTON);
    elements.results = document.getElementById(DOM_ELEMENT_IDS.RESULTS);
}

function toggleTheme() {
    const currentTheme = elements.body.getAttribute(DOM_ATTRIBUTES.DATA_THEME);
    elements.body.setAttribute(DOM_ATTRIBUTES.DATA_THEME, currentTheme === DOM_ATTRIBUTES.THEME_DARK ? DOM_ATTRIBUTES.THEME_LIGHT : DOM_ATTRIBUTES.THEME_DARK);
}

function syncExplosionTile() {
    elements.tile2.classList.toggle('active', elements.expl.checked);
}

function getBonusValue() {
    return Number.parseInt(elements.bonusValue.value, 10) || 0;
}

function render() {
    renderApp({ state: appState, dom: elements });
}

function rollDice() {
    resetRollSession(appState);

    const diceCount = Number.parseInt(elements.count.value, 10) || 0;
    const bonus = getBonusValue();

    for (let index = 0; index < diceCount; index++) {
        const die = rollDie(appState, bonus, false);
        addDie(appState, die);

        if (elements.expl.checked && die.natural === 10) {
            rollExplosionChain(appState, bonus);
        }
    }

    render();
}

function rerollSelectedDie() {
    if (!appState.rerollAvailable) {
        return;
    }

    const selectedIndex = appState.dice.findIndex(die => die.selected);

    if (selectedIndex === -1) {
        render();
        return;
    }

    appState.dice.splice(selectedIndex, 1);

    const bonus = getBonusValue();
    const rerolledDie = rollDie(appState, bonus, false);
    addDie(appState, rerolledDie);

    if (elements.expl.checked && die.natural === GAME_CONFIG.NATURAL_EXPLOSIVE) {
        rollExplosionChain(appState, bonus);
    }

    disableReroll(appState);
    render();
}

function handleDieClick(event) {
    const dieElement = event.target.closest(`.${CSS_CLASSES.DIE}`);

    if (!dieElement || !elements.results.contains(dieElement)) {
        return;
    }

    const dieId = Number(dieElement.dataset.dieId);

    if (!Number.isNaN(dieId)) {
        toggleExclusiveSelection(appState, dieId);
        render();
    }
}

function bindEvents() {
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.target.addEventListener('change', render);
    elements.expl.addEventListener('change', () => {
        syncExplosionTile();
        render();
    });
    elements.rollBtn.addEventListener('click', rollDice);
    elements.rerollBtn.addEventListener('click', rerollSelectedDie);
    elements.results.addEventListener('click', handleDieClick);
}

export function startApp() {
    cacheDom();
    bindEvents();
    syncExplosionTile();
}
