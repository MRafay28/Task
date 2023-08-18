


import conversationModal from "../models/conversationModal.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

export const sendImage = async (req, res) => {
  try {
    const update = await userModel
      .create(
        {
          _id: req.body.userId,
        },
        { $set: { image: req.file.filename} },
        { new: true }
      )
      .select("-username -company -country -teamId -password -formId ");
    if (update) {
      res.status(200).json({ updatedProfile: update });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: error.stack });
  }
};
