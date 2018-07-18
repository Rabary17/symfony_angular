import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'; 
import {UserService} from '../services/user.service';
import {MediaService} from '../services/media.service';
import {Media} from '../models/media';


@Component({
	selector: 'media-new',
	templateUrl: '../views/media.new.html',
	providers: [UserService,MediaService]
})
export class MediaNewComponent implements OnInit{
	public page_title: string;
	public identity;
	public token;
	public media:Media;
	public status_produit;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _mediaService: MediaService
	){
		this.page_title = 'New Media';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		if(this.identity == null && !this.identity.sub ){
			this._router.navigate(['/login']);
		}else{
			this.media = new Media(1,'','','','','');
		}
	}

	onSubmit(){
		console.log(this.media);
		this._mediaService.create(this.token, this.media).subscribe(
			response=> {
				this.status_produit = response.status;
				if(this.status_produit != 'success'){
					this.status_produit = 'error';
				}else{
					this.media = response.data;
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
