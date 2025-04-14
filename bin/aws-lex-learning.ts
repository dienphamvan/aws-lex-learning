#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { BotStack } from '../lib/BotStack'

const app = new cdk.App()

const botStack = new BotStack(app, 'LexBotStack')
