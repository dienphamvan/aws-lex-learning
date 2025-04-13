#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { LexStack } from '../lib/LexStack'
import { LambdaStack } from '../lib/LambdaStack'
import { DynamoStack } from '../lib/DynamoStack'

const app = new cdk.App()

const dynamoStack = new DynamoStack(app, 'DynamoStack')
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
    orderTable: dynamoStack.orderTable,
    menuTable: dynamoStack.menuTable,
})
const lexStack = new LexStack(app, 'LexStack', {
    lambdaFunction: lambdaStack.lambdaFunction,
})

lambdaStack.addDependency(dynamoStack)
lexStack.addDependency(lambdaStack)
