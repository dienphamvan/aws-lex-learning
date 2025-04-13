import * as cdk from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'

export class DynamoStack extends cdk.Stack {
    public readonly orderTable: dynamodb.Table
    public readonly menuTable: dynamodb.Table

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        this.menuTable = new dynamodb.Table(this, 'Menu', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING,
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        })

        this.orderTable = new dynamodb.Table(this, 'Order', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING,
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        })
    }
}
