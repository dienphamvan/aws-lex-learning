import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const PALACE_BURGER_TYPE = [
    'Palace Plain',
    'Palace Cheese',
    'Palace Bacon',
]

export const createPalaceBurgerType = (): CfnBot.SlotTypeProperty => {
    return {
        name: 'PalaceBurgerType',
        slotTypeValues: PALACE_BURGER_TYPE.map((value) => ({
            sampleValue: {
                value,
            },
        })),
        valueSelectionSetting: {
            resolutionStrategy: 'ORIGINAL_VALUE',
        },
    }
}
