import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../shared/services/customer.service';


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export class ListUserComponent implements OnInit {
  customers: any[] = []; // Lista de clientes
    loading: boolean = true; // Indicador de carga

    constructor(private customerService: CustomerService) {}

    ngOnInit() {
      // Cargar datos de usuarios al inicializar el componente
      this.customerService.getCustomersLarge().then(customers => {
          this.customers = customers; // Asignar los usuarios recibidos
          this.loading = false;
      }).catch(error => {
          console.error('Error al cargar usuarios:', error);
          this.loading = false;
      });
  }
}
