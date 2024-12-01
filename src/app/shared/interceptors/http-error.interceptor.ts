import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { ErrorHandlingService } from "../services/error-handling.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private errorHandlingService: ErrorHandlingService) { }

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      console.log('intercepted request ... ');
      console.log(req)
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                this.errorHandlingService.handleHttpError(error);
                return throwError(() => error);
            }))
    }
}
