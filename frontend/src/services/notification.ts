import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

class NotificationService {
    configure = () => {
        PushNotification.configure({
            onRegister: function (token) {
                console.log('TOKEN:', token);
            },

            onNotification: function (notification) {
                console.log('NOTIFICATION:', notification);
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

    scheduleNotification = (id: string, title: string, message: string, date: Date) => {
        // Generate a numeric ID from the string ID for the notification system
        const numericId = this.hashString(id);

        PushNotification.localNotificationSchedule({
            channelId: "reminders-channel",
            id: numericId,
            title: title,
            message: message,
            date: date,
            allowWhileIdle: true,
            playSound: true,
            soundName: 'default',
            userInfo: { id },
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
