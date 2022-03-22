import { ethers } from "hardhat";
import { BigNumber } from "ethers";

export async function advanceTime(time: number) {
  await ethers.provider.send("evm_increaseTime", [time]);
}

export const duration = {
  seconds: function (val: number) {
    return BigNumber.from(val);
  },
  minutes: function (val: number) {
    return BigNumber.from(val).mul(this.seconds(60));
  },
  hours: function (val: number) {
    return BigNumber.from(val).mul(this.minutes(60));
  },
  days: function (val: number) {
    return BigNumber.from(val).mul(this.hours(24));
  },
  weeks: function (val: number) {
    return BigNumber.from(val).mul(this.days(7));
  },
  years: function (val: number) {
    return BigNumber.from(val).mul(this.days(365));
  },
};
