import { Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { RegistrarpdvComponent } from 'app/registrarpdv/registrarpdv.component';
import { PagosComponent } from 'app/pagos/pagos.component';
import { CreditosComponent } from 'app/creditos/creditos.component';
import { ReportesComponent } from 'app/reportes/reportes.component';
import { AuthGuard } from 'app/auth/guard/authguard.guard';
import { Pagina404Component } from 'app/paginas-error/pagina404/pagina404.component';

let rutas:Routes = [];
let permisos:any = sessionStorage.getItem('permisos');
if (permisos) {
    permisos = JSON.parse(permisos);
    permisos.forEach(permiso => {
        rutas.push({ path: 'register', component: RegistrarpdvComponent, data: { requiredPermissions: [1] } })

        rutas.push({ path: 'pagos', component: PagosComponent, data: { requiredPermissions: [2] } })
    
        rutas.push({ path: 'creditos', component: CreditosComponent, data: { requiredPermissions: [3] } });
    
        rutas.push({ path: 'reportes', component: ReportesComponent, data: { requiredPermissions: [4] } });
    
        rutas.push(
            {
                path: 'parametrizacion',
                canActivate: [AuthGuard],
                children: [{
                    path: '',
                    canActivateChild: [AuthGuard],
                    loadChildren: () => import('../../parametrizacion/parametrizacion.module').then(m => m.ParametrizacionModule)
                }],
            }
        );
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