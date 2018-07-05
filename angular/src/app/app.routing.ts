import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './components/login.component';
import {RegisterComponent} from './components/register.component';
import {DefaultComponent} from './components/default.component';
import { UserEditComponent } from './components/user.edit.component';
import { ProduitNewComponent } from './components/produit.new.component';
import { ProduitDetailComponent } from './components/produit.detail.component';
import { ProduitEditComponent } from './components/produit.edit.component';

const appRoutes: Routes = [
	{path:'', component			: DefaultComponent},
	{path:'index',component		: DefaultComponent},
	{path:'index/:page',component: DefaultComponent},
	{path:'login',component		: LoginComponent},
	{path:'login/:id',component	: LoginComponent},
	{path:'register',component	: RegisterComponent},
	{path:'user-edit',component	: UserEditComponent},
	{path:'produit-new',component	: ProduitNewComponent},
	{path:'produit/:id',component	: ProduitDetailComponent},
	{path:'index/:page/produit/:id',component	: ProduitDetailComponent},
	{path:'produit-edit/:id',component	: ProduitEditComponent},
	{path:'index/:page/produit-edit/:id',component	: ProduitEditComponent},
	{path:'**',component		: LoginComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);