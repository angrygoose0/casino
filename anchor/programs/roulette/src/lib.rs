#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use ephemeral_vrf_sdk::anchor::vrf;
use ephemeral_vrf_sdk::instructions::{create_request_randomness_ix, RequestRandomnessParams};
use ephemeral_vrf_sdk::types::SerializableAccountMeta;

use anchor_spl::{
    associated_token::{AssociatedToken},
    token_interface::{Mint, TokenAccount, TokenInterface, transfer_checked, TransferChecked, SyncNative, sync_native},
};

declare_id!("AxvxoBUcoLyYAZqEJGzNFxgsfU6QkVYW6bD3TtS7264T");

#[program]
pub mod roulette {
    use super::*;

    //mainnet: pub const TOKEN_MINT: Pubkey = pubkey!("5gVSqhk41VA8U6U4Pvux6MSxFWqgptm3w58X9UTGpump");
    pub const TOKEN_MINT: Pubkey = pubkey!("D2BYx2UoshNpAfgBEXEEyfUKxLSxkLMAb6zeZhZYgoos");
    pub const TOKEN_DECIMALS: u8 = 9;
    pub const SOLANA_MINT: Pubkey = pubkey!("So11111111111111111111111111111111111111112");

    pub const SPIN_INTERVAL: i64 = 60; //1 minute

    //TREASURY
    pub fn init_treasuries(
        ctx: Context<InitializeTreasuries>,
    ) -> Result<()> {
        Ok(())
    } 

    pub fn init_wheel(
        ctx: Context<InitializeWheel>,
    ) -> Result<()> {
        let wheel = &mut ctx.accounts.wheel;
        wheel.spin_history = [0; 10];

        wheel.next_spin_time = -1;
        
        Ok(())
    } 

    pub fn bet(
        ctx: Context<InitializeBet>,
        bet_amount: u64,
        value: u8,
        form: u8,
    ) -> Result<()> {
        let bet = &mut ctx.accounts.bet;
        let wheel = &ctx.accounts.wheel;

        bet.player = ctx.accounts.signer.key();
        bet.round = wheel.round + 1;
        bet.bet_amount = bet_amount;
        bet.value = value;
        bet.form = form;

        Ok(())
    }

    pub fn spin_wheel(
        ctx: Context<SpinWheel>,
        client_seed: u8,
    ) -> Result<()> {
        let wheel = &mut ctx.accounts.wheel;
        let current_time = Clock::get()?.unix_timestamp as i64;

        require!(
            wheel.next_spin_time < current_time, 
            CustomError::Unauthorized
        );

        wheel.next_spin_time = current_time + SPIN_INTERVAL;
        wheel.round += 1;

        let ix = create_request_randomness_ix(RequestRandomnessParams {
            payer: ctx.accounts.signer.key(),
            oracle_queue: ctx.accounts.oracle_queue.key(),
            callback_program_id: ID,
            callback_discriminator: instruction::CallbackSpinWheel::DISCRIMINATOR.to_vec(),
            caller_seed: [client_seed; 32],
            // Specify any account that is required by the callback
            accounts_metas: Some(vec![SerializableAccountMeta {
                pubkey: wheel.key(),
                is_signer: false,
                is_writable: true,
            }]),
            ..Default::default()
        });
        ctx.accounts
            .invoke_signed_vrf(&ctx.accounts.signer.to_account_info(), &ix)?;
        Ok(())
    }

    pub fn callback_spin_wheel(
        ctx: Context<CallbackSpinWheel>,
        randomness: [u8; 32],
      ) -> Result<()> {
          let rnd_u8 = ephemeral_vrf_sdk::rnd::random_u8_with_range(&randomness, 1, 38);
          msg!("Consuming random number: {:?}", rnd_u8);
          let wheel = &mut ctx.accounts.wheel;
          
          // Shift all elements down by one position
          for i in (1..10).rev() {
              wheel.spin_history[i] = wheel.spin_history[i-1];
          }
          // Add new result at the beginning
          wheel.spin_history[0] = rnd_u8;
          
          Ok(())
      }

    pub fn claim(
        ctx: Context<Claim>,
    ) -> Result<()> {
        let wheel = &ctx.accounts.wheel;

        let seeds = &["TOKEN".as_bytes(), &[ctx.bumps.token_treasury]];
        let signer = [&seeds[..]];

        let mut won_amount = 0;


        for account in ctx.remaining_accounts.iter() {
            let data = account.try_borrow_mut_data().map_err(|_| CustomError::Unauthorized)?;
                
            let bet_instance = Bet::try_deserialize(&mut &data[..])
                .map_err(|_| CustomError::Unauthorized)?;
        
            if bet_instance.round > wheel.round {
                continue;
            } else if bet_instance.round == wheel.round {

                if bet_instance.form == 0 { //even / odd
                    if wheel.spin_history[0] != 37 {
                        let is_even = wheel.spin_history[0] % 2 == 0;
                        if (bet_instance.value == 0 && is_even) || (bet_instance.value == 1 && !is_even) {
                            won_amount += bet_instance.bet_amount * 2;
                        }
                    }
                } else if bet_instance.form == 1 { //red / black
                    if wheel.spin_history[0] != 37 {
                        let red_numbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
                        let is_red = red_numbers.contains(&wheel.spin_history[0]);
                        if (bet_instance.value == 0 && is_red) || (bet_instance.value == 1 && !is_red) {
                            won_amount += bet_instance.bet_amount * 2;
                        }
                    }
                } else if bet_instance.form == 2 { //high / low
                    if wheel.spin_history[0] != 37{
                        let is_high = wheel.spin_history[0] > 18;
                        if (bet_instance.value == 0 && is_high) || (bet_instance.value == 1 && !is_high) {
                            won_amount += bet_instance.bet_amount * 2;
                        }
                    }
                } else if bet_instance.form == 3 { //thirds / dozens
                    if wheel.spin_history[0] != 37 {
                        let third = (wheel.spin_history[0] - 1) / 12;
                        if bet_instance.value == third {
                            won_amount += bet_instance.bet_amount * 3;
                        }
                    }
                } else if bet_instance.form == 4 { //columns
                    if wheel.spin_history[0] != 37 {
                        let column = (wheel.spin_history[0] - 1) % 3;
                        if bet_instance.value == column {
                            won_amount += bet_instance.bet_amount * 3;
                        }
                    }
                } else if bet_instance.form == 5 { //singles
                    
                    if bet_instance.value == wheel.spin_history[0] {
                        won_amount += bet_instance.bet_amount * 36;
                    }
                }
            }

            

            // Transfer lamports to the signer before closing
            **ctx.accounts.signer.to_account_info().lamports.borrow_mut() += account.lamports();
            **account.lamports.borrow_mut() = 0;
        
            // Mark the account for closing
            **account.try_borrow_mut_lamports()? = 0;
        }

        transfer_checked(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.token_treasury.to_account_info(),
                    to: ctx.accounts.user_token_account.to_account_info(),
                    authority: ctx.accounts.token_treasury.to_account_info(),
                    mint: ctx.accounts.token_mint.to_account_info(),
                },
                &signer,
            ),
            won_amount,
            TOKEN_DECIMALS,
        )?;
        
        Ok(())
    }

}

#[derive(Accounts)]
pub struct InitializeTreasuries<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        address = crate::roulette::SOLANA_MINT
    )]
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

    #[account(
        address = crate::roulette::TOKEN_MINT
    )]
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
pub struct InitializeWheel<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        seeds = [b"WHEEL"],
        bump,
        payer = signer,
        space = 8 + Wheel::INIT_SPACE,
    )]
    pub wheel: Account<'info, Wheel>,

    pub system_program: Program<'info, System>,
    
}

#[derive(Accounts)]
pub struct InitializeBet<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"WHEEL"],
        bump,
    )]
    pub wheel: Account<'info, Wheel>,

    #[account(
        init,
        space = 8 + Bet::INIT_SPACE,
        payer = signer,
    )]
    pub bet: Account<'info, Bet>,

    pub system_program: Program<'info, System>,
}

#[vrf]
#[derive(Accounts)]
pub struct SpinWheel<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"WHEEL"],
        bump,
    )]
    pub wheel: Account<'info, Wheel>,

    /// CHECK: The oracle queue
    #[account(mut, address = ephemeral_vrf_sdk::consts::DEFAULT_QUEUE)]
    pub oracle_queue: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CallbackSpinWheel<'info> {
    /// This check ensure that the vrf_program_identity (which is a PDA) is a singer
    /// enforcing the callback is executed by the VRF program trough CPI
    #[account(address = ephemeral_vrf_sdk::consts::VRF_PROGRAM_IDENTITY)]
    pub vrf_program_identity: Signer<'info>,

    #[account(
        mut,
        seeds = [b"WHEEL"],
        bump,
    )]
    pub wheel: Account<'info, Wheel>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"WHEEL"],
        bump,
    )]
    pub wheel: Account<'info, Wheel>,   

    #[account(
        mut,
        seeds = [b"TOKEN"],
        bump,
    )]
    pub token_treasury: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        address = crate::roulette::TOKEN_MINT
    )]
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


#[account]
#[derive(InitSpace)]
pub struct Bet {
    pub player: Pubkey,

    pub round: u64,

    pub bet_amount: u64,

    pub value: u8, // if single, determines what number single.
    pub form: u8, //0 = even/odd, 1 = red/black, 2 = high/low, 3 = thirds/dozens, 4 = columns, 5 = singles,
}

#[account]
#[derive(InitSpace)]
pub struct Wheel {
    pub spin_history: [u8; 10],      // 37 is 0, 38 is 00.
    pub round: u64,

    pub next_spin_time: i64,
}

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized")]
    Unauthorized,
}

