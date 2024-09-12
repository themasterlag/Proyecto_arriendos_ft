import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ApiServiceService {
  // url: string = "http://10.0.102.128:3000/api/arriendos/";
  // url: string = "http://localhost:3000/api/arriendos/"; // "http://10.250.9.42:3000/api/arriendos/"; // 10.0.102.128
  url: string = "https://4000-idx-arriendosbk-1726111308907.cluster-2xid2zxbenc4ixa74rpk7q7fyk.cloudworkstations.dev/api/arriendos/";

  constructor(private http: HttpClient) {}

  //-------------------------------------Solicitud------------------------------------------------
  getprocesos() {
    return this.http.get(this.url + "procesos",{withCredentials: true});
  }

  postDatosSolicitud(form) {
    return this.http.post(this.url + "solicitudes", form,{withCredentials: true});
  }

  //-------------------------------------DatosArrendador------------------------------------------------

  getdepa() {
    return this.http.get(this.url + "departamentos",{withCredentials: true});
  }

  getmuni() {
    return this.http.get(this.url + "municipios/d/73",{withCredentials: true});
  }

  getTipoPersona() {
    return this.http.get(this.url + "tipopersonas",{withCredentials: true});
  }

  postDatosArrendador(form) {
    return this.http.post(this.url + "arrendadores", form,{withCredentials: true});
  }

  //-------------------------------------Definicion del contrato------------------------------------------------

  getZonas() {
    return this.http.get(this.url + "zona",{withCredentials: true});
  }

  getMicroZ() {
    return this.http.get(this.url + "microzona",{withCredentials: true});
  }

  postDefinicionContrato(form) {
    return this.http.post(this.url + "registrarproceso", form,{withCredentials: true});
  }

  postArchivoContrato(archivo) {
    return this.http.post(this.url + "archivos/upload", archivo,{withCredentials: true});
  }
  getServiciosPublicos() {
    return this.http.get(this.url + "tiposervicio",{withCredentials: true});
  }
}
