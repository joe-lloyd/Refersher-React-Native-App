import React, { useState } from 'react';
import { Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, View, TextInput } from '@/components/Themed';  // Import Themed components
import Colors from '@/constants/Colors';  // Import your Colors

export default function TabTwoScreen() {
  const [todos, setTodos] = useState<{ id: string; text: string }[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim().length > 0) {
      setTodos([...todos, { id: Date.now().toString(), text: newTodo }]);
      setNewTodo('');
    }
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>

      <TextInput
        style={styles.input}
        placeholder="Add a new task"
        value={newTodo}
        onChangeText={setNewTodo}
      />
      <Button title="Add Task" onPress={addTodo} />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.text}</Text>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    width: '80%',
    backgroundColor: Colors.light.background,
  },
  todoText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  deleteText: {
    color: 'red',
    fontSize: 16,
  },
});
