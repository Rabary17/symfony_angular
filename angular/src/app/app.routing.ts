import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './components/login.component';
import {RegisterComponent} from './components/register.component';
import {DefaultComponent} from './components/default.component';
import { UserEditComponent } from './components/user.edit.component';
import { FleurNewComponent } from './components/fleur.new.component';
import { FleurDetailComponent } from './components/fleur.detail.component';
import { FleurEditComponent } from './components/fleur.edit.component';

const appRoutes: Routes = [
	{path:'', component			: DefaultComponent},
	{path:'index',component		: DefaultComponent},
	{path:'index/:page',component: DefaultComponent},
	{path:'login',component		: LoginComponent},
	{path:'login/:id',component	: LoginComponent},
	{path:'register',component	: RegisterComponent},
	{path:'user-edit',component	: UserEditComponent},
	{path:'fleur-new',component	: FleurNewComponent},
	{path:'fleur/:id',component	: FleurDetailComponent},
	{path:'index/:page/fleur/:id',component	: FleurDetailComponent},
	{path:'fleur-edit/:id',component	: FleurEditComponent},
	{path:'index/:page/fleur-edit/:id',component	: FleurEditComponent},
	{path:'**',component		: LoginComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);