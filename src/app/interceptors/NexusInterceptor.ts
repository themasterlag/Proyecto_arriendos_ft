import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import Swal from "sweetalert2";

@Injectable()
export class NexusInterceptor implements HttpInterceptor {

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!request.url.includes('/api') || request.url.includes("login")) {
            return next.handle(request);
        }
        
        const nuevoReq = request.clone({
            setHeaders:{
                "x-access-token": sessionStorage.getItem("token")
            }
        });
        const url = new URL(request.url);
        const domain = url.protocol + '//' + url.hostname + ':' + url.port;

        return this.checkDomainAvailability(domain).pipe(
            switchMap(() => {
                if (
                    !localStorage.getItem('online') ||
                    localStorage.getItem('online').toString() === 'false'
                ) {
                    console.log(localStorage.getItem('online'));
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        title: 'Actualiza el sitio web',
                        text: 'Se detectó una desconexión al servidor, actualice la página para el correcto funcionamiento',
                        icon: 'warning',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showConfirmButton: false,
                        showCloseButton: true,
                        timer: 7000,
                        timerProgressBar: true,
                    });
                }

                const xhr = new XMLHttpRequest();
                xhr.open("GET", domain+"/api/arriendos/aut/renovar/"+sessionStorage.getItem("token"), true);
                xhr.onload = () =>{
                    const token = JSON.parse(xhr.response).token;
                    if(token){
                        sessionStorage.setItem("token", token);
                    }
                }
                xhr.onerror = () => {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        title: 'Error en la sesion',
                        text: "No se pudo renovar la sesion, se recomienda cerrar la sesion e iniciar nuevamente",
                        icon: 'error',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showConfirmButton: false,
                        showCloseButton: true,
                        timer: 5000,
                        timerProgressBar: true,
                    })
                };
                xhr.send();

                localStorage.setItem('online', 'true');

                return next.handle(nuevoReq);
            }),
            catchError((error) => {
                if (error.status === 0) {
                    console.log('Sin conexión', error);
                    localStorage.setItem('online', 'false');

                    const errorMessage = 'No se pudo conectar al servidor.';

                    const headers = request.headers.set(
                        'X-Error-Type',
                        'AvailabilityError'
                    );

                    // Mostrar el Swal y esperar a que se cierre
                    return new Observable<HttpEvent<any>>((observer) => {
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            title: 'Error en la conexión',
                            text: errorMessage,
                            icon: 'error',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showConfirmButton: false,
                            showCloseButton: true,
                            timer: 5000,
                            timerProgressBar: true,
                        }).then(() => {
                            const customError = new HttpErrorResponse({
                                error: errorMessage,
                                status: 503,
                                statusText: 'Error de red',
                                url: request.url,
                                headers: headers,
                            });
                            observer.error(customError);
                        });
                    });
                } else {
                    return next.handle(nuevoReq);
                }
            })
        );
    }

    private checkDomainAvailability(domain: string): Observable<any> {
        // Realiza una solicitud HEAD al dominio para verificar la disponibilidad
        return new Observable((observer) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', domain);
            xhr.onload = () => {
                if (xhr.status != 0) {
                    observer.next();
                    observer.complete();
                } else {
                    observer.error(xhr);
                }
            };
            xhr.onerror = () => {
                observer.error(xhr);
            };
            xhr.send();
        });
    }
}