import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AuthStatus } from '../interfaces/auth-status.enum';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  // En este punto el usuario no ha sido autenticado
  // y se puede redirigir a la página que corresponda

  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  // Si no está autenticado, solo puede acceder a la páginas de auth y a la página de inicio de la tienda
  if (authenticationService.authStatus() === AuthStatus.notAuthenticated) {

    console.log('No autenticado', 'Puede acceder a la página de login o registro');

    // También funcione para la página de verificación de correo
    if (
      state.url === '/store' ||
      state.url === '/auth/login' ||
      state.url === '/auth/regiser' ||
      state.url.includes('/auth/verify-user')
    ) {
      console.log('Está en la página de login o registro', 'Permitiendo acceso');
      return true;
    }

    console.log('No está en la página de login o registro', 'Redirigiendo a la página de inicio de la tienda');
    return false;
  }

  console.log('Ya está autenticado', 'Redirigiendo a la página de inicio de la tienda');
  return true;
};
