import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const YUM_BURGER_TYPE = ['Yum Plain', 'Yum Cheese', 'Yum Bacon']

export const createYumBurgerType = (): CfnBot.SlotTypeProperty => {
    return {
        name: 'YumBurgerType',
        slotTypeValues: YUM_BURGER_TYPE.map((value) => ({
            sampleValue: {
                value,
            },
        })),
        valueSelectionSetting: {
            resolutionStrategy: 'ORIGINAL_VALUE',
        },
    }
}
