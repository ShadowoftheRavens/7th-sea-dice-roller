import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGES, setLanguage, getLanguage, t, initializeLanguage, getAvailableLanguages } from '../i18n.mjs';

test('i18n - LANGUAGES constant exports EN and IT', () => {
    assert.equal(LANGUAGES.EN, 'en');
    assert.equal(LANGUAGES.IT, 'it');
});

test('i18n - default language is English', () => {
    assert.equal(getLanguage(), 'en');
});

test('i18n - setLanguage returns true for valid language', () => {
    const result = setLanguage('it');
    assert.equal(result, true);
});

test('i18n - setLanguage returns false for invalid language', () => {
    setLanguage('en'); // Reset to default
    const result = setLanguage('invalid');
    assert.equal(result, false);
});

test('i18n - getLanguage returns current language after setLanguage', () => {
    setLanguage('it');
    assert.equal(getLanguage(), 'it');
    setLanguage('en'); // Reset
});

test('i18n - t() returns English translation for valid key', () => {
    setLanguage('en');
    assert.equal(t('DICE_ROLLED'), 'Rolled Dice');
    assert.equal(t('COMBINATIONS'), 'Combinations');
    assert.equal(t('LEFTOVERS'), 'Leftovers');
});

test('i18n - t() returns Italian translation for valid key', () => {
    setLanguage('it');
    assert.equal(t('DICE_ROLLED'), 'Dadi Lanciati');
    assert.equal(t('COMBINATIONS'), 'Combinazioni');
    assert.equal(t('LEFTOVERS'), 'Scarti');
    setLanguage('en'); // Reset
});

test('i18n - t() returns key itself for missing translation', () => {
    setLanguage('en');
    const unknownKey = 'NONEXISTENT_KEY_12345';
    assert.equal(t(unknownKey), unknownKey);
});

test('i18n - INCREMENT_SINGULAR and INCREMENT_PLURAL differ between languages', () => {
    setLanguage('en');
    const enSingular = t('INCREMENT_SINGULAR');
    const enPlural = t('INCREMENT_PLURAL');
    
    setLanguage('it');
    const itSingular = t('INCREMENT_SINGULAR');
    const itPlural = t('INCREMENT_PLURAL');
    
    assert.notEqual(enSingular, itSingular);
    assert.notEqual(enPlural, itPlural);
    
    setLanguage('en'); // Reset
});

test('i18n - getAvailableLanguages returns array with en and it', () => {
    const languages = getAvailableLanguages();
    assert.ok(Array.isArray(languages));
    assert.ok(languages.includes('en'));
    assert.ok(languages.includes('it'));
});

test('i18n - all button labels exist for English', () => {
    setLanguage('en');
    assert.equal(typeof t('BUTTON_ROLL'), 'string');
    assert.equal(typeof t('BUTTON_REROLL'), 'string');
    assert.equal(typeof t('THEME_TOGGLE'), 'string');
    assert.equal(typeof t('LABEL_NUM_DICE'), 'string');
    assert.equal(typeof t('LABEL_BONUS'), 'string');
});

test('i18n - all button labels exist for Italian', () => {
    setLanguage('it');
    assert.equal(typeof t('BUTTON_ROLL'), 'string');
    assert.equal(typeof t('BUTTON_REROLL'), 'string');
    assert.equal(typeof t('THEME_TOGGLE'), 'string');
    assert.equal(typeof t('LABEL_NUM_DICE'), 'string');
    assert.equal(typeof t('LABEL_BONUS'), 'string');
    setLanguage('en'); // Reset
});

test('i18n - LEFTOVERS_LABEL translations are different', () => {
    setLanguage('en');
    const enLabel = t('LEFTOVERS_LABEL');
    
    setLanguage('it');
    const itLabel = t('LEFTOVERS_LABEL');
    
    assert.notEqual(enLabel, itLabel);
    assert.ok(enLabel.length > 0);
    assert.ok(itLabel.length > 0);
    
    setLanguage('en'); // Reset
});

test('i18n - setLanguage accepts both lowercase and LANGUAGES constants', () => {
    const result1 = setLanguage('en');
    assert.equal(result1, true);
    
    const result2 = setLanguage(LANGUAGES.IT);
    assert.equal(result2, true);
    
    setLanguage('en'); // Reset
});
