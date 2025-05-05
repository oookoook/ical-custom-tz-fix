# ical-custom-tz-fix

Lambda to fix custom timezone produced by O365

You have to define several variables and secrets in the repository settings:

- `vars.STACK_NAME` - name of the cloudformation stack in AWS
- `vars.MAX_MEMORY` - maximum memory for the Lambda (number only, e.g. `128`)
- `vars.API_KEY` - key to secure the API endpoint. Authorization is disabled if blank
- `vars.REGION-` - WS region to deploy the function to, e.g. `eu-central-1`  
- `vars.AWS_ROLE_ARN` - AWS role to assume when authenticating to AWS using OIDC
- `secrets.AWS_ACCESS_KEY_ID` - legacy option, do not use if not necessary. Also you need to modify the `deploy.yml` file.
- `secrets.AWS_SECRET_ACCESS_KEY` - legacy option, do not use if not necessary. Also you need to modify the `deploy.yml` file.

Optionally, you can create `production` environment and add the variables to the environment.

The API URL is printed out in the GitHub action in the SAM Deploy step.

## Creating OIDC trust and role

For more information, read the [original docs](https://github.com/marketplace/actions/configure-aws-credentials-action-for-github-actions#oidc).

Create a CloudFormation stack using the `oidc-iam-role-cf-template.yml` file.

The role in the privided stackis restricted to the GitHub user/org, not for the repository. This way this role can be re-used by multiple repositories. Uncomment the lines if you wont to resrict the role to a single repository.

## Creating IAm policy

Create IAm-Policy for the AWS role that is used:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Statement1",
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "codepipeline:*",
        "codebuild:*",
        "s3:*",
        "lambda:*",
        "apigateway:*",
        "iam:PassRole",
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:TagRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:GetRole"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
```

## Creating the assumed role

Create a role of type Web Identintity, select `token.actions.githubusercontent.com` provider and proceed with the wizard. Add the policy created in the previous step.

Get the role ARN and create the variable in the repository settings.

## TODO

Automate the process - create the policy and assumed role also in the CF stack.
