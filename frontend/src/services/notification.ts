import PushNotification from 'react-native-push-notification';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

class NotificationService {
    private listeners: ((notification: any) => void)[] = [];

    configure = () => {
        PushNotification.configure({
            onRegister: function (token) {
                console.log('TOKEN:', token);
            },

            onNotification: (notification) => {
                console.log('NOTIFICATION RECEIVED:', notification);

                // Notify listeners
                this.listeners.forEach((listener) => listener(notification));

                // Show alert when notification is received in foreground
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const notif = notification as any;
                if (notif.foreground) {
                    Alert.alert(
                        notif.title || 'Reminder',
                        notif.message as string
                    );
                }
            },

            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            popInitialNotification: true,
            requestPermissions: Platform.OS === 'ios',
        });

        PushNotification.createChannel(
            {
                channelId: "reminders-channel",
                channelName: "Reminders",
                channelDescription: "Channel for reminder notifications",
                soundName: "default",
                importance: 4,
                vibrate: true,
            },
            (created) => console.log(`createChannel returned '${created}'`)
        );
    };

    onNotificationOpened = (callback: (notification: any) => void) => {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== callback);
        };
    };

    getInitialNotification = (): Promise<any> => {
        return new Promise((resolve) => {
            PushNotification.popInitialNotification((notification) => {
                if (notification) {
                    resolve({ notification });
                } else {
                    resolve(null);
                }
            });
        });
    };

    checkPermissions = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            console.log('POST_NOTIFICATIONS check:', granted);
            return granted;
        }
        return true;
    };

    requestPermissions = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                    {
                        title: 'Notification Permission',
                        message: 'App needs permission to send reminders',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                console.log('POST_NOTIFICATIONS request result:', granted);
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    scheduleNotification = (id: string, title: string, message: string, date: Date) => {
        // Generate a numeric ID from the string ID for the notification system
        const numericId = this.hashString(id);

        console.log('Scheduling notification:', {
            id: numericId,
            title,
            message,
            date: date.toString(),
            now: new Date().toString()
        });

        PushNotification.localNotificationSchedule({
            channelId: "reminders-channel",
            id: numericId,
            title: title,
            message: message,
            date: date,
            allowWhileIdle: true,
            playSound: true,
            soundName: 'default',
            userInfo: { reminderId: id },
        });
    };

    cancelNotification = (id: string) => {
        const numericId = this.hashString(id);
        PushNotification.cancelLocalNotification(String(numericId));
    };

    // Simple hash to convert string ID to integer
    private hashString(str: string): number {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
}

export default new NotificationService();
