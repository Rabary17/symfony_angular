import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'; 
import {UserService} from '../services/user.service';
import {ProduitService} from '../services/produit.service';
import {Produit} from '../models/produit';


@Component({
	selector: 'produit-new',
	templateUrl: '../views/produit.new.html',
	providers: [UserService,ProduitService]
})
export class ProduitNewComponent implements OnInit{
	public page_title: string;
	public identity;
	public token;
	public produit:Produit;
	public status_produit;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _produitService: ProduitService
	){
		this.page_title = 'New Produit';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		if(this.identity == null && !this.identity.sub ){
			this._router.navigate(['/login']);
		}else{
			this.produit = new Produit(1,'user','','','','','');
		}
	}

	onSubmit(){
		console.log(this.produit);
		this._produitService.create(this.token, this.produit).subscribe(
			response=> {
				this.status_produit = response.status;
				if(this.status_produit != 'success'){
					this.status_produit = 'error';
				}else{
					this.produit = response.data;
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