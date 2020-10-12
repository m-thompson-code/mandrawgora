import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/guards/can-deactivate.guard';
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
                canDeactivate: [
                    CanDeactivateGuard,
                ],
            },
        ],
        canDeactivate: [
            CanDeactivateGuard,
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
