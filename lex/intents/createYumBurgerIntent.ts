import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const YUM_BURGER_SLOT = 'YumBurgerSlot'

export const createYumBurgerIntent = ({
    slotTypeName,
    typesValue,
}: {
    slotTypeName: string
    typesValue: string[]
}): CfnBot.IntentProperty => {
    return {
        name: 'YumBurger',
        sampleUtterances: [
            {
                utterance: 'Yum Burger',
            },
            {
                utterance: 'yum burger',
            },
        ],

        slotPriorities: [
            {
                slotName: 'YumBurgerSlot',
                priority: 1,
            },
        ],

        slots: [
            {
                name: YUM_BURGER_SLOT,
                slotTypeName,
                valueElicitationSetting: {
                    slotConstraint: 'Required',
                    promptSpecification: {
                        maxRetries: 2,
                        messageGroupsList: [
                            {
                                message: {
                                    plainTextMessage: {
                                        value: `Which Yum Burger would you like (${typesValue.join(
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
                                value: `Would you like to order your {${YUM_BURGER_SLOT}}?`,
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
