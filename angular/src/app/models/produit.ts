export class Produit {
	
	constructor(
      public id: number,
      public nom: string,
      public categorie: string,
      public description: string,
      public prix: string,
      public createdAt,
      public updatedAt,
      public media
	) {}
}