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
	public media: string; 

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
			this.produit = new Produit(1,'user','','','','','','');
		}
	}

	onFileChange(event) {
		let reader = new FileReader();
		// let nbr = event.target.files.length;
		// console.log(nbr);
		// this.produit.media = [];
		// var i;
		// for(i=0; i<nbr; i++){
		// 	var result;
		// 	let file = event.target.files[i];
		// 	reader.readAsDataURL(file);
		// 	reader.onload = () => {
		// 	  result = encodeURIComponent(reader.result)
			  
		// 	  return this.produit.media.push(result);
		// };
		// console.log(this.produit.media);
		if(event.target.files && event.target.files.length > 0) {
		  let file = event.target.files[0];
		  reader.readAsDataURL(file);
		  reader.onload = () => {
				/**this.form.get('avatar').setValue({
					filename: file.name,
					filetype: file.type,
					value: reader.result.split(',')[1]
				})*/
				console.log(reader.result);
			this.produit.media = encodeURIComponent(reader.result);//.split(',')[1];
		  };
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