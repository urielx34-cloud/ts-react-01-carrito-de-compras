import { useMemo, useEffect, useState } from 'react'
import { db } from '../data/db';
import type { CartItem, Guitar } from  "../types";

export const useCart = () => {
    
    /**
     * funcion que evita que se pierda el localStorage al recargar la página, esta función se ejecuta cada vez que se carga la página y verifica si hay un carrito guardado en el localStorage, 
     * si lo hay, lo devuelve como un objeto JavaScript, si no lo hay, devuelve un arreglo vacío.
     * @returns 
     */
    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart');
        return localStorageCart ? JSON.parse(localStorageCart) : [];
    }
    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart());
    const MAX_ITEM = 5;
    const MIN_ITEM = 1;
    // es recomendado usar useEffect para guardar datos en el localStorage, ya que esto permite que los datos se mantengan incluso si el usuario recarga la página o cierra el navegador, 
    // esto es importante para mantener la persistencia de los datos del carrito de compras.
    //! ademas useEffect se ejecuta cada vez que el estado del carrito (cart) cambia, lo que permite que los datos del carrito se actualicen de forma sincronizado en el localStorage cada vez que se agrega, elimina o modifica un item en el carrito.
    //! useEffect es necesario porque las funciones de ract son asincronas, lo que significa que el estado del carrito (cart) puede no estar actualizado en el momento en que se intenta guardar en el localStorage, 
    //! por lo que useEffect garantiza que los datos se guarden correctamente cada vez que el estado del carrito cambia.
    //! en resumen useEffect se ejecuta cuando el componente esta listo
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);



    /// es recomendado usar useEffect para cargar datos cuando se trae de una base de datos o API
    //const [data, setData] = useState([]); // ahorita no usasmos datos de api
    // useEffect(() => {
    //     setData(db);
    // }, []);

    function addToCart(item: Guitar)  {


        const itemExist = cart.findIndex(cartItem => cartItem.id === item.id);
        if (itemExist >= 0) {
            if (cart[itemExist].quantity >= MAX_ITEM) return;
            const updatedCart = [...cart];
            updatedCart[itemExist].quantity++;
            setCart(updatedCart);
        } else {
            // se agrega la propiedad quantity al objeto item, esto es necesario para poder llevar el conteo de la cantidad de cada item en el carrito, ya que si el item no existe en el carrito se agrega con una cantidad de 1, y si el item ya existe en el carrito se incrementa la cantidad en 1.
            item.quantity = 1;
            const newItem : CartItem = {...item, quantity: 1}; // se crea un nuevo objeto con las propiedades del item y la propiedad quantity, esto es necesario para poder llevar el conteo de la cantidad de cada item en el carrito, ya que si el item no existe en el carrito se agrega con una cantidad de 1, y si el item ya existe en el carrito se incrementa la cantidad en 1.
            //  ... spread operator, se utiliza para crear una nueva matriz que contiene todos los elementos de la matriz anterior (prevCart) 
            // y luego se agrega el nuevo elemento (guitar) al final de la nueva matriz. Esto es importante porque en React no se 
            // debe mutar el estado directamente, sino que se debe crear una nueva copia del estado con las modificaciones necesarias.
            setCart(prevCart => [...prevCart, newItem]);
        }

    }

    function removeFromCart(itemId: Guitar['id']) {
        //! elimina un iteam, donde se vulve a crear un nuevo arreglo sin mutarlo, se utiliza el método filter 
        // !para crear un nuevo arreglo que contiene todos los elementos del arreglo anterior (prevCart) excepto el elemento que se desea eliminar (cartItem.id !== itemId), 
        // !esto es importante porque en React no se debe mutar el estado directamente, sino que se debe crear una nueva copia del estado con las modificaciones necesarias.
        setCart(prevCart => prevCart.filter(cartItem => cartItem.id !== itemId));
    }

    function increaseQuantity(itemId: Guitar['id']) {
        const updatedCart = cart.map(cartItem => {
            if (cartItem.id == itemId && cartItem.quantity < MAX_ITEM) {
                return {
                    ...cartItem,//! el spread(...) indica que se va una copia del state cart y luego se modifica la propiedad quantity, esto es importante porque en React no se debe mutar el estado directamente, 
                    // !sino que se debe crear una nueva copia del estado con las modificaciones necesarias.
                    quantity: cartItem.quantity + 1
                }
            }

            return cartItem;
        });
        setCart(updatedCart);
    }

    function decreaseQuantity(idEliminar:Guitar['id']) {
        const updatedCart = cart.map(itemEncarrito => {
            if (itemEncarrito.id == idEliminar && itemEncarrito.quantity > MIN_ITEM) {
                return {
                    ...itemEncarrito,
                    quantity: itemEncarrito.quantity - 1
                }
            }
            return itemEncarrito;
        });

        setCart(updatedCart);
    }

    function clearCart() {
        setCart([]);
    }

        // state derivado es un estado que se calcula a partir de otro estado, en este caso el estado del carrito, se utiliza para calcular si el carrito esta vacio o no, 
    // esto es necesario para mostrar un mensaje en el carrito cuando este este vacio, y mostrar la tabla cuando el carrito tenga productos.
    const isEmpty = useMemo(() => cart.length === 0,[cart]); // se crea una función que devuelve un booleano, esto es necesario para poder mostrar un mensaje en el carrito cuando este este vacio, y mostrar la tabla cuando el carrito tenga productos.
    //!EL USO DE USEMEMO ES IMPORTANTE PARA EVITAR CALCULOS INNECESARIOS, YA QUE SI EL COMPONENTE SE RENDERIZA NUEVAMENTE, LA FUNCION SE EJECUTARA NUEVAMENTE, 
    //! PERO SI EL VALOR DE CART NO CAMBIA,
    //!  LA FUNCION NO SE EJECUTARA NUEVAMENTE, ESTO MEJORA EL RENDIMIENTO DEL COMPONENTE.

    // USO DEL REDUCE
    // se utiliza el método reduce para calcular el total del carrito, el primer argumento es una función que recibe el acumulador (total) y el valor actual (itemActual), el segundo argumento es el valor inicial del acumulador (0), 
    // la función devuelve la suma del acumulador y el precio del itemActual multiplicado por la cantidad del itemActual, esto es necesario para calcular el total del carrito cuando este tenga productos.
    const cartTotal = useMemo(() => cart.reduce((total, itemActual) => total + itemActual.price * itemActual.quantity, 0), [cart]); // se crea una función que devuelve el total del carrito, esto es necesario para calcular el total del carrito cuando este tenga productos.


    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}

