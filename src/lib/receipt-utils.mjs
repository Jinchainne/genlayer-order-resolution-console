export function extractReturnValue(receipt) {
  const readable =
    receipt?.consensus_data?.leader_receipt?.[0]?.result?.payload?.readable ??
    receipt?.consensus_data?.validators?.[0]?.result?.payload?.readable ??
    null;

  if (typeof readable === "string") {
    try {
      return JSON.parse(readable);
    } catch {
      return readable;
    }
  }

  return (
    receipt?.returnValue ??
    receipt?.return_value ??
    receipt?.result ??
    receipt?.result_name ??
    null
  );
}
