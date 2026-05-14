import 'dotenv/config';
import { deleteOldOrders } from './cleanup/delete-old-orders';
import { autoCompleteCooking } from './workflow/auto-complete-cooking';
import { autoCompleteDelivery } from './workflow/auto-complete-delivery';

// CronJob에서 args로 전달된 서브커맨드를 분기 실행
//   args: ["cleanup"]                  → 7일 이상된 주문 삭제 (1일 1회)
//   args: ["auto-complete-cooking"]    → COOKING 적체 자동 완료 (1분 주기)
//   args: ["auto-complete-delivery"]   → DELIVERING 적체 자동 완료 (1분 주기)

const COMMANDS: Record<string, () => Promise<void>> = {
  cleanup: deleteOldOrders,
  'auto-complete-cooking': autoCompleteCooking,
  'auto-complete-delivery': autoCompleteDelivery,
};

async function main(): Promise<void> {
  const command = process.argv[2];

  if (!command || !(command in COMMANDS)) {
    console.error(`[batch] Unknown command: ${command ?? '(none)'}`);
    console.error(`[batch] Usage: node dist/index.js <${Object.keys(COMMANDS).join('|')}>`);
    process.exit(1);
  }

  try {
    await COMMANDS[command]();
    process.exit(0);
  } catch (err) {
    console.error(`[batch] ${command} 실패 -`, (err as Error).message);
    process.exit(1);
  }
}

main();
