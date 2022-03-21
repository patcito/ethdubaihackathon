import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

describe("Hackathon", function () {
  before(async function () {
    this.signers = await ethers.getSigners();
    this.deployer = this.signers[0];
    this.alex = this.signers[1];
    this.bob = this.signers[2];
  });

  this.beforeEach(async function () {
    const Weth = await ethers.getContractFactory("WETH");
    this.weth = await Weth.deploy();
    await this.weth.deployed();

    const Hackathon = await ethers.getContractFactory("Hackathon");
    this.hackathon = await Hackathon.deploy(this.weth.address);
    await this.hackathon.deployed();

    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    this.erc20Mock = await ERC20Mock.deploy(
      "ETHDubai",
      "ETHDUBAI",
      parseEther("1000"),
      this.deployer.address
    );
  });

  it("Should has correct settings", async function () {
    expect(await this.hackathon.owner()).to.equal(this.deployer.address);
    expect(await this.hackathon.native()).to.equal(this.weth.address);
    expect(await this.erc20Mock.balanceOf(this.deployer.address)).to.eq(
      parseEther("1000")
    );
  });

  it("Should deposit token", async function () {
    await this.erc20Mock.approve(this.hackathon.address, parseEther("100"));
    await this.hackathon.deposit(this.erc20Mock.address, parseEther("100"));

    expect(await this.erc20Mock.balanceOf(this.hackathon.address)).to.eq(
      parseEther("100")
    );
    expect(await this.erc20Mock.balanceOf(this.deployer.address)).to.eq(
      parseEther("900")
    );

    expect(
      await this.hackathon.sponsorsTokens(
        this.deployer.address,
        this.erc20Mock.address
      )
    ).to.eq(parseEther("100"));
  });

  it("Should deposit native", async function () {
    expect(await ethers.provider.getBalance(this.alex.address)).to.eq(
      parseEther("10000")
    );
    await this.hackathon
      .connect(this.alex)
      .deposit(this.weth.address, parseEther("100"), {
        value: parseEther("100"),
      });
    expect(await ethers.provider.getBalance(this.alex.address)).to.be.closeTo(
      parseEther("9900"),
      parseEther("0.001")
    );

    await this.hackathon.deposit(this.weth.address, parseEther("500"), {
      value: parseEther("500"),
    });

    expect(
      await this.hackathon.sponsorsTokens(this.alex.address, this.weth.address)
    ).to.eq(parseEther("100"));

    expect(
      await this.hackathon.sponsorsTokens(
        this.deployer.address,
        this.weth.address
      )
    ).to.eq(parseEther("500"));

    expect(await this.weth.balanceOf(this.hackathon.address)).to.eq(
      parseEther("600")
    );
  });

  it("Should withdraw token", async function () {
    await this.erc20Mock.approve(this.hackathon.address, parseEther("100"));
    await this.hackathon.deposit(this.erc20Mock.address, parseEther("100"));
    await expect(
      this.hackathon
        .connect(this.alex)
        .withdraw(this.erc20Mock.address, parseEther("100"), this.bob.address)
    ).to.be.revertedWith("!balance");

    await expect(
      this.hackathon.withdraw(
        this.erc20Mock.address,
        parseEther("100"),
        this.bob.address
      )
    )
      .to.emit(this.hackathon, "Withdraw")
      .withArgs(this.erc20Mock.address, parseEther("100"), this.bob.address);

    expect(await this.erc20Mock.balanceOf(this.hackathon.address)).to.eq(
      parseEther("0")
    );
    expect(await this.erc20Mock.balanceOf(this.deployer.address)).to.eq(
      parseEther("900")
    );
    expect(await this.erc20Mock.balanceOf(this.bob.address)).to.eq(
      parseEther("100")
    );

    expect(
      await this.hackathon.sponsorsTokens(
        this.deployer.address,
        this.erc20Mock.address
      )
    ).to.eq(parseEther("0"));
  });

  it("Should withdraw native", async function () {
    await this.hackathon
      .connect(this.alex)
      .deposit(this.weth.address, parseEther("100"), {
        value: parseEther("100"),
      });
    await this.hackathon.deposit(this.weth.address, parseEther("500"), {
      value: parseEther("500"),
    });

    await this.hackathon
      .connect(this.alex)
      .withdraw(this.weth.address, parseEther("100"), this.bob.address);

    await this.hackathon.withdraw(
      this.weth.address,
      parseEther("250"),
      this.bob.address
    );

    await this.hackathon.withdraw(
      this.weth.address,
      parseEther("250"),
      this.bob.address
    );

    expect(
      await this.hackathon.sponsorsTokens(this.alex.address, this.weth.address)
    ).to.eq(parseEther("0"));

    expect(await ethers.provider.getBalance(this.bob.address)).to.be.eq(
      parseEther("10600")
    );
  });

  it("Should set verified sponsor", async function () {
    expect(await this.hackathon.verifiedSponsors(this.bob.address)).to.eq(
      false
    );

    expect(await this.hackathon.setVerifiedSponsor(this.bob.address, true))
      .to.emit(this.hackathon, "SetVerifiedSponsor")
      .withArgs(this.bob.address, true);

    expect(await this.hackathon.verifiedSponsors(this.bob.address)).to.eq(true);
  });
});
