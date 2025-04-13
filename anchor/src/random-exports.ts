// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import RandomIDL from '../target/idl/random.json'
import type { Random } from '../target/types/random'

// Re-export the generated IDL and type
export { Random, RandomIDL }

// The programId is imported from the program IDL.
export const RANDOM_PROGRAM_ID = new PublicKey(RandomIDL.address)

// This is a helper function to get the Random Anchor program.
export function getRandomProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...RandomIDL, address: address ? address.toBase58() : RandomIDL.address } as Random, provider)
}

// This is a helper function to get the program ID for the Random program depending on the cluster.
export function getRandomProgramId(cluster: Cluster) {
  
  return RANDOM_PROGRAM_ID;
  
}
