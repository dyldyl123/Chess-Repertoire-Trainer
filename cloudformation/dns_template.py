from base64 import b64encode

from troposphere import Template, Parameter, Ref, Sub, Output, Export
import troposphere.route53 as r53

t = Template()

##### Parameters
domain_name = t.add_parameter(
    Parameter(
        "DomainName",
        Type="String",
        Description="Route 53 Domain name",
    )
)

##### Resources
# Route 53 Hosted Zone
hosted_zone = t.add_resource(r53.HostedZone("HostedZone", Name=Ref(domain_name)))

##### Outputs
t.add_output(
    [
        Output(
            "ChessTrainerHostedZoneID",
            Value=Ref(hosted_zone),
            Description="Hosted Zone ID",
            Export=Export(Sub("${AWS::StackName}:HostedZoneID")),
        )
    ]
)

with open("template.yaml", "w") as fh:
    fh.write(t.to_yaml())
