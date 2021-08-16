# gh-actions-terraform

## What is this?

>A simple javascript wrapper for GitHub Actions to execute terraform commands

## How to run this?

>Create a workflow with this like any normal github action workflow.
A regular workflow will look like this : 
```
name: Test Terraform Actions

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master

jobs:
  action:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - name: tf-ensure
        uses: mainak90/terraform-actions-aws@master
        with:
          terraform_version: '0.12.20'
          command: 'ensure'

      - name: tf-init
        uses: mainak90/terraform-actions-aws@master
        with:
          terraform_version: '0.12.20'
          command: 'init'
```

## Supported Inputs
>The workflow supports the following inputs.

`terraform_version` The version of terraform to use while using this wrapper. It expects the terraform binary to be in "/usr/local/bin" and the binary to be named in format terraform**version-major**. If the binary is not installed please use the **ensure** action. *Required: True*

`command` The action to perform. The terraform actions supported are **init**, **plan**, **apply**, **destroy**. There is an additional action defined **ensure** that checks if you have the exact version of terraform provided as terraform version in workflow installed, or it will download and place the binary on **$PATH**. *Required: True*

`working-directory` The path(directories) to the terraform manifests. Should be a relative path w.r.t the root directory. By default set to **cwd** . *Required: False*

`bucket` The state bucket to use. Can be skipped if you want to maintain local state. *Required: False*

`stateprefix` The bucket key to use to store the state. Optional if you are using local state. *Required: False*

`varsfile` Use a terraform variable file if any. *Required: False*

`planfile` Use a custom name for a plan file. Default name **out.plan**. *Required: False*

`workspace` The workspace to use. Uses **default** workspace by default. *Required: False*

`aws_region` The AWS region to use AWS provisioning for. Default is **eu-west-1**. Use this to switch your region. *Required: False*

`aws_access_key_id` You can opt to use your access key id to provision the workflow or ensure you use a github runner that has appropriate IAM permissions to provision your infra. In the former case this is a mandatory parameter. To use this it is recommended to store this as your repo secret and use this as 
```
${{secrets.SECRET_NAME}}
```
in your workflow input. _Required: False_

`aws_secret_access_key` You can opt to use your secret access key to provision the workflow or ensure you use a github runner that has appropriate IAM permissions to provision your infra. In the former case this is a mandatory parameter. To use this it is recommended to store this as your repo secret and use this as 
```
${{secrets.SECRET_NAME}}
```
in your workflow input. _Required: False_

## Supported platforms
>For now this action only supports the **ubuntu-latest** runners owing to the fact that it is only acting as a wrapper for terraform operations. To provision this on a self-hosted runner you would need to hook this up with an Ubuntu based machine. 

To learn how to setup your self hosted runner please check the article [here](https://docs.github.com/en/actions/hosting-your-own-runners/adding-self-hosted-runners)

