import { Injectable } from "@angular/core"
import { Api } from "../config"
import { HttpClient, HttpParams } from "@angular/common/http"
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class GeneralesService {
  api = Api.url;
  apiCarnet = Api.urlCarnet;
  apiNovedades = Api.urlNovedades;

  constructor(private servicio: HttpClient) {}

  traerBase64(imagePath) {
    return this.servicio.get(imagePath, { responseType: "blob",withCredentials: true })
  }

  traerciudades() {
    return this.servicio.get(this.api + "municipios", {withCredentials: true})
  }

  traerdepartamentos() {
    return this.servicio.get(this.api + "departamentos", {withCredentials: true})
  }

  enviarregistrotercero(form) {
    return this.servicio.post(this.api + "cliente", form, {withCredentials: true})
  }
  traerResponsableByClienteId(id: number) {
    return this.servicio.get(this.api + "/responsable/cliente/" + id, {withCredentials: true})
  }
  traerAutorizadoByClienteId(id: number) {
    return this.servicio.get(this.api + "/autorizado/cliente/" + id, {withCredentials: true})
  }
  traerzonas() {
    return this.servicio.get(this.api + "zona", {withCredentials: true})
  }

  traermicrozonas() {
    return this.servicio.get(this.api + "microzona", {withCredentials: true})
  }

  enviarregistropdv(form) {
    return this.servicio.post(this.api + "puntodeventa", form, {withCredentials: true})
  }

  actualizrRegistroPdv(form) {
    return this.servicio.patch(this.api + "puntodeventa/update", form, {withCredentials: true})
  }

  inhabilitarPDV(datos) {
    return this.servicio.patch(this.api + "puntodeventa/inhabilitar", datos, {withCredentials: true})
  }

  habilitarPDV(datos){
    return this.servicio.patch(this.api + "puntodeventa/habilitar", datos, {withCredentials: true})
  }

  traerPuntosDeVentaSinContrato() {
    return this.servicio.get(this.api + "puntodeventa/sincontrato", {withCredentials: true})
  }

  traerTerceroConsulta(id) {
    return this.servicio.get(this.api + "cliente/numero_documento/" + id, {withCredentials: true})
  }
  actualizarTercero(id, contrato_ter) {
    return this.servicio.patch(this.api + "cliente/" + id, contrato_ter, {withCredentials: true})
  }

  traerPuntosDeVenta() {
    return this.servicio.get(this.api + "puntodeventa", {withCredentials: true})
  }

  traerPDv(id) {
    return this.servicio.get(this.api + "puntodeventa/codigo-sitventa/" + id, {withCredentials: true})
  }

  registrarresponsable(responsable) {
    return this.servicio.post(this.api + "responsable", responsable, {withCredentials: true})
  }

  registrarautorizado(autorizado) {
    return this.servicio.post(this.api + "autorizado", autorizado, {withCredentials: true})
  }

  traerAutorizado() {
    return this.servicio.get(this.api + "autorizado", {withCredentials: true})
  }

  traerConceptos() {
    return this.servicio.get(this.api + "conceptos", {withCredentials: true})
  }

  traerConceptosTipo(id) {
    return this.servicio.get(this.api + "conceptos/tipo/" + id, {withCredentials: true})
  }

  registrarcontrato(contrato) {
    return this.servicio.post(this.api + "contrato", contrato, {withCredentials: true})
  }
  actuliarcontrato(contrato) {
    return this.servicio.patch(this.api + "contrato", contrato, {withCredentials: true})
  }
  traerserviciospublicos() {
    return this.servicio.get(this.api + "tiposervicio", {withCredentials: true})
  }

  registroserviciocontrato(relacion) {
    return this.servicio.post(this.api + "contratoservicio", relacion, {withCredentials: true})
  }

  traerclientes() {
    return this.servicio.get(this.api + "cliente", {withCredentials: true})
  }

  traerConceptoMunicpio() {
    return this.servicio.get(this.api + "contrato/concepto-municipio", {withCredentials: true})
  }
  enviarproppdv(datos) {
    return this.servicio.post(this.api + "propietariopunto", datos, {withCredentials: true})
  }

  
  traerBancos(){
    return this.servicio.get(this.api + "entidadbancaria", {withCredentials: true});
  }
   
  enviarBanco(banco){
    return this.servicio.post(this.api + "entidadbancaria/registrar", banco, {withCredentials: true});
  }
   modificarBanco(banco) {
    return this.servicio.patch(this.api + "entidadbancaria/update", banco, {withCredentials: true});
  }
  
  eliminarBanco(id: number) {
    return this.servicio.delete(this.api + "entidadbancaria/" + id, {withCredentials: true});
  }
  
  
  traertipocuentas() {
    return this.servicio.get(this.api + "tipocuenta", {withCredentials: true})
  }

  traerpendientespagoarriendo(mes, anio) {
    return this.servicio.get(this.api + "preliquidacion/" + mes + "/" + anio, {withCredentials: true})
  }

  iniciarSesion(datos) {
    return this.servicio.post(this.api + "aut/login", datos, {withCredentials: true})
  }

  traertipodepunto() {
    return this.servicio.get(this.api + "tipocontrato", {withCredentials: true})
  }

  traerContratos() {
    return this.servicio.get(this.api + "contrato", {withCredentials: true})
  }

  traerContrato(pdv) {
    return this.servicio.get(this.api + "contrato/pdv/" + pdv, {withCredentials: true})
  }

  traerContratoCliente(tipo, documento) {
    return this.servicio.get(this.api + "contrato/cliente/" + tipo + "/" + documento, {withCredentials: true});
  }

  traerPrenomina(tipo, ids) {
    const body = tipo == 0 ? { idContratos: ids } : { idPagos: ids };
    const url = tipo == 0 ? this.api + "preliquidacion/prenomina" : this.api + "preliquidacion/nomina";
    return this.servicio.post(url, body, {withCredentials: true});
  }

  // traerPrenomina(tipo, ids) {
  //   let datos = new HttpParams()
  //   if (tipo == 0) {
  //     datos = datos.append("idContratos", JSON.stringify(ids))
  //     return this.servicio.get(this.api + "preliquidacion/prenomina", {
  //       params: datos,
  //     })
  //   } else {
  //     datos = datos.append("idPagos", JSON.stringify(ids))
  //     return this.servicio.get(this.api + "preliquidacion/nomina", {
  //       params: datos,
  //     })
  //   }
  // }

  traerListaPagos(datosConsulta) {
    let datos = new HttpParams()
    datos = datos.append("datosResponsable", JSON.stringify(datosConsulta.DT))
    datos = datos.append("tipoDatos", JSON.stringify(datosConsulta.TD))
    datos = datos.append("rangoFechas", JSON.stringify(datosConsulta.RF))

    return this.servicio.get(this.api + "preliquidacion/", { params: datos, withCredentials:true })
  }

  //Incrementos

  traerIncrementos(){
    return this.servicio.get(this.api + "incrementos", {withCredentials: true});
  }

  calcularIncrementoContrato(id){
    return this.servicio.get(this.api + "reportes/valor-incremento/" + id, {withCredentials: true})
  }

  enviarIncremento(datosIncrementos){
    return this.servicio.post(this.api + "incrementos/inc", datosIncrementos, {withCredentials: true});
  }

  actualizarIncremento(datos: any) {
    return this.servicio.patch(this.api + "incrementos/update", datos, {withCredentials: true})
  }

  eliminarIncremento(id: number) {
    return this.servicio.delete(this.api + "incrementos/inc"+id, {withCredentials: true})
  }

  //

  traerListaPagosTodos() {
    return this.servicio.get(this.api + "preliquidacion/todos", {withCredentials: true})
  }

  pagarContratos(datos) {
    return this.servicio.post(this.api + "preliquidacion/todos", datos, {withCredentials: true})
  }

  traerInfoCsv(opcion, puntos) {
    let ruta = "preliquidacion/" + opcion
    let pdv = new HttpParams()
    pdv = pdv.append("opcion", puntos)

    return this.servicio.get(this.api + ruta, { params: pdv, withCredentials: true })
  }

  traerSitioVentaLiquidacion(id: number) {
    return this.servicio.get(this.api + "preliquidacion/sitioventa/" + id, {withCredentials: true})
  }

  traerContratoPdf(sitioVenta) {
    return this.servicio.get(this.api + "contrato/pdv-nopagado/" + sitioVenta, {withCredentials: true})
  }
  
  traerContratoPdfPagado(data) {
    return this.servicio.get(this.api + "contrato/pdv-pagado/", {
      params: data,
      withCredentials: true
    })
  }

  actuallizarContratos(datos){
    return this.servicio.patch(this.api + "pago-conceptos/update-conceptos", datos, {withCredentials: true});
  }

  traerTodoContratos() {
    return this.servicio.get(this.api + "contrato", {withCredentials: true})
  }

  actualizarContrato(datos) {
    return this.servicio.patch(this.api + "contrato/actualizar-contrato-incremento", datos, {withCredentials: true})
  }

  inhabilitarContratos(datos) {
    return this.servicio.patch(this.api + "contrato/inhabilitar", datos, {withCredentials: true})
  }

  renovarContratos(datos) {
    return this.servicio.patch(this.api + "contrato/renovarcontrato", datos, {withCredentials: true})
  }

  // Creditos
  traerListaCreditos() {
    return this.servicio.get(this.api + "saldo-credito", {withCredentials: true})
  }

  registrarCredito(datos: any) {
    return this.servicio.post(this.api + "saldo-credito", datos, {withCredentials: true})
  }

  actualizarCredito(datos: any) {
    return this.servicio.put(this.api + "saldo-credito", datos, {withCredentials: true})
  }

  eliminarCredito(id: number) {
    return this.servicio.delete(this.api + "saldo-credito/" + id, {withCredentials: true})
  }

  traerPdvReporte(mes:any,anio:any,filtro: any){
    return this.servicio.get(this.api + `reportes/contratos-periodo/${mes}/${anio}/${filtro}`, {withCredentials: true})
  }

  abonarCredito(datos:any){
    return this.servicio.post(this.api + 'saldo-credito-pago', datos, {withCredentials: true});
  }

  traerPagosCredito(id:any){
    return this.servicio.get(this.api + 'saldo-credito/pagos/'+id, {withCredentials: true});
  }

 //Procesos y subprocesos

  traerProcesos(){
    return this.servicio.get(this.api + "procesos", {withCredentials: true});
  }

  traerProceso(id){
    return this.servicio.get(this.api + "procesos/"+id, {withCredentials: true});
  }

  enviarProceso(datosProcesos){
    return this.servicio.post(this.api + "procesos/p", datosProcesos, {withCredentials: true});
  }
  
  eliminarProceso(id: number) {
    return this.servicio.delete(this.api + "procesos/proceso"+id, {withCredentials: true})
  }

  actualizarProcesos(datos: any) {
    return this.servicio.patch(this.api + "procesos/update", datos, {withCredentials: true})
  }

  traerSubProcesos(){
    return this.servicio.get(this.api + "procesos/subprocesos/", {withCredentials: true});
  }

  traerSubProceso(id){
    return this.servicio.get(this.api + "procesos/subprocesos"+id, {withCredentials: true});
  }

  enviarSubProceso(datosSubProcesos){
    return this.servicio.post(this.api + "procesos/subP", datosSubProcesos, {withCredentials: true});
  }
  
  eliminarSubProceso(id: number) {
    return this.servicio.delete(this.api + "procesos/subproceso/"+id, {withCredentials: true})
  }

  actualizarSubProcesos(datos: any) {
    return this.servicio.patch(this.api + "procesos/updateSub", datos, {withCredentials: true})
  }

  //PERMISOS

  traerPermisos(){
    return this.servicio.get(this.api + "permisos", {withCredentials: true});
  }

  registrarPermisoDetalle(permiso){
    return this.servicio.post(this.api + "permiso-detalle", permiso, {withCredentials: true});
  }

  traerPermiso(id){
    return this.servicio.get(this.api + "permisos/"+id, {withCredentials: true});
  }

  enviarPermiso(DatosPermiso){
    return this.servicio.post(this.api + "permisos", DatosPermiso, {withCredentials: true});
  }
  
  eliminarPermiso(id: number) {
    return this.servicio.delete(this.api + "permisos/"+id, {withCredentials: true})
  }

  actualizarPermisos(datos: any) {
    return this.servicio.patch(this.api + "permisos/update", datos, {withCredentials: true})
  }




   //USUARIOS

  enviarUsuarios(formUsuario){
    return this.servicio.post(this.api + "aut/singup", formUsuario, {withCredentials: true});
  }

  traerUsuario(idUsuario){
    return this.servicio.get(this.api + "usuarios/documento/" + idUsuario, {withCredentials: true});
  }

  actualizarUsuarios(datos){
    return this.servicio.patch(this.api + "usuarios/update/", datos, {withCredentials: true});
  }

  traerTodosUsuarios(){ 
    return this.servicio.get(this.api + "usuarios/todos/", {withCredentials: true});
  }

  inhabilitarUsuarios(id_usuario){
    const body = { id: id_usuario };

    return this.servicio.patch(this.api + "usuarios/inhabilitar", body, {withCredentials: true});
  }

  habilitarUsuarios(id_usuario){
    const body = { id: id_usuario };

    return this.servicio.patch(this.api + "usuarios/habilitar", body, {withCredentials: true});
  }
  // CARGOS

  actualizarCargo(datos: any) {
    return this.servicio.patch(this.api + "cargos/update", datos, {withCredentials: true})
  }

  traerCargos(){
    return this.servicio.get(this.api + "cargos", {withCredentials: true});
  }

  traerCargo(id){
    return this.servicio.get(this.api + "cargos/"+id, {withCredentials: true});
  }

  enviarCargo(datosCargos){
    return this.servicio.post(this.api + "cargos", datosCargos, {withCredentials: true});
  }

  eliminarCargo(id: number) {
    return this.servicio.delete(this.api + "cargos/"+id, {withCredentials: true})
  }




  // ORGANIZAR CONCEPTOS, TABLA CONCEPTOS, CONCEPTOS
  traerConceptosAsociados(){
    return this.servicio.get(this.api + "/conceptos/asociados", {withCredentials: true});
  }

  traerTipoConcepto(){
    return this.servicio.get(this.api + "/tipo-concepto/", {withCredentials: true});
  }

  crearConceptos(data){
    return this.servicio.post(this.api + "/conceptos", data, {withCredentials: true});
  }

  traerConceptoCodigo(id){
    return this.servicio.get(this.api + "/conceptos/codigo-concepto/"+ id, {withCredentials: true});
  }
  
  traerContratosRenovar(mes:any,anio:any){
    return this.servicio.get(this.api + `contrato/proximosrenovar/${mes}/${anio}`, {withCredentials: true})
  }

  traerContratosRenovarSiguienteMes(){
    return this.servicio.get(this.api + "contrato/proximosrenovar/", {withCredentials: true});
  }

  actualizarConcepto(datos){
    return this.servicio.patch(this.api + "/conceptos/update", datos, {withCredentials: true});
  }

  eliminarConcepto(id){
    return this.servicio.delete(this.api + "/conceptos/delete/"+ id, {withCredentials: true});
  }


  // Carnet virtual
  consultarCarnet(id){
    return this.servicio.get(this.apiCarnet + "/carnet/"+ id, { responseType: 'arraybuffer', withCredentials: true });
  }

  descargaExcel(){
    const url = this.apiCarnet + "/personaVinculado/crearExcel";

    const headers = {
      "x-access-token": sessionStorage.getItem("token"),
    };

    const requestOptions = {
      method: 'GET',
      headers: new Headers(headers),
    };

    fetch(url, requestOptions)
    .then(response => {
      const filename = response.headers.get('Content-Disposition').split('filename=')[1];
      console.log(response);
      return response.blob().then(blob => ({ blob, filename }));
    })
    .then(data => {
      const blobUrl = URL.createObjectURL(data.blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = data.filename;
      a.click();
    })
    .catch(error => Swal.fire("Error",'Error en la solicitud:'+ error, "error"));
    // return this.servicio.get(this.apiCarnet + "/personaVinculado/crearExcel");
  }
  traerPersonal(){
    return this.servicio.get(this.apiCarnet + "personaVinculado", {withCredentials: true});
  }

  traerPersona(id){
    return this.servicio.get(this.apiCarnet + "personaVinculado/personalIdentificacion/" + id, {withCredentials: true});
  }


  actualizarPersonal(datos: any) {
    return this.servicio.patch(this.api + "personaVinculado/personal", datos, {withCredentials: true})
  }

  enviarPersonal(datosCargos){
    return this.servicio.post(this.api + "personaVinculado/personal", datosCargos, {withCredentials: true});
  }

  enviarExcel(datosCargos){
    return this.servicio.post(this.api + "personaVinculado", datosCargos, {withCredentials: true});
  }


  inhabilitarPersonal(id_usuario){
    const body = { id: id_usuario };

    return this.servicio.patch(this.api + "personaVinculado/inhabilitar", body, {withCredentials: true});
  }

  habilitarPersonal(id_usuario){
    const body = { id: id_usuario };

    return this.servicio.patch(this.api + "personaVinculado/habilitar", body, {withCredentials: true});
  }

  //Novedades && Motivo Novedades && tipo pago novedad

  traerNovedades(){
    return this.servicio.get(this.apiNovedades + "novedad/", {withCredentials: true});
  }

  traerNovedad(id){
    return this.servicio.get(this.apiNovedades + "novedad/" + id, {withCredentials: true});
  }

  actualizarNovedad(datos: any) {
    return this.servicio.patch(this.apiNovedades + "novedad/update", datos, {withCredentials: true})
  }

  enviarNovedad(datos){
    return this.servicio.post(this.apiNovedades + "novedad", datos, {withCredentials: true});
  }


  traerMotivosNovedes(){
    return this.servicio.get(this.apiNovedades + "motivoNovedad/", {withCredentials: true});
  }
  traerMotivoNovedad(id){
    return this.servicio.get(this.apiNovedades + "motivoNovedad/" + id, {withCredentials: true});
  }

  actualizarMotivoNovedad(datos: any) {
    console.log(datos)
    return this.servicio.patch(this.apiNovedades + "motivoNovedad/update/"+ datos.id_motivo, datos, {withCredentials: true})
  }

  enviarMotivoNovedad(datos){
    console.log(datos,"_____________________________")
    return this.servicio.post(this.apiNovedades + "motivoNovedad/registrar", datos, {withCredentials: true});
  }

  eliminarMotivoNovedad(id){
    return this.servicio.delete(this.apiNovedades + "motivoNovedad/"+ id, {withCredentials: true});
  }

  traerTipoPagosNovedades(){
    return this.servicio.get(this.apiNovedades + "tipoPago/", {withCredentials: true});
  }

  traerTipoPagoNovedad(id){
    return this.servicio.get(this.apiNovedades + "tipoPago/" + id, {withCredentials: true});
  }

  actualizarTipoPagoNovedad(datos: any) {
    console.log(datos)
    return this.servicio.patch(this.api + "tipoPago/update", datos, {withCredentials: true})
  }

  enviarTipoPagoNovedad(datos){
    return this.servicio.post(this.apiNovedades + "tipoPago/", datos, {withCredentials: true});
  }

  inhabilitarTipoPagoNovedad(id){
    const body = { id: id };

    return this.servicio.patch(this.api + "tipoPago/inhabilitar", body, {withCredentials: true});
  }

  cambiarEstadoTipoPagoNovedad(body){
    return this.servicio.put(this.api + "tipoPago/cambiarEstado", body, {withCredentials: true});
  }


}
