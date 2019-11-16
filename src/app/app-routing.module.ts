import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", loadChildren: "./login/login.module#LoginPageModule" },
  { path: "home", loadChildren: "./home/home.module#HomePageModule" },
  {
    path: "second/:mensaje/:estatus",
    loadChildren: "./second/second.module#SecondPageModule"
  },
  {
    path: "accion/:item",
    loadChildren: "./accion/accion.module#AccionPageModule"
  },
  {
    path: "acciones",
    loadChildren: "./acciones/acciones.module#AccionesPageModule"
  },
  { path: "casos", loadChildren: "./casos/casos.module#CasosPageModule" },
  { path: "caso", loadChildren: "./caso/caso.module#CasoPageModule" },
  { path: "tabs", loadChildren: "./tabs/tabs.module#TabsPageModule" },
  { path: "camara", loadChildren: "./camara/camara.module#CamaraPageModule" },
  { path: "mapa", loadChildren: "./mapa/mapa.module#MapaPageModule" },
  {
    path: "usuario",
    loadChildren: "./usuario/usuario.module#UsuarioPageModule"
  },
  {
    path: "cuestionario",
    loadChildren: "./cuestionario/cuestionario.module#CuestionarioPageModule"
  },
  {
    path: "modalmapa/:item",
    loadChildren: "./modalmapa/modalmapa.module#ModalmapaPageModule"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
