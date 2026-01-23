export interface Reminder {
    _id: string;
    title: string;
    description?: string;
    datetime: string; // ISO string
    createdAt: string;
}

export type RootStackParamList = {
    Home: undefined;
    AddEdit: { reminder?: Reminder; id?: string };
    Login: undefined;
    Signup: undefined;
};
