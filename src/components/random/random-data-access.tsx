'use client'

import { getRandomProgram, getRandomProgramId } from '@project/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useRandomProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getRandomProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getRandomProgram(provider, programId), [provider, programId])

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

export function useInitDice() {
  const { program, programId } = useRandomProgram();
  const transactionToast = useTransactionToast();
  const { connection } = useConnection();
  const { sendTransaction, publicKey } = useWallet();
  const initDice = useMutation<
    string,
    Error
  >({
    mutationKey: ['initDice'],
    mutationFn: async ( ) => {
      try {
        if (publicKey === null) {
          throw new Error('Wallet not connected');
        }

        const diceSeeds = [Buffer.from("DICE")];
        const [diceKey] = PublicKey.findProgramAddressSync(diceSeeds, programId);
        
        const init = await program.methods
          .initializeDice()
          .accounts({
            payer: publicKey,
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
      toast.error(`Error initializing game ${error.message}`);
      console.error('Toast error:', error);
    },
  });

  return {
    initDice,
  };
}

export function useRollDice() {
  const { program } = useRandomProgram();
  const transactionToast = useTransactionToast();
  const { connection } = useConnection();
  const { sendTransaction, publicKey } = useWallet();
  const rollDice = useMutation<
    string,
    Error
  >({
    mutationKey: ['rollDice'],
    mutationFn: async ( ) => {
      try {
        if (publicKey === null) {
          throw new Error('Wallet not connected');
        }


        
        const roll = await program.methods
          .rollDice(0)
          .accounts({
            payer: publicKey,
          })
          .rpc();

        
        return roll;


      } catch (error) {
        console.error("Error during transaction processing:", error);
        throw error;
      }
    },

    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: (error) => {
      toast.error(`Error initializing game ${error.message}`);
      console.error('Toast error:', error);
    },
  });

  return {
    rollDice,
  };
}

export function useDiceQuery() {
  const { program, programId } = useRandomProgram();
  const { connection } = useConnection();
  

  const diceSeeds = [Buffer.from("DICE")];
  const gameAccountKey = PublicKey.findProgramAddressSync(diceSeeds, programId)[0];

  const diceQuery = useQuery({
    queryKey: ['diceQuery'],
    queryFn: async () => {
      return program.account.dice.fetch(gameAccountKey);
    },
  });

  return {
    diceQuery
  }
};
  


