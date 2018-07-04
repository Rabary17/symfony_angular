import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'; 
import {UserService} from '../services/user.service';
import {FleurService} from '../services/fleur.service';
import {Fleur} from '../models/fleur';


@Component({
	selector: 'fleur-detail',
	templateUrl: '../views/fleur.detail.html',
	providers: [UserService,FleurService]
})
export class FleurDetailComponent implements OnInit{
	public page_title: string;
	public identity;
	public token;
	public fleur:Fleur;
	public status_fleur;
	public loading;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _fleurService: FleurService
	){
		this.page_title = 'Fleur Detail';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		if(this.identity && this.identity.sub){
			//call the fleur service
			this.getFleur();
		}else{
			this._router.navigate(['/login']);
		}
	}

	getFleur(){
		this.loading = 'show';
		this._route.params.forEach((params: Params) => {
			let id = +params['id'];

			this._fleurService.getFleur(this.token, id).subscribe(
				response => {
					
					if(response.status == 'success'){
						
						if(response.data.users.id == this.identity.sub){
							this.fleur = response.data;

							console.log(this.fleur);

							this.loading = 'hide';
						}else{
							this._router.navigate(['/']);
						}

					}else{
						this._router.navigate(['/login']);
					}
				},
				error => {
					console.log(<any>error);
				}
			);
		});
	}

	deleteFleur(id){
		this._fleurService.deleteFleur(this.token, id).subscribe(
			response => {
				if(response.status == 'success'){
					this._router.navigate(['/']);
				}else{
					alert('Fleur was not deleted');
				}
			},
			error =>{
				console.log(<any>error);
			}
		);
	}
}