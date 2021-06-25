import { IotaAnchoringChannel } from "../src/iotaAnchoringChannel";
import { IotaLdProofGenerator } from "../src/iotaLdProofGenerator";
import { IotaSigner } from "../src/iotaSigner";
import { IIotaLinkedDataProof } from "../src/models/IIotaLinkedDataProof";
import { LinkedDataProofTypes } from "../src/models/linkedDataProofTypes";

/*

{
  did: 'did:iota:EmsBSiBR7kjuYPLMHmZnyzmZY7t985t5BBsvK3Dbiw3d',
  keys: {
    public: 'DbKSCHm16ekaGpGEeaNToNUMX9WvwL4SH3ngziuYRqrz',
    private: 'TEBVMPPX91ZhtBZ8R8zBP6WZpVeAnrWMnknkSHThmYk'
  },
  transactionUrl:
  'https://explorer.iota.org/mainnet/message/470d3f43af2467169f4ff199f04e3d6ff84c1107fa9d1f340988b6e02a4a6b85'
}

*/

/**
 * Asserts a linked data proof
 * @param proof The proof
 * @param proofType The expected type of proof
 * @param did DID The expected DID
 * @param method Verification method
 *
 */
function assertProof(proof: IIotaLinkedDataProof, proofType: string, did: string, method: string) {
    expect(proof.created).toBeDefined();
    expect(proof.verificationMethod).toBe(`${did}`);
    expect(proof.type).toBe(proofType);
}

/**
 * Asserts the value of an IOTA Linked Data Proof
 *
 * @param proof The proof
 * @param channelID The expected channelID in the proof value
 * @param anchorageID The expected anchorageID in the proof value
 *
 */
function assertProofValue(proof: IIotaLinkedDataProof, channelID: string, anchorageID: string) {
    expect(proof.proofValue).toBeDefined();
    expect(proof.proofValue.channelID).toBe(channelID);
    expect(proof.proofValue.anchorageID).toBe(anchorageID);
}

describe("Generate Linked Data Proofs", () => {
    const node = "https://chrysalis-nodes.iota.org";

    const did = "did:iota:EmsBSiBR7kjuYPLMHmZnyzmZY7t985t5BBsvK3Dbiw3d";
    const method = "key";

    const privateKey = "TEBVMPPX91ZhtBZ8R8zBP6WZpVeAnrWMnknkSHThmYk";

    test("should generate a Linked Data Proof for the JSON-LD document", async () => {
        const document = {
            "@context": "https://schema.org",
            "type": "Organization",
            "name": "IOTA Foundation"
        };

        // Channel that will be used
        const channel = await IotaAnchoringChannel.create(node).bind();
        // Signer that will be used
        const signer = await IotaSigner.create(node, did);

        const generator = new IotaLdProofGenerator(channel, signer);

        const proof = await generator.buildForJsonLd(document, method,
            privateKey,
            channel.firstAnchorageID);

        assertProof(proof, LinkedDataProofTypes.IOTA_LD_PROOF_2021, did, method);
        assertProofValue(proof, channel.channelID, channel.firstAnchorageID);
    });

    test("should generate a Linked Data Proof for the JSON document", async () => {
        const document = {
            "property1": "value1",
            "property2": false
        };

        // Channel that will be used
        const channel = await IotaAnchoringChannel.create(node).bind();
        // Signer that will be used
        const signer = await IotaSigner.create(node, did);

        const generator = new IotaLdProofGenerator(channel, signer);

        const proof = await generator.buildForJson(document, method,
            privateKey,
            channel.firstAnchorageID);

        assertProof(proof, LinkedDataProofTypes.IOTA_LD_PROOF_2021, did, method);
        assertProofValue(proof, channel.channelID, channel.firstAnchorageID);
    });
});
