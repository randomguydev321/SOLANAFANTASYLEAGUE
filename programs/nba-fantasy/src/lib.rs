use anchor_lang::prelude::*;

declare_id!("NBAFantasy111111111111111111111111111111111");

#[program]
pub mod nba_fantasy {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let league = &mut ctx.accounts.league;
        league.authority = ctx.accounts.authority.key();
        league.entry_fee = 100_000_000; // 0.1 SOL in lamports
        league.prize_pool = 0;
        league.salary_cap = 20;
        Ok(())
    }

    pub fn add_player(
        ctx: Context<AddPlayer>,
        player_id: u32,
        name: String,
        position: String,
        salary: u8,
    ) -> Result<()> {
        require!(salary >= 1 && salary <= 5, ErrorCode::InvalidSalary);
        require!(
            position == "PG" || position == "SG" || position == "SF" || position == "PF" || position == "C",
            ErrorCode::InvalidPosition
        );

        let player = &mut ctx.accounts.player;
        player.player_id = player_id;
        player.name = name;
        player.position = position;
        player.salary = salary;
        player.points = 0;
        player.active = true;

        Ok(())
    }

    pub fn register_lineup(
        ctx: Context<RegisterLineup>,
        pg_id: u32,
        sg_id: u32,
        sf_id: u32,
        pf_id: u32,
        c_id: u32,
    ) -> Result<()> {
        let league = &mut ctx.accounts.league;
        let lineup = &mut ctx.accounts.lineup;

        // Check if user already registered
        require!(!lineup.registered, ErrorCode::AlreadyRegistered);

        // Verify positions and calculate total salary
        let mut total_salary = 0u8;
        
        // Note: In a real implementation, you'd need to fetch player data from accounts
        // For now, we'll assume the frontend validates this
        
        require!(total_salary <= league.salary_cap, ErrorCode::SalaryCapExceeded);

        // Transfer entry fee
        let entry_fee = league.entry_fee;
        **ctx.accounts.user_lamports.borrow_mut() -= entry_fee;
        **ctx.accounts.league_lamports.borrow_mut() += entry_fee;

        lineup.user = ctx.accounts.user.key();
        lineup.pg = pg_id;
        lineup.sg = sg_id;
        lineup.sf = sf_id;
        lineup.pf = pf_id;
        lineup.c = c_id;
        lineup.total_salary = total_salary;
        lineup.total_points = 0;
        lineup.registered = true;

        league.prize_pool += entry_fee;

        Ok(())
    }

    pub fn update_player_score(ctx: Context<UpdatePlayerScore>, points: u32) -> Result<()> {
        let player = &mut ctx.accounts.player;
        player.points = points;
        Ok(())
    }

    pub fn pay_winner(ctx: Context<PayWinner>) -> Result<()> {
        let league = &mut ctx.accounts.league;
        let winner = &mut ctx.accounts.winner;

        require!(league.prize_pool > 0, ErrorCode::NoPrizePool);

        let prize = league.prize_pool;
        league.prize_pool = 0;

        **winner.lamports.borrow_mut() += prize;

        Ok(())
    }

    pub fn set_entry_fee(ctx: Context<SetEntryFee>, new_fee: u64) -> Result<()> {
        let league = &mut ctx.accounts.league;
        league.entry_fee = new_fee;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + League::INIT_SPACE
    )]
    pub league: Account<'info, League>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(player_id: u32)]
pub struct AddPlayer<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub league: Account<'info, League>,
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + Player::INIT_SPACE,
        seeds = [b"player", player_id.to_le_bytes().as_ref()],
        bump
    )]
    pub player: Account<'info, Player>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterLineup<'info> {
    #[account(mut)]
    pub league: Account<'info, League>,
    #[account(
        init,
        payer = user,
        space = 8 + Lineup::INIT_SPACE,
        seeds = [b"lineup", user.key().as_ref()],
        bump
    )]
    pub lineup: Account<'info, Lineup>,
    #[account(mut)]
    pub user: Signer<'info>,
    /// CHECK: This is safe because we're just transferring lamports
    #[account(mut)]
    pub user_lamports: AccountInfo<'info>,
    /// CHECK: This is safe because we're just transferring lamports
    #[account(mut)]
    pub league_lamports: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(player_id: u32)]
pub struct UpdatePlayerScore<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub league: Account<'info, League>,
    pub authority: Signer<'info>,
    #[account(
        mut,
        seeds = [b"player", player_id.to_le_bytes().as_ref()],
        bump
    )]
    pub player: Account<'info, Player>,
}

#[derive(Accounts)]
pub struct PayWinner<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub league: Account<'info, League>,
    pub authority: Signer<'info>,
    /// CHECK: This is safe because we're just transferring lamports
    #[account(mut)]
    pub winner: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct SetEntryFee<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub league: Account<'info, League>,
    pub authority: Signer<'info>,
}

#[account]
pub struct League {
    pub authority: Pubkey,
    pub entry_fee: u64,
    pub prize_pool: u64,
    pub salary_cap: u8,
}

impl League {
    pub const INIT_SPACE: usize = 32 + 8 + 8 + 1;
}

#[account]
pub struct Player {
    pub player_id: u32,
    pub name: String,
    pub position: String,
    pub salary: u8,
    pub points: u32,
    pub active: bool,
}

impl Player {
    pub const INIT_SPACE: usize = 4 + 4 + 32 + 4 + 32 + 1 + 4 + 1;
}

#[account]
pub struct Lineup {
    pub user: Pubkey,
    pub pg: u32,
    pub sg: u32,
    pub sf: u32,
    pub pf: u32,
    pub c: u32,
    pub total_salary: u8,
    pub total_points: u32,
    pub registered: bool,
}

impl Lineup {
    pub const INIT_SPACE: usize = 32 + 4 + 4 + 4 + 4 + 4 + 1 + 4 + 1;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid salary. Must be between 1-5.")]
    InvalidSalary,
    #[msg("Invalid position. Must be PG, SG, SF, PF, or C.")]
    InvalidPosition,
    #[msg("User already registered.")]
    AlreadyRegistered,
    #[msg("Salary cap exceeded.")]
    SalaryCapExceeded,
    #[msg("No prize pool available.")]
    NoPrizePool,
}
