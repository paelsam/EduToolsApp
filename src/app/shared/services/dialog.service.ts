import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  // Dialogos disponibles:
  // Dialogo de dirección
  // Dialogo de metoso de pago

  // Igual que en el servicio de Loading, creamos un BehaviorSubject para manejar el estado del diálogo

  private directionDialogSubject = new BehaviorSubject<boolean>(false);
  directionDialog$ = this.directionDialogSubject.asObservable();

  private paymentMethodDialogSubject = new BehaviorSubject<boolean>(false);
  paymentMethodDialog$ = this.paymentMethodDialogSubject.asObservable();

  // Creamos un método para cambiar el estado del diálogo de dirección
  setDirectionDialog(open: boolean): void {
    this.directionDialogSubject.next(open);
  }

  // Creamos un método para cambiar el estado del diálogo de método de pago
  setPaymentMethodDialog(open: boolean): void {
    this.paymentMethodDialogSubject.next(open);
  }

}
