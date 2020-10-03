import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadComponent } from './upload.component';

const routes: Routes = [
    {
        path: '',
        component: UploadComponent,
        runGuardsAndResolvers: 'always',
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UploadRoutingModule { }
