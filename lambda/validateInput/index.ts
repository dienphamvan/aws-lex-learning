import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { LexV2Event, LexV2Result, LexV2Slot } from 'aws-lambda'

const client = new DynamoDBClient({})

const dynamo = DynamoDBDocumentClient.from(client)

const TABLE_NAME = process.env.TABLE_NAME

enum BurgerSlot {
    BURGER_SIZE_SLOT = 'BurgerSizeSlot',
    BURGER_FRANCHISE_SLOT = 'BurgerFranchiseSlot',
    BURGER_KIND_SLOT = 'BurgerKindSlot',
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
            const data = await dynamo.send(
                new ScanCommand({
                    TableName: TABLE_NAME,
                    FilterExpression: 'contains(burgerKind, :kind)',
                    ExpressionAttributeValues: {
                        ':kind': slots.BurgerKindSlot?.value?.interpretedValue,
                    },
                })
            )

            const franchises = data.Items?.map(
                (item) => item.franchiseName
            ) as string[]

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
