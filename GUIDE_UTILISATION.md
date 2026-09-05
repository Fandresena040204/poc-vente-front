# Guide d'utilisation

Ce guide explique comment utiliser l'application une fois connecté : comptes
de test, création de compte, gestion des rôles/permissions, et utilisation
des ressources métier (Customers, Products, Ventes).

Pour l'installation et le lancement du projet, voir `README.md`. Pour le
guide destiné aux développeurs (ajouter une page, un menu, une route, un
modèle côté backend...), voir `GUIDE_DEVELOPPEUR.md`.

## Se connecter

L'app est disponible sur `http://localhost:5173` une fois `pnpm dev` lancé
(voir `README.md`), avec le backend démarré sur `http://localhost:8000`.

### Compte de test fourni

| Compte     | Mot de passe   | Rôle    |
|------------|----------------|---------|
| `testuser` | `TestPass123!` | `admin` |

Ce compte a tous les droits (Customers/Products/Ventes en CRUD complet,
gestion des utilisateurs et des rôles). Il est créé localement lors du
développement — si tu pars d'une base vide, voir « Créer un compte » et
« Assigner un rôle » ci-dessous pour t'en fabriquer un équivalent.

## Créer un compte

Depuis l'écran de connexion (`/sign-in`), cliquer sur **Sign Up** (ou aller
directement sur `/sign-up`) :

1. Renseigner un nom d'utilisateur, un email et un mot de passe (au moins
   8 caractères, pas uniquement numérique, pas trop commun — règles
   standard de validation Django).
2. Valider : le compte est créé et tu es automatiquement connecté.

**Important** : un compte fraîchement créé n'a **aucun rôle**, donc aucune
permission — il ne verra aucune entrée de menu à part Dashboard et
Settings. Il faut ensuite lui assigner un rôle (voir plus bas), ce que seul
un compte `admin` peut faire.

## Gérer les utilisateurs et les rôles

Réservé aux comptes ayant le rôle `admin` — sinon les entrées **Users** et
**Roles** de la sidebar (section *Administration*) n'apparaissent même pas.

### Assigner un rôle à un compte

1. Aller sur **Users** (menu de gauche, section Administration).
2. Sur la ligne de l'utilisateur concerné, ouvrir le menu **⋮** →
   **Manage roles**.
3. Cocher/décocher les rôles à donner/retirer, puis valider. Un compte peut
   avoir **plusieurs rôles à la fois** (ses permissions se cumulent).

Il n'y a pas de suppression de compte ni de création directe depuis cette
page : la création passe uniquement par `/sign-up` (voir plus haut).

### Créer un rôle

1. Aller sur **Roles**.
2. Cliquer sur **Create Role**, saisir un nom (ex. `manager`), valider.
   Le rôle est créé sans aucune permission — à configurer ensuite.

### Assigner des permissions à un rôle

Sur la page **Roles**, une matrice s'affiche : les rôles en colonnes, les
permissions en lignes, groupées par ressource (`view`/`add`/`change`/
`delete` × `customer`/`product`/`vente`).

- Cocher une case = donner cette permission à ce rôle (sauvegarde
  immédiate, pas de bouton "Enregistrer" séparé).
- Décocher = la retirer.

**3 rôles existent par défaut** et ne peuvent pas être supprimés dans le
scénario courant du POC :

| Rôle     | Droits sur Customers/Products/Ventes |
|----------|----------------------------------------|
| `admin`  | Tout (créer/voir/modifier/supprimer)   |
| `editor` | Créer, voir, modifier (pas supprimer)  |
| `user`   | Créer et voir seulement                |

### Supprimer un rôle

Sur **Roles**, menu **⋮** de la ligne concernée → **Delete**, puis retaper
le nom du rôle pour confirmer. Les utilisateurs qui l'avaient perdent
simplement ce rôle (ils gardent leurs autres rôles s'ils en ont).

## Utiliser Customers, Products et Ventes

Ces 3 ressources suivent exactement le même fonctionnement. Dans la
sidebar, chacune a un sous-menu avec deux entrées :

- **Liste** — tableau paginé/filtrable/triable de toutes les entrées
- **Saisie** — formulaire de création (et aussi de modification, voir
  plus bas)

Ces sous-menus n'apparaissent que si le compte a la permission
correspondante (`view_x` pour Liste, `add_x` pour Saisie) — un compte avec
le rôle `user` par exemple ne voit pas forcément les deux.

### Consulter la liste

Ouvrir **Ventes → Liste** (ou Products/Customers). La table permet de :

- trier en cliquant sur l'en-tête d'une colonne
- filtrer par texte (Customers/Products) ou par statut (Ventes)
- paginer en bas de page

### Créer une fiche

Ouvrir **Ventes → Saisie** (ou cliquer sur le bouton **Add Vente** en haut
de la page Liste — les deux mènent à la même page). Remplir le formulaire
et cliquer **Save changes** — retour automatique à la Liste avec un message
de confirmation. **Cancel** annule sans rien enregistrer.

Pour une **Vente** spécifiquement : choisir un client, puis ajouter une ou
plusieurs lignes (produit + quantité + prix unitaire) via **Add line**. Le
total est calculé automatiquement par le serveur.

### Modifier une fiche

Depuis la Liste, menu **⋮** de la ligne concernée → **Edit** — ouvre la
même page de Saisie, pré-remplie avec les valeurs existantes. Nécessite la
permission `change_x`.

### Supprimer une fiche

Depuis la Liste, menu **⋮** → **Delete**, puis retaper le nom (Customer),
le SKU (Product) ou l'ID (Vente) pour confirmer — action irréversible.
Nécessite la permission `delete_x`.

### Ventes : valider / annuler

Une vente nouvellement créée est en statut **Draft**. Depuis la Liste, menu
**⋮** d'une ligne :

- **Valider** (visible seulement si Draft) → passe en **Validated**.
- **Annuler** (visible seulement si Validated) → passe en **Cancelled**.

Il n'existe pas d'autre transition (pas de retour en arrière, pas de
passage direct Draft → Cancelled). Ces deux actions nécessitent la
permission `change_vente`.

## Se déconnecter

Depuis le menu utilisateur (avatar en haut à droite, ou en bas de la
sidebar) → **Sign out**.
