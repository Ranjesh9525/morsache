const shippingReducer = (
  state: { choice: "pickup" | "delivery" | "" } = { choice: "" },
  action: {
    type: "SET_SHIPPING_CHOICE" | "CLEAR_CHOICE";
    payload: "pickup" | "delivery";
  }
): { choice: "pickup" | "delivery" | "" } => {
  switch (action.type) {
    case "SET_SHIPPING_CHOICE":
      return { choice: action.payload };
    case "CLEAR_CHOICE":
      return { choice: "" };
    default:
      return state;
  }
};
export default shippingReducer;
