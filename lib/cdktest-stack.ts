import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';


export class CdktestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      new s3.Bucket(this, 'MyBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,});
    
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2,
    });

    // Create an EC2 instance
    const ec2Instance = new ec2.Instance(this, 'MyEC2Instance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO), 
      machineImage: ec2.MachineImage.latestAmazonLinux(), 
      vpc: vpc, 
    });

    const ec2InstanceSecurityGroup = new ec2.SecurityGroup(this, 'EC2InstanceSecurityGroup', {
      vpc,
      description: 'Allow inbound SSH and HTTP traffic',
    });
    
    ec2Instance.addSecurityGroup(ec2InstanceSecurityGroup);
    
    ec2InstanceSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'SSH access');
    ec2InstanceSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'HTTP access');
  }
}
