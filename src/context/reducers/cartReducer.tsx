import { Cart, CartAction } from "@/@types/cart";

export const cartReducer = (state: Cart, action: CartAction) => {
  switch (action.type) {
    case "ADD_TO_CART":
        const { product, quantity, size, variant } = action.payload;
        const existingItemIndex = state.items.findIndex(item => item.product.id === product.id && item.size === size && item.variant === variant);
  
        if (existingItemIndex !== -1) {
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity += quantity;
          console.log({
            ...state,
            items: updatedItems
          })
          return {
            ...state,
            items: updatedItems
          };
        } else {
          console.log({
            ...state,
            items: [...state.items, { product, quantity, size, variant, totalPrice: product.price * quantity }]
          })
          return {
            ...state,
            items: [...state.items, { product, quantity, size, variant, totalPrice: product.price * quantity }]
          };
        }
  
      case "REMOVE_FROM_CART":
        // const { product.id:productId, size, variant } = action.payload;
        const updatedItems = state.items.filter(item => !(item.product.id === product.id && item.size === size && item.variant === variant));
        return {
          ...state,
          items: updatedItems
        };
    default:
      return state;
  }
};
// export const cartReducer = (state: Cart, action: CartAction) => {
//   switch (action.type) {
//     case "ADD_TO_CART":
//     //   return [...state, action.payload];

//     case "REMOVE_FROM_CART":
//       // return state.items.map((cart) =>
//       //   cart.id === action.payload ? { ...cart, status: true } : cart
//       // );
//       return state.items.filter(
//         (itemInCart) => itemInCart.product.id !== action.payload.product.id
//       );
//     default:
//       return state;
//   }
// };
