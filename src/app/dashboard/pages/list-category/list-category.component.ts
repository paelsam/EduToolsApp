import { Component, OnInit } from '@angular/core';
import { Category } from '../../../shared/interfaces/category.interface';
import { ProductService } from '../../../shared/services/product.service';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.scss',
})
export class ListCategoryComponent implements OnInit {
  // Igual que en list-user.component.ts, se deben declarar las variables que se usarán en el componente

  categories: Category[] = [];
  category: Category = {} as Category;
  cols: any[] = [];
  loading: boolean = true;
  categoryDialog: boolean = false;
  submitted: boolean = false;
  deleteCategoryDialog: boolean = false;
  createCategory: boolean = false;

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService
  ) {}

  // Igual que en list-user.component.ts, se debe inicializar el componente
  ngOnInit() {
    this.updateCategories();

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Nombre' },
      { field: 'description', header: 'Descripción' },
    ];
  }

  // Update categories
  updateCategories() {
    this.productService.getCategories().subscribe((categories) => {
      console.log(categories);
      this.categories = categories;
    });
  }

  // Igual que en list-user.component.ts, se deben declarar las funciones que se usarán en el componente
  openNew() {
    this.category = {} as Category;
    this.submitted = false;
    this.categoryDialog = true;
    this.createCategory = true;
  }

  editCategory(category: Category) {
    this.category = { ...category };
    this.categoryDialog = true;
  }

  deleteCategory(category: Category) {
    this.category = { ...category };
    this.deleteCategoryDialog = true;
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
  }

  confirmDelete() {
    this.productService.deleteCategory(this.category.id).subscribe(() => {
      this.deleteCategoryDialog = false;
      this.category = {} as Category;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Categoría eliminada',
        life: 3000,
      });
    });
  }

  saveCategory() {
    this.submitted = true;

    if (this.createCategory) {
      this.productService.createCategory(this.category).subscribe(() => {
        this.categoryDialog = false;
        this.createCategory = false;
        this.category = {} as Category;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Categoría creada',
          life: 3000,
        });
        this.updateCategories();
      });
    } else {
      this.productService.editCategory(this.category).subscribe(() => {
        this.categoryDialog = false;
        this.category = {} as Category;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Categoría actualizada',
          life: 3000,
        });
        this.updateCategories();
      });
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
