# 7th Sea Dice Roller

Un'applicazione web leggera per il sistema RPG *7th Sea* con calcolo automatico delle combinazioni ottimali e logica “zero waste”.

## Demo Online

🌐 https://gdr-sys.github.io/7th-sea-dice-roller/

---

# Funzionalità

## Configurazione dei dadi

L'app permette di:

- scegliere quanti d10 lanciare
- attivare/disattivare l'esplosione dei 10
- aggiungere un bonus globale `+1`
- scegliere il tipo di combinazione:
  - somma 10
  - somma 15 (+10)

---

## Sistema di Combinazioni Ottimizzate

L'app utilizza un algoritmo ricorsivo che:

- trova le migliori combinazioni possibili
- massimizza il numero di set validi
- dà priorità ai set da 15
- minimizza gli sprechi
- riduce l'overflow oltre il valore target

Ogni combinazione viene analizzata per ottenere il risultato più efficiente possibile.

---

## Sistema di Reroll

È possibile:

- selezionare dadi specifici
- rilanciare solo i dadi selezionati
- mantenere le combinazioni migliori
- ottimizzare strategicamente i rilanci

---

# Tecnologie Utilizzate

- HTML5
- CSS3
- Vanilla JavaScript
- GitHub Pages

---

# Come Utilizzarlo

1. Apri la web app
2. Scegli il numero di dadi
3. Attiva o disattiva:
   - esplosione del 10
   - bonus +1
4. Scegli il tipo di obiettivo
5. Lancia i dadi
6. Analizza le combinazioni generate automaticamente

---

# Deploy

Il progetto è pubblicato tramite GitHub Pages.

## Repository

https://github.com/gdr-sys/7th-sea-dice-roller

## Web App

https://gdr-sys.github.io/7th-sea-dice-roller/

---

# Possibili Miglioramenti Futuri

- cronologia tiri
- modalità dark/light
- integrazione scheda personaggio
- supporto multilingua

---

# Licenza

Questo progetto utilizza la licenza MIT.

Sei libero di usarlo, modificarlo e distribuirlo.

---

# Contributi

Suggerimenti e miglioramenti sono benvenuti.

Per contribuire:

1. Fai un fork del repository
2. Crea un branch
3. Effettua le modifiche
4. Apri una Pull Request

---

# Autore

Creato da GDR-SYS.
