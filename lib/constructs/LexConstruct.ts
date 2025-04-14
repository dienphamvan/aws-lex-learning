import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lex from 'aws-cdk-lib/aws-lex'
import { Construct } from 'constructs'
import { createBurgerOrderIntent } from '../../lex/intents/createBurgerOrderIntent'
import { createFallbackIntent } from '../../lex/intents/createFallbackIntent'
import {
    createFranchiseType,
    FRANCHISE_TYPE,
} from '../../lex/slot-types/createFranchiseType'
import {
    createKindSlotType,
    KIND_TYPE,
} from '../../lex/slot-types/createKindSlotType'
import {
    createSizeSlotType,
    SIZE_TYPE,
} from '../../lex/slot-types/createSizeSlotType'

type LexConstructProps = {
    readonly lambdaFunction: lambda.IFunction
}

export class LexConstruct extends Construct {
    public readonly lexBot: lex.CfnBot

    constructor(scope: Construct, id: string, props: LexConstructProps) {
        super(scope, id)

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

        const sizeSlotType = createSizeSlotType()
        const franchiseType = createFranchiseType()
        const kindType = createKindSlotType()

        this.lexBot = new lex.CfnBot(this, 'MyLexBot', {
            name: 'MyLexBot',
            roleArn: lexRuntimeRole.roleArn,
            dataPrivacy: {
                ChildDirected: false,
            },
            idleSessionTtlInSeconds: 300,
            autoBuildBotLocales: true,
            testBotAliasSettings: {
                botAliasLocaleSettings: [
                    {
                        localeId: 'en_US',
                        botAliasLocaleSetting: {
                            enabled: true,
                            codeHookSpecification: {
                                lambdaCodeHook: {
                                    lambdaArn: props.lambdaFunction.functionArn,
                                    codeHookInterfaceVersion: '1.0',
                                },
                            },
                        },
                    },
                ],
            },
            botLocales: [
                {
                    localeId: 'en_US',
                    nluConfidenceThreshold: 0.4,
                    voiceSettings: { voiceId: 'Joanna', engine: 'neural' },
                    slotTypes: [sizeSlotType, franchiseType, kindType],
                    intents: [
                        createBurgerOrderIntent({
                            sizeSlotTypeName: sizeSlotType.name,
                            sizeTypes: SIZE_TYPE,
                            franchiseTypes: FRANCHISE_TYPE,
                            franchiseSlotTypeName: franchiseType.name,
                            kindSlotTypeName: kindType.name,
                            kindTypes: KIND_TYPE,
                        }),
                        createFallbackIntent(),
                    ],
                },
            ],
        })
    }
}
