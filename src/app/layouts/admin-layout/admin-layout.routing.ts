import { Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { RegistrarpdvComponent } from 'app/registrarpdv/registrarpdv.component';
import { PagosComponent } from 'app/pagos/pagos.component';
import { CreditosComponent } from 'app/creditos/creditos.component';
import { ReportesComponent } from 'app/reportes/reportes.component';
import { AuthGuard } from 'app/auth/guard/authguard.guard';
import { Pagina404Component } from 'app/paginas-error/pagina404/pagina404.component';

let rutas = [];
let permisos:any = sessionStorage.getItem('permisos');
if (permisos) {
    permisos = JSON.parse(permisos);
    permisos.forEach(permiso => {
        console.log(permiso);
        switch (permiso.id_permiso) {
            case 1:
                rutas.push({ path: 'register', component: RegistrarpdvComponent })
                break;

            case 2:
                rutas.push({ path: 'pagos', component: PagosComponent })
                break;
            
            case 3:
                rutas.push({ path: 'creditos', component: CreditosComponent });
                break;
            
            case 4:
                rutas.push({ path: 'reportes', component: ReportesComponent });
                break;
            
            case 5:
            case 6:
                console.log("aqui"+permiso)
                rutas.push(
                    {
                        path: 'parametrizacion',
                        canActivate: [AuthGuard],
                        children: [{
                            path: '',
                            canActivateChild: [AuthGuard],
                            loadChildren: () => import('../../parametrizacion/parametrizacion.module').then(m => m.ParametrizacionModule)
                        }]
                    }
                );
            break;
        }
    });
}

rutas.push(
    {
        path: '',
        redirectTo: rutas.length>0? rutas[0].path:"",
        pathMatch: 'full',
    },
    { path: 'dashboard',    component: DashboardComponent },
    { path: '**',           component: Pagina404Component }
);

export const AdminLayoutRoutes: Routes = rutas;