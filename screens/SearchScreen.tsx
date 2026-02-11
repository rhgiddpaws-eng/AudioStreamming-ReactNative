import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: '1', name: 'Pop', color: '#FF6B6B' },
    { id: '2', name: 'Rock', color: '#4ECDC4' },
    { id: '3', name: 'Hip-Hop', color: '#45B7D1' },
    { id: '4', name: 'Jazz', color: '#FFA07A' },
    { id: '5', name: 'Classical', color: '#98D8C8' },
    { id: '6', name: 'Electronic', color: '#F7DC6F' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search songs, artists..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Browse All</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryCard, { backgroundColor: item.color }]}
            >
              <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          columnWrapperStyle={styles.columnWrapper}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchContainer: {
    padding: 16,
    paddingTop: 40,
  },
  searchInput: {
    backgroundColor: '#282828',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryCard: {
    flex: 1,
    height: 100,
    borderRadius: 8,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
