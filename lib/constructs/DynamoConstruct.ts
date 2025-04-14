import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'

export class DynamoConstruct extends Construct {
    public readonly orderTable: dynamodb.Table
    public readonly menuTable: dynamodb.Table

    constructor(scope: Construct, id: string) {
        super(scope, id)

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
