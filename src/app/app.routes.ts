import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { PublicLayoutComponent } from './layout/public-layout/public-layout';
import { LoginComponent } from './features/auth/login/login';

export const routes: Routes = [

    {
        path: '',
        component: PublicLayoutComponent,
        children: [

            {
                path: '',
                component: HomeComponent
            },

            {
                path: 'login',
                component: LoginComponent
            }

        ]
    },

    {
        path: '**',
        redirectTo: ''
    }

];