import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lex from 'aws-cdk-lib/aws-lex'
import * as iam from 'aws-cdk-lib/aws-iam'
import { createGreetingIntent } from '../lex/intents/createGreetingIntent'
import { createBuggerOrderIntent } from '../lex/intents/createBuggerOrderIntent'
import { createFallbackIntent } from '../lex/intents/createFallbackIntent'
import { createSizeSlotType } from '../lex/slot-types/createSizeSlotType'
import {
    createBuggerTypeSlotType,
    SLOT_TYPE_VALUES,
} from '../lex/slot-types/createBuggerTypeSlotType'

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

        const buggerTypeSlotType = createBuggerTypeSlotType()
        const sizeSlotType = createSizeSlotType()

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
                    slotTypes: [sizeSlotType, buggerTypeSlotType],
                    intents: [
                        createGreetingIntent(),
                        createBuggerOrderIntent({
                            slotTypeName: sizeSlotType.name,
                            sizeTypes: SLOT_TYPE_VALUES,
                        }),
                        createFallbackIntent(),
                    ],
                },
            ],
        })
    }
}
