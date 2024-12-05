import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ErrorResponse } from '../../authentication/interfaces/error-response.interface';


@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(private messageService: MessageService) { }

  handleHttpError(error: HttpErrorResponse): void {
    let summary = 'Error!';
    let detail = 'Ocurrió un error inesperado.';

    // Verifica si el error tiene la estructura de ErrorResponse
    if (error.error && typeof error.error === 'object') {
      const errorResponse: ErrorResponse = error.error;

      const messages: string[] = [];

      if (errorResponse.message) {
        messages.push(...errorResponse.message);
      }
      if (errorResponse.username) {
        messages.push(`Username: ${errorResponse.username.join(', ')}`);
      }
      if (errorResponse.email) {
        messages.push(`Email: ${errorResponse.email.join(', ')}`);
      }
      if (errorResponse.details) {
        messages.push(...errorResponse.details);
      }
      if (errorResponse.non_field_errors) {
        messages.push(...errorResponse.non_field_errors);
      }
      if (errorResponse.detail) {
        messages.push(...errorResponse.detail);
      }

      if (messages.length > 0) {
        // Si hay varios mensajes de error, los concatena con un salto de línea
        detail = messages.join('\n');
      }
    } else if (error.message) {
      // Si no tiene la estructura esperada, utiliza el mensaje genérico del error
      detail = error.message;
    }

    this.messageService.add({ severity: 'error', summary, detail });
  }
}
