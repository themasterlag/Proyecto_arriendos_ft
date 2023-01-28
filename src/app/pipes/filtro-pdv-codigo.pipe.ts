import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroPdvCodigo'
})
export class FiltroPdvCodigoPipe implements PipeTransform {

  transform(puntos: any, page:number=0, search:string=''): any {
    if (search.length===0) {
      return puntos.slice(page,page + 10);
    }{
      const filtropdv =  puntos.filter(e=>e.codigo_glpi.includes(search))
      return filtropdv.slice(page,page + 10);
    }
  }

}
