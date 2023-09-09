import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import { MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms'





interface Bancos {
  id_entidad_bancaria: number;
  entidad_bancaria: string;
}

// @Component({
//   selector: 'app-banco',
//   templateUrl: './banco.component.html',
//   styleUrls: ['./banco.component.css']
// })

@Component({
  selector: 'app-banco',
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.css']
})

export class BancoComponent implements OnInit {
  panelOpenState = true;
  consulta_banco: any = null;
  @ViewChild('registrarBanco')enviarBanco: NgForm;
  @ViewChild('formBanco') formularioBancos: NgForm;
  id_entidad_bancaria: number;
  entidad_bancaria: any;
  consulta_bancos: any = null;
  consultar: boolean = false;
  listaBancos:any = [];
  dataSourceBanco: MatTableDataSource<Bancos> =
  new MatTableDataSource<Bancos>();
  displayedColumns: string[] = ["id_banco", "banco","acciones"];
  editar: boolean = false;
  datoSeleccionadoParaEditar: string;
  datoOriginal: string = '';
  opcionSeleccionada: string = '';
  @ViewChild(MatSort) sort: MatSort;
  bancos: any;
  tabla_banco: any;
  @ViewChild("paginatorBanco") paginatorBancos: MatPaginator
  nombreBancoEditar: string = '';


  
  constructor(
      public servicio: GeneralesService,
      
      ) { 
        
  }

  ngOnInit(): void {
     this.traerBancos();
     this.dataSourceBanco.sort = this.sort;
  }

  llenarDesplegable(){
    this.llenarDesplegableBancos();

  }

  llenarDesplegableBancos() {
    this.servicio.traerBancos().subscribe(
      (res: any) => {
        this.listaBancos = res;
      },
      (error: any) => {
        Swal.fire('Error al consultar', 'Ocurrió un error al consultar los bancos.', 'error');
      }
    );
  }

  // editarBanco(element: any) {
  //   console.log(element);
  //   this.id_entidad_bancaria = element.id_entidad_bancaria;
  //   this.editar = true;
  //   this.datoSeleccionadoParaEditar = element.entidad_bancaria;
  //   this.datoOriginal = element.entidad_bancaria;
  // }
    
  // editarBanco(element: any) {
  //   console.log(element); // Verifica el contenido de element en la consola
  //   this.id_entidad_bancaria = element.id_entidad_bancaria;
  //   this.editar = true;
  //   this.datoSeleccionadoParaEditar = element.entidad_bancaria; // Asegúrate de que element tenga la propiedad entidad_bancaria
  //   this.datoOriginal = element.entidad_bancaria;
  // }
 
  // editarBanco(element: any) {
  //   console.log(element);
  //   this.id_entidad_bancaria = element.id_entidad_bancaria;
  //   this.editar = true;
  //   this.nombreBancoEditar = element.entidad_bancaria; // Asigna el nombre del banco al nuevo campo
  //   this.datoOriginal = element.entidad_bancaria;
  // }

  editarBanco(element: any) {
    this.id_entidad_bancaria = element.id_entidad_bancaria;
    this.editar = true;
    this.nombreBancoEditar = element.banco; // Asigna el nombre del banco al nuevo campo
    this.datoOriginal = element.banco;
  }
  
  
  
  

  // eliminarBanco(banco: any){
  //   if (this.servicio.eliminarBanco(banco.id_entidad_bancaria)) {
  //     const formBancos = {
  //       id_entidad_bancaria: this.id_entidad_bancaria,
  //     };
  //       Swal.fire({
  //         title: "Seguro que quieres eliminar este banco?",
  //         showDenyButton: true,
  //         confirmButtonText: "Confirmar",
  //         denyButtonText: `Cancelar`,
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           this.servicio.eliminarBanco(banco.id_entidad_bancaria).subscribe(
  //             (res: any) => {
  //               Swal.fire("Banco eliminado", "", "success");
  //               this.llenarDesplegable();
  //               this.traerBancos();
  //             },
  //             (error) => {
  //              Swal.fire("No se pudo eliminar", "Error: "+error.error.message, "error");
  //             }
  //           );
  //         }
  //       });
  //     }
  //   }

  
  eliminarBanco(id: number) {
    console.log(id);
    Swal.fire({
      title: "¿Seguro que quieres eliminar este banco?",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicio.eliminarBanco(id).subscribe(
          (res: any) => {
            // Eliminación exitosa, puedes actualizar la lista de bancos aquí si es necesario
            this.traerBancos();
            Swal.fire("Banco eliminado", "", "success");
          },
          (error) => {
            Swal.fire("No se pudo eliminar", "Error: " + error.error.message, "error");
          }
        );
      }
    });
  }
   

    traerBancos() {
      this.servicio.traerBancos().subscribe(
        (res) => {
          console.log(res); // Verifica si los datos se imprimen correctamente en la consola
          this.entidad_bancaria = res;
          this.tablaBanco();
        },
        (error: any) => {
          Swal.fire("No se encontro", "Error: " + error.error.message, "error");
        }
      );
    }
    


    tablaBanco() {
      this.tabla_banco = this.entidad_bancaria.map((entidad_bancaria) => {
        return {
          id_entidad_bancaria: entidad_bancaria.id_entidad_bancaria,
          banco: entidad_bancaria.entidad_bancaria,
        };
      });
    
      this.dataSourceBanco = new MatTableDataSource(this.tabla_banco); // Inicializar dataSourceBanco
    
      // Asignar paginator y sort al dataSource
      this.dataSourceBanco.paginator = this.paginatorBancos;
      this.dataSourceBanco.sort = this.sort; // Asignar sort
    
      console.log(this.sort);
    }

    
registrarBancos() {
  if (this.enviarBanco.valid) {
    const formBancos = {
      entidad_bancaria: this.enviarBanco.value.añadirbanco
    };
    

    if (this.editar) {
      // Si estamos editando, utilizamos el método modificarBanco
      formBancos['id_entidad_bancaria'] = this.id_entidad_bancaria; // Agregamos el ID al objeto si estamos editando
      formBancos['nuevoNombre'] = this.nombreBancoEditar; // Agrega el nuevo nombre

      this.servicio.modificarBanco(formBancos).subscribe(
        (res: any) => {
          this.datoOriginal = this.datoSeleccionadoParaEditar;
          this.datoSeleccionadoParaEditar = '';
          this.llenarDesplegable();
          this.traerBancos();
          this.id_entidad_bancaria = null;
          this.editar = false;
          Swal.fire("Cambios guardados con éxito", "", "success");
        },
        (err: any) => {
          Swal.fire("No se pudieron guardar los cambios", "", "error");
        }
      );
    } else {
      // Si no estamos editando, utilizamos el método enviarBanco para crear uno nuevo
      Swal.fire({
        title: "Seguro de guardar los cambios?",
        showDenyButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.servicio.enviarBanco(formBancos).subscribe(
            (res: any) => {
              Swal.fire("Banco guardado con éxito", "", "success");
              this.enviarBanco.form.markAsPristine();
              this.enviarBanco.form.markAsUntouched();
              this.enviarBanco.resetForm();
              this.traerBancos();
            },
            (error) => {
              Swal.fire("No se pudo guardar el banco", "Error: " + error.error.message, "error");
            }
          );
        }
      });
    }
  }
} 


    
   
    llenarFormulario(entidad_bancaria){
      this.enviarBanco.controls.banco.setValue(entidad_bancaria.entidad_bancaria);
    }

    
  

limpiarFormulario(){
  this.consulta_banco = null;
  this.consultar = false;
  this.datoSeleccionadoParaEditar = null;

  this.id_entidad_bancaria = null;
  this.editar = false;
  this.opcionSeleccionada  = '';


  this.enviarBanco.reset();
  console.log(this.datoOriginal);
}

applyFilter(event: Event){
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceBanco.filter = filterValue.trim().toLowerCase();
}

}
