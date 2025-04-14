import * as lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import * as path from 'path'

export class LambdaConstruct extends Construct {
    public readonly lambdaFunction: lambda.Function

    constructor(scope: Construct, id: string) {
        super(scope, id)

        this.lambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
            code: lambda.Code.fromAsset(
                path.join(__dirname, '../../dist/validateInput')
            ),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
        })
    }
}
