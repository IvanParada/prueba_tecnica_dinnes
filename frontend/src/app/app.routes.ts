import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout-component/public-layout.component';
import { PrivateLayoutComponent } from './layouts/private-layout-component/private-layout.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: PublicLayoutComponent,
        canActivate: [],
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login.component'),
            },
            { path: '', pathMatch: 'full', redirectTo: 'login' },
        ]
    },
    {
        path: '',
        component: PrivateLayoutComponent,
        canActivate: [],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.component'),
            },
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    }
];
