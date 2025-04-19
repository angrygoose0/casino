#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use ephemeral_vrf_sdk::anchor::vrf;
use ephemeral_vrf_sdk::instructions::{create_request_randomness_ix, RequestRandomnessParams};
use ephemeral_vrf_sdk::types::SerializableAccountMeta;

use anchor_spl::{
    associated_token::{AssociatedToken},
    token_interface::{Mint, TokenAccount, TokenInterface, transfer_checked, TransferChecked, SyncNative, sync_native},
};

declare_id!("EFiw9bYPsvyHhdMS8Xxc78f8ZkFJQh6v5RwabCbEEdAa");


#[program]
pub mod random {
    use super::*;

    pub const ENTRY_PRICE: u64 = 100_000_000; //0.1 sol
    pub const ANTE_PRICE: u64 = 10_000_000; //0.01 sol

    //mainnet: pub const TOKEN_MINT: Pubkey = pubkey!("5gVSqhk41VA8U6U4Pvux6MSxFWqgptm3w58X9UTGpump");
    pub const TOKEN_MINT: Pubkey = pubkey!("D2BYx2UoshNpAfgBEXEEyfUKxLSxkLMAb6zeZhZYgoos");
    pub const TOKEN_DECIMALS: u8 = 9;

    pub const FEE_PERCENTAGE: u8 = 100; // divide by 100 so 1%

    pub const SOLANA_MINT: Pubkey = pubkey!("So11111111111111111111111111111111111111112");

    pub const WAIT_TIME: i64 = 120; //2 minutes

    //TREASURY
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

    //DICE

    pub fn initialize_dice(ctx: Context<InitializeDice>) -> Result<()> {
      msg!(
          "Initializing dice: {:?}",
          ctx.accounts.dice.key()
      );
      Ok(())
    }

    pub fn roll_dice(ctx: Context<DoRollDiceCtx>, client_seed: u8) -> Result<()> {
      msg!("Requesting randomness...");
      let ix = create_request_randomness_ix(RequestRandomnessParams {
          payer: ctx.accounts.payer.key(),
          oracle_queue: ctx.accounts.oracle_queue.key(),
          callback_program_id: ID,
          callback_discriminator: instruction::CallbackRollDice::DISCRIMINATOR.to_vec(),
          caller_seed: [client_seed; 32],
          // Specify any account that is required by the callback
          accounts_metas: Some(vec![SerializableAccountMeta {
              pubkey: ctx.accounts.dice.key(),
              is_signer: false,
              is_writable: true,
          }]),
          ..Default::default()
      });
      ctx.accounts
          .invoke_signed_vrf(&ctx.accounts.payer.to_account_info(), &ix)?;
      Ok(())
    }

    pub fn callback_roll_dice(
      ctx: Context<CallbackRollDiceCtx>,
      randomness: [u8; 32],
    ) -> Result<()> {
        let rnd_u8 = ephemeral_vrf_sdk::rnd::random_u8_with_range(&randomness, 1, 6);
        msg!("Consuming random number: {:?}", rnd_u8);
        let dice = &mut ctx.accounts.dice;
        dice.last_result = rnd_u8; // Update the dice's last result
        Ok(())
    }

    // POKER

    pub fn initialize_poker(ctx: Context<InitializePoker>) -> Result<()> {
        let poker = &mut ctx.accounts.poker;

        poker.min_buy_in = 1000000;
        poker.max_buy_in = 10000000;
        

        poker.min_player_count = 4;
        poker.max_player_count = 8;

        poker.big_blind = 10000;
        poker.small_blind = 5000;

        poker.pot_amount = 0;
        poker.next_skip_time = -1;

        poker.current_raise = 0;
        poker.last_raise = 0;


        poker.card_1 = 0;
        poker.card_2 = 0;
        poker.card_3 = 0;
        poker.card_4 = 0;
        poker.card_5 = 0;


        poker.player_no = 0;


        poker.current_player_id = 0;
        poker.dealer_id = 0;
        poker.currently_playing = 0;

        poker.round = 0;

        poker.showdown = false;



        Ok(())
    }

    pub fn join_poker(ctx: Context<JoinPoker>, username:String, buy_in_amount: u64) -> Result<()> {
        let poker = &mut ctx.accounts.poker;
        let new_id: u64 = poker.player_no + 1;

        require!(
            poker.currently_playing < poker.max_player_count,
            PokerError::FullTable
        );

        require!(
            buy_in_amount >= poker.min_buy_in,
            CustomError::TooSmall
        );

        require!(
            buy_in_amount <= poker.max_buy_in,
            CustomError::TooBig
        );

        require!(
            ctx.accounts.token_mint.key() == TOKEN_MINT,
            CustomError::Unauthorized
        );

        poker.currently_playing += 1;
        poker.player_no = new_id;


        let poker_player = &mut ctx.accounts.poker_player;

        poker_player.user = ctx.accounts.signer.key();
        poker_player.poker = poker.key();
        poker_player.id = new_id;
        poker_player.chip_amount = buy_in_amount;
        poker_player.username = username;
        poker_player.round = poker.round + 1;


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
            buy_in_amount,
            TOKEN_DECIMALS,
        );

        Ok(())
    }

    pub fn poker_start(ctx: Context<StartPoker>) -> Result<()> {
        let poker = &mut ctx.accounts.poker;

        let dealer_id = get_next_player_id(
            poker.dealer_id,
            1,
            poker.key(), 
            poker.round,
            &ctx.remaining_accounts
        )?; 
        poker.dealer_id = dealer_id;


        let small_blind_player = &mut ctx.accounts.small_blind_poker_player;
        let big_blind_player = &mut ctx.accounts.big_blind_poker_player;

        poker.round += 1;

        require!(
            poker.currently_playing >= poker.min_player_count,
            CustomError::Unauthorized
        );

        require!(
            poker.pot_amount == 0,
            CustomError::Unauthorized
        );

        require!(
            ctx.remaining_accounts.len() == poker.currently_playing as usize,
            CustomError::Unauthorized
        );

        let small_blind_id = get_next_player_id(
            poker.dealer_id,
            1,
            poker.key(), 
            poker.round,
            &ctx.remaining_accounts
        )?; 

        require!(
            small_blind_id == small_blind_player.id,
            CustomError::Unauthorized
        );
        require!(
            small_blind_player.poker == poker.key(),
            CustomError::Unauthorized
        );

        let big_blind_id = get_next_player_id(
            poker.dealer_id,
            2,
            poker.key(), 
            poker.round,
            &ctx.remaining_accounts
        )?; 

        require!(
            big_blind_id == big_blind_player.id,
            CustomError::Unauthorized
        );
        require!(
            big_blind_player.poker == poker.key(),
            CustomError::Unauthorized
        );

        let utg_id = get_next_player_id(
            poker.dealer_id,
            3,
            poker.key(), 
            poker.round,
            &ctx.remaining_accounts
        )?; 

        poker.current_player_id = utg_id;


        //take tokens away from both blinds.
        small_blind_player.chip_amount -= poker.small_blind;
        big_blind_player.chip_amount -= poker.big_blind;

        let blinds = poker.small_blind + poker.big_blind;
        poker.pot_amount = blinds;
        poker.current_raise = poker.big_blind;
        poker.last_raise = poker.big_blind;

    
        Ok(())

    
    }


    pub fn poker_call(ctx: Context<PokerCall>, amount: i64) -> Result<()> { // 0 call/check | 0< raise |  fold
        let poker = &mut ctx.accounts.poker;
        let poker_player = &mut ctx.accounts.poker_player;

        let next_player_id = get_next_player_id(
            poker.current_player_id, 
            1,
            poker.key(), 
            poker.round,
            &ctx.remaining_accounts
        )?; 

        let small_blind_id = get_next_player_id(
            poker.dealer_id,
            1,
            poker.key(), 
            poker.round,
            &ctx.remaining_accounts
        )?; 

        let big_blind_id = get_next_player_id(
            poker.dealer_id,
            2,
            poker.key(), 
            poker.round,
            &ctx.remaining_accounts
        )?; 


        let next_poker_player = &mut ctx.accounts.next_poker_player;

        require!(
            next_poker_player.id == next_player_id,
            CustomError::Unauthorized
        );

        require!(
            next_poker_player.poker == poker.key(),
            CustomError::Unauthorized
        );

        require!(
            poker.showdown == false,
            CustomError::Unauthorized
        );

        require!(
            poker.current_player_id == poker_player.id,
            CustomError::Unauthorized
        );

        require!(
            poker.pot_amount != 0,
            CustomError::Unauthorized,
        );

        require!(
            ctx.remaining_accounts.len() == poker.currently_playing as usize,
            CustomError::Unauthorized
        );

        let mut new_turn: bool = false;
        if amount == 0 {
            if poker.current_raise > poker_player.raised_amount { //other wise ur checking
                poker_player.chip_amount -= poker.current_raise;
                poker_player.raised_amount = poker.current_raise;
                

                if poker.current_raise == next_poker_player.raised_amount {
                    new_turn = true;
                }
            }

        } else if amount > 0 { //raise
            require!(
                amount as u64 > poker.last_raise,
                CustomError::TooSmall
            );

            poker.last_raise = amount as u64;

            let raising_to = amount as u64 + poker.current_raise;
            poker.current_raise = raising_to;

            let player_puts_in = raising_to - poker_player.raised_amount;
            poker_player.chip_amount -= player_puts_in;
            poker_player.raised_amount = raising_to;

        } else { // if amount smaller than 0 fold
            poker_player.round += 1;

            if poker.current_raise > poker_player.raised_amount {
                if poker.current_raise == next_poker_player.raised_amount {
                    new_turn = true;
                }
            } else {
                if poker.card_1 == 0 {
                    if next_poker_player.id == big_blind_id {
                        new_turn = true;
                    }
                } else {
                    if next_poker_player.id == poker.dealer_id {
                        new_turn = true;
                    }
                }
            }
            // when folding, see if they folded because they had to call or they folded when they couldve just checked.
            // if folded because they had to call, check next_players current-raise and determine if new turn or not.
            // if folded when they couldve just checked, check to see if the next_player is the button / big blind depending on what cards have been revealed.

        }

        

        

        if new_turn == true { //means everyone matched the raise / folded, so we go to next round or showdown

            if poker.card_5 != 0 {
                poker.showdown = true;
            } else {
                if poker.card_1 == 0 {
                    poker.card_1 = 1;
                    poker.card_2 = 1;
                    poker.card_3 = 1;
                } else if poker.card_4 == 0 {
                    poker.card_4 = 1;
                } else if poker.card_5 == 0 {
                    poker.card_5 = 1;
                }  
                poker.current_player_id = small_blind_id;
                
                
            }

        } else {
            let next_player_id = get_next_player_id(
                poker.current_player_id, 
                1,
                poker.key(), 
                poker.round,
                &ctx.remaining_accounts
            )?; 
            poker.current_player_id = next_player_id;
        }
        
        //check if every active player's raise_amount is equal to the current_raise,
        // if so, new card on river based on how many cards have been revealed.
        // if card_5 has already been revealed, it's showdown time
        //next persons turn

        Ok(())
    }

    pub fn poker_show_cards(ctx: Context<PokerCall>, card_1: u8, card_2: u8) -> Result<()> { // 0 call/check | 0< raise |  fold
        let poker = &mut ctx.accounts.poker;
        let poker_player = &mut ctx.accounts.poker_player;


        require!(
            poker.round == poker_player.round,
            CustomError::Unauthorized
        );

        require!(
            poker.showdown == true,
            CustomError::Unauthorized
        );




        
        Ok(())
    }




}


fn get_next_player_id(
    current_player_id: u64,
    steps_ahead: u64,
    poker_key: Pubkey,
    poker_round: u64,
    remaining_accounts: &[AccountInfo],
) -> Result<u64> {
    let mut player_ids: Vec<u64> = vec![];

    for account in remaining_accounts.iter() {
        let data = account.try_borrow_data().map_err(|_| CustomError::Unauthorized)?;

        let remaining_player_account = PokerPlayer::try_deserialize(&mut &data[..])
            .map_err(|_| CustomError::Unauthorized)?;

        require!(
            remaining_player_account.poker == poker_key,
            CustomError::Unauthorized
        );

        if remaining_player_account.round != poker_round {
            continue;
        }

        player_ids.push(remaining_player_account.id);
    }

    // Sort player IDs in ascending order
    player_ids.sort_unstable();

    // Return the first (smallest) ID if current_player_id is 0
    if current_player_id == 0 {
        return Ok(player_ids
            .first()
            .copied()
            .ok_or(CustomError::Unauthorized)?);
    }

    // Find the index of the current player
    let current_index = player_ids
        .iter()
        .position(|&id| id == current_player_id)
        .ok_or(CustomError::Unauthorized)?;

    // Compute the index for the next player, wrapping around if needed
    let total_players = player_ids.len() as u64;
    let next_index = ((current_index as u64 + steps_ahead) % total_players) as usize;

    Ok(player_ids[next_index])
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


// DICE
#[derive(Accounts)]
pub struct InitializeDice<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init_if_needed, 
        payer = payer, 
        space = 8 + Dice::INIT_SPACE,
        seeds = [b"DICE"],
        bump
    )]
    pub dice: Account<'info, Dice>,
    pub system_program: Program<'info, System>,
}

#[vrf]
#[derive(Accounts)]
pub struct DoRollDiceCtx<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        seeds = [b"DICE"],
        bump
    )]
    pub dice: Account<'info, Dice>,
    /// CHECK: The oracle queue
    #[account(mut, address = ephemeral_vrf_sdk::consts::DEFAULT_QUEUE)]
    pub oracle_queue: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct CallbackRollDiceCtx<'info> {
    /// This check ensure that the vrf_program_identity (which is a PDA) is a singer
    /// enforcing the callback is executed by the VRF program trough CPI
    #[account(address = ephemeral_vrf_sdk::consts::VRF_PROGRAM_IDENTITY)]
    pub vrf_program_identity: Signer<'info>,
    #[account(
        mut,
        seeds = [b"DICE"],
        bump,
    )]
    pub dice: Account<'info, Dice>,
}

#[account]
#[derive(InitSpace)]
pub struct Dice {
    pub last_result: u8,
}


// POKER

#[derive(Accounts)]
pub struct InitializePoker<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer, 
        space = 8 + Poker::INIT_SPACE,
        seeds = [b"POKER"],
        bump
    )]
    pub poker: Account<'info, Poker>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinPoker<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"POKER"],
        bump
    )]
    pub poker: Account<'info, Poker>,

    #[account(
        init,
        payer = signer,
        space = 8 + PokerPlayer::INIT_SPACE,
        seeds = [b"PokerPlayer", poker.key().as_ref(), signer.key().as_ref()],
        bump
    )]
    pub poker_player: Account<'info, PokerPlayer>,

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
pub struct StartPoker<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"POKER"],
        bump,
    )]
    pub poker: Account<'info, Poker>,

    #[account(
        mut,
        seeds = [b"PokerPlayer", poker.key().as_ref(), signer.key().as_ref()],
        bump
    )]
    pub poker_player: Account<'info, PokerPlayer>,

    #[account(mut)]
    pub big_blind_poker_player: Account<'info, PokerPlayer>,

    #[account(mut)]
    pub small_blind_poker_player: Account<'info, PokerPlayer>,


    pub system_program: Program<'info, System>,

}

#[derive(Accounts)]
pub struct PokerCall<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"POKER"],
        bump,
    )]
    pub poker: Account<'info, Poker>,

    #[account(
        mut,
        seeds = [b"PokerPlayer", poker.key().as_ref(), signer.key().as_ref()],
        bump
    )]
    pub poker_player: Account<'info, PokerPlayer>,

    #[account(mut)]
    pub next_poker_player: Account<'info, PokerPlayer>,


    pub system_program: Program<'info, System>,

}

#[derive(Accounts)]
pub struct TurnPoker<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"POKER"],
        bump,
    )]
    pub poker: Account<'info, Poker>,

    #[account(
        mut,
        seeds = [b"PokerPlayer", poker.key().as_ref(), signer.key().as_ref()],
        bump
    )]
    pub poker_player: Account<'info, PokerPlayer>,

    #[account(mut)]
    pub next_poker_player: Account<'info, PokerPlayer>,

    pub system_program: Program<'info, System>,

}


#[account]
#[derive(InitSpace)]
pub struct Poker {
    pub min_buy_in: u64,
    pub max_buy_in: u64,

    pub min_player_count: u8,
    pub max_player_count: u8,

    pub big_blind: u64,
    pub small_blind: u64,

    pub pot_amount: u64, // 8
    pub next_skip_time: i64, // 8

    pub current_raise: u64, //8 what people have to put in to call
    pub last_raise: u64, //8 minimum you have to raise by to re-raise

    pub card_1: u8, //1
    pub card_2: u8, //1
    pub card_3: u8, //1
    pub card_4: u8, //1
    pub card_5: u8, //1


    pub player_no: u64, //8  how many players have been here for this game round?


    pub current_player_id: u64, //8  id of player whos turn is now
    pub dealer_id: u64,

    pub round: u64, // 8
    pub currently_playing: u8, //8

    pub showdown: bool, // 1
}

#[account]
#[derive(InitSpace)]
pub struct PokerPlayer {
    pub user: Pubkey, //32
    pub poker: Pubkey, //32
    pub id: u64, //8

    pub chip_amount: u64, // 8

    pub raised_amount: u64, // 8
    pub round: u64, //8

    pub card_1: u8, // 1
    pub card_2: u8, // 2

    #[max_len(100)]
    pub username: String,

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

#[error_code]
pub enum PokerError {
    #[msg("Full Table")]
    FullTable
}