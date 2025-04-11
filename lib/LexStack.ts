import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lex from 'aws-cdk-lib/aws-lex'
import { Construct } from 'constructs'
import { createBestBurgerIntent } from '../lex/intents/createBestBurgerIntent'
import { createBurgerOrderIntent } from '../lex/intents/createBurgerOrderIntent'
import { createFallbackIntent } from '../lex/intents/createFallbackIntent'
import { createGreetingIntent } from '../lex/intents/createGreetingIntent'
import {
    BEST_BURGER_TYPE,
    createBestBurgerType,
} from '../lex/slot-types/createBestBurgerType'
import {
    createSizeSlotType,
    SIZE_TYPE as SIZE_SLOT_TYPE_VALUES,
} from '../lex/slot-types/createSizeSlotType'
import {
    createPalaceBurgerType,
    PALACE_BURGER_TYPE,
} from '../lex/slot-types/createPalaceBurgerType'
import {
    createYumBurgerType,
    YUM_BURGER_TYPE,
} from '../lex/slot-types/createYumBurgerType'
import { createPalaceBurgerIntent } from '../lex/intents/createPalaceBurgerIntent'
import { createYumBurgerIntent } from '../lex/intents/createYumBurgerIntent'
import {
    createFranchiseType,
    FRANCHISE_TYPE,
} from '../lex/slot-types/createFranchiseType'
import {
    createKindSlotType,
    KIND_TYPE,
} from '../lex/slot-types/createKindSlotType'

export class LexStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const lexRuntimeRole = new iam.Role(this, 'LexRuntimeRole', {
            assumedBy: new iam.ServicePrincipal('lexv2.amazonaws.com'),
            description: 'LexV2Bots Permission Runtime Role',
            inlinePolicies: {
                lexv2BotPolicy: new iam.PolicyDocument({
                    statements: [
                        new iam.PolicyStatement({
                            effect: iam.Effect.ALLOW,
                            actions: ['polly:SynthesizeSpeech'],
                            resources: ['*'],
                        }),
                    ],
                }),
            },
        })

        new cdk.CfnOutput(this, 'LexRuntimeRoleArn', {
            value: lexRuntimeRole.roleArn,
            description: 'The ARN of the Lex runtime role',
        })

        const bestBurgerType = createBestBurgerType()
        const palaceBurgerType = createPalaceBurgerType()
        const yumBurgerType = createYumBurgerType()
        const sizeSlotType = createSizeSlotType()
        const franchiseType = createFranchiseType()
        const kindType = createKindSlotType()

        const bot = new lex.CfnBot(this, 'MyLexBot', {
            name: 'MyLexBot',
            // roleArn:
            //     'arn:aws:iam::271225931225:role/aws-service-role/lexv2.amazonaws.com/AWSServiceRoleForLexV2Bots_AH6UVQSF728',
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
                        sizeSlotType,
                        franchiseType,
                        kindType,
                        /*
                        bestBurgerType,
                        palaceBurgerType,
                        yumBurgerType,
                        */
                    ],
                    intents: [
                        createBurgerOrderIntent({
                            sizeSlotTypeName: sizeSlotType.name,
                            sizeTypes: SIZE_SLOT_TYPE_VALUES,
                            franchiseTypes: FRANCHISE_TYPE,
                            franchiseSlotTypeName: franchiseType.name,
                            kindSlotTypeName: kindType.name,
                            kindTypes: KIND_TYPE,
                        }),
                        createFallbackIntent(),
                        /*
                        createGreetingIntent(),
                        createBestBurgerIntent({
                            slotTypeName: bestBurgerType.name,
                            typesValue: BEST_BURGER_TYPE,
                        }),
                        createPalaceBurgerIntent({
                            slotTypeName: palaceBurgerType.name,
                            typesValue: PALACE_BURGER_TYPE,
                        }),
                        createYumBurgerIntent({
                            slotTypeName: yumBurgerType.name,
                            typesValue: YUM_BURGER_TYPE,
                        }),
                        */
                    ],
                },
            ],
        })
    }
}
