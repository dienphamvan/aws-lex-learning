import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const createSizeSlotType = (): CfnBot.SlotTypeProperty => {
    return {
        name: 'BuggerSizeType',
        slotTypeValues: [
            {
                sampleValue: {
                    value: 'Small',
                },
            },
            {
                sampleValue: {
                    value: 'Medium',
                },
            },
            {
                sampleValue: {
                    value: 'Large',
                },
            },
        ],
        valueSelectionSetting: {
            resolutionStrategy: 'ORIGINAL_VALUE',
        },
    }
}
