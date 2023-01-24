from base64 import b64encode

from troposphere import Template, Ref, Sub, Output, Parameter, GetAtt, ImportValue
import troposphere.cloudfront as cf
import troposphere.ec2 as ec2
import troposphere.rds as rds
import troposphere.route53 as r53
import troposphere.s3 as s3
import troposphere_dns_certificate.certificatemanager as acm
from awacs.aws import Allow, PolicyDocument, Principal, Statement
import awacs.s3 as as3


t = Template()

##### Parameters
dns_stack_name = t.add_parameter(
    Parameter(
        "DnsStackName", Type="String", Description="Stack name containing hosted zone"
    )
)

s3_bucket_name = t.add_parameter(
    Parameter(
        "S3BucketName",
        Type="String",
        Description="The name of the S3 bucket to use as the origin for the CloudFront distribution",
    )
)

domain_name = t.add_parameter(
    Parameter(
        "FrontendDomainName",
        Type="String",
        Description="Domain name for frontend static site",
    )
)

backend_subdomain = t.add_parameter(
    Parameter(
        "BackendSubdomain", Type="String", Description="Subdomain for backend site"
    )
)

vpc_cidr_block = t.add_parameter(
    Parameter("VPCCidrBlock", Type="String", Description="The CIDR block for the VPC")
)

subnet_cidr_block_1 = t.add_parameter(
    Parameter(
        "SubnetCidrBlock1",
        Type="String",
        Description="The CIDR block for the public subnet 1",
    )
)

subnet_cidr_block_2 = t.add_parameter(
    Parameter(
        "SubnetCidrBlock2",
        Type="String",
        Description="The CIDR block for the public subnet 2",
    )
)

ec2_image_id = t.add_parameter(
    Parameter(
        "EC2ImageId",
        Type="AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>",
        Description="The ImageId for the EC2 instance",
    )
)

# https://aws.amazon.com/ec2/instance-types/
ec2_instance_type = t.add_parameter(
    Parameter(
        "EC2InstanceType",
        Type="String",
        Description="The InstanceType for the EC2 instance",
    )
)

rds_master_username = t.add_parameter(
    Parameter(
        "RDSMasterUsername",
        Type="String",
        Description="The master username for the RDS database",
    )
)

rds_master_password = t.add_parameter(
    Parameter(
        "RDSMasterPassword",
        Type="String",
        Description="The master password for the RDS database",
        NoEcho=True,
    )
)

# https://aws.amazon.com/rds/instance-types/
rds_db_instance_class = t.add_parameter(
    Parameter(
        "RDSDBInstanceClass",
        Type="String",
        Description="The DBInstanceClass for the RDS instance",
    )
)

##### Resources

########## Frontend Site ##########
s3_bucket = t.add_resource(
    s3.Bucket(
        "S3Bucket",
        AccessControl="PublicRead",
        BucketName=Ref(s3_bucket_name),
        WebsiteConfiguration=s3.WebsiteConfiguration(
            ErrorDocument="404.html", IndexDocument="index.html"
        ),
    )
)
s3_bucket.DeletionPolicy = "Delete"

s3_bucket_policy = t.add_resource(
    s3.BucketPolicy(
        "S3BucketPolicy",
        Bucket=Ref(s3_bucket),
        PolicyDocument=PolicyDocument(
            Statement=[
                Statement(
                    Effect=Allow,
                    Action=[as3.GetObject],
                    Principal=Principal("*"),
                    Resource=Sub("${S3Bucket.Arn}/*"),
                )
            ]
        ),
    )
)

acm_certificate = t.add_resource(
    acm.Certificate(
        "AcmCertificate",
        DomainName=Ref(domain_name),
        DomainValidationOptions=[
            acm.DomainValidationOption(
                DomainName=Ref(domain_name),
                HostedZoneId=ImportValue(Sub("${DnsStackName}:HostedZoneID")),
            )
        ],
        SubjectAlternativeNames=[Sub("www.${FrontendDomainName}")],
        ValidationMethod="DNS",
        Region="us-east-1",
    )
)

cf_redirect_function = t.add_resource(
    cf.Function(
        "CfRedirectFunction",
        AutoPublish=True,
        FunctionCode=Sub(
            """
function handler(event) {
var request = event.request;
var uri = request.uri;
if (request.headers.host.value === "www.${FrontendDomainName}") {
    return {
        statusCode: 302,
        statusDescription: "Redirecting",
        headers: { "location": { "value": `https://${FrontendDomainName}${!uri}` } }
    };
}
return request;
}
        """
        ),
        FunctionConfig=cf.FunctionConfig(
            Comment=Sub("${FrontendDomainName} www subdomain redirect"),
            Runtime="cloudfront-js-1.0",
        ),
        Name=Sub("${AWS::StackName}_www_redirect"),
    )
)

cf_distribution = t.add_resource(
    cf.Distribution(
        "CfDistribution",
        DistributionConfig=cf.DistributionConfig(
            Aliases=[Ref(domain_name), Sub("www.${FrontendDomainName}")],
            Comment=Ref(domain_name),
            Origins=[
                cf.Origin(
                    Id="s3Origin",
                    DomainName=Sub(
                        "${FrontendDomainName}.s3-website-${AWS::Region}.amazonaws.com"
                    ),
                    CustomOriginConfig=cf.CustomOriginConfig(
                        OriginProtocolPolicy="http-only"
                    ),
                )
            ],
            DefaultCacheBehavior=cf.DefaultCacheBehavior(
                FunctionAssociations=[
                    cf.FunctionAssociation(
                        EventType="viewer-request",
                        FunctionARN=GetAtt(cf_redirect_function, "FunctionARN"),
                    )
                ],
                TargetOriginId="s3Origin",
                ForwardedValues=cf.ForwardedValues(QueryString=False),
                ViewerProtocolPolicy="redirect-to-https",
                CachePolicyId="658327ea-f89d-4fab-a63d-7e88639e58f6",
            ),
            Enabled=True,
            HttpVersion="http2",
            PriceClass="PriceClass_All",
            ViewerCertificate=cf.ViewerCertificate(
                AcmCertificateArn=Ref(acm_certificate),
                SslSupportMethod="sni-only",
                MinimumProtocolVersion="TLSv1.2_2021",
            ),
        ),
    )
)

r53_records = t.add_resource(
    r53.RecordSetGroup(
        "R53Record",
        HostedZoneId=ImportValue(Sub("${DnsStackName}:HostedZoneID")),
        RecordSets=[
            r53.RecordSet(
                Name=Ref(domain_name),
                Type="A",
                AliasTarget=r53.AliasTarget(
                    HostedZoneId="Z2FDTNDATAQYW2",
                    DNSName=GetAtt(cf_distribution, "DomainName"),
                ),
            ),
            r53.RecordSet(
                Name=Sub("www.${FrontendDomainName}"),
                Type="A",
                AliasTarget=r53.AliasTarget(
                    HostedZoneId="Z2FDTNDATAQYW2",
                    DNSName=GetAtt(cf_distribution, "DomainName"),
                ),
            ),
        ],
    )
)

########## Backend Site ##########
# VPC
vpc = t.add_resource(
    ec2.VPC(
        "MyVPC",
        CidrBlock=Ref(vpc_cidr_block),
        EnableDnsSupport=True,
        EnableDnsHostnames=True,
    )
)

# Public Subnet
public_subnet_1 = t.add_resource(
    ec2.Subnet(
        "MyPublicSubnet1",
        VpcId=Ref(vpc),
        CidrBlock=Ref(subnet_cidr_block_1),
        MapPublicIpOnLaunch=True,
        AvailabilityZone=Sub("${AWS::Region}a"),
    )
)

public_subnet_2 = t.add_resource(
    ec2.Subnet(
        "MyPublicSubnet2",
        VpcId=Ref(vpc),
        CidrBlock=Ref(subnet_cidr_block_2),
        MapPublicIpOnLaunch=True,
        AvailabilityZone=Sub("${AWS::Region}b"),
    )
)

# Internet Gateway
igw = t.add_resource(ec2.InternetGateway("MyInternetGateway"))

# Internet Gateway Attachment
igw_attachment = t.add_resource(
    ec2.VPCGatewayAttachment(
        "MyVPCGatewayAttachment", InternetGatewayId=Ref(igw), VpcId=Ref(vpc)
    )
)

# Route Table for Public Subnet
public_route_table = t.add_resource(
    ec2.RouteTable("MyPublicRouteTable", VpcId=Ref(vpc))
)

# Route for Public Subnet to Internet Gateway
public_route = t.add_resource(
    ec2.Route(
        "MyPublicRoute",
        RouteTableId=Ref(public_route_table),
        DestinationCidrBlock="0.0.0.0/0",
        GatewayId=Ref(igw),
    )
)

# EC2 Security Group
ec2_security_group = t.add_resource(
    ec2.SecurityGroup(
        "MyEC2SecurityGroup",
        GroupDescription="Allow HTTP traffic",
        VpcId=Ref(vpc),
        SecurityGroupIngress=[
            ec2.SecurityGroupRule(
                IpProtocol="tcp", FromPort="80", ToPort="80", CidrIp="0.0.0.0/0"
            )
        ],
    )
)

# EC2 Instance
ec2_instance = t.add_resource(
    ec2.Instance(
        "MyEC2Instance",
        ImageId=Ref(ec2_image_id),
        InstanceType=Ref(ec2_instance_type),
        SecurityGroupIds=[Ref(ec2_security_group)],
        SubnetId=Ref(public_subnet_1),
        UserData=b64encode(
            b"""#!/bin/bash
echo "Hello World"
"""
        ).decode("utf-8"),
    )
)

# RDS Security Group
rds_security_group = t.add_resource(
    ec2.SecurityGroup(
        "MyRDSSecurityGroup",
        GroupDescription="Allow inbound DB traffic",
        VpcId=Ref(vpc),
        SecurityGroupIngress=[
            ec2.SecurityGroupRule(
                IpProtocol="tcp",
                FromPort="5432",
                ToPort="5432",
                CidrIp=Ref(vpc_cidr_block),
            )
        ],
    )
)

rds_db_security_group = t.add_resource(
    rds.DBSecurityGroup(
        "MyRDSDBSecurityGroup",
        GroupDescription="Allow Postgres traffic",
        EC2VpcId=Ref(vpc),
        DBSecurityGroupIngress=[
            rds.Ingress(EC2SecurityGroupId=Ref(rds_security_group))
        ],
    )
)

# RDS Instance
rds_subnet_group = t.add_resource(
    rds.DBSubnetGroup(
        "MyRDSSubnetGroup",
        DBSubnetGroupDescription="RDS Subnet Group",
        SubnetIds=[Ref(public_subnet_1), Ref(public_subnet_2)],
    )
)

rds_instance = t.add_resource(
    rds.DBInstance(
        "MyRDSInstance",
        DBName="postgres",
        Engine="postgres",
        MasterUsername=Ref(rds_master_username),
        MasterUserPassword=Ref(rds_master_password),
        AllocatedStorage="20",
        DBInstanceClass=Ref(rds_db_instance_class),
        PubliclyAccessible=True,
        VPCSecurityGroups=[Ref(rds_security_group)],
        DBSubnetGroupName=Ref(rds_subnet_group),
    )
)

# Route53 Record
route53_record = t.add_resource(
    r53.RecordSetGroup(
        "MyRecordSet",
        HostedZoneId=ImportValue(Sub("${DnsStackName}:HostedZoneID")),
        RecordSets=[
            r53.RecordSet(
                Name=Sub("${BackendSubdomain}.${FrontendDomainName}"),
                Type="A",
                TTL="300",
                ResourceRecords=[GetAtt(ec2_instance, "PublicIp")],
            )
        ],
    )
)

##### Outputs
t.add_output(
    [
        Output(
            "EC2InstancePublicIP",
            Value=Ref(ec2_instance),
            Description="EC2 instance public IP",
        ),
        Output(
            "CloudFrontDistributionDomainName",
            Value=Ref(cf_distribution),
            Description="CloudFront distribution domain name",
        ),
        # Output("RDSEndpoint", Value=Ref(rds_instance), Description="RDS endpoint"),
    ]
)

with open("template.yaml", "w") as fh:
    fh.write(t.to_yaml())
