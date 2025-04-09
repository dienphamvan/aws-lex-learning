import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const SLOT_TYPE_VALUES = [
    'Cheeseburger',
    'Veggie Burger',
    'Chicken Burger',
]

export const createBuggerTypeSlotType = (): CfnBot.SlotTypeProperty => {
    return {
        name: 'BuggerType',
        slotTypeValues: SLOT_TYPE_VALUES.map((value) => ({
            sampleValue: {
                value,
            },
        })),
        valueSelectionSetting: {
            resolutionStrategy: 'ORIGINAL_VALUE',
        },
    }
}
