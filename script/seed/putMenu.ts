import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

export const putMenu = async ({
    dynamo,
}: {
    dynamo: DynamoDBDocumentClient
}) => {
    const res = await Promise.all([
        dynamo.send(
            new PutCommand({
                TableName: process.env.MENU_TABLE_NAME,
                Item: {
                    id: '1',
                    franchiseName: 'Best Burger',
                    burgerKind: ['Beef', 'Chicken'],
                },
            })
        ),
        dynamo.send(
            new PutCommand({
                TableName: process.env.MENU_TABLE_NAME,
                Item: {
                    id: '2',
                    franchiseName: 'Palace Burger',
                    burgerKind: ['Chicken', 'Fish', 'Vegetarian'],
                },
            })
        ),
        dynamo.send(
            new PutCommand({
                TableName: process.env.MENU_TABLE_NAME,
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
