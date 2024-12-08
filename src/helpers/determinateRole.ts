import { User } from '../app/authentication/interfaces/user.interface';
import { Roles } from '../app/shared/interfaces/roles.enum';

export const determinateRole = (user: User): string => {
  // El objeto user tiene 2 propiedades: is_superuser, is_staff
  // Si is_superuser es true, el usuario es Administrador
  // Si is_staff es true, el usuario es Staff
  // Si ninguna de las anteriores es true, el usuario es Cliente

  if (user.is_superuser) {
    return Roles.ADMIN;
  }

  if (user.is_staff) {
    return Roles.STAFF;
  }

  return Roles.CLIENT;
};
