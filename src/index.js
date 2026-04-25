require('dotenv').config();
const axios = require('axios');

async function deleteOldOrders() {
  console.log('[batch] 7일 이상된 주문 삭제 시작');
  try {
    const res = await axios.delete(`${process.env.ORDER_URL}/orders/old`);
    console.log('[batch] 삭제 완료 -', res.data);
  } catch (err) {
    console.error('[batch] 삭제 실패 -', err.message);
    process.exit(1); // 실패 시 CronJob이 재시도하도록
  }
  process.exit(0);
}

deleteOldOrders();