import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

async function main() {
  const signers = await ethers.getSigners();

  const Weth = await ethers.getContractFactory("WETH");
  const weth = await Weth.deploy();
  await weth.deployed();

  const Hackathon = await ethers.getContractFactory("Hackathon");
  const hackathon = await Hackathon.deploy(weth.address);
  await hackathon.deployed();

  const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
  const erc20Mock = await ERC20Mock.deploy(
    "ETHDubai",
    "ETHDUBAI",
    parseEther("1000"),
    signers[0].address
  );

  console.log("WETH deployed to:", weth.address);
  console.log("Hackathon deployed to:", hackathon.address);
  console.log("ERC20Mock deployed to:", erc20Mock.address);
}

main()
  .then(() => {
    process.exit(1);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
