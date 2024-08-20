export const shippingReducer = (
  state: { choice: "pickup" | "delivery" |"" },
  action: { type: "SET_SHIPPING_CHOICE"; payload: "pickup" | "delivery" }
) => {
  switch (action.type) {
    case "SET_SHIPPING_CHOICE":
        console.log("choice", action.payload);
      return {
        choice: action.payload,
      };
    default:
      return state;
  }
};
