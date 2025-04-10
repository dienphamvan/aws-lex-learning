import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const BEST_BURGER_SLOT = 'BestBurgerSlot'

export const createBestBurgerIntent = ({
    slotTypeName,
    typesValue,
}: {
    slotTypeName: string
    typesValue: string[]
}): CfnBot.IntentProperty => {
    return {
        name: 'BestBurger',
        sampleUtterances: [
            {
                utterance: 'Best Burger',
            },
            {
                utterance: 'best burger',
            },
        ],

        slotPriorities: [
            {
                slotName: 'BestBurgerSlot',
                priority: 1,
            },
        ],

        slots: [
            {
                name: BEST_BURGER_SLOT,
                slotTypeName,
                valueElicitationSetting: {
                    slotConstraint: 'Required',
                    promptSpecification: {
                        maxRetries: 2,
                        messageGroupsList: [
                            {
                                message: {
                                    plainTextMessage: {
                                        value: `Which Best Burger would you like (${typesValue.join(
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
                                value: `Would you like to order your {${BEST_BURGER_SLOT}}?`,
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
