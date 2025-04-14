import { Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { RemovalPolicy } from 'aws-cdk-lib'

export class S3Construct extends Construct {
    public readonly bucket: s3.Bucket

    constructor(scope: Construct, id: string) {
        super(scope, id)

        this.bucket = new s3.Bucket(this, 'MyBucket', {
            bucketName: 'aws-lex-learning-data-lake-bucket',
            versioned: false,
            // For testing only
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        })
    }
}
