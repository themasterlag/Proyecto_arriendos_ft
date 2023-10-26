import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import Swal from "sweetalert2";

@Injectable()
export class NexusInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): any {
        return next.handle(req);

        // // Extrae el dominio de la URL de la solicitud
        // if (!req.url.includes("/api")) {
        //     console.log("No back", req.url)
        //     return next.handle(req);
        // }

        // const url = new URL(req.url);
        // const domain = url.protocol + '//' + url.hostname + ':' + url.port;
        // console.log("interceptor", domain);

        // // Realiza una solicitud HEAD al dominio para verificar la disponibilidad
        // return this.checkDomainAvailability(domain).pipe(
        //     switchMap(() => {
        //         // Si la comprobación de disponibilidad tiene éxito, continúa con la solicitud original
        //         console.log("con conexion");
        //         if (!localStorage.getItem("online") || localStorage.getItem("online").toString() == "false") {
        //             console.log(localStorage.getItem("online"))
        //             Swal.fire({
        //                 toast: true,
        //                 position: "top-end",
        //                 title: "Actualiza el sitio web",
        //                 text: "Se detecto una desconexion al servidor, actualice la pagina para el correcto funcionamiento",
        //                 icon: 'warning',
        //                 allowOutsideClick: false,
        //                 allowEscapeKey: false,
        //                 showConfirmButton: false,
        //                 showCloseButton: true,
        //                 timer: 7000,
        //                 timerProgressBar: true,
        //             })
        //         }
        //         localStorage.setItem("online","true");
        //         return next.handle(req);
        //     }),
        //     catchError((error) => {
        //         // Si la comprobación de disponibilidad falla, devuelve un error
        //         if (error.status ==0) {
        //             console.log("Sin conexion",error);
        //             localStorage.setItem("online", "false");

        //             const errorMessage = 'No se pudo conectar al servidor.';

        //             const headers = new HttpHeaders();
        //             headers.set('X-Error-Type', 'AvailabilityError'); // Puedes personalizar los encabezados según tus necesidades

        //             return Swal.fire({
        //                 toast: true,
        //                 position: "top-end",
        //                 title: "Error en la conexion",
        //                 text: errorMessage,
        //                 icon: 'error',
        //                 allowOutsideClick: false,
        //                 allowEscapeKey: false,
        //                 showConfirmButton: false,
        //                 showCloseButton: true,
        //                 timer: 5000,
        //                 timerProgressBar: true,
        //             }).then(()=>{
        //                 return throwError(new HttpErrorResponse({
        //                     error: errorMessage,
        //                     status: 503, // Código de estado HTTP 503 (Servicio no disponible)
        //                     statusText: 'Error de red',
        //                     url: req.url,
        //                     headers: headers,
        //                 }));
        //             });
        //         } else {
        //             return error;
        //         }
        //     })
        // );
    }

    private checkDomainAvailability(domain: string): Observable<any> {
        // Realiza una solicitud HEAD al dominio para verificar la disponibilidad
        return new Observable((observer) => {
            const xhr = new XMLHttpRequest();
            xhr.open('HEAD', domain);
            xhr.onload = () => {
                if (xhr.status != 0) {
                    console.log("aquiiii0000", xhr)
                    observer.next();
                    observer.complete();
                } else {
                    console.log("aquiiii11111", xhr)
                    observer.error(xhr);
                }
            };
            xhr.onerror = () => {
                console.log("aquiiii2222", xhr.status)
                observer.error('No se pudo conectar al dominio.');
            };
            xhr.send();
        });
    }

    requestReturn(req: HttpRequest<any>, next: HttpHandler){
        return next.handle(req);
    }
}