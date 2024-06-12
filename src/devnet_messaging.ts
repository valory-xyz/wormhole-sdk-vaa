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
    sequence: 10n,
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
  // Woq66KD115Xy8J2BBcodmf4NJXMfGab4UsFapZ3CK8GzHDUZZPTDRKdDcR9g8CscuJ5zogRWdeFStasMXN2XKEv

  // postVAA tx:
  // XG5sWNSncWxcxrH6obfxPurt31nJ3PE87FjaeYTsNbK4JeU5yuuLap38Z7HQs5vd9dpyQoy1GXTxzt84ZZwVAeZ
  // Created "posted" account: 95qM8dmVpx56goCr7MuPSR8sXidTWoehtopGMRew7PDT
})();
