import { Request, Response } from 'express';
import Reminder, { IReminder } from '../models/reminder.model';

export const getReminders = async (req: Request, res: Response): Promise<void> => {
    try {
        const reminders = await Reminder.find().sort({ datetime: 1 });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createReminder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, datetime } = req.body;
        const newReminder: IReminder = new Reminder({
            title,
            description,
            datetime,
        });
        const savedReminder = await newReminder.save();
        res.status(201).json(savedReminder);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const updateReminder = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedReminder = await Reminder.findByIdAndUpdate(
            req.params.id,
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

export const deleteReminder = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedReminder = await Reminder.findByIdAndDelete(req.params.id);
        if (!deletedReminder) {
            res.status(404).json({ message: 'Reminder not found' });
            return;
        }
        res.json({ message: 'Reminder deleted' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
