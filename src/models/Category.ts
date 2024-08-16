import mongoose from "mongoose";

//sample data of tags coming in
// tags: [
//     { tag: 'size', values: [Array] },
//     { tag: 'gender', values: [Array] },
//     { tag: 'klein', values: [Array] }
//   ]

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    featured: { type: Boolean, default: false },
    tags: [
      {
        tag: String,
        values: [String],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Categories ||
  mongoose.model("Categories", CategorySchema);
