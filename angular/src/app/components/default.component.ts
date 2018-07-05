import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {ProduitService} from '../services/produit.service';
import {Produit} from '../models/produit'; 

@Component({
	selector: 'default',
	templateUrl: '../views/default.html',
	providers: [UserService, ProduitService]
})
export class DefaultComponent implements OnInit{
	public title: string;
	public identity;
	public token;
	public produits: Array<Produit>;
	public pages;
	public pagePrev;
	public pageNext;
	public loading;

	constructor(
		private _route	: ActivatedRoute,
		private _router	: Router,
		private _userService: UserService,
		private _produitService: ProduitService
	){
		this.title = 'Homepage';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		console.log('Default component created!');
		this.getAllProduit();
	}

	getAllProduit(){
		this._route.params.forEach((params: Params) => {
			let page = +params['page'];

			if(!page){
				page=1;
			}

			this.loading = 'show';
			this._produitService.getProduits(this.token, page).subscribe(
				response => {
					if(response.status == 'success'){
						this.produits = response.data;	
						this.loading = 'hide';
					
						console.log('***',this.produits);
						//total pages
						this.pages = [];
						for(let i=0; i < response.total_pages; i++){
							this.pages.push(i);
						}
						//previous page
						if(page>=2){
							this.pagePrev = (page - 1);
						}else{
							this.pagePrev = page;
						}
						//next page
						if(page < response.total_pages){
							this.pageNext = (page+1);
						}else{
							this.pageNext = page;
						}

					}
				},
				error => {
					console.log(<any>error);
				}
			);
		});
	}


	public filter = 0;
	public order = 0;
	public searchString;

	search(){
		console.log(this.filter);
		console.log(this.order);
		console.log(this.searchString);

		this.loading = 'show';

		if(!this.searchString || this.searchString.trim().length == 0){
			this.searchString = null;
		}

		this._produitService.search(this.token, this.searchString, this.filter, this.order).subscribe(
			response => {

				console.log(response.status);
				if(response.status == 'success'){
					this.produits = response.data;
					this.loading = 'hide';
				}else{
					this._router.navigate(['/index'])
				}
			},
			error=> {
				console.log(<any>error);
			}
		);
	}
}