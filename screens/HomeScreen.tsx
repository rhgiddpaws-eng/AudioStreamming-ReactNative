import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function HomeScreen() {
  const trendingTracks = [
    {
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      title: 'Levitating',
      artist: 'Dua Lipa',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      title: 'INDUSTRY BABY',
      artist: 'Lil Nas X & Jack Harlow',
      image: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome to SoundWave</Text>
        <Text style={styles.subGreeting}>Discover new music</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <FlatList
          data={trendingTracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.trackCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.trackImage}
              />
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.trackArtist} numberOfLines={1}>
                  {item.artist}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: '#888',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  trackCard: {
    flexDirection: 'row',
    backgroundColor: '#282828',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  trackImage: {
    width: 60,
    height: 60,
  },
  trackInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 12,
    color: '#888',
  },
});
