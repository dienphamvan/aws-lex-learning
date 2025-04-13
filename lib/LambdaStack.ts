import { Construct } from 'constructs'
import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'

export class LambdaStack extends cdk.Stack {
    lambdaArn: string

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const lambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
            code: lambda.Code.fromAsset(
                path.join(__dirname, '../dist/validateInput')
            ),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
        })

        lambdaFunction.addPermission('LexInvokePermission', {
            principal: new iam.ServicePrincipal('lexv2.amazonaws.com'),
            action: 'lambda:InvokeFunction',
            sourceAccount: cdk.Stack.of(this).account,
            sourceArn: cdk.Arn.format(
                {
                    service: 'lex',
                    account: this.account,
                    region: this.region,
                    resource: 'bot-alias/*',
                },
                this
            ),
        })

        this.lambdaArn = lambdaFunction.functionArn
    }
}
