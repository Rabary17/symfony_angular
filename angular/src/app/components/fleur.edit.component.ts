import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'; 
import {UserService} from '../services/user.service';
import {FleurService} from '../services/fleur.service';
//import {TaskDetailComponent} from './fleur.detail.component';		
import {Fleur} from '../models/fleur';


@Component({
	selector: 'fleur-edit',
	templateUrl: '../views/fleur.new.html',
	providers: [UserService,FleurService]
})
export class FleurEditComponent implements OnInit{
	
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
		private _FleurService: FleurService
	){
		this.page_title = 'Edit Fleur';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		if(this.identity == null && !this.identity.sub ){
			this._router.navigate(['/login']);
		}else{
			//this.task = new Task(1,'','','new','null','null');
    		// let taskData = new TaskDetailComponent();
    		// taskData.test();
    		// console.log('ads');

    		this.getFleur();

		}	
	}

	getFleur(){
		this.loading = 'show';
		this._route.params.forEach((params: Params) => {
			console.log(params);
			let id = +params['id'];

			this._FleurService.getFleur(this.token, id).subscribe(
				response => {
					console.log(response);
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

	onSubmit(){
		
		this._route.params.forEach((params: Params) => {
			let id = +params['id'];
			this._FleurService.update(this.token, this.fleur, id).subscribe(
				response=> {
					this.status_fleur = response.status;

					if(this.status_fleur != 'success'){
						this.status_fleur = 'error';
					}else{
						this.fleur = response.data;
						//this._router.navigate(['/fleur',this.fleur.id]);
						this._router.navigate(['/']);
					}
				},
				error => {
					console.log(<any>error);
				}
			);
		});
	}
}