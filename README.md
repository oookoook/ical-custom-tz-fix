# ical-custom-tz-fix
Lambda to fix custom timezone produced by O365

IAm-Policy for the user to create the stack:

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
        "iam:DetachRolePolicy"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
```
