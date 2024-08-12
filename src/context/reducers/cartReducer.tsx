import { Cart, CartAction } from "@/@types/cart";

export const cartReducer = (state: Cart, action: CartAction) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const savedCart: any = localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart") as string)
        : state;

      const { product, quantity, size, variant } = action.payload;
      const existingItemIndex = savedCart.items.findIndex(
        (item: any) =>
          item.product.id === product.id &&
          item.size === size &&
          item.variant === variant
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...savedCart.items];

        updatedItems[existingItemIndex].quantity = quantity;
        savedCart.totalAmount += parseFloat(product.price) * quantity;
        savedCart.totalItems += quantity;
        localStorage.setItem(
          "cart",
          JSON.stringify({
            ...savedCart,
            items: updatedItems,
          })
        );
        return {
          ...savedCart,
          items: updatedItems,
        };
      } else {
        localStorage.setItem(
          "cart",
          JSON.stringify({
            ...savedCart,
            items: [
              ...state.items,
              {
                product,
                quantity,
                size,
                variant,
                totalPrice: parseFloat(product.price) * quantity,
              },
            ],
          })
        );
        return {
          ...state,
          items: [
            ...state.items,
            {
              product,
              quantity,
              size,
              variant,
              totalPrice: parseFloat(product.price) * quantity,
            },
          ],
        };
      }

    case "REMOVE_FROM_CART":
      // const { product.id:productId, size, variant } = action.payload;
      const updatedItems = savedCart.items.filter(
        (item: any) =>
          !(
            item.product.id === product.id &&
            item.size === size &&
            item.variant === variant
          )
      );
      localStorage.setItem(
        "cart",
        JSON.stringify({
          ...savedCart,
          items: updatedItems,
        })
      );
      return {
        ...savedCart,
        items: updatedItems,
      };
    default:
      return savedCart;
  }
};
// const cartReducer = (state: Cart, action: CartAction) => {
//   let savedCart: Cart = {
//     items: [],
//     totalAmount: 0,
//     totalItems: 0
//   };

//   switch (action.type) {
//     case "ADD_TO_CART":
//       savedCart = localStorage.getItem("cart")
//         ? JSON.parse(localStorage.getItem("cart") as string)
//         : state;

//       const { product, quantity, size, variant } = action.payload;
//       const existingItemIndex = savedCart.items.findIndex(
//         (item: any) =>
//           item.product.id === product.id &&
//           item.size === size &&
//           item.variant === variant
//       );

//       if (existingItemIndex !== -1) {
//         const updatedItems = [...savedCart.items];
//         updatedItems[existingItemIndex].quantity += quantity;
//         savedCart.totalAmount += parseFloat(product.price) * quantity;
//         savedCart.totalItems += quantity;
//         localStorage.setItem(
//           "cart",
//           JSON.stringify({
//             ...savedCart,
//             items: updatedItems,
//           })
//         );
//         return {
//           ...savedCart,
//           items: updatedItems,
//         };
//       } else {
//         localStorage.setItem(
//           "cart",
//           JSON.stringify({
//             ...savedCart,
//             items: [
//               ...savedCart.items,
//               {
//                 product,
//                 quantity,
//                 size,
//                 variant,
//                 totalPrice: parseFloat(product.price) * quantity,
//               },
//             ],
//           })
//         );
//         return {
//           ...savedCart,
//           items: [
//             ...savedCart.items,
//             {
//               product,
//               quantity,
//               size,
//               variant,
//               totalPrice: parseFloat(product.price) * quantity,
//             },
//           ],
//         };
//       }

//     case "REMOVE_FROM_CART":
//       savedCart = localStorage.getItem("cart")
//         ? JSON.parse(localStorage.getItem("cart") as string)
//         : state;

//       const { product: productId, size, variant } = action.payload;
//       const updatedItems = savedCart.items.filter(
//         (item: any) =>
//           !(
//             item.product.id === productId &&
//             item.size === size &&
//             item.variant === variant
//           )
//       );
//       savedCart.items = updatedItems;
//       savedCart.totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
//       savedCart.totalAmount = updatedItems.reduce((total, item) => total + (item.quantity * parseFloat(item.product.price)), 0);
//       localStorage.setItem("cart", JSON.stringify(savedCart));
//       return {
//         ...savedCart
//       };

//     default:
//       return savedCart;
//   }
// };
