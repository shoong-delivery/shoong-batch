"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const delete_old_orders_1 = require("./cleanup/delete-old-orders");
const auto_complete_cooking_1 = require("./workflow/auto-complete-cooking");
const auto_complete_delivery_1 = require("./workflow/auto-complete-delivery");
// CronJob에서 args로 전달된 서브커맨드를 분기 실행
//   args: ["cleanup"]                  → 7일 이상된 주문 삭제 (1일 1회)
//   args: ["auto-complete-cooking"]    → COOKING 적체 자동 완료 (1분 주기)
//   args: ["auto-complete-delivery"]   → DELIVERING 적체 자동 완료 (1분 주기)
const COMMANDS = {
    cleanup: delete_old_orders_1.deleteOldOrders,
    'auto-complete-cooking': auto_complete_cooking_1.autoCompleteCooking,
    'auto-complete-delivery': auto_complete_delivery_1.autoCompleteDelivery,
};
async function main() {
    const command = process.argv[2];
    if (!command || !(command in COMMANDS)) {
        console.error(`[batch] Unknown command: ${command ?? '(none)'}`);
        console.error(`[batch] Usage: node dist/index.js <${Object.keys(COMMANDS).join('|')}>`);
        process.exit(1);
    }
    try {
        await COMMANDS[command]();
        process.exit(0);
    }
    catch (err) {
        console.error(`[batch] ${command} 실패 -`, err.message);
        process.exit(1);
    }
}
main();
