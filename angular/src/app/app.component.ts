import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service'
import { GLOBAL } from './services/global'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[UserService]
})
export class AppComponent {
  title = 'app';
  public identity;
  public token;
  public username :  string;
  public avatar: string;
  public url;
  public session;

  constructor(
  	private _userService:UserService
  ){
  	this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = global;
  }

  ngOnInit(){
    console.log("app.component loaded");
if(this.identity) {
  this.session = true;
}
    this.url = GLOBAL.url;
		this.username = this.identity.name;
    this.avatar = GLOBAL.url + '/'+ this.identity.avatar;
    console.log(this.username);
    console.log(this.avatar);
  }
}
