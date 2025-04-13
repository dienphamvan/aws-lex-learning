import { Construct } from 'constructs'
import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as path from 'path'

type LambdaStackProps = cdk.StackProps & {
    readonly orderTable: dynamodb.Table
    readonly menuTable: dynamodb.Table
}

export class LambdaStack extends cdk.Stack {
    public readonly lambdaFunction: lambda.Function

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props)

        this.lambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
            code: lambda.Code.fromAsset(
                path.join(__dirname, '../dist/validateInput')
            ),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
        })

        this.lambdaFunction.addPermission('LexInvokePermission', {
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

        this.lambdaFunction.addEnvironment(
            'TABLE_NAME',
            props.menuTable.tableName
        )

        props.orderTable.grantReadWriteData(this.lambdaFunction)
        props.menuTable.grantReadWriteData(this.lambdaFunction)
    }
}
