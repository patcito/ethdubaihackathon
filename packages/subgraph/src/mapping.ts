import { ERC20 } from "./../generated/Hackathon/ERC20";
import { Token, Deposit, Sponsor, SponsorBalance } from "./../generated/schema";
import {
  Deposit as DepositEvent,
  SetVerifiedSponsor,
  Withdraw,
} from "./../generated/Hackathon/Hackathon";
import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts";

export function createSponsorIfNotExists(address: Bytes): Sponsor {
  const sponsorId = `${address.toHexString()}`;
  let sponsor = Sponsor.load(sponsorId);
  if (sponsor == null) {
    sponsor = new Sponsor(sponsorId);
    sponsor.address = address;
    sponsor.verified = false;
    sponsor.save();
  }

  return sponsor;
}

export function createTokenIfNotExists(address: Bytes): Token {
  const id = `${address.toHexString()}`;
  let token = Token.load(id);
  if (token == null) {
    const tokenContract = ERC20.bind(Address.fromString(address.toHexString()));
    token = new Token(id);
    token.address = address;
    token.name = tokenContract.name();
    token.symbol = tokenContract.symbol();
    token.decimals = BigInt.fromI32(tokenContract.decimals());
    token.save();
  }

  return token;
}

export function createDeposit(sponsor: Sponsor, event: DepositEvent): Deposit {
  const token = createTokenIfNotExists(event.params.token);

  const id = `${event.transaction.hash.toHexString()}`;
  let deposit = Deposit.load(id);
  if (deposit == null) {
    deposit = new Deposit(id);
    deposit.sponsor = sponsor.id;
    deposit.token = token.id;
    deposit.amount = event.params.amount;
    deposit.save();
  }
  return deposit;
}

export function updateSponsorBalance(
  sponsor: string,
  token: string,
  amount: BigInt,
  increment: boolean
): SponsorBalance {
  const id = `${sponsor}-${token}`;
  let balance = SponsorBalance.load(id);
  if (balance == null) {
    balance = new SponsorBalance(id);
    balance.sponsor = sponsor;
    balance.token = token;
    balance.totalAmount = increment
      ? balance.totalAmount.plus(amount)
      : balance.totalAmount.minus(amount);
  } else {
    balance.totalAmount = increment
      ? balance.totalAmount.plus(amount)
      : balance.totalAmount.minus(amount);
  }
  balance.save();

  return balance;
}

export function handleDeposit(event: DepositEvent): void {
  const sponsor = createSponsorIfNotExists(event.transaction.from);
  createDeposit(sponsor, event);
  updateSponsorBalance(
    sponsor.id,
    event.params.token.toHexString(),
    event.params.amount,
    true
  );
}

export function handleSetVerifiedSponsor(event: SetVerifiedSponsor): void {
  let sponsor = createSponsorIfNotExists(event.params.sponsor);
  sponsor.verified = event.params.status;
  sponsor.save();
}

export function handleWithdraw(event: Withdraw): void {
  updateSponsorBalance(
    event.transaction.from.toHexString(),
    event.params.token.toHexString(),
    event.params.amount,
    false
  );
}
