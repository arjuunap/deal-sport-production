import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { PublicLayoutComponent } from './layout/public-layout/public-layout';

export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    {
        path: '', component: PublicLayoutComponent, children: [
            { path: '', component: HomeComponent }
        ]
    },
    { path: '**', redirectTo: 'public-layout' }
];
