"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var defaults_1 = require("./defaults");
var src_1 = require("../../../src");
describe('Moonbeam Chain', function () {
    it('getChainId', function () {
        chai_1.expect(src_1.Moonbeam.chainId).to.equal(1284);
    });
    it('getChainName', function () {
        chai_1.expect(src_1.Moonbeam.chainName).to.eq('Moonbeam');
    });
    it('isTestChain', function () {
        chai_1.expect(src_1.Moonbeam.isTestChain).to.be["false"];
    });
    it('isLocalChain', function () {
        chai_1.expect(src_1.Moonbeam.isLocalChain).to.be["false"];
    });
    it('getExplorerAddressLink', function () {
        chai_1.expect(src_1.Moonbeam.getExplorerAddressLink(defaults_1.TEST_ADDRESS)).to.eq("https://blockscout.moonbeam.network/address/" + defaults_1.TEST_ADDRESS + "/transactions");
    });
    it('getExplorerTransactionLink', function () {
        chai_1.expect(src_1.Moonbeam.getExplorerTransactionLink(defaults_1.TEST_TX)).to.eq("https://blockscout.moonbeam.network/tx/" + defaults_1.TEST_TX + "/internal-transactions");
    });
});
//# sourceMappingURL=moonbeam.test.js.map