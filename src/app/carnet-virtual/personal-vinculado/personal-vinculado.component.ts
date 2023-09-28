import { Component, OnInit } from '@angular/core';
import { GeneralesService } from "app/services/generales.service";
import { error } from 'console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personal-vinculado',
  templateUrl: './personal-vinculado.component.html',
  styleUrls: ['./personal-vinculado.component.css']
})
export class PersonalVinculadoComponent implements OnInit {

  displayedColumns: string[] = ["id", "nombre", "apellido", "identificacion","cargo","rh","estado"];

  constructor(
    public servicio: GeneralesService,
  ) { }

  ngOnInit(): void {
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

  handleFileInput(event: any) {
    const archivoSeleccionado = event.target.files[0]; // Obtiene el primer archivo seleccionado
    if (archivoSeleccionado) {
      // Realiza acciones con el archivo, por ejemplo, muestra su nombre
      console.log('Nombre del archivo seleccionado:', archivoSeleccionado.name);
      
      // Puedes continuar aquí con el procesamiento del archivo, como cargarlo al servidor o procesarlo en el cliente.
    }
  }
}


