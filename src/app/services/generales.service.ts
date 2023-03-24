import { Injectable } from "@angular/core";
import { Api } from "../config";
import { HttpClient, HttpParams } from "@angular/common/http";
import { fromEvent, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class GeneralesService {
  api = Api.url;
  constructor(private servicio: HttpClient) {}

  // traerImagen(imageUrl: string): Observable<string> {
  //   return this.servicio.get<Blob>(imageUrl).pipe(
  //     switchMap((imageBlob: Blob) => {
  //       const fileReader = new FileReader();
  //       fileReader.readAsDataURL(imageBlob);

  //       return fromEvent(fileReader, "loadend").pipe(
  //         map(() => fileReader.result.toString().split(",")[1])
  //       );
  //     })
  //   );
  // }
  traerBase64(imagePath) {
    return this.servicio.get(imagePath, { responseType: "blob" });
  }

  traerciudades() {
    return this.servicio.get(this.api + "municipios");
  }

  traerdepartamentos() {
    return this.servicio.get(this.api + "departamentos");
  }

  enviarregistrotercero(form) {
    return this.servicio.post(this.api + "cliente", form);
  }
  traerResponsableByClienteId(id: number) {
    return this.servicio.get(this.api + "/responsable/cliente/" + id);
  }
  traerAutorizadoByClienteId(id: number) {
    return this.servicio.get(this.api + "/autorizado/cliente/" + id);
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
  traerPuntosDeVentaSinContrato() {
    return this.servicio.get(this.api + "puntodeventa/sincontrato");
  }

  traerTerceroConsulta(id){
    return this.servicio.get(this.api + "cliente/numero_documento/" + id);
  }

  traerPuntosDeVenta() {
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
  actuliarcontrato(contrato) {
    return this.servicio.patch(this.api + "contrato", contrato);
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

  traerContrato(id) {
    return this.servicio.get(this.api + "contrato/pdv/" + id);
  }

  traerListaPagos(datosConsulta) {
    let datos = new HttpParams();
    datos = datos.append("datosResponsable", JSON.stringify(datosConsulta));

    return this.servicio.get(this.api + "preliquidacion", { params: datos });
  }

  traerInfoCsv(opcion, puntos) {
    let ruta = "preliquidacion/" + opcion;
    let pdv = new HttpParams();
    pdv = pdv.append("opcion", puntos);

    return this.servicio.get(this.api + ruta, { params: pdv });
  }

  traerSitioVentaLiquidacion(id: number) {
    return this.servicio.get(this.api + "preliquidacion/sitioventa/" + id);
  }
}
