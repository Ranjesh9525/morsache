import { Cart, CartAction } from "@/@types/cart";

export const cartReducer = (state: Cart, action: CartAction) => {
  switch (action.type) {
    case "ADD_TO_CART":
        const { product, quantity, size, color } = action.payload;
        const existingItemIndex = state.items.findIndex(item => item.product.id === product.id && item.size === size && item.color === color);
  
        if (existingItemIndex !== -1) {
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity += quantity;
          return {
            ...state,
            items: updatedItems
          };
        } else {
          return {
            ...state,
            items: [...state.items, { product, quantity, size, color, totalPrice: product.price * quantity }]
          };
        }
  
      case "REMOVE_FROM_CART":
        // const { product.id:productId, size, color } = action.payload;
        const updatedItems = state.items.filter(item => !(item.product.id === product.id && item.size === size && item.color === color));
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
