import mongoose from 'mongoose';
const { model, models, Schema } = mongoose;

const notificationSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true, enum: ["follow", "like"] },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = models?.notification || model('notification', notificationSchema)

export default Notification
