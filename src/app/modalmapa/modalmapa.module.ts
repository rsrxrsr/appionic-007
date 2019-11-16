import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ModalmapaPage } from "./modalmapa.page";

const routes: Routes = [
  {
    path: "",
    component: ModalmapaPage
  }
];

@NgModule({
  entryComponents: [ModalmapaPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ModalmapaPage]
})
export class ModalmapaPageModule {}
