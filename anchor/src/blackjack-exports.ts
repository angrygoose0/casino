// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import BlackjackIDL from '../target/idl/blackjack.json'
import type { Blackjack } from '../target/types/blackjack'

// Re-export the generated IDL and type
export { Blackjack, BlackjackIDL }

export const BLACKJACK_PROGRAM_ID = new PublicKey(BlackjackIDL.address)


export function getBlackjackProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...BlackjackIDL, address: address ? address.toBase58() : BlackjackIDL.address } as Blackjack, provider)
}

export function getBlackjackProgramId(cluster: Cluster) {

  return BLACKJACK_PROGRAM_ID;
}
