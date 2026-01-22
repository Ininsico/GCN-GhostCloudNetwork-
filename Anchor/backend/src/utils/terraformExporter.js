/**
 * TF-ENGINE: TERRAFORM CONFIGURATION EXPORTER
 * Generates HCL (HashiCorp Configuration Language) for the current infrastructure state.
 */
class TerraformExporter {
    static generateClusterConfig(cluster) {
        return `
resource "anchor_cluster" "${cluster.name.replace(/\s+/g, '_')}" {
  name        = "${cluster.name}"
  provider    = "${cluster.provider}"
  region      = "${cluster.region}"
  type        = "${cluster.type}"
  endpoint    = "${cluster.endpoint}"
  auto_scale  = true
  
  config {
    max_connections = 10000
    ssl_enabled    = true
    ddos_protection = "high"
  }
}

output "endpoint" {
  value = anchor_cluster.${cluster.name.replace(/\s+/g, '_')}.endpoint
}
        `.trim();
    }
}

module.exports = TerraformExporter;
