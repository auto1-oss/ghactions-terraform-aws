const core = require("@actions/core");
const exec = require("@actions/exec")

async function makews(createworkspace, workspace, execfile) {
    try {
        let stdout = '';
        let stderr = '';

        const options = {};
        options.listeners = {
            stdout: (data) => {
                stdout = data.toString();
            },
            stderr: (data) => {
                stderr = data.toString();
            }
        };
        options.cwd = './';
        await exec.exec(execfile, [`workspace`, `list`], options);

        if (createworkspace != "false") {
            if (matchExact(new RegExp(`^${workspace}$`, 'gm'), stdout)) {
                core.info(`workspace does not exists, creating as create-workspace param not set to false`)
                await exec.exec(execfile, [`workspace`, `new`, `${workspace}`]);
                return true
            }
        }

        if (matchExact(new RegExp(`\\* ${workspace}$`, 'gm'), stdout)) {
            core.info(`workspace already switched to ${workspace}`)
            return true
        }

        core.info(`workspace already exists, switching to workspace ${workspace}`)
        await exec.exec(execfile, [`workspace`, `select`, `${workspace}`]);
        return true
        
    } catch (err) {
        core.error(err);
        throw err;
    }
}

function matchExact(r, str) {
    var match = r.test(str)
    return match
}

module.exports = makews;