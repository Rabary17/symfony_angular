export class Produit {
	
	constructor(
      public id: number,
      public nom: string,
      public description: string,
      public categorie: string,
      public prix: string,
      public createdAt,
      public updatedAt
	) {}
}