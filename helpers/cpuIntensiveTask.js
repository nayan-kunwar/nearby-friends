export function cpuTask(ms = 3000) {
  const end = process.hrtime.bigint() + BigInt(ms) * 1_000_000n;
  let result = 1;

  while (process.hrtime.bigint() < end) {
    for (let i = 1; i < 50_000; i++) {
      result = (result * i) % 1_000_000_007;
      result ^= result << 13;
    }
  }

  return result;
}
