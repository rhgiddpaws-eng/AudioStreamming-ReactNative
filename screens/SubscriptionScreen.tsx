import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
  popular?: boolean;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: '광고와 함께 음악 감상',
    features: ['광고 포함', '기본 음질', '제한된 스킵'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9900,
    description: '광고 없이 무제한 스트리밍',
    features: ['광고 없음', '고음질 스트리밍', '무제한 스킵', '오프라인 다운로드'],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 14900,
    description: 'Premium + 음원 구매 할인',
    features: ['모든 Premium 기능', '음원 구매 20% 할인', '우선 고객 지원', '독점 콘텐츠'],
    popular: false,
  },
];

export default function SubscriptionScreen() {
  const navigation = useNavigation();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);

  useEffect(() => {
    fetchSubscriptionInfo();
  }, []);

  const fetchSubscriptionInfo = async () => {
    try {
      const response = await axios.get('http://localhost:3000/subscriptions/current', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentPlan(response.data.planId);
      setSubscriptionInfo(response.data);
    } catch (error) {
      console.log('구독 정보 조회 실패');
    }
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan.price === 0) {
      Alert.alert('안내', '이미 무료 플랜을 사용 중입니다.');
      return;
    }

    if (currentPlan === plan.id) {
      Alert.alert('안내', '이미 이 플랜을 구독 중입니다.');
      return;
    }

    navigation.navigate('Payment', {
      item: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        type: 'subscription',
      },
    });
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      '구독 취소',
      '정말로 구독을 취소하시겠습니까?\n남은 기간까지 서비스를 이용할 수 있습니다.',
      [
        {
          text: '취소',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            try {
              setLoading(true);
              await axios.post(
                'http://localhost:3000/subscriptions/cancel',
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              Alert.alert('성공', '구독이 취소되었습니다.');
              fetchSubscriptionInfo();
            } catch (error: any) {
              Alert.alert('오류', error.response?.data?.message || '구독 취소 중 오류가 발생했습니다.');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>구독 플랜</Text>
        <Text style={styles.headerSubtitle}>당신에게 맞는 플랜을 선택하세요</Text>
      </View>

      {/* 현재 구독 정보 */}
      {subscriptionInfo && currentPlan !== 'free' && (
        <View style={styles.currentSubscriptionCard}>
          <View>
            <Text style={styles.currentPlanLabel}>현재 구독 중</Text>
            <Text style={styles.currentPlanName}>
              {SUBSCRIPTION_PLANS.find((p) => p.id === currentPlan)?.name}
            </Text>
            <Text style={styles.expiryDate}>
              만료일: {new Date(subscriptionInfo.endDate).toLocaleDateString('ko-KR')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelSubscription}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 플랜 카드 */}
      <View style={styles.plansContainer}>
        {SUBSCRIPTION_PLANS.map((plan) => (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              plan.popular && styles.planCardPopular,
              currentPlan === plan.id && styles.planCardActive,
            ]}
          >
            {plan.popular && <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>인기</Text>
            </View>}

            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>
              {plan.price === 0 ? '무료' : `${plan.price.toLocaleString()}원`}
            </Text>
            <Text style={styles.planPeriod}>/월</Text>
            <Text style={styles.planDescription}>{plan.description}</Text>

            {/* 기능 목록 */}
            <View style={styles.featuresList}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureCheckmark}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* 버튼 */}
            {currentPlan === plan.id ? (
              <View style={styles.currentButton}>
                <Text style={styles.currentButtonText}>현재 구독 중</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.selectButton, plan.popular && styles.selectButtonPopular]}
                onPress={() => handleSelectPlan(plan)}
              >
                <Text style={[styles.selectButtonText, plan.popular && styles.selectButtonTextPopular]}>
                  {plan.price === 0 ? '무료 플랜 사용' : '플랜 선택'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* 비교 테이블 */}
      <View style={styles.comparisonSection}>
        <Text style={styles.comparisonTitle}>플랜 비교</Text>

        <View style={styles.comparisonTable}>
          <View style={styles.comparisonRow}>
            <Text style={[styles.comparisonCell, styles.comparisonHeader]}>기능</Text>
            <Text style={[styles.comparisonCell, styles.comparisonHeader]}>Free</Text>
            <Text style={[styles.comparisonCell, styles.comparisonHeader]}>Premium</Text>
            <Text style={[styles.comparisonCell, styles.comparisonHeader]}>Pro</Text>
          </View>

          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonCell}>광고</Text>
            <Text style={styles.comparisonCell}>있음</Text>
            <Text style={styles.comparisonCell}>없음</Text>
            <Text style={styles.comparisonCell}>없음</Text>
          </View>

          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonCell}>음질</Text>
            <Text style={styles.comparisonCell}>기본</Text>
            <Text style={styles.comparisonCell}>고음질</Text>
            <Text style={styles.comparisonCell}>최고음질</Text>
          </View>

          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonCell}>다운로드</Text>
            <Text style={styles.comparisonCell}>불가</Text>
            <Text style={styles.comparisonCell}>가능</Text>
            <Text style={styles.comparisonCell}>가능</Text>
          </View>

          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonCell}>음원 할인</Text>
            <Text style={styles.comparisonCell}>-</Text>
            <Text style={styles.comparisonCell}>-</Text>
            <Text style={styles.comparisonCell}>20%</Text>
          </View>
        </View>
      </View>

      {/* FAQ */}
      <View style={styles.faqSection}>
        <Text style={styles.faqTitle}>자주 묻는 질문</Text>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>언제든지 구독을 취소할 수 있나요?</Text>
          <Text style={styles.faqAnswer}>
            네, 언제든지 구독을 취소할 수 있습니다. 취소 후 남은 기간까지 서비스를 이용할 수 있습니다.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>플랜을 변경할 수 있나요?</Text>
          <Text style={styles.faqAnswer}>
            네, 언제든지 다른 플랜으로 변경할 수 있습니다. 변경 시 차액이 조정됩니다.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>여러 기기에서 사용할 수 있나요?</Text>
          <Text style={styles.faqAnswer}>
            네, Premium 이상의 플랜은 최대 5개 기기에서 동시에 사용할 수 있습니다.
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomColor: '#282828',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  currentSubscriptionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1DB954',
    borderRadius: 12,
  },
  currentPlanLabel: {
    fontSize: 12,
    color: '#000',
    opacity: 0.7,
    marginBottom: 4,
  },
  currentPlanName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  expiryDate: {
    fontSize: 12,
    color: '#000',
    opacity: 0.7,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#000',
    borderRadius: 6,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1DB954',
  },
  plansContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  planCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderColor: '#282828',
    borderWidth: 1,
  },
  planCardPopular: {
    borderColor: '#1DB954',
    borderWidth: 2,
  },
  planCardActive: {
    borderColor: '#1DB954',
    borderWidth: 2,
    backgroundColor: '#1A3A1A',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#1DB954',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1DB954',
  },
  planPeriod: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  featuresList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureCheckmark: {
    fontSize: 16,
    color: '#1DB954',
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#fff',
  },
  selectButton: {
    paddingVertical: 12,
    backgroundColor: '#282828',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonPopular: {
    backgroundColor: '#1DB954',
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  selectButtonTextPopular: {
    color: '#000',
  },
  currentButton: {
    paddingVertical: 12,
    backgroundColor: '#1DB954',
    borderRadius: 8,
    alignItems: 'center',
  },
  currentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  comparisonSection: {
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  comparisonTable: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
  },
  comparisonRow: {
    flexDirection: 'row',
    borderBottomColor: '#282828',
    borderBottomWidth: 1,
  },
  comparisonCell: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 12,
    color: '#fff',
  },
  comparisonHeader: {
    fontWeight: '600',
    backgroundColor: '#282828',
    color: '#1DB954',
  },
  faqSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomColor: '#282828',
    borderBottomWidth: 1,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#888',
    lineHeight: 20,
  },
});
