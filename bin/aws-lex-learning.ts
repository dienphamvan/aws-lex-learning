#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
// import { LambdaStack } from '../lib/LambdaStack'
import { LexStack } from '../lib/LexStack'
import { LambdaStack } from '../lib/LambdaStack'

const app = new cdk.App()
const lambdaStack = new LambdaStack(app, 'LambdaStack')
const lexStack = new LexStack(app, 'LexStack')
lexStack.addDependency(lambdaStack)
