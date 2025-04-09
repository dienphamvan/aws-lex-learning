import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const createGreetingIntent = (): CfnBot.IntentProperty => ({
    name: 'Greeting',
    sampleUtterances: [
        {
            utterance: 'Hello',
        },
        {
            utterance: 'Hi',
        },
        {
            utterance: 'Hi Bugger Order bot',
        },
    ],
    intentClosingSetting: {
        closingResponse: {
            messageGroupsList: [
                {
                    message: {
                        plainTextMessage: {
                            value: 'Hello, welcome to the Bugger Order Bot!',
                        },
                    },
                    variations: [
                        {
                            plainTextMessage: {
                                value: "Hi there! You've reached the Bugger Order Bot.",
                            },
                        },
                        {
                            plainTextMessage: {
                                value: "Welcome! I'm the Bugger Order Bot, here to help you.",
                            },
                        },
                    ],
                },
            ],
        },
    },
})
