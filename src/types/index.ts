export  type Guitar = {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
    quantity?: number;
}

//aqui se aplica herencia   con = Guitar & 
export type CartItem = Guitar & {
    quantity: number;
}
// o con interface
// export interface CartItem extends Guitar {
//     quantity: number;
// }

//! solo funciona con types 
// vamos a heredadar cierto atributos del type
// export type CartItem = Pick<Guitar,'id' | 'name' | 'price'> & {
//     quantity: number;
// }

// vamos a heredadar y quitar atributos del type
// export type CartItem = Omit<Guitar,'id' | 'name' | 'price'> & {
//     quantity: number;
// }