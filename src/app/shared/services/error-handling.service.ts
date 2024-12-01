import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(private messageService: MessageService) { }

  handleHttpError(error: HttpErrorResponse): void {
    console.log(error.status);
    console.log(error.message);
    const summary = `error.status.${error.status}.label`;
    const detail = `error.${error.message}`;
    this.messageService.add({ severity: 'error', summary, detail });
  }
}
