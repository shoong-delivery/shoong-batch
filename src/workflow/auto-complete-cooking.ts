import axios from 'axios';

// COOKING 상태로 임계시간 이상 머문 주문을 자동으로 /complete 처리
// 포트폴리오 시뮬레이션용 — 실서비스에선 주방 직원이 누르는 완료 버튼 역할
export async function autoCompleteCooking(): Promise<void> {
  const orderUrl = process.env.ORDER_URL;
  const kitchenUrl = process.env.KITCHEN_URL;
  const minutes = Number(process.env.COOKING_TIMEOUT_MINUTES ?? 3);

  if (!orderUrl || !kitchenUrl) {
    throw new Error('ORDER_URL and KITCHEN_URL are required');
  }

  console.log(`[workflow:auto-complete-cooking] 시작 (임계값: ${minutes}분)`);

  const { data } = await axios.get(`${orderUrl}/orders/overdue`, {
    params: { status: 'COOKING', minutes },
  });

  const orderIds: number[] = data.order_ids ?? [];
  console.log(`[workflow:auto-complete-cooking] 대상 ${orderIds.length}건`);

  let success = 0;
  let failure = 0;

  for (const orderId of orderIds) {
    try {
      await axios.post(`${kitchenUrl}/complete`, { order_id: orderId });
      success++;
    } catch (err) {
      console.error(
        `[workflow:auto-complete-cooking] order_id=${orderId} 실패 -`,
        (err as Error).message
      );
      failure++;
    }
  }

  console.log(
    `[workflow:auto-complete-cooking] 완료 - 성공:${success} 실패:${failure}`
  );

  // 일부 실패해도 다음 주기에 재시도되므로 batch는 성공 처리
  // 다만 전체 실패시엔 알림 발화를 위해 exit 1
  if (orderIds.length > 0 && success === 0) {
    throw new Error('all auto-complete attempts failed');
  }
}
