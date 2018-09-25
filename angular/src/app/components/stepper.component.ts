import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router'; 
import {UserService} from '../services/user.service';
import {ProduitService} from '../services/produit.service';
import {Produit} from '../models/produit';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
    selector: 'stepper',
    templateUrl: '../views/stepper.html',
})
export class StepperComponent implements OnInit{
	public page_title: string;
	public identity;
	public token;
	public produit:Produit;
	public status_produit;
    public media: string; 
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
        private _produitService: ProduitService,
        private _formBuilder: FormBuilder
	){
		this.page_title = 'New Produit';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){
        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ['', Validators.required]
          });
          this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required]
          });
    }
    
	onSubmit(){
	
	}
}

