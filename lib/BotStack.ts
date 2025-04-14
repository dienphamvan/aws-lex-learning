import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'
import { DynamoConstruct } from './constructs/DynamoConstruct'
import { LambdaConstruct } from './constructs/LambdaConstruct'
import { LexConstruct } from './constructs/LexConstruct'
import { S3Construct } from './constructs/S3Construct'

type MainStackProps = cdk.StackProps

export class BotStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: MainStackProps) {
        super(scope, id, props)

        const { menuTable, orderTable } = new DynamoConstruct(
            this,
            'DynamoConstruct'
        )

        const { lambdaFunction } = new LambdaConstruct(this, 'LambdaConstruct')

        const { lexBot } = new LexConstruct(this, 'LexConstruct', {
            lambdaFunction,
        })

        const { bucket } = new S3Construct(this, 'S3Construct')

        lambdaFunction.addEnvironment('MENU_TABLE_NAME', menuTable.tableName)
        lambdaFunction.addEnvironment('ORDER_TABLE_NAME', orderTable.tableName)
        lambdaFunction.addEnvironment('BUCKET_NAME', bucket.bucketName)

        lambdaFunction.addPermission('LexInvokePermission', {
            principal: new iam.ServicePrincipal('lexv2.amazonaws.com'),
            action: 'lambda:InvokeFunction',
            sourceAccount: cdk.Stack.of(this).account,
            sourceArn: cdk.Arn.format(
                {
                    service: 'lex',
                    account: this.account,
                    region: this.region,
                    resource: `bot-alias/${lexBot.attrId}/*`,
                },
                this
            ),
        })
        bucket.grantReadWrite(lambdaFunction)
        orderTable.grantReadWriteData(lambdaFunction)
        menuTable.grantReadWriteData(lambdaFunction)
    }
}
