import mongoose, { Document, Schema } from 'mongoose';

export interface IReminder extends Document {
    title: string;
    description?: string;
    datetime: Date;
    createdAt: Date;
    userId: mongoose.Schema.Types.ObjectId;
}

const ReminderSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    datetime: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model<IReminder>('Reminder', ReminderSchema);
