import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { data } from 'jquery';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";






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

  tipossFiltrados: any = null;
  myControl = new FormControl();
  options: any = null;
  filteredOptions: any = null;


  panelOpenState = true;
  personalInfo: any;
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
  displayedColumns: string[] = ["id", "nombre", "identificacion","cargo","rh","tipo_personal","fecha_creacion","fecha_inactivacion", "accion"];
  @ViewChild("archivoExcel") botonExcel: ElementRef;
  enviandoExcel: boolean = false;

  constructor(public servicio: GeneralesService,) { 
    
  }

  ngOnInit(): void {
    this.tablaPersonal();

    

    this.servicio.traerPersonal().subscribe((data: any) => {
      console.log(data)
      this.options = Array.from(new Set(data.map((elemento)=> elemento.tipo_personal)));
      this.filteredOptions = this.options;
      console.log(this.options)
    });
  }

  autoCompletarTipo(dato) {
    console.log(dato)
    const filterValue = dato.toLowerCase();
    this.filteredOptions = this.options.filter(tipoPer => tipoPer.toLowerCase().includes(filterValue) );
  }


  autoCompletarTipoLabel(personal){
    // console.log("autoComp", cliente)
    if (personal) {
      return personal;
    }
    else{
      return null;
    }
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
    console.log(archivo,"----------------");
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
        console.log(file,"+++++++++++++++++++++++");
        console.error();

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
            this.tipossFiltrados = this.personalInfo;
          },

          (error) => {
            Swal.fire('Error al consultar', error.error.message, 'warning');
          }
        )
      }
    }
  

  llenarFormulario(infoPersonal){
    console.log(this.enviarPersonal)
    this.enviarPersonal.controls.nombre.setValue(infoPersonal.nombre);
    this.enviarPersonal.controls.apellido.setValue(infoPersonal.apellido);
    this.enviarPersonal.controls.identificacion.setValue(infoPersonal.identificacion);
    this.enviarPersonal.controls.cargo.setValue(infoPersonal.cargo)
    this.enviarPersonal.controls.rh.setValue(infoPersonal.rh);
    this.enviarPersonal.controls.tipo_personal.setValue(infoPersonal.tipo_personal);

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
        tipo_personal: this.enviarPersonal.controls.tipo_personal.value,

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
                      this.ngOnInit(); 
                        
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
            tipo_personal: personal.tipo_personal,
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
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

