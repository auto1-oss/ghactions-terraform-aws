const core = require("@actions/core");
const util = require('util');
const path = require("path")
const exec = util.promisify(require('child_process').exec);

async function plan() {
    try {
        const version = core.getInput("terraform_version");
        const versionsSet = version.split(".");
        const majorVer = (versionsSet[0] = "0") ? versionsSet[1] : versionsSet[0];
        const aws_access_key_id = core.getInput("aws_access_key_id");
        const aws_secret_access_key = core.getInput("aws_secret_access_key")
        const region = core.getInput("aws_region");
        process.env['AWS_DEFAULT_REGION'] = `${region}`;
        addEnvVars(aws_access_key_id, aws_secret_access_key)
        const plancmd = makePlanCmd(core.getInput("varsfile"), core.getInput("planfile"));
        const workspaceargs = makeWorkspaceOrNot(core.getInput("create-workspace"), core.getInput("workspace"))
        const execfile = `terraform${majorVer}`
        core.info(`Changing directories to working directory`)
        process.chdir(path.join(process.cwd(), core.getInput("working-directory")))
        core.startGroup(`Terraform Apply`);
        core.info(`Starting terraform workspace switch with command ${execfile}`);
        await exec.exec(execfile, workspaceargs);
        core.info(`Starting terraform plan with command ${plancmd}`);
        await exec.exec(execfile, plancmd);
        core.endGroup();
    } catch (err) {
        core.error(err);
        throw err;
    }
}

function addEnvVars(aws_access_key_id, aws_secret_access_key) {
    if (aws_access_key_id != "acracadabra_id") {
        core.info(`**** IMPORTANT: Setting provided AWS Credentials ****`);
        process.env['AWS_ACCESS_KEY_ID'] = `${aws_access_key_id}`;
        process.env['AWS_SECRET_ACCESS_KEY'] = `${aws_secret_access_key}`;
    }
    core.info(`**** IMPORTANT: No AWS Credentials provided. To proceed with instance profile access ****`);
}

function makeWorkspaceOrNot(createworkspace, workspace) {
    if (createworkspace != "false") {
        return [`workspace`, `new`, `${workspace}`]
    }
    return [`workspace`, `select`, `${workspace}`]
}

function makePlanCmd(varsfile, planfile) {
    if (varsfile != "") {
        return [`plan`, `-var-file`, `${varsfile}`, `-out`, `${planfile}`]
    }
    return [`plan`, `-out`, `${planfile}`]
}

module.exports = plan;
