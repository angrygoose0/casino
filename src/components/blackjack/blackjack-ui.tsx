'use client'

import { Keypair, PublicKey } from '@solana/web3.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import toast from 'react-hot-toast'
import { useWallet } from '@solana/wallet-adapter-react'
import { useBlackjack, useBlackjackQuery, useInitTreasury } from './blackjack-data-access'

export function JoinBlackJack() {
  const { joinBlackjack } = useBlackjack();
  const {publicKey} = useWallet();

  const handleJoinBlackjackButton = useCallback(async () => {
    try {
      if (!publicKey) throw new Error("Wallet is not connected.");

      await joinBlackjack.mutateAsync();

      toast.success("lottery created successfully!");
    } catch (error: any) {
      console.error("Error creating lottery:", error);
      toast.error("Failed to create lottery");
    }
  }, [joinBlackjack, publicKey]);

  return (
    <button
      className="btn btn-xs shadow-lg"
      onClick={handleJoinBlackjackButton}
    >
      JOIN
    </button>
  );
}

export function AnteBlackJack() {
  const {anteBlackjack} = useBlackjack();
  const {publicKey} = useWallet();

  const handleAnteBlackjackButton = useCallback(async () => {
    try {
      if (!publicKey) throw new Error("Wallet is not connected.");

      await anteBlackjack.mutateAsync();

      toast.success("lottery created successfully!");
    } catch (error: any) {
      console.error("Error creating lottery:", error);
      toast.error("Failed to create lottery");
    }
  }, [anteBlackjack, publicKey]);

  return (
    <button
      className="btn btn-xs shadow-lg"
      onClick={handleAnteBlackjackButton}
    >
      ANTE
    </button>
  );
}

export function InitTreasury() {
  const {initTreasury} = useInitTreasury();
  const {publicKey} = useWallet();

  const handleInitTreasuryButton = useCallback(async () => {
    try {
      if (!publicKey) throw new Error("Wallet is not connected.");

      await initTreasury.mutateAsync();

      toast.success("lottery created successfully!");
    } catch (error: any) {
      console.error("Error creating lottery:", error);
      toast.error("Failed to create lottery");
    }
  }, [initTreasury, publicKey]);

  return (
    <button
      className="btn btn-xs shadow-lg"
      onClick={handleInitTreasuryButton}
    >
      INIT TREASURY
    </button>
  );
}


export function ShowBlackJack() {
  const { blackjackQuery, blackjackHandQuery } = useBlackjackQuery();

  return (
    <div className="space-y-4">
      <div>
        <p className="font-bold text-md">blackjackQuery:</p>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
          {JSON.stringify(blackjackQuery.data, null, 2)}
        </pre>
      </div>

      <div>
        <p className="font-bold text-md">blackjackHandQuery:</p>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
          {JSON.stringify(blackjackHandQuery.data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

