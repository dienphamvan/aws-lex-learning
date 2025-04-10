import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const BEST_BURGER_TYPE = ['Best Plain', 'Best Cheese', 'Best Bacon']

export const createBestBurgerType = (): CfnBot.SlotTypeProperty => {
    return {
        name: 'BestBurgerType',
        slotTypeValues: BEST_BURGER_TYPE.map((value) => ({
            sampleValue: {
                value,
            },
        })),
        valueSelectionSetting: {
            resolutionStrategy: 'ORIGINAL_VALUE',
        },
    }
}
