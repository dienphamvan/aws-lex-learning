import { Construct } from 'constructs'
import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'

export class LambdaStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName(
                    'AWSLambda_FullAccess'
                ),
            ],
        })

        const lambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
            code: lambda.Code.fromAsset(
                path.join(__dirname, '../dist/validateInput')
            ),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            role: lambdaRole,
        })
    }
}
