import { createInitialState, resetRollSession, toggleExclusiveSelection, disableReroll, addDie, addRollHistoryEntry } from './app-state.mjs';
import { rollDie, rollExplosionChain } from './dice-service.mjs';
import { renderApp } from './renderer.mjs';
import { DOM_ELEMENT_IDS, DOM_ATTRIBUTES, GAME_CONFIG, CSS_CLASSES, FOOTER_CREDITS } from './constants.mjs';
import { setLanguage, initializeLanguage, getLanguage, t } from './i18n.mjs';
import { cacheDom } from './dom-utils.mjs';

const elements = {};
const appState = createInitialState();

// DOM caching is handled by dom-utils.cacheDom

function parseIntOrZero(value) {
    return Number.parseInt(value, 10) || 0;
}

function getFormValues() {
    return {
        diceCount: parseIntOrZero(elements.count.value),
        bonus: getBonusValue(),
        target: parseIntOrZero(elements.target.value),
        explosionsEnabled: elements.expl.checked,
    };
}

function buildHistoryEntry({ dice, target, bonus, explosionsEnabled, isReroll = false, rerolledDieIndex = undefined }) {
    return {
        dice: dice.map(d => ({ ...d })),
        target,
        bonus,
        explosionsEnabled,
        createdAt: new Date().toISOString(),
        ...(isReroll ? { isReroll: true, rerolledDieIndex } : {}),
    };
}

function toggleTheme() {
    const currentTheme = elements.body.getAttribute(DOM_ATTRIBUTES.DATA_THEME);
    elements.body.setAttribute(DOM_ATTRIBUTES.DATA_THEME, currentTheme === DOM_ATTRIBUTES.THEME_DARK ? DOM_ATTRIBUTES.THEME_LIGHT : DOM_ATTRIBUTES.THEME_DARK);
}

function handleLanguageChange(lang) {
    setLanguage(lang);
    updateUILabels();
}

function syncExplosionTile() {
    elements.tile2.classList.toggle('active', elements.expl.checked);
}

function updateUILabels() {
    document.getElementById('labelNumDice').textContent = t('LABEL_NUM_DICE');
    document.getElementById('labelTarget').textContent = t('LABEL_TARGET');
    document.getElementById('optionSum10').textContent = t('OPTION_SUM_10');
    document.getElementById('optionSum15').textContent = t('OPTION_SUM_15');
    document.getElementById('labelBonus').textContent = t('LABEL_BONUS');
    document.getElementById('explosionLabel').textContent = t('EXPLOSION_LABEL');
    elements.rollBtn.textContent = t('BUTTON_ROLL');
    elements.rerollBtn.textContent = t('BUTTON_REROLL');
    elements.themeToggle.textContent = t('THEME_TOGGLE');
    elements.footerProjectLabel.textContent = t('FOOTER_PROJECT_IDEA_BY');
    elements.footerNoemiName.textContent = FOOTER_CREDITS.NOEMI_NAME;
    elements.footerNoemiLink.href = FOOTER_CREDITS.NOEMI_EMAIL;
    elements.footerExtensions.textContent = `${t('FOOTER_EXTENSIONS_BY')} ${FOOTER_CREDITS.EXTENSIONS_AUTHOR}`;
    render();
}

function getBonusValue() {
    return Number.parseInt(elements.bonusValue.value, 10) || 0;
}

function render() {
    renderApp({ state: appState, dom: elements });
}

function rollDice() {
    resetRollSession(appState);
    const { diceCount, bonus, target, explosionsEnabled } = getFormValues();

    for (let i = 0; i < diceCount; i++) {
        const die = rollDie(appState, bonus, false);
        addDie(appState, die);

        if (explosionsEnabled && die.natural === GAME_CONFIG.NATURAL_EXPLOSIVE) {
            rollExplosionChain(appState, bonus);
        }
    }

    addRollHistoryEntry(appState, buildHistoryEntry({
        dice: appState.dice,
        target,
        bonus,
        explosionsEnabled,
    }));

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
    const { bonus, target, explosionsEnabled } = getFormValues();

    const rerolledDie = rollDie(appState, bonus, false);
    addDie(appState, rerolledDie);

    if (explosionsEnabled && rerolledDie.natural === GAME_CONFIG.NATURAL_EXPLOSIVE) {
        rollExplosionChain(appState, bonus);
    }

    addRollHistoryEntry(appState, buildHistoryEntry({
        dice: appState.dice,
        target,
        bonus,
        explosionsEnabled,
        isReroll: true,
        rerolledDieIndex: appState.dice.length - 1,
    }));

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
    // Language selector
    elements.languageSelector.addEventListener('change', (e) => {
        handleLanguageChange(e.target.value);
    });
    
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
    initializeLanguage();
    cacheDom(elements);
    elements.languageSelector.value = getLanguage();
    bindEvents();
    updateUILabels();
    syncExplosionTile();
}
