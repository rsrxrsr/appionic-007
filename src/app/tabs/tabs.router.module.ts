import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../caso/caso.module').then(m => m.CasoPageModule)
          },
          {
            path: 'camara',
            loadChildren: () =>
              import('../camara/camara.module').then(m => m.CamaraPageModule)
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          { path: '', redirectTo: 'camara/medio', pathMatch: 'full' },
          {
            path: 'camara/:medio',
            loadChildren: () =>
              import('../camara/camara.module').then(m => m.CamaraPageModule)
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../mapa/mapa.module').then(m => m.MapaPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
