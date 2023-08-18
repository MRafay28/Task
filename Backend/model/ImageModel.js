import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const userSchema = new Schema(
  {
    image: {
      type: String,
      //   required: true,
    },
   
  },
  { timestamps: true }
);
export default model("Users", userSchema);
