import { Injectable } from "@angular/core";
import { Api } from "../config";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class GeneralesService {
  api = Api.url;
  constructor(private servicio: HttpClient) {}

  traerciudades() {
    return this.servicio.get(this.api + "municipios");
  }

  traerdepartamentos() {
    return this.servicio.get(this.api + "departamentos");
  }

  enviarregistrotercero(form) {
    return this.servicio.post(this.api + "cliente", form);
  }

  traerzonas() {
    return this.servicio.get(this.api + "zona");
  }

  traermicrozonas() {
    return this.servicio.get(this.api + "microzona");
  }

  enviarregistropdv(form) {
    return this.servicio.post(this.api + "puntodeventa", form);
  }

  traerpuntosdeventa() {
    return this.servicio.get(this.api + "puntodeventa");
  }

  registrarresponsable(responsable) {
    return this.servicio.post(this.api + "responsable", responsable);
  }

  registrarautorizado(autorizado) {
    return this.servicio.post(this.api + "autorizado", autorizado);
  }

  traerAutorizado() {
    return this.servicio.get(this.api + "autorizado");
  }

  traerConceptos() {
    return this.servicio.get(this.api + "conceptos");
  }

  registrarcontrato(contrato) {
    return this.servicio.post(this.api + "contrato", contrato);
  }

  traerserviciospublicos() {
    return this.servicio.get(this.api + "tiposervicio");
  }

  registroserviciocontrato(relacion) {
    return this.servicio.post(this.api + "contratoservicio", relacion);
  }

  traerclientes() {
    return this.servicio.get(this.api + "cliente");
  }

  enviarproppdv(datos) {
    return this.servicio.post(this.api + "propietariopunto", datos);
  }

  traerbancos() {
    return this.servicio.get(this.api + "entidadbancaria");
  }

  traertipocuentas() {
    return this.servicio.get(this.api + "tipocuenta");
  }

  traerpendientespagoarriendo(mes, anio) {
    return this.servicio.get(this.api + "preliquidacion/" + mes + "/" + anio);
  }

  iniciarSesion(datos) {
    return this.servicio.post(this.api + "aut/login", datos);
  }

  traertipodepunto() {
    return this.servicio.get(this.api + "tipocontrato");
  }
}
