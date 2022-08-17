import { isAddress } from "ethers/lib/utils";

export const shortenAddress = (address: string, chars = 4): string => {
  const isValidAddress = isAddress(address);
  if (!isValidAddress) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${address.substring(0, chars + 2)}...${address.substring(
    42 - chars
  )}`;
};

export const roundToTwo = (num: number | string | undefined) => {
  if (!num) {
    return;
  }
  return Math.round((+num + Number.EPSILON) * 100) / 100;
};
