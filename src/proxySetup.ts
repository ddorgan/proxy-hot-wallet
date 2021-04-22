// Setup proxy via the api directly example
import { ApiPromise, Keyring }  from '@polkadot/api';
import { blake2AsHex, encodeDerivedAddress, encodeMultiAddress } from "@polkadot/util-crypto";
import { resolve } from 'path';
import { createDemoKeyPairs, Keys } from './keyring';
import {
	logSeperator,
	sleep,
	sortAddresses,
	submiting,
	waiting,
	waitToContinue,
} from './util';
const seed = "//Eve";

export async function proxySetup(seed_anon_proxy: string) {
//export const proxySetup = async () => {
  const api =  await ApiPromise.create({})

  const keyring = new Keyring({ type: "sr25519" });
  const ss58Prefix = 42;
  const keys = await  createDemoKeyPairs();


  const addresses_any = [keys.alice.address, keys.bob.address, keys.dave.address];
  const threshold_any = 2;
  const addresses_cancel = [keys.eve.address, keys.ferdie.address];
  const threshold_cancel = 2;
  const multisig_staking = encodeMultiAddress(addresses_any, threshold_any, ss58Prefix);
  const multisig_cancel = encodeMultiAddress(addresses_cancel, threshold_cancel, ss58Prefix);


  const innerTx_staking = api.tx.proxy.addProxy(multisig_staking, "Staking", 10)
  //const innerTx2 = api.tx.proxy.addProxy(multisig_cancel, "CancelProxy", 0)

  // setup staking proxy
    try {

      const setProxy_staking = await api.tx.proxy.proxy(
        seed_anon_proxy,
        "Any",
        innerTx_staking
     );
     try {
       const hash2 = await setProxy_staking.signAndSend(
         keyring.addFromUri(seed), ({ status, events }) => {
         //"13Ky4MtCMnD2ytLbm8tWmkGWHW9rE2vwRCb8STrx8W1h1GdR", ({ status, events }) => {
         if (status.isFinalized) {
             events
             // We know this tx should result in `Sudid` event.
             .forEach(({ event: { data, method, section }, phase }) => {
               const seed_anon_proxy_any = data[0]
               console.log(`staking-proxy = ${seed_anon_proxy_any} / phase: ${phase}}`)
               console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString())
             });
            }
         });
     } catch {
       console.log(`{TestSETUP:: ${seed} set proxy failed...`);
     }
      }

      catch {
     console.log(`{TestSETUP:: ${seed} set proxy failed...`);
   }

   await sleep(21000);
}

