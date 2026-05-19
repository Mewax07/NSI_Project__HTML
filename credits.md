# Credits et Sources

Projet NSI — Scoring Tir  
Auteur : **Mewax07** et **Mms20-09**

---

## Librairies et outils maison

| Fichier          | Description                                          | Auteur  |
| ---------------- | ---------------------------------------------------- | ------- |
| `lib/html.js`    | Librairie pour créer du Html dynamiquement           | Mewax07 |
| `lib/targets.js` | Classes des cibles de tir (Lib juste pour ce projet) | Mewax07 |

---

## Theme visuel

**Twilight** — theme de couleurs utilise pour toutes les variables CSS du
projet.

- Source :
  [github.com/longbridge/gpui-component](https://github.com/longbridge/gpui-component/blob/main/themes/twilight.json)
- Auteur original : **MacroMates** (TextMate)
- Adapter pour le web via des variables CSS custom properties Variables extraites (:root dans le css)

---

## Google Fonts

- **Fredoka** -
  [fonts.google.com/specimen/Fredoka](https://fonts.google.com/specimen/Fredoka)
    - licence OFL
- **DM Mono** -
  [fonts.google.com/specimen/DM+Mono](https://fonts.google.com/specimen/DM+Mono)
    - licence OFL

---

## Techniques JavaScript utilisees

### 1. localStorage

Le `localStorage` stocke seulement des chaine de caractere. Pour save un objet
js il faut le "serialiser" avec `JSON.stringify`, puis le "deserialiser" avec
`JSON.parse` au moment de le lire.

Source : Mozilla Dev -
[Storage: setItem()](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem)  
Source
: Mozilla Dev -
[Window: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### 2. Detecter la zone lors du click sur la cible (`closest`)

Pour savoir sur quel cercle de la cible l'utilisateur a clické, on utilise
`event.target.closest("[data-value]")`.

Source : Mozilla Dev -
[Element: closest()](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)

### 3. Créer des tableaux

Source : MDN Web Docs — [HTMLTableCellElement: rowSpan](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement/rowSpan)