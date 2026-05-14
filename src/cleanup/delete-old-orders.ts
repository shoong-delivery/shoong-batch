import axios from 'axios';

// 7일 이상된 주문 일괄 삭제 (1일 1회 실행)
export async function deleteOldOrders(): Promise<void> {
  console.log('[cleanup:delete-old-orders] 시작');
  const res = await axios.delete(`${process.env.ORDER_URL}/orders/old`);
  console.log('[cleanup:delete-old-orders] 완료 -', res.data);
}
