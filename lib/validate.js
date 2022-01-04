const core = require("@actions/core");
const path = require("path")
const exec = require("@actions/exec")
const tc   = require('@actions/tool-cache');

async function validate() {
    try {
        const version = core.getInput("terraform_version");
        let toolPath = tc.find("terraform", version);
        const region = core.getInput("aws_region");
        process.env['AWS_DEFAULT_REGION'] = `${region}`;
        core.info(`Changing directories to working directory`);
        process.chdir(path.join(process.cwd(), core.getInput("working-directory")));
        core.info(`Starting terraform validate`);
        const execfile = `${toolPath}/terraform`
        core.startGroup(`Terraform Validate`);
        await exec.exec(execfile, [`validate`]);
        core.endGroup();
    } catch (err) {
        core.error(err);
        throw err;
    }
}

module.exports = validate;