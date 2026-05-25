## Modifications de la page Contact

Édits ciblés dans `src/routes/contact.tsx` uniquement. Aucun autre fichier touché.

### Suppressions
- L'eyebrow « Infos pratiques »
- Le `<h1>` « Contact »
- L'image du slogan (`sloganImg` + son import)
- L'eyebrow « Écrivez-nous »
- Le `<h2>` « Formulaire de contact »

### Nouveau contenu (dans cet ordre)
1. `<h1>` : **Contactez-nous**
2. Sous-titre : **Une question ? Un projet ? Nous sommes là.**
3. Texte descriptif : *Utilisez le formulaire ci-dessous pour nous contacter par E-mail.*
4. Le `<ContactForm />` existant, inchangé

### Note
Le composant `ContactForm` contient déjà la phrase « Utilisez le formulaire ci-dessous pour nous contacter par E-mail. » en première ligne. Je la retirerai du `ContactForm.tsx` pour éviter le doublon, puisque le brief demande de l'afficher au niveau de la page avant le formulaire. C'est la seule modification au composant — les champs et la logique restent strictement identiques.

Le reste du site (header, footer, avis Google, autres sections) reste intact.
