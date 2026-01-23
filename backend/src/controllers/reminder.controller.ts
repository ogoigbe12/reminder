import { Response } from 'express';
import Reminder, { IReminder } from '../models/reminder.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const getReminders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = (req.user as any).userId;
        const reminders = await Reminder.find({ userId }).sort({ datetime: 1 });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getReminder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = (req.user as any).userId;
        const reminder = await Reminder.findOne({ _id: req.params.id, userId });
        if (!reminder) {
            res.status(404).json({ message: 'Reminder not found' });
            return;
        }
        res.json(reminder);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createReminder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, datetime } = req.body;
        const userId = (req.user as any).userId;
        const newReminder: IReminder = new Reminder({
            title,
            description,
            datetime,
            userId,
        });
        const savedReminder = await newReminder.save();
        res.status(201).json(savedReminder);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const updateReminder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = (req.user as any).userId;
        const updatedReminder = await Reminder.findOneAndUpdate(
            { _id: req.params.id, userId },
            req.body,
            { new: true }
        );
        if (!updatedReminder) {
            res.status(404).json({ message: 'Reminder not found' });
            return;
        }
        res.json(updatedReminder);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const deleteReminder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = (req.user as any).userId;
        const deletedReminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId });
        if (!deletedReminder) {
            res.status(404).json({ message: 'Reminder not found' });
            return;
        }
        res.json({ message: 'Reminder deleted' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
