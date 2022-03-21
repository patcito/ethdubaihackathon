import { expect } from "chai";
import { ethers } from "hardhat";

describe("Hackathon", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Hackathon = await ethers.getContractFactory("Hackathon");
    const hackathon = await Hackathon.deploy();
    await hackathon.deployed();

    expect(await hackathon.openVote()).to.equal(false);

    const setOpenVote = await hackathon.setOpenVote(true);

    // wait until the transaction is mined
    await setOpenVote.wait();

    expect(await hackathon.openVote()).to.equal(true);
  });
});
