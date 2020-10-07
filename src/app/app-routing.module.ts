import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./dest/root/root.module').then(m => m.RootModule),
        runGuardsAndResolvers: 'always',
    },
    {
        path: 'admin',
        loadChildren: () => import('./dest/admin/admin.module').then(m => m.AdminModule),
        runGuardsAndResolvers: 'always',
    },
    {
        path: 'section/:section',
        loadChildren: () => import('./dest/home/home.module').then(m => m.HomeModule),
        runGuardsAndResolvers: 'always',
    },
    {
        path: '**',
        loadChildren: () => import('./dest/error-404/error-404.module').then(m => m.Error404Module),
        runGuardsAndResolvers: 'always',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        // onSameUrlNavigation: 'reload',
        // source: https://stackoverflow.com/a/51915623/9115419
        scrollPositionRestoration: 'enabled', // Enables scrolling back to top of app whenever navigating forward
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
