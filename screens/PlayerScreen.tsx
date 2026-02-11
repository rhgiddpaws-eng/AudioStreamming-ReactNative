import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Slider,
} from 'react-native';
import { usePlayerStore } from '../store/playerStore';

export default function PlayerScreen() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    repeatMode,
    isShuffled,
    togglePlayPause,
    setCurrentTime,
    setVolume,
    toggleShuffle,
    setRepeatMode,
  } = usePlayerStore();

  if (!currentTrack) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No track playing</Text>
      </View>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>

      <View style={styles.albumArtContainer}>
        <Image
          source={{ uri: currentTrack.album.coverImage }}
          style={styles.albumArt}
        />
      </View>

      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={2}>
          {currentTrack.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {currentTrack.artist.name}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={currentTrack.duration}
          value={currentTime}
          onValueChange={setCurrentTime}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#404040"
          thumbTintColor="#1DB954"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{formatTime(currentTime)}</Text>
          <Text style={styles.time}>{formatTime(currentTrack.duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() =>
            setRepeatMode(
              repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off',
            )
          }
        >
          <Text
            style={[
              styles.controlIcon,
              repeatMode !== 'off' && styles.activeControl,
            ]}
          >
            🔁
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.controlIcon}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={togglePlayPause}
        >
          <Text style={styles.playIcon}>
            {isPlaying ? '⏸' : '▶'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.controlIcon}>⏭</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleShuffle}>
          <Text
            style={[
              styles.controlIcon,
              isShuffled && styles.activeControl,
            ]}
          >
            🔀
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.volumeContainer}>
        <Text style={styles.volumeIcon}>🔊</Text>
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={setVolume}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#404040"
          thumbTintColor="#1DB954"
        />
        <Text style={styles.volumeIcon}>🔇</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  closeText: {
    fontSize: 32,
    color: '#fff',
  },
  albumArtContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  albumArt: {
    width: 280,
    height: 280,
    borderRadius: 16,
  },
  trackInfo: {
    marginBottom: 30,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  trackArtist: {
    fontSize: 16,
    color: '#888',
  },
  progressContainer: {
    marginBottom: 30,
  },
  slider: {
    width: '100%',
    height: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
  },
  controlIcon: {
    fontSize: 24,
    color: '#888',
  },
  activeControl: {
    color: '#1DB954',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 28,
    color: '#000',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volumeIcon: {
    fontSize: 20,
    color: '#888',
  },
  volumeSlider: {
    flex: 1,
    height: 4,
  },
  emptyText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#888',
  },
});
