import { LexV2Event, LexV2Result, LexV2Slot } from 'aws-lambda'

enum BurgerSlot {
    BURGER_SIZE_SLOT = 'BurgerSizeSlot',
    BURGER_FRANCHISE_SLOT = 'BurgerFranchiseSlot',
    BURGER_KIND_SLOT = 'BurgerKindSlot',
}

const FRANCHISE_TYPE = ['Best Burger', 'Palace Burger']

export const handler = async (event: LexV2Event): Promise<LexV2Result> => {
    console.log('Received event:', JSON.stringify(event))
    const slots = event.sessionState.intent.slots as Record<
        BurgerSlot,
        LexV2Slot | null
    >

    const nextElicitSlot = event?.proposedNextState?.dialogAction?.slotToElicit

    if (nextElicitSlot === BurgerSlot.BURGER_FRANCHISE_SLOT) {
        // TODO: Check if there is requested burger on the menu

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
                    content: `What franchise of burger would you like? (${FRANCHISE_TYPE.join(
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
}
