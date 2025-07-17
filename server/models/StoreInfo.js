const mongoose = require("mongoose");

const storeInfoSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    storeLogo: {
      type: String,
      default: "",
      validate: {
        validator: (value) =>
          !value || /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(value),
        message: "Invalid image format. Must be a valid image file.",
      },
    },
    storeWebsite: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // allows multiple nulls
      validate: {
        validator: (value) =>
          !value ||
          /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(value),
        message: "Invalid website URL",
      },
    },
    storeAddress: {
      type: String,
      required: true,
      trim: true,
    },
    storeCity: {
      type: String,
      required: true,
      trim: true,
      index: true, // useful for location-based filters
    },
    storeDescription: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    socialMedia: {
      instagram: {
        type: String,
        trim: true,
        validate: {
          validator: (v) =>
            !v ||
            /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._]+$/.test(v),
          message: "Invalid Instagram URL",
        },
      },
      youtube: {
        type: String,
        trim: true,
        validate: {
          validator: (v) =>
            !v ||
            /^https:\/\/(www\.)?youtube\.com\/(channel|user|c)\/[A-Za-z0-9._-]+$/.test(
              v
            ),
          message: "Invalid YouTube URL",
        },
      },
      twitter: {
        type: String,
        trim: true,
        validate: {
          validator: (v) =>
            !v || /^https:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]+$/.test(v),
          message: "Invalid Twitter URL",
        },
      },
      facebook: {
        type: String,
        trim: true,
        validate: {
          validator: (v) =>
            !v ||
            /^https:\/\/(www\.)?facebook\.com\/[A-Za-z0-9._-]+$/.test(v),
          message: "Invalid Facebook URL",
        },
      },
    },

    // Owner link
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StoreInfo", storeInfoSchema);
