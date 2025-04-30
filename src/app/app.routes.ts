import { Routes } from '@angular/router';

export const routes: Routes = [
 { path: "layout", loadComponent: () => import("./layout/layout.component").then(m => m.LayoutComponent) }
];
