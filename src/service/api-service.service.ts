import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ApiServiceService {
  url: string = "http://10.250.9.42:3000/api/arriendos/";

  constructor(private http: HttpClient) {}

  //-------------------------------------Solicitud------------------------------------------------
  getprocesos() {
    return this.http.get(this.url + "procesos");
  }

  postDatosSolicitud(form) {
    return this.http.post(this.url + "solicitudes", form);
  }

  //-------------------------------------DatosArrendador------------------------------------------------

  getdepa() {
    return this.http.get(this.url + "departamentos");
  }

  getmuni() {
    return this.http.get(this.url + "municipios/d/73");
  }

  getTipoPersona() {
    return this.http.get(this.url + "tipopersonas");
  }

  postDatosArrendador(form) {
    return this.http.post(this.url + "arrendadores", form);
  }

  //-------------------------------------Definicion del contrato------------------------------------------------

  getZonas() {
    return this.http.get(this.url + "zona");
  }

  getMicroZ() {
    return this.http.get(this.url + "microzona");
  }

  postDefinicionContrato(form) {
    return this.http.post(this.url + "registrarproceso", form);
  }

  postArchivoContrato(archivo) {
    return this.http.post(this.url + "archivos/upload", archivo);
  }
  getServiciosPublicos() {
    return this.http.get(this.url + "tiposervicio");
  }
}
