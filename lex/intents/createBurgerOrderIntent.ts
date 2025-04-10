import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const BURGER_SIZE_SLOT = 'BurgerSizeSlot'

export const createBurgerOrderIntent = ({
    slotTypeName,
    sizeTypes,
    franchiseTypes,
}: {
    slotTypeName: string
    sizeTypes: string[]
    franchiseTypes: string[]
}): CfnBot.IntentProperty => {
    return {
        name: 'BurgerOrder',
        sampleUtterances: [
            {
                utterance: "I'd like to order a burger",
            },
            {
                utterance: 'Can I get a burger',
            },
            {
                utterance: 'Let me have a burger',
            },
            {
                utterance: 'burger',
            },

            {
                utterance: 'Burger',
            },
        ],
        initialResponseSetting: {
            initialResponse: {
                messageGroupsList: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'Sure! I can help you with that.',
                            },
                        },
                    },
                ],
            },
        },

        slotPriorities: [
            {
                slotName: BURGER_SIZE_SLOT,
                priority: 1,
            },
        ],

        slots: [
            {
                name: BURGER_SIZE_SLOT,
                slotTypeName,
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
        ],

        intentClosingSetting: {
            closingResponse: {
                messageGroupsList: [
                    {
                        message: {
                            plainTextMessage: {
                                value: `Ok, you have ordered a ${BURGER_SIZE_SLOT} burger. Where would you like to order from? (${franchiseTypes.join(
                                    ', '
                                )})`,
                            },
                        },
                    },
                ],
            },
        },
    }
}
