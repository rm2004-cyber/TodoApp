import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../../firebase/firebaseConfig';

const { height } = Dimensions.get('window');

export default function TodoScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const userId = auth.currentUser?.uid;
  const tasksRef = collection(db, 'users', userId, 'tasks');

  useEffect(() => {
    if (!userId) return;

    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(items);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleAddTask = async () => {
    if (!task.trim()) return;

    try {
      await addDoc(tasksRef, {
        title: task,
        completed: false,
        createdAt: new Date(),
      });
      setTask('');
    } catch (err) {
      Alert.alert('Error', 'Failed to add task');
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    await updateDoc(doc(db, 'users', userId, 'tasks', id), {
      completed: !currentStatus,
    });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'users', userId, 'tasks', id));
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/(auth)/LoginScreen');
    } catch (err) {
      Alert.alert('Logout Error', 'Failed to logout');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        onPress={() => toggleComplete(item.id, item.completed)}
        style={styles.checkbox}
      >
        <Ionicons
          name={item.completed ? 'checkbox' : 'square-outline'}
          size={24}
          color={item.completed ? 'green' : '#aaa'}
        />
      </TouchableOpacity>

      <Text
        style={[styles.taskText, item.completed && styles.completedText]}
      >
        {item.title}
      </Text>

      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash" size={22} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.heading}>Your Tasks</Text>
            <TouchableOpacity onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter task"
              placeholderTextColor="#ccc"
              value={task}
              onChangeText={setTask}
              style={styles.input}
            />
            <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#021B79',
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    minHeight: height,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#0F52BA',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
  },
  checkbox: {
    marginRight: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
});
