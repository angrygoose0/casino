#![allow(clippy::result_large_err)]

use anchor_lang::{
    prelude::*,
    solana_program::{
        pubkey::Pubkey,
        keccak,
    },
    system_program,
};
use ephemeral_vrf_sdk::anchor::vrf;
use ephemeral_vrf_sdk::instructions::{create_request_randomness_ix, RequestRandomnessParams};
use ephemeral_vrf_sdk::types::SerializableAccountMeta;

use anchor_spl::{
    associated_token::{AssociatedToken},
    token_interface::{Mint, TokenAccount, TokenInterface, transfer_checked, TransferChecked, SyncNative, sync_native},
};


declare_id!("GUQb7sfh9G4wL3hEUkSkPPifLTb45z6GK5VtRcgZSFSS");


#[program]
pub mod blackjack {
    use super::*;


    //mainnet: pub const TOKEN_MINT: Pubkey = pubkey!("5gVSqhk41VA8U6U4Pvux6MSxFWqgptm3w58X9UTGpump"); //mainnet
    pub const TOKEN_MINT: Pubkey = pubkey!("D2BYx2UoshNpAfgBEXEEyfUKxLSxkLMAb6zeZhZYgoos"); //devnet
    pub const TOKEN_DECIMALS: u8 = 9;

    pub const FEE_PERCENTAGE: u8 = 100; // divide by 100 so 1%

    pub const SOLANA_MINT: Pubkey = pubkey!("So11111111111111111111111111111111111111112");

    pub fn init_treasuries(
        ctx: Context<InitializeTreasuries>,
    ) -> Result<()> {

        require!(
            ctx.accounts.solana_mint.key() == SOLANA_MINT,
            CustomError::Unauthorized,
        );

        require!(
            ctx.accounts.token_mint.key() == TOKEN_MINT,
            CustomError::Unauthorized,
        );


        Ok(())
    }

    pub fn join_blackjack(
        ctx: Context<JoinBlackJack>,
    ) -> Result<()> {

        let blackjack = &mut ctx.accounts.blackjack;

        blackjack.player = ctx.accounts.signer.key();
        blackjack.active_hands = 0;

        let deck = &mut ctx.accounts.deck;

        let clock = Clock::get()?;
        let seed = keccak::hash(&clock.unix_timestamp.to_le_bytes()).0;

        let shuffled = shuffled_deck_from_seed(seed);
        deck.cards.copy_from_slice(&shuffled);
        deck.drawn = 0;

        Ok(())
    }



    pub fn ante_blackjack( // if blackjack, stand automatically, will pay 1.5x when finishing turn | if dealer's first card is ACE, give players an option for insurance, if dealer's first card is ace / face card, do a random roll to see if its blackjack or not. if it is, the hand is stood automatically, and the player can only do next_turn, which will take the money, or give back the original bet if player has blackjack, or give some back because of the insurance bet.
        ctx: Context<AnteBlackJack>,
        hand_id: u8,
        player_bet: u64,
    ) -> Result<()> {

        require!(
            hand_id == 1,
            CustomError::Unauthorized
        );

        transfer_checked(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.user_token_account.to_account_info(),
                    to: ctx.accounts.token_treasury.to_account_info(),
                    authority: ctx.accounts.signer.to_account_info(),
                    mint: ctx.accounts.token_mint.to_account_info(),
                },   
            ),
            player_bet,
            TOKEN_DECIMALS,
        );

        let blackjack = &mut ctx.accounts.blackjack;


        blackjack.active_hands += 1;
        require!(
            blackjack.active_hands == hand_id,
            CustomError::Unauthorized
        );

        let deck = &mut ctx.accounts.deck;
        require!(deck.drawn < 52, CustomError::Unauthorized);

        let card_1 = deck.cards[deck.drawn as usize];
        deck.drawn += 1;
        let card_2 = deck.cards[deck.drawn as usize];
        deck.drawn += 1;
        let card_3 = deck.cards[deck.drawn as usize];
        deck.drawn += 1;


        let blackjack_hand = &mut ctx.accounts.blackjack_hand;

        blackjack_hand.blackjack = blackjack.key();
        blackjack_hand.id = hand_id;
        blackjack_hand.state = 0;
        blackjack_hand.current_bet = player_bet;

        blackjack_hand.player_card_1 = card_1; // give
        blackjack_hand.player_card_2 = card_2; //give
        blackjack_hand.player_card_3 = 0;
        blackjack_hand.player_card_4 = 0;
        blackjack_hand.player_card_5 = 0;
        blackjack_hand.player_card_6 = 0;
        blackjack_hand.player_card_7 = 0;
        blackjack_hand.player_card_8 = 0;
        blackjack_hand.player_card_9 = 0;
        blackjack_hand.player_card_10 = 0;

        blackjack_hand.dealer_card_1 = card_3; //give
        blackjack_hand.dealer_card_2 = 0;
        blackjack_hand.dealer_card_3 = 0;
        blackjack_hand.dealer_card_4 = 0;
        blackjack_hand.dealer_card_5 = 0;
        blackjack_hand.dealer_card_6 = 0;
        blackjack_hand.dealer_card_7 = 0;
        blackjack_hand.dealer_card_8 = 0;
        blackjack_hand.dealer_card_9 = 0;
        blackjack_hand.dealer_card_10 = 0;

        

        Ok(())
    }

    //pub fn insurance_blackjack() //player can choose to decline / accept insurance, which is paying half your original bet, after this functino is called, then do the random roll...
    /*
    pub fn hit_blackjack(
        ctx: Context<BlackJackHand>,
    ) -> Result<()> {
        let blackjack = &mut ctx.accounts.blackjack;

        let blackjack_hand = &mut ctx.accounts.blackjack_hand;

        require!(
            blackjack_hand.blackjack == blackjack.key(),
            CustomError::Unauthorized
        );

        if blackjack_hand.player_card_3 == 0 {
            blackjack_hand.player_card_3 = new_card;
        } else if blackjack_hand.player_card_4 == 0 {
            blackjack_hand.player_card_4 = new_card;
        } else if blackjack_hand.player_card_5 == 0 {
            blackjack_hand.player_card_5 = new_card;
        } else if blackjack_hand.player_card_6 == 0 {
            blackjack_hand.player_card_6 = new_card;
        } else if blackjack_hand.player_card_7 == 0 {
            blackjack_hand.player_card_7 = new_card;
        } else if blackjack_hand.player_card_8 == 0 {
            blackjack_hand.player_card_8 = new_card;
        } else if blackjack_hand.player_card_9 == 0 {
            blackjack_hand.player_card_9 = new_card;
        } else if blackjack_hand.player_card_10 == 0 {
            blackjack_hand.player_card_10 = new_card;
        } else {
            // All slots are filled – maybe return an error?
            return Err(error!(CustomError::Unauthorized));
        }


    }

    pub fn stand_blackjack( // locks in their hand, gets dealers random cards, determines who won,
        ctx: Context<BlackJackHand>,
    ) -> Result<()> {
        let blackjack = &mut ctx.accounts.blackjack;

        let blackjack_hand = &mut ctx.accounts.blackjack_hand;

        require!(
            blackjack_hand.blackjack == blackjack.key(),
            CustoError::Unauthorized
        );

        if blackjack_hand.player_card_3 == 0 {
            blackjack_hand.player_card_3 = new_card;
        } else if blackjack_hand.player_card_4 == 0 {
            blackjack_hand.player_card_4 = new_card;
        } else if blackjack_hand.player_card_5 == 0 {
            blackjack_hand.player_card_5 = new_card;
        } else if blackjack_hand.player_card_6 == 0 {
            blackjack_hand.player_card_6 = new_card;
        } else if blackjack_hand.player_card_7 == 0 {
            blackjack_hand.player_card_7 = new_card;
        } else if blackjack_hand.player_card_8 == 0 {
            blackjack_hand.player_card_8 = new_card;
        } else if blackjack_hand.player_card_9 == 0 {
            blackjack_hand.player_card_9 = new_card;
        } else if blackjack_hand.player_card_10 == 0 {
            blackjack_hand.player_card_10 = new_card;
        } else {
            // All slots are filled – maybe return an error?
            return Err(error!(CustomError::Unauthorized));
        }


    }

    //pub fn split_blackjack // check if card_1 = card_2, if so, make a second instance of blackjackhand with an id using blackjack.active_hands, and then make it so we give them both new card_2, while keeping original card_1 as card_1., if the card being split is ace, players cannot hit more, and stands automatically.

    //pub fn double_blackjack // put in your current_bet again, update black_hand.current_bet *= 2, stands this hand automatically

    //pub fn finish_game() // goes through each blackjack hand with a remaining account, make sure all hands have been stood or busted. sees which lost and which lost, pays out or not, deletes all the blackjack hand instances make blackjack.active_hands = 0
    */
    

    
}

fn shuffled_deck_from_seed(seed: [u8; 32]) -> [u8; 52] {
    let mut deck: [u8; 52] = core::array::from_fn(|i| (i + 1) as u8);
    for i in (1..deck.len()).rev() {
        let hash = keccak::hashv(&[&seed, &[i as u8]]);
        let j = (hash.0[0] as usize) % (i + 1);
        deck.swap(i, j);
    }
    deck
}

#[derive(Accounts)]
pub struct InitializeTreasuries<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut)]
    pub solana_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init,
        seeds = [b"SOLANA"],
        bump,
        payer = signer,
        token::mint = solana_mint,
        token::authority = solana_treasury,
    )]
    pub solana_treasury: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub token_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init,
        seeds = [b"TOKEN"],
        bump,
        payer = signer,
        token::mint = token_mint,
        token::authority = token_treasury,
    )]
    pub token_treasury: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinBlackJack<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = 8 + BlackJack::INIT_SPACE,
        seeds = [b"BLACKJACK", signer.key().as_ref()],
        bump
    )]
    pub blackjack: Account<'info, BlackJack>,

    #[account(
        init,
        payer = signer,
        space = 8 + std::mem::size_of::<Deck>(), // 8 for discriminator
        seeds = [b"DECK", blackjack.key().as_ref()],
        bump
    )]
    pub deck: Account<'info, Deck>,

    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
#[instruction(
    hand_id: u8,
)]
pub struct AnteBlackJack<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"BLACKJACK", signer.key().as_ref()],
        bump
    )]
    pub blackjack: Account<'info, BlackJack>,

    #[account(
        mut,
        seeds = [b"DECK", blackjack.key().as_ref()],
        bump
    )]
    pub deck: Account<'info, Deck>,


    #[account(
        init,
        payer = signer,
        space = 8 + BlackJackHand::INIT_SPACE,
        seeds = [b"BLACKJACKHAND", blackjack.key().as_ref(), &[hand_id]],
        bump
    )]
    pub blackjack_hand: Account<'info, BlackJackHand>,


    #[account(
        mut,
        seeds = [b"TOKEN"],
        bump,
    )]
    pub token_treasury: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub token_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = token_mint,
        associated_token::authority = signer,
    )]
    pub user_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct HitBlackJack<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"BLACKJACK", signer.key().as_ref()],
        bump
    )]
    pub blackjack: Account<'info, BlackJack>,

    #[account(mut)]
    pub blackjack_hand: Account<'info, BlackJackHand>,

    
    pub system_program: Program<'info, System>,
}


#[account]
#[derive(InitSpace)]
pub struct BlackJackHand {
    pub blackjack: Pubkey,
    pub id: u8,

    pub state: u8, // 0 active | 1 insurance | 2 busted | 3 stood (only one that has potential to win)

    pub current_bet: u64,

    pub player_card_1: u8,
    pub player_card_2: u8,
    pub player_card_3: u8,
    pub player_card_4: u8,
    pub player_card_5: u8,
    pub player_card_6: u8,
    pub player_card_7: u8,
    pub player_card_8: u8,
    pub player_card_9: u8,
    pub player_card_10: u8,

    pub dealer_card_1: u8,
    pub dealer_card_2: u8,
    pub dealer_card_3: u8,
    pub dealer_card_4: u8,
    pub dealer_card_5: u8,
    pub dealer_card_6: u8,
    pub dealer_card_7: u8,
    pub dealer_card_8: u8,
    pub dealer_card_9: u8,
    pub dealer_card_10: u8,
}

#[account]
#[derive(InitSpace)]
pub struct BlackJack {
    pub player: Pubkey,
    pub active_hands: u8,
    
}

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Too Small")]
    TooSmall,
    #[msg("Too Big")]
    TooBig
}

#[account]
#[derive(InitSpace)]
pub struct Deck {
    pub cards: [u8; 52],      // The shuffled cards (1..=52)
    pub drawn: u8,            // Number of cards already drawn (0 initially)
    pub bump: u8,             // For PDA
}
