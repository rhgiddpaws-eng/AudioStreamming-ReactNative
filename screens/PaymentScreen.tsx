import React, { useState } from 'react';
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

interface PaymentItem {
  id: string;
  name: string;
  price: number;
  type: 'subscription' | 'track' | 'album';
}

export default function PaymentScreen({ route }: any) {
  const navigation = useNavigation();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'bank'>('card');

  const item: PaymentItem = route?.params?.item || {
    id: '1',
    name: 'Premium 구독',
    price: 9900,
    type: 'subscription',
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1. Toss Payments 결제 창 열기 (실제 환경에서는 웹뷰 사용)
      const orderId = `ORDER_${Date.now()}`;
      const amount = item.price;

      // 2. 결제 승인 요청
      const response = await axios.post(
        'http://localhost:3000/payments/subscription/approve',
        {
          planId: item.id,
          paymentKey: 'dummy_payment_key',
          orderId,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert('결제 성공', '결제가 완료되었습니다!', [
          {
            text: '확인',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert('결제 실패', error.response?.data?.message || '결제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
        <Text style={styles.title}>결제</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* 결제 상품 정보 */}
      <View style={styles.itemSection}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price.toLocaleString()}원</Text>
        <Text style={styles.itemDescription}>
          {item.type === 'subscription'
            ? '월간 구독 - 광고 없이 무제한 스트리밍'
            : item.type === 'track'
            ? '음원 구매 - 소유권 획득'
            : '앨범 구매 - 전체 곡 소유권 획득'}
        </Text>
      </View>

      {/* 결제 방법 선택 */}
      <View style={styles.paymentMethodSection}>
        <Text style={styles.sectionTitle}>결제 방법</Text>

        <TouchableOpacity
          style={[
            styles.paymentMethodButton,
            selectedPaymentMethod === 'card' && styles.paymentMethodButtonActive,
          ]}
          onPress={() => setSelectedPaymentMethod('card')}
        >
          <View style={styles.radioButton}>
            {selectedPaymentMethod === 'card' && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={styles.paymentMethodText}>신용카드</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentMethodButton,
            selectedPaymentMethod === 'bank' && styles.paymentMethodButtonActive,
          ]}
          onPress={() => setSelectedPaymentMethod('bank')}
        >
          <View style={styles.radioButton}>
            {selectedPaymentMethod === 'bank' && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={styles.paymentMethodText}>계좌이체</Text>
        </TouchableOpacity>
      </View>

      {/* 결제 정보 입력 */}
      <View style={styles.paymentInfoSection}>
        <Text style={styles.sectionTitle}>결제 정보</Text>

        {selectedPaymentMethod === 'card' ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>카드 번호</Text>
              <Text style={styles.dummyInput}>1234 5678 9012 3456</Text>
            </View>
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>유효기간</Text>
                <Text style={styles.dummyInput}>12/25</Text>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>CVV</Text>
                <Text style={styles.dummyInput}>123</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>은행</Text>
              <Text style={styles.dummyInput}>국민은행</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>계좌 번호</Text>
              <Text style={styles.dummyInput}>123-456-789012</Text>
            </View>
          </>
        )}
      </View>

      {/* 결제 약관 */}
      <View style={styles.termsSection}>
        <Text style={styles.termsText}>
          결제 진행 시 SoundWave 서비스 약관 및 개인정보 처리방침에 동의합니다.
        </Text>
      </View>

      {/* 결제 버튼 */}
      <TouchableOpacity
        style={[styles.payButton, loading && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>
            {item.price.toLocaleString()}원 결제하기
          </Text>
        )}
      </TouchableOpacity>

      {/* 취소 버튼 */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={styles.cancelButtonText}>취소</Text>
      </TouchableOpacity>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomColor: '#282828',
    borderBottomWidth: 1,
  },
  closeButton: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  itemSection: {
    padding: 20,
    backgroundColor: '#1DB954',
    margin: 16,
    borderRadius: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#000',
    opacity: 0.8,
  },
  paymentMethodSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    borderColor: '#282828',
    borderWidth: 1,
  },
  paymentMethodButtonActive: {
    borderColor: '#1DB954',
    borderWidth: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: '#666',
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1DB954',
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  paymentInfoSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
    fontWeight: '500',
  },
  dummyInput: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
    borderColor: '#282828',
    borderWidth: 1,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  termsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
  payButton: {
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1DB954',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cancelButton: {
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#282828',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
