# Execution Plan: Infrastructure Secure Deployment

> Scope: AWS IaC (OpenTofu), OIDC Authentication, GitHub Actions CD Pipeline, and Secrets Hardening

## 1. Objective
Establish a secure, automated, and low-cost deployment pipeline for the `cloud-resume-v2` web application using AWS services and OpenTofu (Infrastructure as Code).

---

## 2. Infrastructure Architecture (OpenTofu)

The infrastructure will be defined using OpenTofu files inside the `infra/` directory.

### S3 Storage (Private)
* **Configuration**: Private bucket with all public access blocked.
* **Encryption**: Enable Server-Side Encryption with S3-managed keys (SSE-S3) or KMS keys.
* **Versioning**: Enable bucket versioning for disaster recovery and rollback capability.
* **Bucket Policy**: Restrict access exclusively to the CloudFront distribution using Origin Access Control (OAC).

### CloudFront CDN (Delivery & Technical SEO)
* **Origin**: Point directly to the private S3 bucket using OAC.
* **Compression**: Enable **"Compress Objects Automatically"** to serve assets with Brotli/Gzip encoding (improving LCP/FID metrics).
* **Protocol support**: Enforce **HTTP/2 and HTTP/3** to enable connection multiplexing and minimize latency.
* **Protocol Policy**: Force redirection from HTTP to HTTPS (mandatory SEO ranking signal).
* **Default Root Object**: Set to `index.html`.
* **Edge Functions (Clean URLs)**: Deploy a lightweight **CloudFront Function** on viewer requests to rewrite sub-paths (e.g. `/projects` or `/education`) to `/index.html` internally. This prevents S3 from returning a SEO-damaging `404` status code and returns a clean `200 OK` index response instead.
* **Security Headers**: Inject security response headers (HSTS, X-Frame-Options, X-Content-Type-Options, CSP, and Referrer-Policy) at the edge.
* **Cache Control Optimization**: 
  * Hashed Assets (`/assets/*.js`, `/assets/*.css`, `/assets/*.svg`): Cache aggressively with `Cache-Control: max-age=31536000, immutable`.
  * Index/Metadata (`index.html`, `sitemap.xml`, `robots.txt`): Set `Cache-Control: max-age=0, must-revalidate` to avoid stale index versions.

### ACM & Route 53 (DNS/SSL)
* **SSL Certificate**: Request a free public certificate via ACM for the custom domain.
* **DNS Resolution**: Configure Route 53 A record (Alias) pointing to the CloudFront distribution.

---

## 3. CI/CD Deployment Security (GitHub Actions)

### AWS OIDC Role Federation
* **Mechanism**: Use AWS STS `AssumeRoleWithWebIdentity` with GitHub as the OpenID Connect identity provider.
* **IAM Trust Policy**: Limit authentication strictly to the owner (`randall-liao`) and the repository (`cloud-resume-v2`).
* **IAM Access Policy**: Scope permissions down to least-privilege (only writing to the website S3 bucket and creating CloudFront invalidations).

### Workflow Job Sequence
1. **Quality Job**: Compiles files, runs lints, tests, and validates distribution shape. Uploads the build directory as an action artifact.
2. **Deploy Job**: Runs only on push/merge to `main`. Downloads the artifact, configures AWS credentials via OIDC, syncs to S3, and invalidates CloudFront.

---

## 4. Verification Plan

* **Vulnerability Scanning**: Scan OpenTofu files with Trivy or tfsec prior to provisioning.
* **Static Assets**: Verify that `validate-dist.sh` runs successfully on the generated bundle.
* **Security Headers**: Test the live domain using security header validation tools (e.g., securityheaders.com) to verify HSTS and CSP headers.
