import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const BURGER_SIZE_SLOT = 'BurgerSizeSlot'
export const BURGER_FRANCHISE_SLOT = 'BurgerFranchiseSlot'
export const BURGER_KIND_SLOT = 'BurgerKindSlot'

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
                utterance: `{${BURGER_SIZE_SLOT}} burger`,
            },
            {
                utterance: `{${BURGER_SIZE_SLOT}} {${BURGER_KIND_SLOT}} burger`,
            },
            {
                utterance: `{${BURGER_SIZE_SLOT}} {${BURGER_KIND_SLOT}} burger from {${BURGER_FRANCHISE_SLOT}}`,
            },
        ],

        slotPriorities: [
            {
                slotName: BURGER_SIZE_SLOT,
                priority: 1,
            },
            {
                slotName: BURGER_KIND_SLOT,
                priority: 2,
            },
            {
                slotName: BURGER_FRANCHISE_SLOT,
                priority: 3,
            },
        ],

        slots: [
            {
                name: BURGER_SIZE_SLOT,
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
                name: BURGER_KIND_SLOT,
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
                name: BURGER_FRANCHISE_SLOT,
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
                                value: `Would you like to order a {${BURGER_KIND_SLOT}} {${BURGER_SIZE_SLOT}} burger from {${BURGER_FRANCHISE_SLOT}}?`,
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
                                value: `Ok, you have ordered a {${BURGER_KIND_SLOT}} {${BURGER_SIZE_SLOT}} burger from {${BURGER_FRANCHISE_SLOT}}.`,
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
