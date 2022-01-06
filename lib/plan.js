const core = require("@actions/core");
const util = require('util');
const path = require("path")
const exec = util.promisify(require('child_process').exec);
const tc = require('@actions/tool-cache');
const make_ws = require("./makews");

async function plan() {
    try {
        const version = core.getInput("terraform_version");
        let toolPath = tc.find("terraform", version);
        const aws_access_key_id = core.getInput("aws_access_key_id");
        const aws_secret_access_key = core.getInput("aws_secret_access_key")
        const region = core.getInput("aws_region");
        process.env['AWS_DEFAULT_REGION'] = `${region}`;
        addEnvVars(aws_access_key_id, aws_secret_access_key)
        const plancmd = makePlanCmd(core.getInput("varsfile"), core.getInput("planfile"), core.getInput("target"));
        const execfile = `${toolPath}/terraform`
        core.info(`Changing directories to working directory`)
        process.chdir(path.join(process.cwd(), core.getInput("working-directory")))
        await make_ws(core.getInput("create-workspace"), core.getInput("workspace"), execfile)
        core.startGroup(`Terraform Apply`);
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

function makePlanCmd(varsfile, planfile, target) {
    let plan = [`plan`];

    if (varsfile != "") {
        plan = plan.concat([`-var-file`, `${varsfile}`])
    }

    if (target != "") {
        plan = plan.concat([`-target`, `${target}`]);
    }

    plan = plan.concat([`-out`, `${planfile}`]);

    return plan;
}

module.exports = plan;
