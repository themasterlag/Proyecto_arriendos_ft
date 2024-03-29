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

  inhabilitarPDV(datos) {
    return this.servicio.patch(this.api + "puntodeventa/inhabilitar", datos)
  }

  habilitarPDV(datos){
    return this.servicio.patch(this.api + "puntodeventa/habilitar", datos)
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

  
  traerBancos(){
    return this.servicio.get(this.api + "entidadbancaria");
  }
   
  enviarBanco(banco){
    return this.servicio.post(this.api + "entidadbancaria/registrar", banco);
  }
   modificarBanco(banco) {
    return this.servicio.patch(this.api + "entidadbancaria/update", banco);
  }
  
  eliminarBanco(id: number) {
    return this.servicio.delete(this.api + "entidadbancaria/" + id);
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

  traerContrato(pdv) {
    return this.servicio.get(this.api + "contrato/pdv/" + pdv)
  }

  traerContratoCliente(tipo, documento) {
    return this.servicio.get(this.api + "contrato/cliente/" + tipo + "/" + documento);
  }

  traerPrenomina(tipo, ids) {
    const body = tipo == 0 ? { idContratos: ids } : { idPagos: ids };
    const url = tipo == 0 ? this.api + "preliquidacion/prenomina" : this.api + "preliquidacion/nomina";
    return this.servicio.post(url, body);
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

    return this.servicio.get(this.api + "preliquidacion/", { params: datos })
  }

  //Incrementos

  traerIncrementos(){
    return this.servicio.get(this.api + "incrementos");
  }

  calcularIncrementoContrato(id){
    return this.servicio.get(this.api + "reportes/valor-incremento/" + id)
  }

  enviarIncremento(datosIncrementos){
    return this.servicio.post(this.api + "incrementos/inc", datosIncrementos);
  }

  actualizarIncremento(datos: any) {
    return this.servicio.patch(this.api + "incrementos/update", datos)
  }

  eliminarIncremento(id: number) {
    return this.servicio.delete(this.api + "incrementos/inc"+id)
  }

  //

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

  actualizarContrato(datos) {
    return this.servicio.patch(this.api + "contrato/actualizar-contrato-incremento", datos)
  }

  inhabilitarContratos(datos) {
    return this.servicio.patch(this.api + "contrato/inhabilitar", datos)
  }

  renovarContratos(datos) {
    return this.servicio.patch(this.api + "contrato/renovarcontrato", datos)
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

  traerPdvReporte(mes:any,anio:any,filtro: any){
    return this.servicio.get(this.api + `reportes/contratos-periodo/${mes}/${anio}/${filtro}`)
  }

  abonarCredito(datos:any){
    return this.servicio.post(this.api + 'saldo-credito-pago', datos);
  }

  traerPagosCredito(id:any){
    return this.servicio.get(this.api + 'saldo-credito/pagos/'+id);
  }

 //Procesos y subprocesos

  traerProcesos(){
    return this.servicio.get(this.api + "procesos");
  }

  traerProceso(id){
    return this.servicio.get(this.api + "procesos/"+id);
  }

  enviarProceso(datosProcesos){
    return this.servicio.post(this.api + "procesos/p", datosProcesos);
  }
  
  eliminarProceso(id: number) {
    return this.servicio.delete(this.api + "procesos/proceso"+id)
  }

  actualizarProcesos(datos: any) {
    return this.servicio.patch(this.api + "procesos/update", datos)
  }

  traerSubProcesos(){
    return this.servicio.get(this.api + "procesos/subprocesos/");
  }

  traerSubProceso(id){
    return this.servicio.get(this.api + "procesos/subprocesos"+id);
  }

  enviarSubProceso(datosSubProcesos){
    return this.servicio.post(this.api + "procesos/subP", datosSubProcesos);
  }
  
  eliminarSubProceso(id: number) {
    return this.servicio.delete(this.api + "procesos/subproceso/"+id)
  }

  actualizarSubProcesos(datos: any) {
    return this.servicio.patch(this.api + "procesos/updateSub", datos)
  }

  //PERMISOS

  traerPermisos(){
    return this.servicio.get(this.api + "permisos");
  }

  registrarPermisoDetalle(permiso){
    return this.servicio.post(this.api + "permiso-detalle", permiso);
  }

  traerPermiso(id){
    return this.servicio.get(this.api + "permisos/"+id);
  }

  enviarPermiso(DatosPermiso){
    return this.servicio.post(this.api + "permisos", DatosPermiso);
  }
  
  eliminarPermiso(id: number) {
    return this.servicio.delete(this.api + "permisos/"+id)
  }

  actualizarPermisos(datos: any) {
    return this.servicio.patch(this.api + "permisos/update", datos)
  }




   //USUARIOS

  enviarUsuarios(formUsuario){
    return this.servicio.post(this.api + "aut/singup", formUsuario);
  }

  traerUsuario(idUsuario){
    return this.servicio.get(this.api + "usuarios/documento/" + idUsuario);
  }

  actualizarUsuarios(datos){
    return this.servicio.patch(this.api + "usuarios/update/", datos);
  }

  traerTodosUsuarios(){ 
    return this.servicio.get(this.api + "usuarios/todos/");
  }

  inhabilitarUsuarios(id_usuario){
    const body = { id: id_usuario };

    return this.servicio.patch(this.api + "usuarios/inhabilitar", body);
  }

  habilitarUsuarios(id_usuario){
    const body = { id: id_usuario };

    return this.servicio.patch(this.api + "usuarios/habilitar", body);
  }
  // CARGOS

  actualizarCargo(datos: any) {
    return this.servicio.patch(this.api + "cargos/update", datos)
  }

  traerCargos(){
    return this.servicio.get(this.api + "cargos");
  }

  traerCargo(id){
    return this.servicio.get(this.api + "cargos/"+id);
  }

  enviarCargo(datosCargos){
    return this.servicio.post(this.api + "cargos", datosCargos);
  }

  eliminarCargo(id: number) {
    return this.servicio.delete(this.api + "cargos/"+id)
  }




  // ORGANIZAR CONCEPTOS, TABLA CONCEPTOS, CONCEPTOS
  traerConceptosAsociados(){
    return this.servicio.get(this.api + "/conceptos/asociados");
  }

  traerTipoConcepto(){
    return this.servicio.get(this.api + "/tipo-concepto/");
  }

  crearConceptos(data){
    return this.servicio.post(this.api + "/conceptos", data);
  }

  traerConceptoCodigo(id){
    return this.servicio.get(this.api + "/conceptos/codigo-concepto/"+ id);
  }
  
  traerContratosRenovar(mes:any,anio:any){
    return this.servicio.get(this.api + `contrato/proximosrenovar/${mes}/${anio}`)
  }

  traerContratosRenovarSiguienteMes(){
    return this.servicio.get(this.api + "contrato/proximosrenovar/");
  }

  actualizarConcepto(datos){
    return this.servicio.patch(this.api + "/conceptos/update", datos);
  }

  eliminarConcepto(id){
    return this.servicio.delete(this.api + "/conceptos/delete/"+ id);
  }


  // Carnet virtual
  consultarCarnet(id){
    return this.servicio.get(this.apiCarnet + "/carnet/"+ id, { responseType: 'arraybuffer' });
  }

  descargaExcel(){
    const url = this.apiCarnet + "/personaVinculado/crearExcel";

    const headers = {
      "x-access-token": sessionStorage.getItem("token")
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
    return this.servicio.get(this.apiCarnet + "personaVinculado");
  }

  traerPersona(id){
    return this.servicio.get(this.apiCarnet + "personaVinculado/personalIdentificacion/" + id);
  }


  actualizarPersonal(datos: any) {
    return this.servicio.patch(this.api + "personaVinculado/personal", datos)
  }

  enviarPersonal(datosCargos){
    return this.servicio.post(this.api + "personaVinculado/personal", datosCargos);
  }

  enviarExcel(datosCargos){
    return this.servicio.post(this.api + "personaVinculado", datosCargos);
  }


  inhabilitarPersonal(id_usuario){
    const body = { id: id_usuario };

    return this.servicio.patch(this.api + "personaVinculado/inhabilitar", body);
  }

  habilitarPersonal(id_usuario){
    const body = { id: id_usuario };

    return this.servicio.patch(this.api + "personaVinculado/habilitar", body);
  }

  //Novedades && Motivo Novedades && tipo pago novedad

  traerNovedades(){
    return this.servicio.get(this.apiNovedades + "novedad/");
  }

  traerNovedad(id){
    return this.servicio.get(this.apiNovedades + "novedad/" + id);
  }

  actualizarNovedad(datos: any) {
    return this.servicio.patch(this.apiNovedades + "novedad/update", datos)
  }

  enviarNovedad(datos){
    return this.servicio.post(this.apiNovedades + "novedad", datos);
  }


  traerMotivosNovedes(){
    return this.servicio.get(this.apiNovedades + "motivoNovedad/");
  }
  traerMotivoNovedad(id){
    return this.servicio.get(this.apiNovedades + "motivoNovedad/" + id);
  }

  actualizarMotivoNovedad(datos: any) {
    console.log(datos)
    return this.servicio.patch(this.apiNovedades + "motivoNovedad/update/"+ datos.id_motivo, datos)
  }

  enviarMotivoNovedad(datos){
    console.log(datos,"_____________________________")
    return this.servicio.post(this.apiNovedades + "motivoNovedad/registrar", datos);
  }

  eliminarMotivoNovedad(id){
    return this.servicio.delete(this.apiNovedades + "motivoNovedad/"+ id);
  }

  traerTipoPagosNovedades(){
    return this.servicio.get(this.apiNovedades + "tipoPago/");
  }

  traerTipoPagoNovedad(id){
    return this.servicio.get(this.apiNovedades + "tipoPago/" + id);
  }

  actualizarTipoPagoNovedad(datos: any) {
    console.log(datos)
    return this.servicio.patch(this.api + "tipoPago/update", datos)
  }

  enviarTipoPagoNovedad(datos){
    return this.servicio.post(this.apiNovedades + "tipoPago/", datos);
  }

  inhabilitarTipoPagoNovedad(id){
    const body = { id: id };

    return this.servicio.patch(this.api + "tipoPago/inhabilitar", body);
  }

  cambiarEstadoTipoPagoNovedad(body){
    return this.servicio.put(this.api + "tipoPago/cambiarEstado", body);
  }


}
