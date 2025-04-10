import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const PALACE_BURGER_SLOT = 'PalaceBurgerSlot'

export const createPalaceBurgerIntent = ({
    slotTypeName,
    typesValue,
}: {
    slotTypeName: string
    typesValue: string[]
}): CfnBot.IntentProperty => {
    return {
        name: 'PalaceBurger',
        sampleUtterances: [
            {
                utterance: 'Palace Burger',
            },
            {
                utterance: 'palace burger',
            },
        ],

        slotPriorities: [
            {
                slotName: 'PalaceBurgerSlot',
                priority: 1,
            },
        ],

        slots: [
            {
                name: PALACE_BURGER_SLOT,
                slotTypeName,
                valueElicitationSetting: {
                    slotConstraint: 'Required',
                    promptSpecification: {
                        maxRetries: 2,
                        messageGroupsList: [
                            {
                                message: {
                                    plainTextMessage: {
                                        value: `Which Palace Burger would you like (${typesValue.join(
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
                                value: `Would you like to order your {${PALACE_BURGER_SLOT}}?`,
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
                                value: 'Stay hungry!',
                            },
                        },
                    },
                ],
            },
            confirmationResponse: {
                messageGroupsList: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'Nice! I will place your order.',
                            },
                        },
                    },
                ],
            },
            failureResponse: {
                messageGroupsList: [
                    {
                        message: {
                            plainTextMessage: {
                                value: 'Sorry, I did not understand that.',
                            },
                        },
                    },
                ],
            },
        },
    }
}
