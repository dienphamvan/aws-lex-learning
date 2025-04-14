import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import {
    DynamoDBDocumentClient,
    PutCommand,
    ScanCommand,
} from '@aws-sdk/lib-dynamodb'
import { LexV2Event, LexV2Result, LexV2Slot } from 'aws-lambda'

const dynamoClient = new DynamoDBClient({})
const s3Client = new S3Client({})

const dynamo = DynamoDBDocumentClient.from(dynamoClient)

const MENU_TABLE_NAME = process.env.MENU_TABLE_NAME
const ORDER_TABLE_NAME = process.env.ORDER_TABLE_NAME
const BUCKET_NAME = process.env.BUCKET_NAME || ''

enum BurgerSlot {
    BURGER_SIZE_SLOT = 'BurgerSizeSlot',
    BURGER_FRANCHISE_SLOT = 'BurgerFranchiseSlot',
    BURGER_KIND_SLOT = 'BurgerKindSlot',
}

const getAvailableFranchises = async (
    burgerKind: string
): Promise<string[]> => {
    const data = await dynamo.send(
        new ScanCommand({
            TableName: MENU_TABLE_NAME,
            FilterExpression: 'contains(burgerKind, :kind)',
            ExpressionAttributeValues: {
                ':kind': burgerKind,
            },
        })
    )

    return data.Items?.map((item) => item.franchiseName) as string[]
}

const saveOrder = async (data: {
    burgerSize?: string
    burgerFranchise?: string
    burgerKind?: string
}) => {
    const orderId = Math.floor(Math.random() * 1000000).toString()

    const order = await dynamo.send(
        new PutCommand({
            TableName: ORDER_TABLE_NAME,
            Item: {
                id: orderId,
                ...data,
            },
        })
    )

    console.log('Saved order:', JSON.stringify(order))

    const output = await s3Client.send(
        new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `orders/${orderId}.json`,
            Body: JSON.stringify({
                id: orderId,
                ...data,
            }),
        })
    )

    console.log('Saved order to S3:', JSON.stringify(output))
}

export const handler = async (event: LexV2Event): Promise<LexV2Result> => {
    try {
        console.log('Received event:', JSON.stringify(event))
        const slots = event.sessionState.intent.slots as Record<
            BurgerSlot,
            LexV2Slot | null
        >

        const nextElicitSlot =
            event?.proposedNextState?.dialogAction?.slotToElicit

        if (
            nextElicitSlot === BurgerSlot.BURGER_FRANCHISE_SLOT &&
            slots.BurgerKindSlot?.value?.interpretedValue
        ) {
            const franchises = await getAvailableFranchises(
                slots.BurgerKindSlot.value.interpretedValue
            )

            return {
                sessionState: {
                    dialogAction: {
                        type: 'ElicitSlot',
                        slotToElicit: BurgerSlot.BURGER_FRANCHISE_SLOT,
                    },
                    intent: {
                        name: event.sessionState.intent.name,
                        slots: event.sessionState.intent.slots,
                        state: 'InProgress',
                    },
                },
                messages: [
                    {
                        contentType: 'PlainText',
                        content: `What franchise of burger would you like? (${franchises.join(
                            ', '
                        )})`,
                    },
                ],
            }
        }

        if (event?.sessionState?.intent?.confirmationState === 'Confirmed') {
            const order = {
                burgerSize: slots.BurgerSizeSlot?.value?.interpretedValue,
                burgerFranchise:
                    slots.BurgerFranchiseSlot?.value?.interpretedValue,
                burgerKind: slots.BurgerKindSlot?.value?.interpretedValue,
            }

            console.log('Saving order:', order)
            await saveOrder(order)
        }

        return {
            sessionState: {
                dialogAction: {
                    type: 'Delegate',
                },
                intent: {
                    name: event.sessionState.intent.name,
                    slots: event.sessionState.intent.slots,
                    state: 'InProgress',
                },
            },
        }
    } catch (error) {
        console.error('Error processing event:', JSON.stringify(error))
        return {
            sessionState: {
                dialogAction: {
                    type: 'ElicitIntent',
                },
                intent: {
                    name: event.sessionState.intent.name,
                    state: 'Failed',
                },
            },
            messages: [
                {
                    contentType: 'PlainText',
                    content: 'Sorry, something went wrong. Please try again.',
                },
            ],
        }
    }
}
