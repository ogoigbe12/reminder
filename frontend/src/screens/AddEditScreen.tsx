import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../services/api';
import NotificationService from '../services/notification';
import { RootStackParamList, Reminder } from '../types';
import { colors } from '../theme/colors';

type AddEditScreenRouteProp = RouteProp<RootStackParamList, 'AddEdit'>;

const AddEditScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<AddEditScreenRouteProp>();
  const { reminder } = route.params;

  const [title, setTitle] = useState(reminder?.title || '');
  const [description, setDescription] = useState(reminder?.description || '');
  const [date, setDate] = useState(reminder ? new Date(reminder.datetime) : new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  const handleSave = async () => {
    if (!title) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const data = {
      title,
      description,
      datetime: date.toISOString(),
    };

    try {
      let savedReminder: Reminder;
      if (reminder) {
        const response = await api.put<Reminder>(`/${reminder._id}`, data);
        savedReminder = response.data;
      } else {
        const response = await api.post<Reminder>('/', data);
        savedReminder = response.data;
      }

      // Schedule notification
      NotificationService.scheduleNotification(
        savedReminder._id,
        savedReminder.title,
        savedReminder.description || 'Reminder',
        new Date(savedReminder.datetime)
      );

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save reminder');
    }
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setShowPicker(true);
    setMode(currentMode);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Reminder Title"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Details"
        placeholderTextColor={colors.textSecondary}
        multiline
      />

      <Text style={styles.label}>Date & Time</Text>
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity onPress={() => showMode('date')} style={styles.dateBtn}>
            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showMode('time')} style={styles.dateBtn}>
            <Text style={styles.dateText}>{date.toLocaleTimeString()}</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          themeVariant="dark"
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Reminder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  label: {
    color: colors.secondary,
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dateBtn: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default AddEditScreen;
