import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'; 
import {UserService} from '../services/user.service';
import {ProduitService} from '../services/produit.service';
import {Produit} from '../models/produit';


@Component({
	selector: 'produit-detail',
	templateUrl: '../views/produit.detail.html',
	providers: [UserService,ProduitService]
})
export class ProduitDetailComponent implements OnInit{
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
		private _produitService: ProduitService
	){
		this.page_title = 'Produit Detail';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		if(this.identity && this.identity.sub){
			//call the fleur service
			this.getProduit();
		}else{
			this._router.navigate(['/login']);
		}
	}

	getProduit(){
		this.loading = 'show';
		this._route.params.forEach((params: Params) => {
			let id = +params['id'];

			this._produitService.getProduit(this.token, id).subscribe(
				response => {
					
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

	deleteProduit(id){
		this._produitService.deleteProduit(this.token, id).subscribe(
			response => {
				if(response.status == 'success'){
					this._router.navigate(['/']);
				}else{
					alert('Produit was not deleted');
				}
			},
			error =>{
				console.log(<any>error);
			}
		);
	}
}