import { Routes } from '@angular/router';

export const layoutRoutes: Routes = [
 {
  path: "", loadComponent: () => import("./layout.component").then(m => m.LayoutComponent), children: [
   { path: "", redirectTo: "words", pathMatch: "full" },
   { path: "words", loadComponent: () => import("./translated-words-details/translated-words-details.component").then(m => m.TranslatedWordsDetailsComponent) },
   { path: "add-word", loadComponent: () => import("./add-word/add-word.component").then(m => m.AddWordComponent) }
  ]
 },
];
