import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../services/api';
import { Reminder, RootStackParamList } from '../types';
import { colors } from '../theme/colors';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const fetchReminders = async () => {
    try {
      const response = await api.get<Reminder[]>('/');
      setReminders(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch reminders');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [])
  );

  const handleDelete = async (id: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/${id}`);
            fetchReminders();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete reminder');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Reminder }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AddEdit', { reminder: item })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{new Date(item.datetime).toLocaleString()}</Text>
      {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
      <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEdit', {})}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    color: colors.secondary,
    marginTop: 4,
    marginBottom: 4,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  deleteText: {
    color: colors.error,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
