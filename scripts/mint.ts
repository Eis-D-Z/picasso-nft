import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from "@mysten/sui/transactions";
import {
  SuiClient,
  getFullnodeUrl,
} from "@mysten/sui/client";
import * as denv from "dotenv"
denv.config();

// To be filled after publish
const packageId = "";
const capId = "";

const client = new SuiClient({url: getFullnodeUrl(process.env.NETWORK as "mainnet" | "testnet")});
const {schema, secretKey } = decodeSuiPrivateKey(process.env.ADMIN_KEY as string);
const signer = Ed25519Keypair.fromSecretKey(secretKey);

const mint = async (imageUrl:string, receiver: string) => {
    const tx = new Transaction();
    const nft = tx.moveCall({
        target: `${packageId}::picasso::mint`,
        arguments: [
            tx.object(capId),
            tx.pure.string(imageUrl),
            tx.object("0x6") // clock
        ]
    });

    tx.transferObjects([nft], tx.pure.address(receiver));

    const response = await client.signAndExecuteTransaction({
        transaction: tx,
        signer,
        options: {
            showEffects: true
        }
    });

    if(response.effects?.status.status === "success") {
        console.log(`Minted successfully for address: ${receiver}`);
    } else {
        console.log(`Minting failed for address: ${receiver}`);
    }
    
}

// mint("an.image.url", "0x...");