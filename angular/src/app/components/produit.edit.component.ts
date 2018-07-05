import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'; 
import {UserService} from '../services/user.service';
import {ProduitService} from '../services/produit.service';
//import {TaskDetailComponent} from './fleur.detail.component';		
import {Produit} from '../models/produit';


@Component({
	selector: 'produit-edit',
	templateUrl: '../views/produit.new.html',
	providers: [UserService,ProduitService]
})
export class ProduitEditComponent implements OnInit{
	
	public page_title: string;
	public identity;
	public token;
	public produit:Produit;
	public status_produit;
	public loading;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _ProduitService: ProduitService
	){
		this.page_title = 'Edit Produit';
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

    		this.getProduit();

		}	
	}

	getProduit(){
		this.loading = 'show';
		this._route.params.forEach((params: Params) => {
			console.log(params);
			let id = +params['id'];

			this._ProduitService.getProduit(this.token, id).subscribe(
				response => {
					console.log(response);
					if(response.status == 'success'){
						
						if(response.data.users.id == this.identity.sub){
							this.produit = response.data;
							console.log(this.produit);
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
			this._ProduitService.update(this.token, this.produit, id).subscribe(
				response=> {
					this.status_produit = response.status;

					if(this.status_produit != 'success'){
						this.status_produit = 'error';
					}else{
						this.produit = response.data;
						//this._router.navigate(['/produit',this.produit.id]);
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