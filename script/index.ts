import * as dotenv from 'dotenv'

dotenv.config()

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
})

const dynamo = DynamoDBDocumentClient.from(client)

const TABLE_NAME = process.env.TABLE_NAME

const main = async () => {
    // Burger Kind column contains 'Chicken'
    const data = await dynamo.send(
        new ScanCommand({
            TableName: TABLE_NAME,
            FilterExpression: 'contains (burgerKind, :kind)',
            ExpressionAttributeValues: {
                ':kind': 'Chicken',
            },
        })
    )

    console.log('DynamoDB scan result:', data)
}

main()
