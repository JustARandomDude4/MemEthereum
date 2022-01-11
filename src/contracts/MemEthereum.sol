
pragma solidity ^0.5.0;

contract MemEthereum {             //1
  string public name;
  uint public imageCount = 0;
  mapping(uint => Image) public images;

  struct Image {
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
  }

  event ImageCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  constructor() public {
    name = "MemEthereum";           //2
  }

  function uploadImage(string memory _imgHash, string memory _description) public {
    // Make sure the image hash exists
    require(bytes(_imgHash).length > 0);
    // Make sure image description exists
    require(bytes(_description).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));

    // Increment image id
    imageCount ++;

    // Add Image to the contract
    images[imageCount] = Image(imageCount, _imgHash, _description, 0, msg.sender);
    // Trigger an event
    emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);
  }

  function tipImageOwner(uint _id) public payable {
    // Make sure the id is valid
    require(_id > 0 && _id <= imageCount);
    // Fetch the image
    Image memory _image = images[_id];
    // Fetch the author
    address payable _author = _image.author;
    // Pay the author by sending them Ether
    address(_author).transfer(msg.value);
    // Increment the tip amount
    _image.tipAmount = _image.tipAmount + msg.value;
    // Update the image
    images[_id] = _image;
    // Trigger an event
    emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
  }
}

/*pragma solidity ^0.5.0;

contract Decentragram {

  //store memes
  string public name;
  uint public imageCount = 0;
  mapping(uint => Image) public images;  // we call  this function called 'images' 


  struct Image{
    uint id;   //unsigned integer cant be nagative
    string hash;  //location of IPFS
    string description;  //post description
    uint tipAmount;    //tip the crypto currency
    address payable author;   //adress of author to sedn him the money

  }

  event ImageCreated(
    uint id,
    string hash, 
    string description,  
    uint tipAmount,    
    address payable author  
  );

   event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );
 constructor() public {
    name = "Decentragram";
  }

  //createImages
  function uploadImage(string memory _imgHash,string memory _description) public{

// make sure imageHash,bytr descrition & adress exists
  require(bytes(_imgHash).length >0);
  require(bytes(_description).length >0);
  require(msg.sender !=address(0));   

    //Incrementing the meme id:
    imageCount ++;
    //Add image to contract

    //msg is a global variable given by solidity.
    // sender- person whos calling this func is the ethereum address of person whos calling this func
    images[imageCount]=Image(imageCount,_imgHash,_description,0,msg.sender);
    emit ImageCreated(imageCount,_imgHash,_description,0,msg.sender);
  }

  //tip the meme
  function tipImageOwner(uint _id) public payable {
    // Make sure the id is valid
    require(_id > 0 && _id <= imageCount);
    // Fetch the image
    Image memory _image = images[_id];
    // Fetch the author
    address payable _author = _image.author;
    // Pay the author by sending them Ether
    address(_author).transfer(msg.value);
    // Increment the tip amount
    _image.tipAmount = _image.tipAmount + msg.value;
    // Update the image
    images[_id] = _image;
    // Trigger an event
    emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
  }

}*/