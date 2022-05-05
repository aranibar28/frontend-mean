import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';

// Components
import { LoginComponent } from './login/login.component';

const childRoutes: Routes = [
    { path: '',component: IndexComponent },
    { path: 'login',component: LoginComponent },
    { path: '**', redirectTo: 'inicio', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule],
})
export class ChildRoutesModule { }