import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@app/guards/can-deactivate.guard';
import { ManagementComponent } from './management.component';

const routes: Routes = [
    {
        path: '',
        component: ManagementComponent,
        runGuardsAndResolvers: 'always',
        canDeactivate: [
            CanDeactivateGuard,
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManagementRoutingModule { }
