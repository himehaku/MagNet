output "environment" {
  description = "Configured deployment environment."
  value       = terraform_data.staging_environment.output.environment
}

output "service_names" {
  description = "Service names used by MagNet."
  value       = terraform_data.staging_environment.output.services
}

output "service_ports" {
  description = "Ports used by MagNet services."
  value       = terraform_data.staging_environment.output.ports
}