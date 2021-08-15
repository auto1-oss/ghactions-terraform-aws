const core = require("@actions/core");
const tc = require('@actions/tool-cache');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

//Terraform_version==major.minor.patch

async function ensure() {
    try{
        const version = core.getInput("terraform_version");
        const versionsSet = version.split(".");
        const majorVer = (versionsSet[0] = "0") ? versionsSet[1] : versionsSet[0];
        const installpath = `/usr/local/bin/terraform${majorVer}`;
        if (fs.existsSync(installpath)) {
            core.info(`File exists at ${installpath}`);
        } else {
            core.info(`File does not exist at ${installpath}`);
            const downloadurl = `https://releases.hashicorp.com/terraform/${version}/terraform_${version}_linux_amd64.zip`;
            core.info(`Downloading Terraform CLI from ${downloadurl}`);
            const pathToCLIZip = await tc.downloadTool(downloadurl);
            core.info('Extracting Terraform CLI zip file');
            const pathToCLI = await tc.extractZip(pathToCLIZip, "/tmp");
            core.info(`Terraform CLI path is ${pathToCLI}.`);
            if (!pathToCLIZip || !pathToCLI) {
                throw new Error(`Unable to download Terraform from ${downloadurl}`);
            }
            core.info(`Copying and changing file permissions at ${installpath}`);
            const { stdout, stderr } = await exec(`mv /tmp/terraform ${installpath} && chmod 777 ${installpath}`);
            core.info(`stdout: ${stdout}`);
            core.info(`stderr:, ${stderr}`);
            core.info(`File permissions changed!`);
        }
    } catch (err) {
        core.error(err);
        throw err;
    }

}

module.exports = ensure;