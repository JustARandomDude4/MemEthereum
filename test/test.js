//tests r really imp for smart contracts  cuz we can't change(immutable) them, once we deploy them.
//all u can do is deploy a new copy of it.
//so, we write test, to make sure, they work really really well.

//const { assert } = require('chai')

const MemEthereum = artifacts.require('./MemEthereum.sol')    // 3,4

// chai is imported
require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('MemEthereum', ([deployer, author, tipper]) => {   //5
  let memEthereum                                                      //forgot 5

  before(async () => {
    memEthereum = await MemEthereum.deployed()                   //6,7
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await memEthereum.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await memEthereum.name()                //8
      assert.equal(name, 'MemEthereum')               //9
    })
  })

    describe('images', async () => {
      let result, imageCount
      const hash = 'abc123'
  
      before(async () => {
        result = await memEthereum.uploadImage(hash, 'Image description', { from: author })  //10
        imageCount = await memEthereum.imageCount()                         //11
      })
  
      //check event
      it('creates images', async () => {
        // SUCESS
        assert.equal(imageCount, 1)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
        assert.equal(event.hash, hash, 'Hash is correct')
        assert.equal(event.description, 'Image description', 'description is correct')
        assert.equal(event.tipAmount, '0', 'tip amount is correct')
        assert.equal(event.author, author, 'author is correct')
  
  
        // FAILURE: Image must have hash
        await memEthereum.uploadImage('', 'Image description', { from: author }).should.be.rejected;   //12
  
        // FAILURE: Image must have description
        await memEthereum.uploadImage('Image hash', '', { from: author }).should.be.rejected;   //13
      })
  
  //check from Struct
  it('lists images', async () => {
    const image = await memEthereum.images(imageCount)                      //14
    assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
    assert.equal(image.hash, hash, 'Hash is correct')
    assert.equal(image.description, 'Image description', 'description is correct')
    assert.equal(image.tipAmount, '0', 'tip amount is correct')
    assert.equal(image.author, author, 'author is correct')
  })

  it('allows users to tip images', async () => {
    // Track the author balance before purchase
    let oldAuthorBalance
    oldAuthorBalance = await web3.eth.getBalance(author)
    oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

    result = await memEthereum.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })   //15

    // SUCCESS
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
    assert.equal(event.hash, hash, 'Hash is correct')
    assert.equal(event.description, 'Image description', 'description is correct')
    assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
    assert.equal(event.author, author, 'author is correct')

    // Check that mememaker received funds
    let newAuthorBalance
    newAuthorBalance = await web3.eth.getBalance(author)
    newAuthorBalance = new web3.utils.BN(newAuthorBalance)

    let tipImageOwner
    tipImageOwner = web3.utils.toWei('1', 'Ether')
    tipImageOwner = new web3.utils.BN(tipImageOwner)

    const expectedBalance = oldAuthorBalance.add(tipImageOwner)

    assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

    // FAILURE: when we Try to tip a meme that does not exist
    await memEthereum.tipImageOwner(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;   //16
  })
  })
})



