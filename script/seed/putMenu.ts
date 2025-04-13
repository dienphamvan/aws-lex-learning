import * as dotenv from 'dotenv'

dotenv.config()

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
})

const dynamo = DynamoDBDocumentClient.from(client)

const main = async () => {
    /*

    'Best Burger': 'Beef', 'Chicken'
    'Palace Burger': 'Chicken', 'Fish', 'Vegetarian'
    'Yum Burger': 'Vegetarian', 'Vegan'

    */

    const res = await Promise.all([
        dynamo.send(
            new PutCommand({
                TableName: process.env.TABLE_NAME,
                Item: {
                    id: '1',
                    franchiseName: 'Best Burger',
                    burgerKind: ['Beef', 'Chicken'],
                },
            })
        ),
        dynamo.send(
            new PutCommand({
                TableName: process.env.TABLE_NAME,
                Item: {
                    id: '2',
                    franchiseName: 'Palace Burger',
                    burgerKind: ['Chicken', 'Fish', 'Vegetarian'],
                },
            })
        ),
        dynamo.send(
            new PutCommand({
                TableName: process.env.TABLE_NAME,
                Item: {
                    id: '3',
                    franchiseName: 'Yum Burger',
                    burgerKind: ['Vegetarian', 'Vegan'],
                },
            })
        ),
    ])

    console.log('DynamoDB put result:', JSON.stringify(res))
}

main()
