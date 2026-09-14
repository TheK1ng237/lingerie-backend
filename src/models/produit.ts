
export type GenreKey = "femme" | "homme" | "enfant";

export interface Variant {
  id: string;
  price: number;
  stock: number;
}

interface color{
  id:string;
  code:string;
}
interface size{
  id:string;
  label:string;
}
interface marque {
  id: number;
  name: string;
  description: string;
}

interface Like {
  id: number;
  quantity: number;
  dateLike: Date;
}

export interface products {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  type:string;

}
