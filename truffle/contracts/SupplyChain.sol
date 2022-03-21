// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.24;

//contracts
import "./Consumer.sol";
import "./Distributor.sol";
import "./Manufacturer.sol";
import "./Retailer.sol";

contract SupplyChain is Retailer, Consumer, Manufacturer, Distributor {
    uint256[] composite;
    mapping(uint256 => Item) items;
    mapping(address => totalItems) ownership;
    mapping(address => totalItems) shipped;
    //mapping(uint256 => composite) mappingComposite;

    uint256 randNonce = 0;

    function randMod() internal returns (uint256) {
        randNonce++;
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            ) % 82589933;
    }

    function deleteItem(uint256 _uin, address x) internal {
        for (uint256 i = 0; i < ownership[x].itemUin.length; i++) {
            if (_uin == ownership[x].itemUin[i]) {
                ownership[x].itemUin[i] = ownership[x].itemUin[
                    ownership[x].itemUin.length - 1
                ];
                ownership[x].itemUin.pop();
                break;
            }
        }
    }

    function deleteItemshipped(uint256 _uin, address x) internal {
        for (uint256 i = 0; i < shipped[x].itemUin.length; i++) {
            if (_uin == shipped[x].itemUin[i]) {
                shipped[x].itemUin[i] = shipped[x].itemUin[
                    shipped[x].itemUin.length - 1
                ];
                shipped[x].itemUin.pop();
                break;
            }
        }
    }

    enum State {
        SProducedByManufacturer, //0
        SForSaleByManufacturer, //1
        SShippedByManufacturer, //2
        SReceivedByDistributor, //3
        SForSaleByDistributor, //4
        SShippedByDistributor, //5
        SReceivedByRetailer, //6
        SForSaleByRetailer, //7
        SShippedByRetailer, //8
        SReceivedByCustomer, //9
        SCollectibleForSaleByCustomer, //10
        SShippedByCustomer, //11
        SReceivedCollectibleByCustomer //12
    }

    State constant defaultState = State.SProducedByManufacturer;

    struct totalItems {
        uint256 count;
        uint256[] itemUin;
    }

    struct Item {
        uint256 uin;
        string productName;
        string productType;
        string productDescription;
        address payable manufacturerId;
        address payable CurrentOwner;
        address payable ShipTo;
        uint256 productDate;
        bool collectible;
        bool composite;
        bool visibility;
        uint256 weight;
        uint256 productPrice;
        uint256 productHash;
        State productState;
    }

    //Events

    event EProducedByManufacturer(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller
    );
    event EForSaleByManufacturer(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        uint256 price
    );
    event EShippedByManufacturer(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        address indexed receiver
    );
    event EReceivedByDistributor(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller
    );
    event EForSaleByDistributor(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        uint256 price
    );
    event EShippedByDistributor(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        address indexed receiver
    );
    event EReceivedByRetailer(
        uint256 indexed uin,
        uint256 timeStamp,
        address caller
    );

    event EForSaleByRetailer(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        uint256 price
    );

    event EShippedByRetailer(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        address indexed receiver
    );

    event EReceivedByCustomer(
        uint256 indexed uin,
        uint256 timeStamp,
        address caller
    );

    event ECollectibleForSaleByCustomer(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        uint256 price
    );

    event EShippedtheCollectibleByCustomer(
        uint256 indexed uin,
        uint256 timeStamp,
        address indexed caller,
        address indexed receiver
    );

    event EReceivedCollectibleByCustomer(
        uint256 indexed uin,
        uint256 timeStamp,
        address caller
    );

    //Is Amount Equal
    modifier paidEnough(uint256 _price) {
        require(msg.value >= _price);
        _;
    }

    //Return Extra value
    modifier checkValue(uint256 _upc, address payable addressToFund) {
        uint256 _price = items[_upc].productPrice;
        uint256 amountToReturn = msg.value - _price;
        addressToFund.transfer(amountToReturn);
        _;
    }

    //Item State Modifiers
    modifier MProducedByManufacturer(uint256 _uin) {
        require(items[_uin].productState == State.SProducedByManufacturer);
        _;
    }

    modifier MForSaleByManufacturer(uint256 _uin) {
        require(items[_uin].productState == State.SForSaleByManufacturer);
        _;
    }

    modifier MReceivedByDistributor(uint256 _uin) {
        require(items[_uin].productState == State.SReceivedByDistributor);
        _;
    }

    modifier MShippedByManufacturer(uint256 _uin) {
        require(items[_uin].productState == State.SShippedByManufacturer);
        _;
    }

    modifier MForSaleByDistributor(uint256 _uin) {
        require(items[_uin].productState == State.SForSaleByDistributor);
        _;
    }

    modifier MShippedByDistributor(uint256 _uin) {
        require(items[_uin].productState == State.SShippedByDistributor);
        _;
    }

    modifier MReceivedByRetailer(uint256 _uin) {
        require(items[_uin].productState == State.SReceivedByRetailer);
        _;
    }

    modifier MForSaleByRetailer(uint256 _uin) {
        require(items[_uin].productState == State.SForSaleByRetailer);
        _;
    }

    modifier MShippedByRetailer(uint256 _uin) {
        require(items[_uin].productState == State.SShippedByRetailer);
        _;
    }

    modifier MReceivedByCustomer(uint256 _uin) {
        require(items[_uin].productState == State.SReceivedByCustomer);
        _;
    }

    modifier MCollectibleForSaleByCustomer(uint256 _uin) {
        require(
            items[_uin].productState == State.SCollectibleForSaleByCustomer
        );
        _;
    }

    modifier MShippedCollectibleByCustomer(uint256 _uin) {
        require(items[_uin].productState == State.SShippedByCustomer);
        _;
    }

    modifier MReceivedCollectibleByCustomer(uint256 _uin) {
        require(
            items[_uin].productState == State.SReceivedCollectibleByCustomer
        );
        _;
    }

    modifier MisCollectible(uint256 _uin) {
        require(items[_uin].collectible == true);
        _;
    }

    modifier MVerifyCaller(uint256 _uin) {
        require(
            items[_uin].productHash ==
                uint256(
                    keccak256(
                        abi.encodePacked(
                            _uin,
                            items[_uin].CurrentOwner,
                            msg.sender,
                            items[_uin].productName
                        )
                    )
                )
        );
        _;
    }

    function getEntity() public view returns (uint256) {
        if (isManufacturer(msg.sender)) {
            return 1;
        } else if (isDistributor(msg.sender)) {
            return 2;
        } else if (isRetailer(msg.sender)) {
            return 3;
        } else if (isConsumer(msg.sender)) {
            return 4;
        } else {
            return 5;
        }
    }

    // Step1
    function producebymanufacturer(
        string memory _ProductName,
        string memory _ProductDesc,
        string memory _ProductType,
        bool _collectible,
        uint256 weight
    ) public onlyManufacturer(msg.sender) returns (uint256) {
        uint256 uin = randMod();
        address payable manufacturer = payable(msg.sender);
        items[uin] = Item(
            uin,
            _ProductName,
            _ProductType,
            _ProductDesc,
            manufacturer,
            manufacturer,
            payable(address(0)),
            block.timestamp,
            _collectible,
            false,
            false,
            weight,
            0,
            0,
            defaultState
        );
        ownership[manufacturer].count++;
        ownership[manufacturer].itemUin.push(uin);
        emit EProducedByManufacturer(uin, block.timestamp, msg.sender);
        return (uin);
    }

    //Step2
    function forsalebymanufacturer(uint256 uin, uint256 price)
        public
        onlyManufacturer(msg.sender)
        MProducedByManufacturer(uin)
    {
        items[uin].visibility = true;
        items[uin].productState = State.SForSaleByManufacturer;
        items[uin].productPrice = price;
        emit EForSaleByManufacturer(uin, block.timestamp, msg.sender, price);
    }

    //Step3

    function shippedbymanufacturer(uint256 uin, address payable shipTo)
        public
        onlyManufacturer(msg.sender)
        onlyDistributor(shipTo)
        MForSaleByManufacturer(uin)
    {
        items[uin].productState = State.SShippedByManufacturer;
        items[uin].ShipTo = shipTo;
        shipped[shipTo].count++;
        shipped[shipTo].itemUin.push(uin);
        items[uin].productHash = uint256(
            keccak256(
                abi.encodePacked(
                    uin,
                    items[uin].CurrentOwner,
                    shipTo,
                    items[uin].productName
                )
            )
        );
        emit EShippedByManufacturer(uin, block.timestamp, msg.sender, shipTo);
    }

    //Step4

    function receivedbydistributor(uint256 uin)
        public
        payable
        onlyDistributor(msg.sender)
        paidEnough(items[uin].productPrice)
        MShippedByManufacturer(uin)
        MVerifyCaller(uin)
    //checkValue(items[uin].productPrice, payable(msg.sender))
    {
        items[uin].productState = State.SReceivedByDistributor;
        items[uin].visibility = false;
        items[uin].CurrentOwner.transfer(items[uin].productPrice);
        deleteItem(uin, items[uin].CurrentOwner);
        ownership[items[uin].CurrentOwner].count--;
        items[uin].CurrentOwner = payable(msg.sender);
        shipped[items[uin].CurrentOwner].count--;
        deleteItemshipped(uin, items[uin].CurrentOwner);
        items[uin].productPrice = 0;
        ownership[msg.sender].count++;
        ownership[msg.sender].itemUin.push(uin);
        emit EReceivedByDistributor(uin, block.timestamp, msg.sender);
    }

    //Step5
    function forsalebydistributor(uint256 uin, uint256 price)
        public
        onlyDistributor(msg.sender)
        MReceivedByDistributor(uin)
    {
        items[uin].visibility = true;
        items[uin].productState = State.SForSaleByDistributor;
        items[uin].productPrice = price;
        emit EForSaleByDistributor(uin, block.timestamp, msg.sender, price);
    }

    //Step6
    function shippedbydistributor(uint256 uin, address payable shipTo)
        public
        onlyDistributor(msg.sender)
        onlyRetailer(shipTo)
        MForSaleByDistributor(uin)
    {
        items[uin].productState = State.SShippedByDistributor;
        items[uin].ShipTo = shipTo;
        shipped[shipTo].count++;
        shipped[shipTo].itemUin.push(uin);
        items[uin].productHash = uint256(
            keccak256(
                abi.encodePacked(
                    uin,
                    items[uin].CurrentOwner,
                    shipTo,
                    items[uin].productName
                )
            )
        );
        emit EShippedByDistributor(uin, block.timestamp, msg.sender, shipTo);
    }

    //Step7
    function receivedbyretailer(uint256 uin)
        public
        payable
        onlyRetailer(msg.sender)
        paidEnough(items[uin].productPrice)
        MShippedByDistributor(uin)
        MVerifyCaller(uin)
    {
        items[uin].productState = State.SReceivedByRetailer;
        items[uin].visibility = false;
        items[uin].CurrentOwner.transfer(items[uin].productPrice);
        ownership[items[uin].CurrentOwner].count--;
        deleteItem(uin, items[uin].CurrentOwner);
        items[uin].CurrentOwner = payable(msg.sender);
        shipped[items[uin].CurrentOwner].count--;
        deleteItemshipped(uin, items[uin].CurrentOwner);
        items[uin].productPrice = 0;
        ownership[msg.sender].count++;
        ownership[msg.sender].itemUin.push(uin);
        emit EReceivedByRetailer(uin, block.timestamp, msg.sender);
    }

    //Step8
    function forsalebyretailer(uint256 uin, uint256 price)
        public
        onlyRetailer(msg.sender)
        MReceivedByRetailer(uin)
    {
        items[uin].productState = State.SForSaleByRetailer;
        items[uin].productPrice = price;
        emit EForSaleByRetailer(uin, block.timestamp, msg.sender, price);
    }

    //Step9
    function shippedbyretailer(uint256 uin, address payable shipTo)
        public
        onlyRetailer(msg.sender)
        onlyConsumer(shipTo)
        MForSaleByRetailer(uin)
    {
        items[uin].productState = State.SShippedByRetailer;
        items[uin].ShipTo = shipTo;
        shipped[shipTo].count++;
        shipped[shipTo].itemUin.push(uin);
        items[uin].productHash = uint256(
            keccak256(
                abi.encodePacked(
                    uin,
                    items[uin].CurrentOwner,
                    shipTo,
                    items[uin].productName
                )
            )
        );
        emit EShippedByRetailer(uin, block.timestamp, msg.sender, shipTo);
    }

    //Step10
    function receivedbycustomer(uint256 uin)
        public
        payable
        onlyConsumer(payable(msg.sender))
        paidEnough(items[uin].productPrice)
        MShippedByRetailer(uin)
        MVerifyCaller(uin)
    {
        items[uin].productState = State.SReceivedByCustomer;
        items[uin].visibility = false;
        items[uin].CurrentOwner.transfer(items[uin].productPrice);
        ownership[items[uin].CurrentOwner].count--;
        deleteItem(uin, items[uin].CurrentOwner);
        items[uin].CurrentOwner = payable(msg.sender);
        shipped[items[uin].CurrentOwner].count--;
        deleteItemshipped(uin, items[uin].CurrentOwner);
        items[uin].productPrice = 0;
        ownership[msg.sender].count++;
        ownership[msg.sender].itemUin.push(uin);
        emit EReceivedByCustomer(uin, block.timestamp, msg.sender);
    }

    //Step11
    function collectibleforsalebycustomer(uint256 uin, uint256 price)
        public
        onlyConsumer(payable(msg.sender))
        MReceivedByCustomer(uin)
        MisCollectible(uin)
    {
        items[uin].productState = State.SCollectibleForSaleByCustomer;
        items[uin].productPrice = price;
        items[uin].visibility = true;
        emit ECollectibleForSaleByCustomer(
            uin,
            block.timestamp,
            msg.sender,
            price
        );
    }

    //Step12
    function shippedcollectiblebycustomer(uint256 uin, address payable ShipTo)
        public
        onlyConsumer(payable(msg.sender))
        onlyConsumer(ShipTo)
        MCollectibleForSaleByCustomer(uin)
    {
        items[uin].productState = State.SShippedByCustomer;
        items[uin].ShipTo = ShipTo;
        shipped[ShipTo].count++;
        shipped[ShipTo].itemUin.push(uin);
        items[uin].productHash = uint256(
            keccak256(
                abi.encodePacked(
                    uin,
                    items[uin].CurrentOwner,
                    ShipTo,
                    items[uin].productName
                )
            )
        );
        emit EShippedtheCollectibleByCustomer(
            uin,
            block.timestamp,
            msg.sender,
            ShipTo
        );
    }

    //Step13

    function receivedcollectiblebycustomer(uint256 uin)
        public
        payable
        onlyConsumer(payable(msg.sender))
        MisCollectible(uin)
        paidEnough(items[uin].productPrice)
        MShippedCollectibleByCustomer(uin)
        MVerifyCaller(uin)
    {
        items[uin].productState = State.SReceivedCollectibleByCustomer;
        items[uin].visibility = false;
        items[uin].CurrentOwner.transfer(items[uin].productPrice);
        ownership[items[uin].CurrentOwner].count--;
        deleteItem(uin, items[uin].CurrentOwner);
        items[uin].CurrentOwner = payable(msg.sender);
        shipped[items[uin].CurrentOwner].count--;
        deleteItemshipped(uin, items[uin].CurrentOwner);
        items[uin].productPrice = 0;
        ownership[msg.sender].count++;
        ownership[msg.sender].itemUin.push(uin);
        emit EReceivedCollectibleByCustomer(uin, block.timestamp, msg.sender);
    }

    //Step 14
    // function productDetail(uint256 uin)
    //     public
    //     view
    //     returns (
    //         uint256,
    //         string memory,
    //         string memory,
    //         address,
    //         address,
    //         uint256,
    //         uint256
    //     )
    // {
    //     return (
    //         items[uin].uin,
    //         items[uin].productName,
    //         items[uin].productDescription,
    //         items[uin].manufacturerId,
    //         items[uin].CurrentOwner,
    //         items[uin].productDate,
    //         items[uin].productPrice
    //     );
    // }

    function productDetail(uint256 uin) public view returns (Item memory) {
        return (items[uin]);
    }

    function getOwnedProducts(address z) public view returns (Item[] memory) {
        Item[] memory item = new Item[](ownership[z].itemUin.length);
        for (uint256 i = 0; i < ownership[z].itemUin.length; i++) {
            Item storage x = items[ownership[z].itemUin[i]];
            item[i] = x;
        }
        return item;
    }

    function getShippedProducts(address z) public view returns (Item[] memory) {
        Item[] memory item = new Item[](shipped[z].itemUin.length);
        for (uint256 i = 0; i < shipped[z].itemUin.length; i++) {
            Item storage x = items[shipped[z].itemUin[i]];
            item[i] = x;
        }
        return item;
    }
}

//         uint256 uin
//         string productName;
//         string productDescription;
//         address manufacturerId;
//         address CurrentOwner;
//         uint256 productDate;
//         bool collectible;
//         bool composite;
//         uint weight;
//         uint productPrice;
//         byte32 productHash;
//         State productState;
