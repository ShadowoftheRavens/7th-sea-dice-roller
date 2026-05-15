// Internationalization (i18n) Module
// Manages language selection and translations

export const LANGUAGES = {
    EN: 'en',
    IT: 'it',
};

const TRANSLATIONS = {
    en: {
        // UI Labels
        DICE_ROLLED: 'Rolled Dice',
        INCREMENT_SINGULAR: 'SUCCESS',
        INCREMENT_PLURAL: 'SUCCESSES',
        COMBINATIONS: 'Combinations',
        LEFTOVERS: 'Leftovers',
        LEFTOVERS_LABEL: 'Leftovers: ',
        HISTORY: 'History',
        HISTORY_EMPTY: 'No rolls yet.',
        HISTORY_EXPLOSIONS_ON: 'Explosions on',
        HISTORY_EXPLOSIONS_OFF: 'Explosions off',
        
        // HTML Labels
        LABEL_NUM_DICE: 'Number of Dice',
        LABEL_TARGET: 'Target',
        OPTION_SUM_10: 'Sum 10',
        OPTION_SUM_15: 'Sum 15 (+10)',
        LABEL_BONUS: 'Add bonus to each die:',
        EXPLOSION_LABEL: 'Explosion of 10',
        BUTTON_ROLL: 'ROLL DICE',
        BUTTON_REROLL: 'REROLL SELECTED',
        THEME_TOGGLE: 'THEME 🌓',
        FOOTER_PROJECT_IDEA_BY: 'Project and idea by',
        FOOTER_EXTENSIONS_BY: 'Extensions by',
    },
    it: {
        // UI Labels
        DICE_ROLLED: 'Dadi Lanciati',
        INCREMENT_SINGULAR: 'INCREMENTO',
        INCREMENT_PLURAL: 'INCREMENTI',
        COMBINATIONS: 'Combinazioni',
        LEFTOVERS: 'Scarti',
        LEFTOVERS_LABEL: 'Scarti: ',
        HISTORY: 'Cronologia',
        HISTORY_EMPTY: 'Nessun lancio ancora.',
        HISTORY_EXPLOSIONS_ON: 'Esplosioni attive',
        HISTORY_EXPLOSIONS_OFF: 'Esplosioni disattivate',
        
        // HTML Labels
        LABEL_NUM_DICE: 'N. Dadi',
        LABEL_TARGET: 'Obiettivo',
        OPTION_SUM_10: 'Somma 10',
        OPTION_SUM_15: 'Somma 15 (+10)',
        LABEL_BONUS: 'Aggiungi bonus a ogni dado:',
        EXPLOSION_LABEL: 'Esplosione del 10',
        BUTTON_ROLL: 'LANCIA DADI',
        BUTTON_REROLL: 'RILANCIA SELEZIONATO',
        THEME_TOGGLE: 'TEMA 🌓',
        FOOTER_PROJECT_IDEA_BY: 'Progetto e idea di',
        FOOTER_EXTENSIONS_BY: 'Estensioni di',
    },
};

let currentLanguage = LANGUAGES.EN;

export function setLanguage(lang) {
    if (lang in TRANSLATIONS) {
        currentLanguage = lang;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('preferredLanguage', lang);
        }
        return true;
    }
    return false;
}

export function getLanguage() {
    return currentLanguage;
}

export function t(key) {
    return TRANSLATIONS[currentLanguage]?.[key] ?? key;
}

export function initializeLanguage() {
    if (typeof localStorage !== 'undefined') {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && savedLanguage in TRANSLATIONS) {
            currentLanguage = savedLanguage;
        }
    }
}

export function getAvailableLanguages() {
    return Object.keys(TRANSLATIONS);
}
