#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { AwsLexLearningStack } from '../lib/LexStack'

const app = new cdk.App()
const lexStack = new AwsLexLearningStack(app, 'AwsLexLearningStack')
