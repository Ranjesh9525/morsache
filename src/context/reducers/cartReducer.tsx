import { Cart, CartAction } from "@/@types/cart";

export const cartReducer = (state: Cart, action: CartAction) => {
  const savedCart = state;
  switch (action.type) {
    case "ADD_TO_CART":
      const { product, quantity, size, variant } = action.payload;
      const existingItemIndex = savedCart.items.findIndex(
        (item: any) =>
          item.product.id === product.id &&
          item.size === size &&
          item.variant === variant
      );
    
      if (existingItemIndex !== -1) {
        const updatedItems = savedCart.items.map((item) => {
          if (item.product.id === product.id && item.size === size && item.variant === variant) {
            return {
              ...item,
              quantity: item.quantity + quantity,
              totalPrice: item.totalPrice + parseFloat(product.price) * quantity
            };
          }
          return item;
        });
    
        const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
        const totalAmount = updatedItems.reduce((total, item) => total + item.quantity * parseFloat(item.product.price), 0);
    
        return {
          ...savedCart,
          items: updatedItems,
          totalItems,
          totalAmount
        };
      }else {
        // localStorage.setItem(
        //   "cart",
        //   JSON.stringify({
        //     ...savedCart,
        //     items: [
        //       ...savedCart?.items,
        //       {
        //         product,
        //         quantity,
        //         size,
        //         variant,
        //         totalPrice: parseFloat(product.price) * quantity,
        //       },
        //     ],
        //   })
        // );
        return {
          ...savedCart,
          totalItems: savedCart.totalItems + quantity,
          totalAmount:
            savedCart.totalAmount + parseFloat(product.price) * quantity,
          items: [
            ...savedCart.items,
            {
              product,
              quantity,
              size,
              variant,
              totalPrice: parseFloat(product.price) * quantity,
            },
          ],
        };
      };
    case "REMOVE_FROM_CART":
        const { product: productId, size: payloadSize, variant: payloadVariant } = action.payload;
        
        const updatedItems = savedCart.items.filter((item: any) => item?.product?.id !== productId && item?.size !== payloadSize && item.variant !== payloadVariant);
      
        const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
        const totalAmount = updatedItems.reduce((total, item) => total + item.quantity * parseFloat(item.product.price), 0);
      
        return {
          ...savedCart,
          items: updatedItems,
          totalItems,
          totalAmount
        };

    case "INCREASE":
      if (parseInt(action.payload.product.stock!) > action.payload.quantity) {
        const newQuantity = action.payload.quantity + 1;
        const newTotalPrice =
          parseFloat(action.payload.product.price) * newQuantity;

        const updatedCart = {
          ...savedCart,
          items: savedCart.items.map((item) =>
            item.product.id === action.payload.product.id && item.size === action.payload.size && item.variant === action.payload.variant
              ? { ...item, quantity: newQuantity, totalPrice: newTotalPrice }
              : item
          ),
        };
        updatedCart.totalAmount = updatedCart.items.reduce(
          (total, item) =>
            total + item.quantity * parseFloat(item.product.price),
          0
        );
        updatedCart.totalItems = updatedCart.items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        return {
          ...updatedCart,
        };
      }

      return savedCart;

    case "DECREASE":
      if (action.payload.quantity > 1) {
        const newQuantity = action.payload.quantity - 1;
        const newTotalPrice =
          parseFloat(action.payload.product.price) * newQuantity;
      
          const updatedCart = {
            ...savedCart,
            items: savedCart.items.map((item) =>
            item.product.id === action.payload.product.id && item.size === action.payload.size && item.variant === action.payload.variant
                ? { ...item, quantity: newQuantity, totalPrice: newTotalPrice }
                : item
            ),
          };
          updatedCart.totalAmount = updatedCart.items.reduce(
            (total, item) =>
              total + item.quantity * parseFloat(item.product.price),
            0
          );
          updatedCart.totalItems = updatedCart.items.reduce(
            (total, item) => total + item.quantity,
            0
          );
  
          return {
            ...updatedCart,
          };
        }
      return savedCart;

    default:
      return savedCart;
  }
};
// switch (action.type) {
//   case "ADD_TO_CART":
//     const savedCart: any = localStorage.getItem("cart")
//       ? JSON.parse(localStorage.getItem("cart") as string)
//       : state;

//     const { product, quantity, size, variant } = action.payload;
//     const existingItemIndex = savedCart.items.findIndex(
//       (item: any) =>
//         item.product.id === product.id &&
//         item.size === size &&
//         item.variant === variant
//     );

//     if (existingItemIndex !== -1) {
//       const updatedItems = [...savedCart.items];

//       updatedItems[existingItemIndex].quantity = quantity;
//       savedCart.totalAmount += parseFloat(product.price) * quantity;
//       savedCart.totalItems += quantity;
//       localStorage.setItem(
//         "cart",
//         JSON.stringify({
//           ...savedCart,
//           items: updatedItems,
//         })
//       );
//       return {
//         ...savedCart,
//         items: updatedItems,
//       };
//     } else {
//       localStorage.setItem(
//         "cart",
//         JSON.stringify({
//           ...savedCart,
//           items: [
//             ...state.items,
//             {
//               product,
//               quantity,
//               size,
//               variant,
//               totalPrice: parseFloat(product.price) * quantity,
//             },
//           ],
//         })
//       );
//       return {
//         ...state,
//         items: [
//           ...state.items,
//           {
//             product,
//             quantity,
//             size,
//             variant,
//             totalPrice: parseFloat(product.price) * quantity,
//           },
//         ],
//       };
//     }

//   case "REMOVE_FROM_CART":
//     // const { product.id:productId, size, variant } = action.payload;
//     const updatedItems = savedCart.items.filter(
//       (item: any) =>
//         !(
//           item.product.id === product.id &&
//           item.size === size &&
//           item.variant === variant
//         )
//     );
//     localStorage.setItem(
//       "cart",
//       JSON.stringify({
//         ...savedCart,
//         items: updatedItems,
//       })
//     );
//     return {
//       ...savedCart,
//       items: updatedItems,
//     };
//   default:
//     return savedCart;
// }
// const cartReducer = (state: Cart, action: CartAction) => {
