const core = require("@actions/core");
const tc = require('@actions/tool-cache');
const fs = require('fs');
const util = require('util');

async function ensure() {
    try {
        const version = core.getInput("terraform_version");
        let toolPath = tc.find("terraform", version);

        if (!toolPath) {
            const downloadurl = `https://releases.hashicorp.com/terraform/${version}/terraform_${version}_linux_amd64.zip`;
            core.info(`Downloading Terraform CLI from ${downloadurl}`);
            const pathToCLIZip = await tc.downloadTool(downloadurl);
            const pathToCLI = await tc.extractZip(pathToCLIZip);

            if (!pathToCLIZip || !pathToCLI) {
                throw new Error(`Unable to download Terraform from ${downloadurl}`);
            }
            toolPath = await tc.cacheDir(pathToCLI, "terraform", version);
        }
        else {
            core.info(`tf-${version} cache found at location ${toolPath}`)
        }
        core.addPath(toolPath);
    } catch (err) {
        core.error(err);
        throw err;
    }

}

module.exports = ensure;