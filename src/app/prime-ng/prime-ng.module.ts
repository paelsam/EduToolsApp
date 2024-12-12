import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importar los módulos de PrimeNG que se vayan a utilizar
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputOtpModule } from 'primeng/inputotp';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextarea, InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    InputTextModule,
    SidebarModule,
    ToolbarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RatingModule,
    FileUploadModule,
    TableModule,
    RippleModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    DataViewModule,
    TagModule,
    MenuModule,
    ProgressSpinnerModule,
    InputOtpModule,
    ConfirmPopupModule,
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
  ],
})
export class PrimeNgModule {}
