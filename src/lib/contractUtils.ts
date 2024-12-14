// import { SendTransactionRequest } from "@tonconnect/sdk";

// export const CONTRACT_ADDRESS =
//   "EQBb_tnQy8fQbmqVjq2dG6TmsCE_91wTmZ9EUlcCipeR8zIe";

// interface CreateMarketParams {
//   description: string;
//   predictionX: string;
//   predictionY: string;
//   endTime: bigint;
// }

// // Helper function to encode payload to base64
// const encodePayload = (data: any): string => {
//   return btoa(JSON.stringify(data));
// };

// export function buildCreateMarketTransaction({
//   description,
//   predictionX,
//   predictionY,
//   endTime,
// }: CreateMarketParams): SendTransactionRequest {
//   const marketId = BigInt(Date.now());

//   const payload = encodePayload({
//     $$type: "CreateMarket",
//     id: marketId.toString(),
//     description,
//     predictionX,
//     predictionY,
//     endTime: endTime.toString(),
//   });

//   return {
//     validUntil: Math.floor(Date.now() / 1000) + 300,
//     messages: [
//       {
//         address: CONTRACT_ADDRESS,
//         amount: "50000000", // 0.05 TON
//         payload,
//       },
//     ],
//   };
// }

// export function buildPlaceBetTransaction(
//   marketId: bigint,
//   prediction: bigint
// ): SendTransactionRequest {
//   const payload = encodePayload({
//     $$type: "PlaceBet",
//     marketId: marketId.toString(),
//     prediction: prediction.toString(),
//   });

//   return {
//     validUntil: Math.floor(Date.now() / 1000) + 300,
//     messages: [
//       {
//         address: CONTRACT_ADDRESS,
//         amount: "100000000", // 0.1 TON minimum bet
//         payload,
//       },
//     ],
//   };
// }

// // Constants from contract
// export const CONSTANTS = {
//   PREDICTION_X: 1n,
//   PREDICTION_Y: 2n,
//   STATUS: {
//     OPEN: 0n,
//     CLOSED: 1n,
//     SETTLED: 2n,
//   },
// } as const;

// // Helper functions
// export const displayTon = (amount: bigint): string => {
//   return (Number(amount) / 1e9).toFixed(2);
// };

// export const displayDate = (timestamp: bigint): Date => {
//   return new Date(Number(timestamp) * 1000);
// };
