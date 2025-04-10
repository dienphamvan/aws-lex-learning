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

        const sizeSlotType = createSizeSlotType()
        const bestBurgerType = createBestBurgerType()
        const palaceBurgerType = createPalaceBurgerType()
        const yumBurgerType = createYumBurgerType()
        const franchiseType = createFranchiseType()

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
                        sizeSlotType,
                        bestBurgerType,
                        palaceBurgerType,
                        yumBurgerType,
                        franchiseType,
                    ],
                    intents: [
                        createGreetingIntent(),
                        createBurgerOrderIntent({
                            slotTypeName: sizeSlotType.name,
                            sizeTypes: SIZE_SLOT_TYPE_VALUES,
                            franchiseTypes: FRANCHISE_TYPE,
                        }),
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
                        createFallbackIntent(),
                    ],
                },
            ],
        })
    }
}
