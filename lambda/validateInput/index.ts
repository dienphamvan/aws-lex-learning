import { LexV2Event, LexV2Result } from 'aws-lambda'

export const handler = async (event: LexV2Event): Promise<LexV2Result> => {
    console.log('Received event:', JSON.stringify(event))

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
}
