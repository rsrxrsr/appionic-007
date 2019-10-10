import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {path: 'tab1',loadChildren: () =>import('../caso/caso.module').then(m => m.CasoPageModule)},
      {path: '',loadChildren: () =>import('../home/home.module').then(m => m.HomePageModule)},
      {path: '',redirectTo: '/tabs/tab1',pathMatch: 'full'}
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
