import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';

@Injectable()
export class MediaService{
	public url: string;
	public identity;
	public token;

	constructor(
		private _http: Http
	){
       this.url = GLOBAL.url;
	}

	create(token, media){
		const json 	= JSON.stringify(media);
		const params 	= `json=${json}&authorization=${token}`;
		console.log(params);
		//const params 	= "json="+json+"&authorization="+token;
		const headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'}); 

		//return this._http.post(this.url+'/task/new',params, {headers:headers})
		return this._http.post(`${this.url}/media/new`,params, {headers:headers})

						 .map(res=>res.json());
	}

}