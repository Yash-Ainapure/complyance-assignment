import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "ID is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["admin", "viewer"],
    },
    assignedCountry: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Validation for viewer role
UserSchema.pre("save", function (next) {
  if (
    this.role === "viewer" &&
    (!this.assignedCountry || this.assignedCountry.length === 0)
  ) {
    next(new Error("Viewers must have at least one assigned country"));
  } else {
    next();
  }
});

// Method to check data access
UserSchema.methods.canAccessData = function (data: { country: string }) {
  return (
    this.role === "admin" ||
    (this.role === "viewer" && this.assignedCountries.includes(data.country))
  );
};

// Method to check data modification
UserSchema.methods.canModifyData = function (data: { country: string }) {
  return (
    this.role === "admin" ||
    (this.role === "viewer" && this.assignedCountries.includes(data.country))
  );
};

// Generic Data Schema
const DataSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "dataType",
  }
);

// Create models
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Data = mongoose.models.Data || mongoose.model("Data", DataSchema);
