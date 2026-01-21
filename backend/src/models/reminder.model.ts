import mongoose, { Document, Schema } from 'mongoose';

export interface IReminder extends Document {
    title: string;
    description?: string;
    datetime: Date;
    createdAt: Date;
}

const ReminderSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    datetime: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReminder>('Reminder', ReminderSchema);
