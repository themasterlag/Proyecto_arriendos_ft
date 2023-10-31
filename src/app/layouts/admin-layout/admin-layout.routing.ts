import { Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { RegistrarpdvComponent } from 'app/registrarpdv/registrarpdv.component';
import { PagosComponent } from 'app/pagos/pagos.component';
import { CreditosComponent } from 'app/creditos/creditos.component';
import { ReportesComponent } from 'app/reportes/reportes.component';
import { AuthGuard } from 'app/auth/guard/authguard.guard';
import { Pagina404Component } from 'app/paginas-error/pagina404/pagina404.component';
import { InicioComponent } from 'app/inicio/inicio/inicio.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'register', component: RegistrarpdvComponent, data: { requiredPermissions: [1] } },
    { path: 'pagos', component: PagosComponent, data: { requiredPermissions: [2] } },
    { path: 'creditos', component: CreditosComponent, data: { requiredPermissions: [3] } },
    { path: 'reportes', component: ReportesComponent, data: { requiredPermissions: [4] } },
    {
        path: 'parametrizacion',
        canActivate: [AuthGuard],
        children: [{
            path: '',
            canActivateChild: [AuthGuard],
            loadChildren: () => import('../../parametrizacion/parametrizacion.module').then(m => m.ParametrizacionModule)
        }],
    },
    {
        path: 'carnetVirtual',
        canActivate: [AuthGuard],
        children: [{
            path: '',
            canActivateChild: [AuthGuard],
            loadChildren: () => import('../../carnet-virtual/carnet-virtual.module').then(m => m.CarnetVirtualModule)
        }],
    },
    {
        path: 'novedades',
        canActivate: [AuthGuard],
        children: [{
            path: '',
            canActivateChild: [AuthGuard],
            loadChildren: () => import('../../novedades/novedades.module').then(m => m.NovedadesModule)
        }],
    },
    
    
    {
        path: 'inicio',
        component: InicioComponent
    },
    {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
    },
    { path: 'dashboard',    component: DashboardComponent },
    { path: '**',           component: Pagina404Component }
]