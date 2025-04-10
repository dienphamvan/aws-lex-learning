import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const FRANCHISE_TYPE = ['Best Burger', 'Palace Burger', 'Yum Burger']

export const createFranchiseType = (): CfnBot.SlotTypeProperty => {
    return {
        name: 'FranchiseType',
        slotTypeValues: FRANCHISE_TYPE.map((value) => ({
            sampleValue: {
                value,
            },
        })),
        valueSelectionSetting: {
            resolutionStrategy: 'ORIGINAL_VALUE',
        },
    }
}
