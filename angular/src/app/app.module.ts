import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

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
import { AgmCoreModule } from '@agm/core';



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
    GenerateDatePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAgOf3asjc942EARpsI1OAsJ5liZtmMTFM'
    })
  ],
  providers: [
  	appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
