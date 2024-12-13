import { Component, OnInit } from '@angular/core';
import { Roles } from '../../../shared/interfaces/roles.enum';
import { User } from '../../../authentication/interfaces/user.interface';
import { UserService } from '../../../shared/services/user.service';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss',
})
export class ListUserComponent implements OnInit {
  users: User[] = [];
  user: User = {} as User;
  cols: any[] = [];
  loading: boolean = true;
  userDialog: boolean = false;
  submitted: boolean = false;
  deleteUserDialog: boolean = false;
  roles: any[] = [];

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.updateUsers();

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'first_name', header: 'Nombre' },
      { field: 'last_name', header: 'Apellido' },
      { field: 'user', header: 'Usuario' },
      // { field: 'role', header: 'Rol' },
      { field: 'email', header: 'Correo' },
      // { field: 'verified', header: 'Está verificado' },
    ];

    this.roles = [
      { label: 'Administrador', value: Roles.ADMIN },
      { label: 'Cliente', value: Roles.CLIENT },
      { label: 'Asesor', value: Roles.STAFF },
    ];
  }

  updateUsers() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users as User[];
    });
  }

  openNew() {
    this.user = {} as User;
    this.submitted = false;
    this.userDialog = true;
  }

  editUser(user: User) {
    this.user = { ...user };
    this.userDialog = true;
  }

  deleteUser(user: User) {
    if (user.email === this.authenticationService.user()?.email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No puedes eliminar tu propia cuenta',
      });
      return;
    }
    this.user = { ...user };
    this.deleteUserDialog = true;
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  confirmDelete() {
    //! Agregar lógica luego
  }

  saveUser() {
    this.submitted = true;

    //? Validar formulario

    this.userDialog = false;
    this.user = {} as User;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
