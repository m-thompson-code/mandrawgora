import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: '',
                loadChildren: () => import('./management/management.module').then(m => m.ManagementModule),
                runGuardsAndResolvers: 'always',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
