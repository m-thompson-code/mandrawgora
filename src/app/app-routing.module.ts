import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./dest/root/root.module').then(m => m.RootModule),
        runGuardsAndResolvers: 'always',
        canDeactivate: [
            CanDeactivateGuard,
        ],
    },
    {
        path: 'admin',
        loadChildren: () => import('./dest/admin/admin.module').then(m => m.AdminModule),
        runGuardsAndResolvers: 'always',
        canDeactivate: [
            CanDeactivateGuard,
        ],
    },
    {
        path: 'section/:section',
        loadChildren: () => import('./dest/home/home.module').then(m => m.HomeModule),
        runGuardsAndResolvers: 'always',
        canDeactivate: [
            CanDeactivateGuard,
        ],
    },
    {
        path: '**',
        loadChildren: () => import('./dest/error-404/error-404.module').then(m => m.Error404Module),
        runGuardsAndResolvers: 'always',
        canDeactivate: [
            CanDeactivateGuard,
        ],
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
