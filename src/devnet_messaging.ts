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
  const wh = await wormhole("Testnet", [solana]);

//  const wh = await wormhole("Devnet", [solana], {
//    chains: {
//      Solana: {
//        contracts: {
//          coreBridge: "Bridge1p5gheXUvJ6jGWGeCsgPKgnE3YgdGKRVCMY9o",
//        },
//        rpc: "https://api.devnet.solana.com",
//      },
//    },
//  });

  const chainCtx = wh.getChain("Solana");
  const coreBridge = await chainCtx.getWormholeCore();

  // The VAA consosts of chainId / emitter / sequence
  // Here one can see it under VAA ID: https://wormholescan.io/#/tx/0x7b0145014a4e8f0d8621fbc0e366460dda3ba307732eff539f7c1e8e6589718a?view=advanced
  const whm: WormholeMessageId = {
    chain: "Sepolia",
    emitter: new UniversalAddress(
      "000000000000000000000000471b3f60f08c50dd0ecba1bcd113b66fcc02b63d"
    ),
    sequence: 12n,
  };
  const apiUrl = "https://api.testnet.wormholescan.io";
  const vaa = await api.getVaa(apiUrl, whm, "Uint8Array");
  console.log(vaa);

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

  // Signature verification tx:
  // s7cYqhFsw46bkSarszjpbVxuTTBxWCRvgGKkmYybunZwye3txsj1Xs3G6w4vNe5rK799NzuBPBxQ7qtEkiPojjt

  // postVAA tx:
  // 5a5SsbepakWG8xgrn8B6xMn1BoWYrHPwbd3KtVSP16bwDrsWkjvdPegPs8QWniKTudXozMK4CqHm99TtoVBCw7y
  // Created "posted" account: ChU6y2AaWctbTZDRJNJgGVR5yXMahv9d7Ev894tp57J1
})();
