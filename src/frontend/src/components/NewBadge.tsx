export function isNew(postedDate: bigint): boolean {
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const postedMs = Number(postedDate / BigInt(1_000_000));
  return Date.now() - postedMs < sevenDaysMs;
}

export default function NewBadge({ postedDate }: { postedDate: bigint }) {
  if (!isNew(postedDate)) return null;
  return (
    <span className="new-badge inline-block bg-destructive text-destructive-foreground text-xs font-bold px-1.5 py-0.5 rounded-sm">
      NEW
    </span>
  );
}
