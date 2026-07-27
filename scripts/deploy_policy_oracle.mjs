import "dotenv/config";
import { buildClient, deployPolicyOracle } from "../sdk/policy-client.mjs";

async function main() {
  const client = buildClient();
  const deployed = await deployPolicyOracle(client);

  console.log("Deployment complete");
  console.log(JSON.stringify(deployed, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
