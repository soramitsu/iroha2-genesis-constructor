import { crypto, init } from '@iroha2/crypto-target-web';
import wasm from '@iroha2/crypto-target-web/wasm_pack_output_bg.wasm?url';

export type KeyPair = {
  public: string;
  private: string;
}

await init(wasm);

function getRandomByte() {
  return Math.floor(Math.random() * 256);
}

function toHexString(bytes: Uint8Array) {
  return bytes.reduce((acc, elem) => (acc + ('0' + elem.toString(16)).slice(-2)), '');
}

function createKeyPair(): KeyPair {
  const seedBytes = new Array(32).fill(0).map(getRandomByte);
  const config = crypto.createKeyGenConfiguration().useSeed(Uint8Array.from(seedBytes));
  const keyPair = crypto.generateKeyPairWithConfiguration(config);

  const publicKey = keyPair.publicKey();
  const privateKey = keyPair.privateKey();

  const publicString = toHexString(crypto.createMultihashFromPublicKey(publicKey).toBytes());
  const privateString = toHexString(privateKey.payload());

  publicKey.free();
  privateKey.free();
  keyPair.free();

  return {
    public: publicString,
    private: privateString,
  };
};

export function useIroha() {
  return {
    createKeyPair,
  };
}
