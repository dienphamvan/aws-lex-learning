import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lex from 'aws-cdk-lib/aws-lex'
import * as iam from 'aws-cdk-lib/aws-iam'

export class AwsLexLearningStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const lexRuntimeRole = new iam.Role(this, 'LexRuntimeRole', {
            assumedBy: new iam.ServicePrincipal('lexv2.amazonaws.com'),
            description: 'LexV2Bots Permission Runtime Role',
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName(
                    'AmazonLexFullAccess'
                ),
            ],
        })

        const bot = new lex.CfnBot(this, 'MyLexBot', {
            name: 'MyLexBot',
            roleArn: lexRuntimeRole.roleArn,
            dataPrivacy: {
                ChildDirected: false,
            },
            idleSessionTtlInSeconds: 300,
            autoBuildBotLocales: true,
            botLocales: [
                {
                    localeId: 'en_US',
                    nluConfidenceThreshold: 0.4,
                    voiceSettings: { voiceId: 'Joanna', engine: 'neural' },
                    slotTypes: [
                        {
                            name: 'BuggerSizeType',
                            slotTypeValues: [
                                {
                                    sampleValue: {
                                        value: 'Small',
                                    },
                                },
                                {
                                    sampleValue: {
                                        value: 'Medium',
                                    },
                                },
                                {
                                    sampleValue: {
                                        value: 'Large',
                                    },
                                },
                            ],
                            valueSelectionSetting: {
                                resolutionStrategy: 'ORIGINAL_VALUE',
                            },
                        },
                    ],
                    intents: [
                        {
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
                        },
                        {
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
                                    slotTypeName: 'BuggerSizeType',
                                    valueElicitationSetting: {
                                        slotConstraint: 'Required',
                                        promptSpecification: {
                                            maxRetries: 2,
                                            messageGroupsList: [
                                                {
                                                    message: {
                                                        plainTextMessage: {
                                                            value: 'What size of burger would you like? (Small, Medium, Large)',
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
                        },
                        {
                            name: 'FallbackIntent',
                            description:
                                'Default intent when no other intent matches',
                            parentIntentSignature: 'AMAZON.FallbackIntent',
                        },
                    ],
                },
            ],
        })
    }
}
