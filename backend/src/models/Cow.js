import mongoose from 'mongoose';

const cowSchema = new mongoose.Schema(
  {
    cowName: { type: String, required: true },
    breed: { type: String, required: true },
    aiBreedPrediction: {
      breed: { type: String, default: 'Unknown' },
      confidence: { type: Number, default: 0 },
    },
    aiHealthStatus: {
      status: { type: String, default: 'Unknown' },
      confidence: { type: Number, default: 0 },
    },
    images: { type: [String], default: [] },
    videoURL: { type: String, default: null },
    age: { type: Number, required: true },
    milkProduction: { type: Number, required: true },
    price: { type: Number, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
    imageURL: { type: String },
    cloudinaryId: { type: String },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

cowSchema.index({ location: '2dsphere' });

const Cow = mongoose.model('Cow', cowSchema);

export default Cow;

