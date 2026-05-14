"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoCompleteDelivery = autoCompleteDelivery;
const axios_1 = __importDefault(require("axios"));
// DELIVERING 상태로 임계시간 이상 머문 주문을 자동으로 /complete 처리
// 포트폴리오 시뮬레이션용 — 실서비스에선 라이더가 누르는 배달완료 버튼 역할
async function autoCompleteDelivery() {
    const orderUrl = process.env.ORDER_URL;
    const deliveryUrl = process.env.DELIVERY_URL;
    const minutes = Number(process.env.DELIVERY_TIMEOUT_MINUTES ?? 5);
    if (!orderUrl || !deliveryUrl) {
        throw new Error('ORDER_URL and DELIVERY_URL are required');
    }
    console.log(`[workflow:auto-complete-delivery] 시작 (임계값: ${minutes}분)`);
    const { data } = await axios_1.default.get(`${orderUrl}/orders/overdue`, {
        params: { status: 'DELIVERING', minutes },
    });
    const orderIds = data.order_ids ?? [];
    console.log(`[workflow:auto-complete-delivery] 대상 ${orderIds.length}건`);
    let success = 0;
    let failure = 0;
    for (const orderId of orderIds) {
        try {
            await axios_1.default.post(`${deliveryUrl}/complete`, { order_id: orderId });
            success++;
        }
        catch (err) {
            console.error(`[workflow:auto-complete-delivery] order_id=${orderId} 실패 -`, err.message);
            failure++;
        }
    }
    console.log(`[workflow:auto-complete-delivery] 완료 - 성공:${success} 실패:${failure}`);
    if (orderIds.length > 0 && success === 0) {
        throw new Error('all auto-complete attempts failed');
    }
}
