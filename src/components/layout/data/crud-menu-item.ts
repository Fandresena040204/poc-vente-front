import { type ElementType } from 'react'
import { type NavItem } from '../types'

/**
 * Entrée de sidebar "Liste"/"Saisie" standard pour une ressource CRUD.
 * `resourceKey` doit correspondre au nom du modèle Django en minuscules
 * (ex: 'product' -> permissions 'view_product'/'add_product').
 *
 * `gateByRole` : certaines ressources (Roles, Users) ne sont pas protégées
 * par le système générique de permissions (`HasRolePermission` +
 * codenames), mais par `IsAdminRole` côté backend — les codenames
 * `view_<resourceKey>`/`add_<resourceKey>` ne sont alors jamais assignés à
 * personne. Passer `gateByRole: 'admin'` (ou un autre nom de rôle) bascule
 * le gating sur `hasRole` au lieu de `hasPermission` pour ces deux
 * sous-items.
 */
export function crudMenuItem(
  title: string,
  icon: ElementType,
  resourceKey: string,
  basePath: string,
  gateByRole?: string
): NavItem {
  return {
    title,
    icon,
    items: [
      {
        title: 'Liste',
        url: basePath,
        ...(gateByRole
          ? { role: gateByRole }
          : { permission: `view_${resourceKey}` }),
      },
      {
        title: 'Saisie',
        url: `${basePath}/saisie`,
        ...(gateByRole
          ? { role: gateByRole }
          : { permission: `add_${resourceKey}` }),
      },
    ],
  }
}
