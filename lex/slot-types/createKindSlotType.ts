import { CfnBot } from 'aws-cdk-lib/aws-lex'

export const KIND_TYPE = ['Beef', 'Chicken', 'Fish', 'Vegetarian', 'Vegan']

/*

'Best Burger': 'Beef', 'Chicken'
'Palace Burger': 'Chicken', 'Fish', 'Vegetarian'
 'Yum Burger': 'Vegetarian', 'Vegan'

*/

export const createKindSlotType = (): CfnBot.SlotTypeProperty => {
    return {
        name: 'BurgerKindType',
        slotTypeValues: KIND_TYPE.map((value) => ({
            sampleValue: {
                value,
            },
        })),
        valueSelectionSetting: {
            resolutionStrategy: 'ORIGINAL_VALUE',
        },
    }
}
