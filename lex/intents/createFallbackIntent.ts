import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const createFallbackIntent = (): CfnBot.IntentProperty => {
    return {
        name: 'FallbackIntent',
        parentIntentSignature: 'AMAZON.FallbackIntent',
        intentClosingSetting: {
            closingResponse: {
                messageGroupsList: [
                    {
                        message: {
                            plainTextMessage: {
                                value: "Sorry, I can't help you with that.",
                            },
                        },
                    },
                ],
            },
        },
    }
}
