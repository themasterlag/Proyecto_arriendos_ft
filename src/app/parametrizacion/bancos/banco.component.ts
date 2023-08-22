import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import { NgForm } from "@angular/forms";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import { error } from 'console';
import { MatCardModule } from '@angular/material/card';



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
  bancos: Bancos[] = []; // Inicializar bancos como un arreglo vacío
  @ViewChild('registrarBanco', { static: true }) enviarBanco: NgForm;
  @ViewChild('formBanco') formularioBancos: NgForm;
  dataSourceBanco: MatTableDataSource<Bancos> =
  new MatTableDataSource<Bancos>();
  displayedColumns: string[] = ["id_banco", "banco","acciones"];
  id_entidad_bancaria: number;
  consulta_bancos: any = null;
  consultar: boolean = false;
  bancoInfo:any = null;
  nuevoBanco: any = {
   
  };
  nombreBanco: string = '';
  listaBancos:any = [];
  
  constructor(
    public servicio: GeneralesService,
  ) { 

  }

  ngOnInit(): void {
      this.traerBancos();
  }

  ejecutarConsultasBanco() {
    this.consultarListaBancos();
  }
  
  consultarListaBancos() {
    this.servicio.traerBancos().subscribe(
      (res: any) => {
        this.listaBancos = res;
      },
      (err: any) => {
        Swal.fire("No se pudo consultar los bancos", "", "error");
      }
    );
  }
  

// traerBancos() {
//   if (!this.consulta_banco) {
//     Swal.fire('Nombre de banco vacío', 'Ingresa un nombre de banco válido.', 'info');
//     return; // Salir de la función si no hay nombre de banco
//   }

//   console.log('Consultando bancos...');

//   this.servicio.traerBancos().subscribe(
//     (res: any) => {
//       console.log('Respuesta del servicio:', res);
//       this.bancoInfo = res;

//       const nombreBancoBuscado = this.consulta_banco.trim();
//       console.log('Nombre de banco buscado:', nombreBancoBuscado);

//       const bancoEncontrado = this.bancoInfo.find((banco: any) => banco.entidad_bancaria === nombreBancoBuscado);
      
//       console.log('Banco encontrado:', bancoEncontrado);

//       if (bancoEncontrado) {
//         Swal.fire('Banco encontrado', 'El banco se encontró con éxito.', 'success');
//       } else {
//         Swal.fire('Banco no encontrado', 'El banco no existe en la base de datos.', 'info');
//       }
//     },
//     (error: any) => {
//       Swal.fire('Error al consultar', 'Ocurrió un error al consultar el banco.', 'error');
//     }
//   );
// }

traerBancos() {
  if (!this.consulta_banco || !this.consulta_banco.trim()) {
    Swal.fire('Nombre de banco vacío', 'Ingresa un nombre de banco válido.', 'info');
    return; // Salir de la función si no hay un nombre de banco válido
  }

  console.log('Consultando bancos...');

  this.servicio.traerBancos().subscribe(
    (res: any) => {
      console.log('Respuesta del servicio:', res);
      this.bancoInfo = res;

      const nombreBancoBuscado = this.consulta_banco.trim().toLowerCase();
      console.log('Nombre de banco buscado:', nombreBancoBuscado);

      const palabrasBancoBuscado = nombreBancoBuscado.split(' ');
      console.log('Palabras del nombre de banco buscado:', palabrasBancoBuscado);

      const bancosCoincidentes = this.bancoInfo.filter((banco: any) => {
        if (banco.entidad_bancaria) {
          const nombreBancoSinTildes = this.normalizarTexto(banco.entidad_bancaria.toLowerCase());
          const palabrasBanco = nombreBancoSinTildes.split(' ');
          const coincidencias = palabrasBanco.filter(palabra => palabrasBancoBuscado.some(busqueda => palabra.includes(busqueda)));
          return coincidencias.length > 0;
        }
        return false;
      });

      console.log('Bancos coincidentes:', bancosCoincidentes);

      if (bancosCoincidentes.length > 0) {
        Swal.fire('Bancos encontrados', 'Se encontraron bancos coincidentes.', 'success');
      } else {
        Swal.fire('Bancos no encontrados', 'No se encontraron bancos coincidentes en la base de datos.', 'info');
      }
    },
    (error: any) => {
      Swal.fire('Error al consultar', 'Ocurrió un error al consultar los bancos.', 'error');
    }
  );
}





normalizarTexto(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}



  

  llenarFormulario(bancos){
    this.formularioBancos.controls.banco.setValue(bancos.banco);
  }

  registrarBanco() {
    if (!this.nombreBanco || !this.nombreBanco.trim()) {
      Swal.fire('Nombre de banco vacío', 'Ingresa un nombre de banco válido.', 'info');
      return; // Salir de la función si no hay un nombre de banco válido
    }
  
    console.log('Registrando nuevo banco...');
  
    // Aquí puedes enviar los datos del nuevo banco al servidor utilizando tu servicio o API correspondiente
    // Por ejemplo:
    this.servicio.enviarBanco(this.nombreBanco).subscribe(
      (res: any) => {
        console.log('Respuesta del servicio:', res);
        Swal.fire('Banco registrado', 'El nuevo banco se ha registrado exitosamente.', 'success');
        // Aquí puedes realizar cualquier otra acción necesaria después de registrar el banco
      },
      (error: any) => {
        Swal.fire('Error al registrar', 'Ocurrió un error al registrar el nuevo banco.', 'error');
      }
    );
  
    // Restablecer el valor del cuadro de texto después de enviar el formulario
    this.nombreBanco = '';
  }
  

  

}
