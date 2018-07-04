import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import "rxjs/add/operator/map";
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';

@Injectable()
export class FleurService{
	public url: string;
	public identity;
	public token;

	constructor(
		private _http: Http
	){
       this.url = GLOBAL.url;
	}

	create(token, fleur){
		const json 	= JSON.stringify(fleur);
		const params 	= `json=${json}&authorization=${token}`;
		//const params 	= "json="+json+"&authorization="+token;
		const headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'}); 

		//return this._http.post(this.url+'/task/new',params, {headers:headers})
		return this._http.post(`${this.url}/fleur/new`,params, {headers:headers})

						 .map(res=>res.json());
	}

	getFleurs(token, page = null){
		//let params = "authorization="+token;
		const params = `authorization=${token}`;
		const header = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

		if(page == null){
			page=1;
		}

		console.log(`${this.url}/fleur/list?page=${page}`);
		return this._http.post(`${this.url}/fleur/list?page=${page}`,params, {headers:header})
						 .map(res=>res.json());
	}

	getFleur(token, id){
		const params = `authorization=${token}`;
		const header = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post(`${this.url}/fleur/detail/${id}`,params, {headers:header})
						 .map(res=>res.json());
	}

	update(token, fleur, id){
		const json 	= JSON.stringify(fleur);
		const params 	= `json=${json}&authorization=${token}`;
		const headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'}); 

		return this._http.post(`${this.url}/fleur/edit/${id}`, params, {headers:headers})
						 .map(res=>res.json());
	}

	search(token, search = null, filter = null, order = null){
		const params = `authorization=${token}&filter=${filter}&order=${order}`;
		const headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'}); 


		let url;
		if(search == null){
			url = `${this.url}/fleur/search`;
		}else{
			url = `${this.url}/fleur/search/${search}`;
		}

		return this._http.post(url, params, {headers: headers})
					.map(res => res.json());
	}

	deleteFleur(token, id){
		const params = `authorization=${token}`;
		const header = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post(`${this.url}/fleur/remove/${id}`,params, {headers:header})
						 .map(res=>res.json());
	}
}