import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const SIZE_TYPE = ['Small', 'Medium', 'Large']

export const createSizeSlotType = (): CfnBot.SlotTypeProperty => {
    return {
        name: 'BurgerSizeType',
        slotTypeValues: SIZE_TYPE.map((value) => ({
            sampleValue: {
                value,
            },
        })),
        valueSelectionSetting: {
            resolutionStrategy: 'ORIGINAL_VALUE',
        },
    }
}
