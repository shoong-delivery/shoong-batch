"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOldOrders = deleteOldOrders;
const axios_1 = __importDefault(require("axios"));
// 7일 이상된 주문 일괄 삭제 (1일 1회 실행)
async function deleteOldOrders() {
    console.log('[cleanup:delete-old-orders] 시작');
    const res = await axios_1.default.delete(`${process.env.ORDER_URL}/orders/old`);
    console.log('[cleanup:delete-old-orders] 완료 -', res.data);
}
