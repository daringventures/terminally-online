export interface EthGasData {
  safeLow: number;
  average: number;
  fast: number;
  baseFee: number;
  suggestBaseFee: number;
}

interface EtherscanGasResponse {
  status: string;
  message: string;
  result: {
    SafeGasPrice: string;
    ProposeGasPrice: string;
    FastGasPrice: string;
    LastBlock: string;
    suggestBaseFee: string;
    gasUsedRatio: string;
  };
}

export async function fetchEthGas(): Promise<EthGasData> {
  const res = await fetch(
    'https://api.etherscan.io/api?module=gastracker&action=gasoracle'
  );
  if (!res.ok) throw new Error(`Etherscan gas: ${res.status}`);
  const data: EtherscanGasResponse = await res.json();
  if (data.status !== '1') throw new Error(`Etherscan gas: ${data.message}`);
  const r = data.result;
  return {
    safeLow: parseFloat(r.SafeGasPrice),
    average: parseFloat(r.ProposeGasPrice),
    fast: parseFloat(r.FastGasPrice),
    baseFee: parseFloat(r.suggestBaseFee),
    suggestBaseFee: parseFloat(r.suggestBaseFee),
  };
}
