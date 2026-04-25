require('dotenv').config();
const axios = require('axios');

function msUntilNoon() {
  const now = new Date();
  const noon = new Date();
  noon.setHours(12, 0, 0, 0);
  if (now >= noon) noon.setDate(noon.getDate() + 1);
  return noon - now;
}

async function deleteOldOrders() {
  console.log('[batch] 7일 이상된 주문 삭제 시작');
  try {
    const res = await axios.delete(`${process.env.ORDER_URL}/orders/old`);
    console.log('[batch] 삭제 완료 -', res.data);
  } catch (err) {
    console.error('[batch] 삭제 실패 -', err.message);
  }

  setTimeout(deleteOldOrders, 24 * 60 * 60 * 1000);
}

const delay = msUntilNoon();
console.log(`[batch-service] 다음 실행까지 ${Math.round(delay / 1000 / 60)}분 남음`);

setTimeout(deleteOldOrders, delay);