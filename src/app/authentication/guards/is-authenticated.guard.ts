import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { Roles } from '../../shared/interfaces/roles.enum';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  // En este punto, el usuario ya ha sido autenticado
  // y se puede redirigir a la página que corresponda

  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  console.log('isAuthenticatedGuard');

  // Si está autenticado, redirigir a la página de inicio de la tienda, o bien puede acceder a la
  // dashboard si es un usuario administrador o staff (asesor)
  if (authenticationService.authStatus() === AuthStatus.authenticated) {
    if (
      authenticationService.role() === Roles.ADMIN ||
      authenticationService.role() === Roles.STAFF
    ) {
      // Si la pagina es la dashboard o la página de inicio de la tienda
      // No hacer nada
      if (state.url === '/dashboard' || state.url === '/store') return true;
    } else {
      router.navigate(['/store']);
    }
    return true;
  }

  router.navigate(['/store']);

  return false;
};
