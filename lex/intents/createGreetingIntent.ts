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
            utterance: 'Hi Burger Order bot',
        },
    ],
    intentClosingSetting: {
        closingResponse: {
            messageGroupsList: [
                {
                    message: {
                        plainTextMessage: {
                            value: 'Hello, welcome to the Burger Order Bot! Would you like to order a burger or a drink?',
                        },
                    },
                    variations: [
                        {
                            plainTextMessage: {
                                value: "Hi there! You've reached the Burger Order Bot. Would you like to order a burger or a drink?",
                            },
                        },
                        {
                            plainTextMessage: {
                                value: "Welcome! I'm the Burger Order Bot, here to help you. Would you like to order a burger or a drink?",
                            },
                        },
                    ],
                },
            ],
        },
    },
})
