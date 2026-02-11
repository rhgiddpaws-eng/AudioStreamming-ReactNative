import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // 요청 인터셉터
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // 응답 인터셉터
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
              });

              const { accessToken } = response.data;
              await AsyncStorage.setItem('accessToken', accessToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // 로그아웃 처리
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  // 인증 API
  async register(email: string, password: string, name: string) {
    const response = await this.client.post('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', {
      email,
      password,
    });

    const { accessToken, refreshToken } = response.data;
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    return response.data;
  }

  async logout() {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  }

  // 음원 API
  async getTracks(skip = 0, take = 20) {
    const response = await this.client.get('/tracks', {
      params: { skip, take },
    });
    return response.data;
  }

  async getTrackById(id: string) {
    const response = await this.client.get(`/tracks/${id}`);
    return response.data;
  }

  async searchTracks(query: string, skip = 0, take = 20) {
    const response = await this.client.get(`/tracks/search/${query}`, {
      params: { skip, take },
    });
    return response.data;
  }

  async getTrendingTracks(skip = 0, take = 20) {
    const response = await this.client.get('/tracks/trending/all', {
      params: { skip, take },
    });
    return response.data;
  }

  async playTrack(trackId: string) {
    const response = await this.client.post(`/tracks/${trackId}/play`);
    return response.data;
  }

  async likeTrack(trackId: string) {
    const response = await this.client.post(`/tracks/${trackId}/like`);
    return response.data;
  }

  async unlikeTrack(trackId: string) {
    const response = await this.client.delete(`/tracks/${trackId}/like`);
    return response.data;
  }

  // 아티스트 API
  async getArtists(skip = 0, take = 20) {
    const response = await this.client.get('/artists', {
      params: { skip, take },
    });
    return response.data;
  }

  async getArtistById(id: string) {
    const response = await this.client.get(`/artists/${id}`);
    return response.data;
  }

  async searchArtists(query: string) {
    const response = await this.client.get(`/artists/search/${query}`);
    return response.data;
  }

  async getTrendingArtists(take = 10) {
    const response = await this.client.get('/artists/trending/all', {
      params: { take },
    });
    return response.data;
  }

  async followArtist(artistId: string) {
    const response = await this.client.post(`/artists/${artistId}/follow`);
    return response.data;
  }

  async unfollowArtist(artistId: string) {
    const response = await this.client.delete(`/artists/${artistId}/follow`);
    return response.data;
  }

  // 앨범 API
  async getAlbums(skip = 0, take = 20) {
    const response = await this.client.get('/albums', {
      params: { skip, take },
    });
    return response.data;
  }

  async getAlbumById(id: string) {
    const response = await this.client.get(`/albums/${id}`);
    return response.data;
  }

  async searchAlbums(query: string) {
    const response = await this.client.get(`/albums/search/${query}`);
    return response.data;
  }

  async getNewAlbums(take = 10) {
    const response = await this.client.get('/albums/new/releases', {
      params: { take },
    });
    return response.data;
  }

  async likeAlbum(albumId: string) {
    const response = await this.client.post(`/albums/${albumId}/like`);
    return response.data;
  }

  async unlikeAlbum(albumId: string) {
    const response = await this.client.delete(`/albums/${albumId}/like`);
    return response.data;
  }

  // 카테고리 API
  async getCategories() {
    const response = await this.client.get('/categories');
    return response.data;
  }

  async getCategoryById(id: string) {
    const response = await this.client.get(`/categories/${id}`);
    return response.data;
  }

  // 구독 API
  async getSubscriptionPlans() {
    const response = await this.client.get('/subscriptions/plans');
    return response.data;
  }

  async getMySubscription() {
    const response = await this.client.get('/subscriptions/me');
    return response.data;
  }

  async getSubscriptionStatus() {
    const response = await this.client.get('/subscriptions/status');
    return response.data;
  }

  async getUserFeatures() {
    const response = await this.client.get('/subscriptions/features');
    return response.data;
  }

  // 결제 API
  async approveSubscriptionPayment(
    planId: string,
    paymentKey: string,
    orderId: string,
    amount: number,
  ) {
    const response = await this.client.post('/payments/subscription/approve', {
      planId,
      paymentKey,
      orderId,
      amount,
    });
    return response.data;
  }

  async approveTrackPurchase(
    trackId: string,
    paymentKey: string,
    orderId: string,
    amount: number,
  ) {
    const response = await this.client.post('/payments/track/approve', {
      trackId,
      paymentKey,
      orderId,
      amount,
    });
    return response.data;
  }

  async getPurchaseHistory(skip = 0, take = 20) {
    const response = await this.client.get('/payments/history/all', {
      params: { skip, take },
    });
    return response.data;
  }

  // DRM API
  async checkPlaybackPermission(trackId: string, deviceId: string) {
    const response = await this.client.post('/drm/check-playback-permission', {
      trackId,
      deviceId,
    });
    return response.data;
  }

  async checkDownloadPermission(trackId: string) {
    const response = await this.client.post('/drm/check-download-permission', {
      trackId,
    });
    return response.data;
  }

  async validateLicense(trackId: string) {
    const response = await this.client.post('/drm/validate-license', {
      trackId,
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
