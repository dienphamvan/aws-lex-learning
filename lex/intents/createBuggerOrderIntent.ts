import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const createBuggerOrderIntent = ({
    slotTypeName,
    sizeTypes,
}: {
    slotTypeName: string
    sizeTypes: string[]
}): CfnBot.IntentProperty => {
    return {
        name: 'BuggerOrder',
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
                slotName: 'BuggerSizeSlot',
                priority: 1,
            },
        ],

        slots: [
            {
                name: 'BuggerSizeSlot',
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
                                value: 'Ok, you have ordered a {BuggerSizeSlot} burger. Where would you like to order from? (Best Bugger, Bugger Palace or Flamming Bugger)',
                            },
                        },
                    },
                ],
            },
        },
    }
}
