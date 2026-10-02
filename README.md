# alexandre_cv

Page personnelle d'**Alexandre Osselin** — ingénieur logiciel, orienté solution engineering / conseil, IA.

**En ligne :** https://osselinalexandre.github.io/alexandre_cv/

## Technique

- Site statique, sans étape de build : `index.html`, `style.css`, `script.js` (+ `.nojekyll`).
- Style hybride : structure TUI inspirée d'[Omarchy](https://omarchy.org) (barre type Waybar, bureau en tuiles, tableaux simples, graphiques en caractères `▁▂▃▄▅▆▇█`, barres `████░░`, typographie JetBrains Mono / Inter) + effets « verre » (backdrop-filter), fond en mesh animé + bruit, halo qui suit le pointeur, apparition lettre par lettre.
- 13 thèmes (Tokyo Night par défaut, Matte Black, Catppuccin, Catppuccin Latte, Gruvbox, Nord, Everforest, Kanagawa, Rosé Pine, Osaka Jade, Ristretto, Flexoki Light, White) via variables CSS ; touche `T` pour faire défiler (`Maj+T` en arrière), choix mémorisé dans `localStorage`. Les couleurs du verre, du halo et du mesh dérivent du thème actif.
- Respecte `prefers-reduced-motion`, navigation clavier, lien d'évitement, responsive.
- Développement local : `python3 -m http.server` puis http://localhost:8000.

## Pistes d'amélioration pour une page de recrutement

Éléments encore absents, à ajouter selon les priorités :

- [ ] **Photo** professionnelle (sobre, cohérente avec le thème).
- [ ] **Études de cas concrètes** avec contexte → action → **résultats mesurables** (placeholder « À venir » déjà en place dans `~/missions`), dans la limite de ce qui est publiable.
- [ ] Présentations visuelles « **résolution de problème** » (schémas avant/après, démarche).
- [ ] **Témoignages / recommandations** (collègues, managers, clients — ex. extraits LinkedIn).
- [ ] **CV téléchargeable en PDF** (bouton dans le hero et le contact).
- [ ] **Disponibilité, mobilité géographique**, type de poste recherché, télétravail.
- [ ] **Langues** et niveaux (ex. anglais).
- [ ] **Certifications** (cloud, Java, IA…) et formations courtes.
- [ ] **Nom de domaine personnalisé** (ex. `alexandre-osselin.fr`) + HTTPS via GitHub Pages.
- [ ] **SEO / OpenGraph** : image de partage `og:image` (1200×630), données structurées `schema.org/Person`, `sitemap.xml`, `robots.txt`.
- [ ] **Mesure d'audience** respectueuse de la vie privée (Plausible, GoatCounter…), avec mention RGPD.
- [ ] **Version anglaise** (sélecteur FR / EN).
- [ ] Liens vers des **projets GitHub** publics mis en avant (README soignés, démos).
- [ ] Formulaire ou lien de **prise de rendez-vous** (Calendly, Cal.com).
- [ ] Favicon / icônes dédiées et page 404 personnalisée.
