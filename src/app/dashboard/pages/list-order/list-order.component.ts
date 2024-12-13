import { Component } from '@angular/core';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrl: './list-order.component.scss'
})
export class ListOrderComponent {


  // Crear una variable customer que almacene Ordenes
  /**
   * <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Dirección</th>
            <th scope="col">Teléfono</th>
            <th scope="col">Fecha</th>
            <th scope="col">Total</th>
            <th scope="col">Estado</th>
   */

    public customers = [
      {
        id: 1,
        name: 'Juan Perez',
        address: 'Calle 1 # 2-3',
        phone: '123456789',
        date: '2021-10-01',
        total: 100,
        status: 'Pendiente'
      },
      {
        id: 2,
        name: 'Maria Lopez',
        address: 'Calle 2 # 3-4',
        phone: '123456789',
        date: '2021-10-01',
        total: 200,
        status: 'Entregado'
      },
      {
        id: 3,
        name: 'Pedro Ramirez',
        address: 'Calle 3 # 4-5',
        phone: '123456789',
        date: '2021-10-01',
        total: 300,
        status: 'Pendiente'
      },
      {
        id: 4,
        name: 'Ana Rodriguez',
        address: 'Calle 4 # 5-6',
        phone: '123456789',
        date: '2021-10-01',
        total: 400,
        status: 'Entregado'
      },
      {
        id: 5,
        name: 'Carlos Perez',
        address: 'Calle 5 # 6-7',
        phone: '123456789',
        date: '2021-10-01',
        total: 500,
        status: 'Pendiente'
      },
      {
        id: 6,
        name: 'Luisa Lopez',
        address: 'Calle 6 # 7-8',
        phone: '123456789',
        date: '2021-10-01',
        total: 600,
        status: 'Entregado'
      },
      {
        id: 7,
        name: 'Jorge Ramirez',
        address: 'Calle 7 # 8-9',
        phone: '123456789',
        date: '2021-10-01',
        total: 700,
        status: 'Pendiente'
      },
      {
        id: 8,
        name: 'Luisa Rodriguez',
        address: 'Calle 8 # 9-10',
        phone: '123456789',
        date: '2021-10-01',
        total: 800,
        status: 'Entregado'
      },
      {
        id: 9,
        name: 'Jorge Perez',
        address: 'Calle 9 # 10-11',
        phone: '123456789',
        date: '2021-10-01',
        total: 900,
        status: 'Pendiente'
      },
      {
        id: 10,
        name: 'Ana Lopez',
        address: 'Calle 10 # 11-12',
        phone: '123456789',
        date: '2021-10-01',
        total: 1000,
        status: 'Entregado'
      }
    ];



}
