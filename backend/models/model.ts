import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Interfaces
export interface IProperty extends Document {
  image: string;
  price: number | string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  yearBuilt?: number;
  description?: string;
  features?: string[];
  address?: string;
  category?: string;
  agentId?: string | mongoose.Types.ObjectId;
  parking?: "Available" | "Not Available";
  propertyType: string;
}

export interface IAgent extends Document {
  name: string;
  title: string;
  experience: string;
  languages: string[];
  phone: string;
  email: string;
  image: string;
}

export interface ITestimonial extends Document {
  name: string;
  location: string;
  testimonial: string;
  rating: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  refreshToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schemas
const PropertySchema: Schema = new Schema({
  image: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: String, required: true },
  type: { type: String, required: true },
  yearBuilt: { type: Number, required: true },
  description: String,
  features: [String],
  address: String,
  category: { type: String, enum: ["Buy", "Rent"] },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  parking: {
    type: String,
    enum: ["Available", "Not Available"],
    default: "Available",
  },
  propertyType: { type: String, required: true },
});

const AgentSchema: Schema = new Schema({
  name: String,
  title: String,
  experience: String,
  languages: [String],
  phone: String,
  email: String,
  image: String,
});

const TestimonialSchema: Schema = new Schema({
  name: String,
  location: String,
  testimonial: String,
  rating: Number,
});

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email"
    ]
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  refreshToken: { type: String, select: false }
});

// User Schema Hooks and Methods
UserSchema.pre<IUser>("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Models
export const Property = mongoose.model<IProperty>("Property", PropertySchema);
export const Agent = mongoose.model<IAgent>("Agent", AgentSchema);
export const Testimonial = mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
export const User = mongoose.model<IUser>("User", UserSchema);