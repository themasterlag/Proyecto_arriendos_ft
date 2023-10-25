import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import Swal from "sweetalert2";

@Injectable()
export class NexusInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Extrae el dominio de la URL de la solicitud
        const url = new URL(req.url);
        const domain = url.protocol + '//' + url.hostname + ':' + url.port;
        console.log("interceptor", domain);

        // Realiza una solicitud HEAD al dominio para verificar la disponibilidad
        return this.checkDomainAvailability(domain).pipe(
            switchMap(() => {
                // Si la comprobación de disponibilidad tiene éxito, continúa con la solicitud original
                console.log("con conexion");
                return next.handle(req);
            }),
            catchError((error) => {
                // Si la comprobación de disponibilidad falla, devuelve un error
                console.log("Sin conexion",error);
                const errorMessage = 'No se pudo conectar al servidor.';

                const headers = new HttpHeaders();
                headers.set('X-Error-Type', 'AvailabilityError'); // Puedes personalizar los encabezados según tus necesidades

                Swal.mixin({
                    toast: true,
                    position: "top-end",
                    title: "Error en la conexion",
                    text: errorMessage,
                    icon: 'error',
                    showConfirmButton: false,
                    showCloseButton: true
                });

                return throwError(new HttpErrorResponse({
                    error: errorMessage,
                    status: 503, // Código de estado HTTP 503 (Servicio no disponible)
                    statusText: 'Error de red',
                    url: req.url,
                    headers: headers,
                }));
            })
        );
    }

    private checkDomainAvailability(domain: string): Observable<any> {
        // Realiza una solicitud HEAD al dominio para verificar la disponibilidad
        return new Observable((observer) => {
            const xhr = new XMLHttpRequest();
            xhr.open('HEAD', domain);
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    observer.next();
                    observer.complete();
                } else {
                    observer.error('No se pudo conectar al dominio.');
                }
            };
            xhr.onerror = () => {
                observer.error('No se pudo conectar al dominio.');
            };
            xhr.send();
        });
    }
}