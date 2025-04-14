import * as dotenv from 'dotenv'

dotenv.config()

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { putMenu } from './seed/putMenu'

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
})

const dynamo = DynamoDBDocumentClient.from(client)

const main = async () => {
    await putMenu({
        dynamo,
    })

    console.log('Seed data inserted successfully')
}

main()
