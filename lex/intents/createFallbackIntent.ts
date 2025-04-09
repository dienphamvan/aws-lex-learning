import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const createFallbackIntent = (): CfnBot.IntentProperty => {
    return {
        name: 'FallbackIntent',
        description: 'Default intent when no other intent matches',
        parentIntentSignature: 'AMAZON.FallbackIntent',
    }
}
