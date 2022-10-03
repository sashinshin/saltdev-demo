const { Stack, Duration } = require('aws-cdk-lib');
const { RestApi } = require('aws-cdk-lib/aws-apigateway');
const { PolicyStatement, Effect } = require('aws-cdk-lib/aws-iam');
const { Runtime } = require('aws-cdk-lib/aws-lambda');
const { NodejsFunction } = require('aws-cdk-lib/aws-lambda-nodejs');
const { Bucket } = require('aws-cdk-lib/aws-s3');
const { CodePipeline, CodePipelineSource, ShellStep }  = require('aws-cdk-lib/pipelines');
const { join } = require('path');

// const sqs = require('aws-cdk-lib/aws-sqs');

class TestStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);



    new CodePipeline(this, 'SaltDevTestPipeline', {
      pipelineName: 'SaltDevTestPipeline',
      dockerEnabledForSynth: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('sashinshin/saltdev-demo', 'main'),
        commands: [
          'npm ci',
          'npx cdk synth',
        ],
      }),
    });

    const bucket = new Bucket(this, 'ResourceS3', {
      bucketName: "resource-bucket-2w1dasdadsa",
      publicReadAccess: true,
    });


    // const getImageLambda = new NodejsFunction(this, "AccessImageLambda", {
    //   description: "Lambda that access s3",
    //   handler: "handler",
    //   entry: join(__dirname, "../lambda/getImage/index.js"),
    //   runtime: Runtime.NODEJS_14_X,
    //   timeout: Duration.seconds(30),
    //   environment: {
    //     BUCKET_NAME: bucket.bucketName,
    //   },
    //   initialPolicy: [
    //     new PolicyStatement({
    //       effect: Effect.ALLOW,
    //       actions: ["s3:*"],
    //       resources: [`${bucket.bucketArn}/*`, bucket.bucketArn]
    //     }),
    //   ]
    // });

    const uploadImageLambda = new NodejsFunction(this, "UploadImageLambda", {
      description: "Lambda that access salt resources",
      handler: "handler",
      entry: join(__dirname, "../lambda/uploadImage/index.js"),
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(30),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["s3:*"],
          resources: [`${bucket.bucketArn}/*`, bucket.bucketArn]
        }),
      ]
    });

    const api = new RestApi(this, "saltdev");
    api.root
      .resourceForPath("resource")
      // .addMethod("GET")
      .addMethod("GET", new LambdaIntegration(getImageLambda))
      .addMethod("POST", new LambdaIntegration(uploadImageLambda))



  }
}

module.exports = { TestStack };
