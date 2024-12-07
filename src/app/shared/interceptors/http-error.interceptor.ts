import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { ErrorHandlingService } from '../services/error-handling.service';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private errorHandlingService: ErrorHandlingService,
    private loadingService: LoadingService
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorHandlingService.handleHttpError(error);
        this.loadingService.setLoading(false);
        return throwError(() => error);
      })
    );
  }
}
