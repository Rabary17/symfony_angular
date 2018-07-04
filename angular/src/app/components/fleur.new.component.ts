import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'; 
import {UserService} from '../services/user.service';
import {FleurService} from '../services/fleur.service';
import {Fleur} from '../models/fleur';


@Component({
	selector: 'fleur-new',
	templateUrl: '../views/fleur.new.html',
	providers: [UserService,FleurService]
})
export class FleurNewComponent implements OnInit{
	public page_title: string;
	public identity;
	public token;
	public fleur:Fleur;
	public status_fleur;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _fleurService: FleurService
	){
		this.page_title = 'New Fleur';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		if(this.identity == null && !this.identity.sub ){
			this._router.navigate(['/login']);
		}else{
			this.fleur = new Fleur(1,'','','','','');
		}
		
	}

	onSubmit(){
		console.log(this.fleur);
		this._fleurService.create(this.token, this.fleur).subscribe(
			response=> {
				this.status_fleur = response.status;
				if(this.status_fleur != 'success'){
					this.status_fleur = 'error';
				}else{
					this.fleur = response.data;
					//this._router.navigate(['/task',this.task.id]);
					this._router.navigate(['/']);
				}
			},
			error => {
				console.log(<any>error);
			}
		);
	}
}