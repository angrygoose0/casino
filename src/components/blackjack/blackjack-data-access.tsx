'use client'

import { getBlackjackProgram, getBlackjackProgramId } from '@project/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'
import BN from 'bn.js'
import { NATIVE_MINT, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { init } from 'next/dist/compiled/webpack/webpack'

const TOKEN_MINT = new PublicKey("D2BYx2UoshNpAfgBEXEEyfUKxLSxkLMAb6zeZhZYgoos")

export function useBlackjackProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getBlackjackProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getBlackjackProgram(provider, programId), [provider, programId])

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  return {
    program,
    programId,
    getProgramAccount,
  }
}

export function useInitTreasury() {
  const { program, programId } = useBlackjackProgram();
  const transactionToast = useTransactionToast();
  const { connection } = useConnection();
  const { sendTransaction, publicKey } = useWallet();

  const initTreasury = useMutation<
    string,
    Error
  >({
    mutationKey: ['initTreasury'],
    mutationFn: async ( ) => {
      try {
        if (publicKey === null) {
          throw new Error('Wallet not connected');
        }

        const init = await program.methods
          .initTreasuries()
          .accounts({
            signer: publicKey,
            solanaMint: NATIVE_MINT,
            tokenMint: TOKEN_MINT,
            tokenProgram: TOKEN_PROGRAM_ID
          })
          .rpc();

        return init;
        

      } catch (error) {
        console.error("Error during transaction processing:", error);
        throw error;
      }
    },

    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: (error) => {
      toast.error(`Error joining ${error.message}`);
      console.error('Toast error:', error);
    },
  });

  return {
    initTreasury,
  };
}

export function useBlackjack() {
  const { program, programId } = useBlackjackProgram();
  const transactionToast = useTransactionToast();
  const { connection } = useConnection();
  const { sendTransaction, publicKey } = useWallet();

  const joinBlackjack = useMutation<
    string,
    Error
  >({
    mutationKey: ['joinBlackjack'],
    mutationFn: async ( ) => {
      try {
        if (publicKey === null) {
          throw new Error('Wallet not connected');
        }

        const join = await program.methods
          .joinBlackjack()
          .accounts({
            signer: publicKey,
          })
          .rpc();

        return join;
        

      } catch (error) {
        console.error("Error during transaction processing:", error);
        throw error;
      }
    },

    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: (error) => {
      toast.error(`Error joining ${error.message}`);
      console.error('Toast error:', error);
    },
  });

  const anteBlackjack = useMutation<
    string,
    Error
  >({
    mutationKey: ['anteBlackjack'],
    mutationFn: async ( ) => {
      try {
        if (publicKey === null) {
          throw new Error('Wallet not connected');
        }

        const tokenTreaurySeeds = [
          Buffer.from("TOKEN"),
        ];
        const tokenTreasuryPda = PublicKey.findProgramAddressSync(tokenTreaurySeeds, programId)[0];

        console.log(tokenTreasuryPda.toString());

        const playerBet = new BN(100000000000);

        const blackjackSeeds = [
          Buffer.from("BLACKJACK"),
          publicKey.toBuffer(),
        ];
        const blackjackPda = PublicKey.findProgramAddressSync(blackjackSeeds, programId)[0];
        
        const blackjackHandSeeds = [
          Buffer.from("BLACKJACKHAND"),
          blackjackPda.toBuffer(),
          Buffer.from([1]), // hand_id = 1
        ];
        const blackjackHandPda = PublicKey.findProgramAddressSync(blackjackHandSeeds, programId)[0];
        console.log(blackjackHandPda.toString());

        const ante = await program.methods
          .anteBlackjack(1, playerBet)
          .accounts({
            signer: publicKey,
            blackjackHand: blackjackHandPda,
            
            tokenMint: TOKEN_MINT,

            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();

        
        return ante;


      } catch (error) {
        console.error("Error during transaction processing:", error);
        throw error;
      }
    },

    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: (error) => {
      toast.error(`Error anteing ${error.message}`);
      console.error('Toast error:', error);
    },
  });

  const hitBlackjack = useMutation<
    string,
    Error
  >({
    mutationKey: ['anteBlackjack'],
    mutationFn: async ( ) => {
      try {
        if (publicKey === null) {
          throw new Error('Wallet not connected');
        }

        const tokenTreaurySeeds = [
          Buffer.from("TOKEN"),
        ];
        const tokenTreasuryPda = PublicKey.findProgramAddressSync(tokenTreaurySeeds, programId)[0];

        console.log(tokenTreasuryPda.toString());

        const playerBet = new BN(100000000000);

        const blackjackSeeds = [
          Buffer.from("BLACKJACK"),
          publicKey.toBuffer(),
        ];
        const blackjackPda = PublicKey.findProgramAddressSync(blackjackSeeds, programId)[0];
        
        const blackjackHandSeeds = [
          Buffer.from("BLACKJACKHAND"),
          blackjackPda.toBuffer(),
          Buffer.from([1]), // hand_id = 1
        ];
        const blackjackHandPda = PublicKey.findProgramAddressSync(blackjackHandSeeds, programId)[0];
        console.log(blackjackHandPda.toString());

        const ante = await program.methods
          .anteBlackjack(1, playerBet)
          .accounts({
            signer: publicKey,
            blackjackHand: blackjackHandPda,
            
            tokenMint: TOKEN_MINT,

            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();

        
        return ante;


      } catch (error) {
        console.error("Error during transaction processing:", error);
        throw error;
      }
    },

    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: (error) => {
      toast.error(`Error anteing ${error.message}`);
      console.error('Toast error:', error);
    },
  });

  return {
    joinBlackjack,
    anteBlackjack
  };
}



export function useBlackjackQuery() {
  const { program, programId } = useBlackjackProgram();
  const { connection } = useConnection();
  const { sendTransaction, publicKey } = useWallet();

  if (publicKey === null) {
    throw new Error('Wallet not connected');
  }
  
  const blackjackSeeds = [
    Buffer.from("BLACKJACK"),
    publicKey.toBuffer(),
  ];
  const blackjackPda = PublicKey.findProgramAddressSync(blackjackSeeds, programId)[0];
  
  const blackjackHandSeeds = [
    Buffer.from("BLACKJACKHAND"),
    blackjackPda.toBuffer(),
    Buffer.from([1]), // hand_id = 1
  ];
  const blackjackHandPda = PublicKey.findProgramAddressSync(blackjackHandSeeds, programId)[0];
  

  const blackjackQuery = useQuery({
    queryKey: ['blackjackQuery'],
    queryFn: async () => {
      return program.account.blackJack.fetch(blackjackPda);
    },
  });

  const blackjackHandQuery = useQuery({
    queryKey: ['blackjackHandQuery'],
    queryFn: async () => {
      return program.account.blackJackHand.fetch(blackjackHandPda);
    },
  });

  return {
    blackjackQuery,
    blackjackHandQuery,
  }
};
  
