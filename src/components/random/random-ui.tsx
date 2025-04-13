'use client'

import { Keypair, PublicKey } from '@solana/web3.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useRandomProgram, useDiceQuery, useInitDice, useRollDice} from './random-data-access'
import toast from 'react-hot-toast'
import { useWallet } from '@solana/wallet-adapter-react'

export function CreateDice() {
  const { initDice } = useInitDice();
  const {publicKey} = useWallet();

  const handleInitDiceButton = useCallback(async () => {
    try {
      if (!publicKey) throw new Error("Wallet is not connected.");



      await initDice.mutateAsync();

      toast.success("lottery created successfully!");
    } catch (error: any) {
      console.error("Error creating lottery:", error);
      toast.error("Failed to create lottery");
    }
  }, [initDice, publicKey]);

  return (
    <button
      className="btn btn-xs shadow-lg"
      onClick={handleInitDiceButton}
    >
      Create Dice
    </button>
  );
}

export function RollDice() {
  const { rollDice } = useRollDice();
  const {publicKey} = useWallet();

  const handleRollDiceButton = useCallback(async () => {
    try {
      if (!publicKey) throw new Error("Wallet is not connected.");

      await rollDice.mutateAsync();

      toast.success("lottery created successfully!");
    } catch (error: any) {
      console.error("Error creating lottery:", error);
      toast.error("Failed to create lottery");
    }
  }, [rollDice, publicKey]);

  return (
    <button
      className="btn btn-xs shadow-lg"
      onClick={handleRollDiceButton}
    >
      Roll Dice
    </button>
  );
}

export function ShowDice() {
  const {diceQuery} = useDiceQuery();

  const [dice, setDice] = useState({
    lastResult: 0,
  });

  useEffect(() => {
    if (diceQuery.data) {
      setDice(diceQuery.data);
    }
  }, [diceQuery.data]);

  
  return (
    <div>
      <p className="font-bold text-md">{dice.lastResult}</p>
    </div>
  )
}

