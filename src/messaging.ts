import {
  Wormhole,
  WormholeMessageId,
  UniversalAddress,
  api,
  encoding,
  signSendWait,
  wormhole,
} from "@wormhole-foundation/sdk";
import solana from "@wormhole-foundation/sdk/solana";

import { getStuff } from "./helpers.js";

(async function () {
  const wh = await wormhole("Mainnet", [solana]);

  const chainCtx = wh.getChain("Solana");
  const coreBridge = await chainCtx.getWormholeCore();

  // The VAA consosts of chainId / emitter / sequence
  // Here one can see it under VAA ID: https://wormholescan.io/#/tx/0x7b0145014a4e8f0d8621fbc0e366460dda3ba307732eff539f7c1e8e6589718a?view=advanced
  const whm: WormholeMessageId = {
    chain: "Polygon",
    emitter: new UniversalAddress(
      "0000000000000000000000004ceb52802ef86edf8796632546d89e55c87a0901"
    ),
    sequence: 0n,
  };
  const apiUrl = "https://api.wormholescan.io";
  const vaa = await api.getVaa(apiUrl, whm, "Uint8Array");

  // Get local signer and parse the address
  const {
    signer,
    address: { address },
  } = await getStuff(chainCtx);

  // prepare transactions to verify the VAA
  const verifyTxs = coreBridge.verifyMessage(
    address.toUniversalAddress(),
    vaa!
  );
  // submit verify txs
  console.log(await signSendWait(chainCtx, verifyTxs, signer));

  // Two signature verification tx-s:
  // 2YhtHGjwRWonPby8UEXYTcHYps1sgsnhAgPCktbtWR5qoBT34QuG44Bps9PYTK9WfjqXweVF1cKiu58ZGDe6sGha
  // 3hXEguRMAL5oZsJnPi56pCj2kGsCxNYo77QLMqgofvgqe4ia2oBM8tAbwf2qhgYi4vHfanCKmiDcXEXfEX5Vhpuc

  // postVAA tx:
  // 3vVzQmnX4qnzBu4KaAZ9zg5Q18z31ycyvVEK5oG152waNNRBV8DknAPskqsjTiFtcbou5VKnB3dMvJtYMfe2dkWK
  // Created "posted" account: Bq8zzYk9sAxFpaWUCUsZz16XgrD27QMNhPYR9wkirh5f
})();
