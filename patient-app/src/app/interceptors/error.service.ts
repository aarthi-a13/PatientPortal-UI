import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        let errorMessage = 'An unknown error occurred!';

        // Handle different HTTP error statuses
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = 'Bad Request! Please check the entered data.';
              break;
            case 401:
              errorMessage = 'Unauthorized! Please login again.';
              this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = 'Forbidden! You don’t have permission to access this resource.';
              break;
            case 404:
              errorMessage = 'Not Found! The requested resource was not found.';
              break;
            case 500:
              if (error.error.error === 'Failed to process enrollment') {
                errorMessage = 'Please check the Existing Patient tab if you are already enrolled.'
              } else if (error.error.error === 'Please upload the clear form') {
                errorMessage = 'Please upload the clear form';
              } else {
                errorMessage = 'Server Error! Please try again later.';
              }
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.message}`;
              break;
          }
        }

        // Log the error and show an alert (You can replace this with a toast/notification)
        console.error(errorMessage);
        // alert(errorMessage);

        // Return the error
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
