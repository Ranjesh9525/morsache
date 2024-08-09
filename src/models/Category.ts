
import mongoose from "mongoose";

const CategorySchema= new mongoose.Schema({
    name:String,
    image:String,
    tags:{
        tag:String,
        values:[String],
    }
},{timestamps:true})


export default mongoose.models.Categories || mongoose.model("Categories",CategorySchema)