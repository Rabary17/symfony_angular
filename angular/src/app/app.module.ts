import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from './material.module';
import { routing, appRoutingProviders } from './app.routing';

import { AppComponent } from './app.component';


import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { DefaultComponent } from './components/default.component';
import { UserEditComponent } from './components/user.edit.component';
import { ProduitNewComponent } from './components/produit.new.component';
import { ProduitDetailComponent } from './components/produit.detail.component';
import { ProduitEditComponent } from './components/produit.edit.component';

//Pipe
import { GenerateDatePipe } from './pipes/generate.date.pipe';
import { StepperComponent } from './components/stepper.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DefaultComponent,
    UserEditComponent,
    ProduitNewComponent,
    ProduitDetailComponent,
    ProduitEditComponent,
    GenerateDatePipe,
    StepperComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    routing,
    BrowserAnimationsModule,
    AngularFontAwesomeModule
  ],
  providers: [
  	appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
