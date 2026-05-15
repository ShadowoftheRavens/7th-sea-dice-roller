import { DOM_ELEMENT_IDS } from './constants.mjs';

export function cacheDom(elements) {
    elements.body = document.body;
    elements.languageSelector = document.getElementById('languageSelector');
    elements.themeToggle = document.getElementById(DOM_ELEMENT_IDS.THEME_TOGGLE);
    elements.target = document.getElementById(DOM_ELEMENT_IDS.TARGET);
    elements.count = document.getElementById(DOM_ELEMENT_IDS.COUNT);
    elements.bonusValue = document.getElementById(DOM_ELEMENT_IDS.BONUS_VALUE);
    elements.expl = document.getElementById(DOM_ELEMENT_IDS.EXPLOSION_CHECKBOX);
    elements.tile2 = document.getElementById(DOM_ELEMENT_IDS.EXPLOSION_TILE);
    elements.rollBtn = document.getElementById(DOM_ELEMENT_IDS.ROLL_BUTTON);
    elements.rerollBtn = document.getElementById(DOM_ELEMENT_IDS.REROLL_BUTTON);
    elements.results = document.getElementById(DOM_ELEMENT_IDS.RESULTS);
    elements.historySidebar = document.getElementById('history-sidebar');
    elements.footerProjectLabel = document.getElementById('footerProjectLabel');
    elements.footerNoemiName = document.getElementById('footerNoemiName');
    elements.footerNoemiLink = document.getElementById('footerNoemiLink');
    elements.footerExtensions = document.getElementById('footerExtensions');
}

export function getElement(elements, key) {
    return elements[key];
}
