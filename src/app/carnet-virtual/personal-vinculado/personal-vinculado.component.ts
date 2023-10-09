import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"



interface Personal {
  id:number;
  nombre: string;
  apellido: string;
  identificacion: string;
  estado: boolean;


}

@Component({
  selector: 'app-personal-vinculado',
  templateUrl: './personal-vinculado.component.html',
  styleUrls: ['./personal-vinculado.component.css']
})
export class PersonalVinculadoComponent implements OnInit {

  panelOpenState = true;

  fecha

  personalInfo: any;
  nombreOriginal: string = '';
  apellidoOriginal: string = '';
  identificacionOriginal: string;
  cargoOriginal: string = '';
  rhOriginal: string = '';

  editar: boolean = false;
  datoEditarNom: string;
  datoEditarApe: string;
  valorDoc: string;
  datoEditarCargo: string;
  datoEditarRh: string;
  datoEditarCorr: string;

  archivoSeleccionado: File | null = null;

  cambiandoEstado:boolean = false;
  listaPersonal:any = [];
  consultar: boolean = false;
  consulta_personal: any = null;
  personal: any;
  personalFilter: any = [];
  tabla_personal: any;
  @ViewChild("registrarPersona") enviarPersonal: NgForm;
  @ViewChild("formularioPersonal") formularioPersonal: NgForm;
  @ViewChild("paginatorPersonal") paginatorPersonal: MatPaginator
  dataSourcePersonal: MatTableDataSource<Personal> =  new MatTableDataSource<any>();
  displayedColumns: string[] = ["id", "nombre", "identificacion","cargo","rh","fechaCre","fechaIn", "accion"];
  @ViewChild("archivoExcel") botonExcel: ElementRef;
  enviandoExcel: boolean = false;

  constructor(public servicio: GeneralesService,) { 
    
  }

  ngOnInit(): void {
    this.tablaPersonal();
  }

  crearExcel(){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Gerenando archivo'
    })
    this.servicio.descargaExcel();
    
  }

  envioExcel(archivo){
    this.enviandoExcel = true;
    Swal.fire({
      toast: true,
      icon: 'info',
      title: 'Cargando archivo',
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });

    let file = new FormData();
    file.append('file', archivo.target.files[0]);
    this.servicio.enviarExcel(file).subscribe(
      (res:any) => {
        this.enviandoExcel = false;

        Swal.fire({
          toast: true,
          icon: 'success',
          title: 'Se ha cargado correctamente el archivo',
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        }).finally(()=>{
          this.botonExcel.nativeElement.value = null;
        });
      },
      (error:any) => {
        this.enviandoExcel = false;

        Swal.fire({
          toast: true,
          icon: 'error',
          title: 'No se pudo cargar el archivo',
          text: 'Verifique el formato del archivo',
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        }).finally(()=>{
          this.botonExcel.nativeElement.value = null;
        });
      }
    )

  }

  traerPersonal(){
      if(this.consulta_personal == null){
        Swal.fire('El campo identificación no puede estar vacio', '','question');
      }else{
        this.servicio.traerPersona(this.consulta_personal).subscribe(
          (res: any) => {
            this.consultar = true;
            console.log(res);
            this.personalInfo = res;
            this.llenarFormulario(res);
          },
          (error) => {
            Swal.fire('Error al consultar', error.error.message, 'warning');
          }
        )
      }
    }
  

  llenarFormulario(infoPersonal){
    this.enviarPersonal.controls.nombre.setValue(infoPersonal.nombre);
    this.enviarPersonal.controls.apellido.setValue(infoPersonal.apellido);
    this.enviarPersonal.controls.identificacion.setValue(infoPersonal.identificacion);
    this.enviarPersonal.controls.cargo.setValue(infoPersonal.cargo)
    this.enviarPersonal.controls.rh.setValue(infoPersonal.rh);
  } 

  registrarPersonal(){
    if(this.enviarPersonal.valid){
      let id = null;


      if(this.consultar == true){
        id = this.personalInfo.id;
      }

      let formPersonal = {
        nombre: this.enviarPersonal.controls.nombre.value,
        apellido: this.enviarPersonal.controls.apellido.value,
        identificacion: this.enviarPersonal.controls.identificacion.value,
        cargo: this.enviarPersonal.controls.cargo.value,
        rh: this.enviarPersonal.controls.rh.value,

        rolid_rol: 1,
        id: id,
      }
      console.log(formPersonal)
      Swal
        .fire({
          title: "Seguro de guardar los cambios?",
          showDenyButton: true,
          confirmButtonText: "Guardar",
          denyButtonText: `Cancelar`,
        })
        .then((result) => {
          if (result.isConfirmed){
            // console.log(this.idSubProcesos);
            if(this.consultar == true) {
              this.servicio.actualizarPersonal(formPersonal).subscribe(
                (res) => {
                  Swal.fire('Persona actualizada con éxito','','success').then(
                    ()=>{
                      this.tablaPersonal();
                      this.limpiarFormulario();        
                    }
                  );
                },
                (error) => {
                  Swal.fire('Error al actualizar persona', error.message, 'error');
                  //Swal.fire("No se encontro", "Error: "+error.error.message, "error");
                }
              )
            } else {
              this.servicio.enviarPersonal(formPersonal).subscribe(
                (res:any) => {
                  // console.log(res);
                  Swal.fire('Personal creado con éxito','','success').then(
                    ()=>{
                      this.tablaPersonal();
                      this.limpiarFormulario();
                    }
                  );
                },
                (error) => {
                  Swal.fire('Error al crear personal ', error.error.message, 'error');
                }
              )
            }
          } 
        })
      
    }  
  }




  tablaPersonal(){

    this.servicio.traerPersonal().subscribe(
      (res:any) => {
        this.dataSourcePersonal.data = null
        this.tabla_personal = res.map((personal) => {
          return {
            id: personal.id,
            identificacion: personal.identificacion,
            nombre: personal.nombre + " " + personal.apellido,
            cargo: personal.cargo,
            rh: personal.rh,
            fecha_creacion: personal.fecha_creacion,
            fecha_inactivacion: personal.fecha_inactivacion,
            estado: personal.estado,
          }
        })

        this.dataSourcePersonal.data = this.tabla_personal;
        this.dataSourcePersonal.paginator = this.paginatorPersonal;
        // console.log(this.sort);
        // this.dataSourceUsuarios.sort = this.sort;

      }
    )
  }

  cambiarEstadoPersonal(personal){
    this.cambiandoEstado = true;
    if(personal.estado){
      this.servicio.inhabilitarPersonal(personal.id).subscribe(
        (res:any) => {
          Swal.fire('Personal inhabilitado', '', 'success')
          .finally(()=>{
            this.cambiandoEstado = false;
            this.tablaPersonal();
          });
        },
        (error:any) => {
          Swal.fire('Ocurrio un error', error.error.message, 'error')
          .finally(()=>{
            this.cambiandoEstado = false;
            this.tablaPersonal();
          });
        }
      );
    }else{
      this.servicio.habilitarPersonal(personal.id).subscribe(
        (res:any) => {
          Swal.fire('Personal habilitado','', 'success')
          .finally(()=>{
            this.cambiandoEstado = false;
            this.tablaPersonal();
          });
        },
        (error:any) => {
          console.log(error.error);
          Swal.fire('Ocurrio un error', error.error.message, 'error')
          .finally(()=>{
            this.cambiandoEstado = false;
            this.tablaPersonal();
          });
        }
      );
        this.tablaPersonal();  
    }    
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePersonal.filter = filterValue.trim().toLowerCase();
  }

  limpiarFormulario(){
    this.consulta_personal = null;
    this.consultar = false;

    this.enviarPersonal.form.markAsPristine(); // Marcar el formulario como "intocado"
    this.enviarPersonal.form.markAsUntouched(); // Marcar el formulario como "no modificado"
    this.enviarPersonal.resetForm();
  }

}

