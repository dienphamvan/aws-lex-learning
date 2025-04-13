import { CfnBot } from 'aws-cdk-lib/aws-lex'

enum BurgerSlot {
    BURGER_SIZE_SLOT = 'BurgerSizeSlot',
    BURGER_FRANCHISE_SLOT = 'BurgerFranchiseSlot',
    BURGER_KIND_SLOT = 'BurgerKindSlot',
}

export const createBurgerOrderIntent = ({
    sizeSlotTypeName,
    franchiseSlotTypeName,
    sizeTypes,
    franchiseTypes,
    kindSlotTypeName,
    kindTypes,
}: {
    sizeSlotTypeName: string
    sizeTypes: string[]
    franchiseSlotTypeName: string
    franchiseTypes: string[]
    kindSlotTypeName: string
    kindTypes: string[]
}): CfnBot.IntentProperty => {
    return {
        name: 'BurgerOrder',
        sampleUtterances: [
            {
                utterance: 'burger',
            },
            {
                utterance: `{${BurgerSlot.BURGER_SIZE_SLOT}} burger`,
            },
            {
                utterance: `{${BurgerSlot.BURGER_SIZE_SLOT}} {${BurgerSlot.BURGER_KIND_SLOT}} burger`,
            },
            {
                utterance: `{${BurgerSlot.BURGER_SIZE_SLOT}} {${BurgerSlot.BURGER_KIND_SLOT}} burger from {${BurgerSlot.BURGER_FRANCHISE_SLOT}}`,
            },
        ],

        slotPriorities: [
            {
                slotName: BurgerSlot.BURGER_SIZE_SLOT,
                priority: 1,
            },
            {
                slotName: BurgerSlot.BURGER_KIND_SLOT,
                priority: 2,
            },
            {
                slotName: BurgerSlot.BURGER_FRANCHISE_SLOT,
                priority: 3,
            },
        ],

        slots: [
            {
                name: BurgerSlot.BURGER_SIZE_SLOT,
                slotTypeName: sizeSlotTypeName,
                valueElicitationSetting: {
                    slotConstraint: 'Required',
                    promptSpecification: {
                        maxRetries: 2,
                        messageGroupsList: [
                            {
                                message: {
                                    plainTextMessage: {
                                        value: `What size of burger would you like? (${sizeTypes.join(
                                            ', '
                                        )})`,
                                    },
                                },
                            },
                        ],
                    },
                },
            },
            {
                name: BurgerSlot.BURGER_KIND_SLOT,
                slotTypeName: kindSlotTypeName,
                valueElicitationSetting: {
                    slotConstraint: 'Required',
                    promptSpecification: {
                        maxRetries: 2,
                        messageGroupsList: [
                            {
                                message: {
                                    plainTextMessage: {
                                        value: `What kind of burger would you like? (${kindTypes.join(
                                            ', '
                                        )})`,
                                    },
                                },
                            },
                        ],
                    },
                },
            },
            {
                name: BurgerSlot.BURGER_FRANCHISE_SLOT,
                slotTypeName: franchiseSlotTypeName,
                valueElicitationSetting: {
                    slotConstraint: 'Required',
                    promptSpecification: {
                        maxRetries: 2,
                        messageGroupsList: [
                            {
                                message: {
                                    plainTextMessage: {
                                        value: `What franchise of burger would you like? (${franchiseTypes.join(
                                            ', '
                                        )})`,
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        ],

        intentConfirmationSetting: {
            promptSpecification: {
                maxRetries: 2,
                messageGroupsList: [
                    {
                        message: {
                            plainTextMessage: {
                                value: `Would you like to order a {${BurgerSlot.BURGER_KIND_SLOT}} {${BurgerSlot.BURGER_SIZE_SLOT}} burger from {${BurgerSlot.BURGER_FRANCHISE_SLOT}}?`,
                            },
                        },
                    },
                ],
            },
            declinationResponse: {
                messageGroupsList: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'Ok, let me know if you need anything else.',
                            },
                        },
                    },
                ],
            },
        },

        intentClosingSetting: {
            closingResponse: {
                messageGroupsList: [
                    {
                        message: {
                            plainTextMessage: {
                                value: `Ok, you have ordered a {${BurgerSlot.BURGER_KIND_SLOT}} {${BurgerSlot.BURGER_SIZE_SLOT}} burger from {${BurgerSlot.BURGER_FRANCHISE_SLOT}}.`,
                            },
                        },
                    },
                ],
            },
        },

        dialogCodeHook: {
            enabled: true,
        },
    }
}
