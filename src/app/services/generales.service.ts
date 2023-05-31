import { Injectable } from "@angular/core"
import { Api } from "../config"
import { HttpClient, HttpParams } from "@angular/common/http"
import { asapScheduler, fromEvent, Observable } from "rxjs"
import { map, switchMap } from "rxjs/operators"
import { DashboardComponent } from "app/dashboard/dashboard.component"
import { stderr } from "process"
import { FOCUS_MONITOR_DEFAULT_OPTIONS } from "@angular/cdk/a11y"

@Injectable({
  providedIn: "root",
})
export class GeneralesService {
  api = Api.url
  constructor(private servicio: HttpClient) {}

  traerBase64(imagePath) {
    return this.servicio.get(imagePath, { responseType: "blob" })
  }

  traerciudades() {
    return this.servicio.get(this.api + "municipios")
  }

  traerdepartamentos() {
    return this.servicio.get(this.api + "departamentos")
  }

  enviarregistrotercero(form) {
    return this.servicio.post(this.api + "cliente", form)
  }
  traerResponsableByClienteId(id: number) {
    return this.servicio.get(this.api + "/responsable/cliente/" + id)
  }
  traerAutorizadoByClienteId(id: number) {
    return this.servicio.get(this.api + "/autorizado/cliente/" + id)
  }
  traerzonas() {
    return this.servicio.get(this.api + "zona")
  }

  traermicrozonas() {
    return this.servicio.get(this.api + "microzona")
  }

  enviarregistropdv(form) {
    return this.servicio.post(this.api + "puntodeventa", form)
  }

  actualizrRegistroPdv(form) {
    return this.servicio.patch(this.api + "puntodeventa/update", form)
  }

  traerPuntosDeVentaSinContrato() {
    return this.servicio.get(this.api + "puntodeventa/sincontrato")
  }

  traerTerceroConsulta(id) {
    return this.servicio.get(this.api + "cliente/numero_documento/" + id)
  }
  actualizarTercero(id, contrato_ter) {
    return this.servicio.patch(this.api + "cliente/" + id, contrato_ter)
  }

  traerPuntosDeVenta() {
    return this.servicio.get(this.api + "puntodeventa")
  }

  traerPDv(id) {
    return this.servicio.get(this.api + "puntodeventa/codigo-sitventa/" + id)
  }

  registrarresponsable(responsable) {
    return this.servicio.post(this.api + "responsable", responsable)
  }

  registrarautorizado(autorizado) {
    return this.servicio.post(this.api + "autorizado", autorizado)
  }

  traerAutorizado() {
    return this.servicio.get(this.api + "autorizado")
  }

  traerConceptos() {
    return this.servicio.get(this.api + "conceptos")
  }

  traerConceptosTipo(id) {
    return this.servicio.get(this.api + "conceptos/tipo/" + id)
  }

  registrarcontrato(contrato) {
    return this.servicio.post(this.api + "contrato", contrato)
  }
  actuliarcontrato(contrato) {
    return this.servicio.patch(this.api + "contrato", contrato)
  }
  traerserviciospublicos() {
    return this.servicio.get(this.api + "tiposervicio")
  }

  registroserviciocontrato(relacion) {
    return this.servicio.post(this.api + "contratoservicio", relacion)
  }

  traerclientes() {
    return this.servicio.get(this.api + "cliente")
  }

  traerConceptoMunicpio() {
    return this.servicio.get(this.api + "contrato/concepto-municipio")
  }
  enviarproppdv(datos) {
    return this.servicio.post(this.api + "propietariopunto", datos)
  }

  traerbancos() {
    return this.servicio.get(this.api + "entidadbancaria")
  }

  traertipocuentas() {
    return this.servicio.get(this.api + "tipocuenta")
  }

  traerpendientespagoarriendo(mes, anio) {
    return this.servicio.get(this.api + "preliquidacion/" + mes + "/" + anio)
  }

  iniciarSesion(datos) {
    return this.servicio.post(this.api + "aut/login", datos)
  }

  traertipodepunto() {
    return this.servicio.get(this.api + "tipocontrato")
  }

  traerContratos() {
    return this.servicio.get(this.api + "contrato")
  }

  traerContrato(id) {
    return this.servicio.get(this.api + "contrato/pdv/" + id)
  }

  traerPrenomina(tipo, ids) {
    let datos = new HttpParams()
    if (tipo == 0) {
      datos = datos.append("idContratos", JSON.stringify(ids))
      return this.servicio.get(this.api + "preliquidacion/prenomina", {
        params: datos,
      })
    } else {
      datos = datos.append("idPagos", JSON.stringify(ids))
      return this.servicio.get(this.api + "preliquidacion/nomina", {
        params: datos,
      })
    }
  }

  traerListaPagos(datosConsulta) {
    let datos = new HttpParams()
    datos = datos.append("datosResponsable", JSON.stringify(datosConsulta.DT))
    datos = datos.append("tipoDatos", JSON.stringify(datosConsulta.TD))
    datos = datos.append("rangoFechas", JSON.stringify(datosConsulta.RF))

    return this.servicio.get(this.api + "preliquidacion/", { params: datos })
  }

  traerListaPagosTodos() {
    return this.servicio.get(this.api + "preliquidacion/todos")
  }

  pagarContratos(datos) {
    return this.servicio.post(this.api + "preliquidacion/todos", datos)
  }

  traerInfoCsv(opcion, puntos) {
    let ruta = "preliquidacion/" + opcion
    let pdv = new HttpParams()
    pdv = pdv.append("opcion", puntos)

    return this.servicio.get(this.api + ruta, { params: pdv })
  }

  traerSitioVentaLiquidacion(id: number) {
    return this.servicio.get(this.api + "preliquidacion/sitioventa/" + id)
  }

  traerContratoPdf(sitioVenta) {
    return this.servicio.get(this.api + "contrato/pdv-nopagado/" + sitioVenta)
  }
  traerContratoPdfPagado(data) {
    return this.servicio.get(this.api + "contrato/pdv-pagado/", {
      params: data,
    })
  }

  actuallizarContratos(datos){
    return this.servicio.patch(this.api + "pago-conceptos/update-conceptos", datos);
  }

  traerTodoContratos() {
    return this.servicio.get(this.api + "contrato")
  }

  inhabilitarContratos(datos) {
    return this.servicio.patch(this.api + "contrato/inhabilitar", datos)
  }

  // Creditos
  traerListaCreditos() {
    return this.servicio.get(this.api + "saldo-credito")
  }

  registrarCredito(datos: any) {
    return this.servicio.post(this.api + "saldo-credito", datos)
  }

  actualizarCredito(datos: any) {
    return this.servicio.put(this.api + "saldo-credito", datos)
  }

  eliminarCredito(id: number) {
    return this.servicio.delete(this.api + "saldo-credito/" + id)
  }
}
