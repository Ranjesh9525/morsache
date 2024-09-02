import mongoose from "mongoose";

const AdminDataSchema = new mongoose.Schema({
  defaultConfirmOrders:{
    type:Boolean,
    default:false
  },
  
});

export default mongoose.models.AdminData || mongoose.model("AdminData", AdminDataSchema);
