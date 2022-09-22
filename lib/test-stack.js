const { Stack, Duration } = require('aws-cdk-lib');
const { RestApi } = require('aws-cdk-lib/aws-apigateway');
const { CodePipeline } = require('aws-cdk-lib/aws-events-targets');
const { PolicyStatement, Effect } = require('aws-cdk-lib/aws-iam');
const { Runtime } = require('aws-cdk-lib/aws-lambda');
const { NodejsFunction } = require('aws-cdk-lib/aws-lambda-nodejs');
const { Bucket } = require('aws-cdk-lib/aws-s3');
const { ShellStep, CodePipelineSource } = require('aws-cdk-lib/pipelines');
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

    new CodePipeline(this, 'PortfolioPipeline', {
      pipelineName: 'PortfolioPipeline',
      dockerEnabledForSynth: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('sashinshin/saltdev-demo', 'main'),
        commands: [
          'cd cdk',
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });

    const bucket = new Bucket(this, 'ResourceS3', {
      bucketName: "resource-bucket-2w1dasdadsa",
    })


    const lambda = new NodejsFunction(this, "AccessResourceLambda", {
      description: "Lambda that access salt resources",
      handler: "handler",
      entry: join(__dirname, "../lambda/lambda.js"),
      runtime: Runtime.NODEJS_14_X,
      timeout: Duration.seconds(30),
      environment: {
        RESOURCE_BUCKET_NAME: bucket.bucketName,
      },
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["s3:*"],
          resources: [`${bucket.bucketArn}/*`, bucket.bucketArn]
        }),
      ]
    })

    const api = new RestApi(this, "saltdev");
    api.root
      .resourceForPath("resource")
      .addMethod("GET")
      // .addMethod("GET", new LambdaIntegration(lambda))


  }
}

module.exports = { TestStack }
