# CI/CD Pipeline Documentation

Complete guide for Continuous Integration and Continuous Deployment workflows.

## Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Automated Testing](#automated-testing)
- [Code Quality Checks](#code-quality-checks)
- [Coverage Reports](#coverage-reports)
- [Deployment Automation](#deployment-automation)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## Overview

This project uses GitHub Actions for automated testing, code quality checks, and deployment. All workflows are located in `.github/workflows/`.

### Workflow Triggers

Workflows run automatically on:
- Push to `main` or `develop` branches
- All pull requests to `main` or `develop`
- Multiple Node.js versions (18.x, 20.x)

## GitHub Actions Workflows

### 1. Test and Coverage (`test.yml`)

**Purpose**: Run comprehensive tests with coverage reporting

**Triggers**:
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

**Jobs**:

#### Test Matrix
- Tests on Node.js 18.x and 20.x
- Runs Solhint code quality checks
- Compiles contracts
- Executes test suite
- Generates coverage reports
- Uploads to Codecov

#### Lint
- Solidity style checking
- Contract size verification

#### Build
- Contract compilation
- Artifact generation
- Artifact upload (7-day retention)

**Example Output**:
```
✓ Test on Node.js 18.x
✓ Test on Node.js 20.x
✓ Code Quality Checks
✓ Build and Compile
```

### 2. Continuous Integration (`ci.yml`)

**Purpose**: Complete CI pipeline with quality gates

**Triggers**:
- Push to `main`, `develop`, or `feature/*` branches
- Pull request events (opened, synchronized, reopened)

**Jobs**:

#### Quality Checks
- Solhint linting
- Contract compilation
- Contract size analysis

#### Test Matrix
- Cross-platform testing (Ubuntu, Windows)
- Multi-version Node.js (18.x, 20.x)
- Full test suite execution
- Coverage generation (Ubuntu + Node 20.x only)

#### Security Scan
- npm audit for vulnerabilities
- Dependency security checks

#### All Checks Passed
- Final validation gate
- Ensures all jobs succeeded

**Matrix Configuration**:
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18.x, 20.x]
```

### 3. Deployment (`deploy.yml`)

**Purpose**: Manual deployment to networks

**Trigger**: Manual workflow dispatch

**Inputs**:
- `network`: Target network (sepolia/localhost)
- `verify`: Enable Etherscan verification (boolean)

**Jobs**:

#### Deploy
- Install dependencies
- Compile contracts
- Deploy to selected network
- Optional Etherscan verification
- Upload deployment artifacts (30-day retention)
- Generate deployment summary

**Usage**:
1. Go to Actions tab
2. Select "Deploy to Sepolia"
3. Click "Run workflow"
4. Choose network and verification options
5. Click "Run workflow"

### 4. CodeQL Security Analysis (`codeql.yml`)

**Purpose**: Automated security vulnerability scanning

**Triggers**:
- Push to `main` or `develop`
- Pull requests to `main`
- Weekly schedule (Mondays at 00:00 UTC)

**Scans**:
- JavaScript/Node.js code
- Security vulnerabilities
- Code quality issues

## Automated Testing

### Test Execution

Tests run automatically on every push and pull request.

**Command**:
```bash
npm test
```

**What Gets Tested**:
- Contract deployment
- Function execution
- Access control
- Event emissions
- Edge cases
- Error handling

### Test Coverage

Coverage reports generated automatically on CI.

**Command**:
```bash
npm run coverage
```

**Coverage Targets**:
- Project: 80% minimum
- Patch: 80% minimum
- Threshold: 5%

**Coverage Files**:
- `coverage/` - Local coverage reports
- `coverage/coverage-final.json` - JSON report
- `coverage/lcov.info` - LCOV format

### Multi-Version Testing

Tests run on multiple Node.js versions:
- **Node.js 18.x**: LTS version
- **Node.js 20.x**: Latest stable

Ensures compatibility across environments.

## Code Quality Checks

### Solhint (Solidity Linter)

**Configuration**: `.solhint.json`

**Rules Enforced**:
- Code complexity: Maximum 10
- Compiler version: >= 0.8.0
- Function visibility
- Naming conventions
- Code style

**Run Locally**:
```bash
# Check code
npm run lint:sol

# Auto-fix issues
npm run lint:sol:fix
```

**Ignored Files**: See `.solhintignore`
- `artifacts/`
- `cache/`
- `node_modules/`
- `LocalFHE.sol`

### Contract Size Check

Monitors contract bytecode size to ensure deployment compatibility.

**Run Locally**:
```bash
npm run size
```

**Ethereum Limit**: 24KB (24,576 bytes)

### Prettier (Code Formatting)

**Configuration**: `.prettierrc.yml`

**Run Locally**:
```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

## Coverage Reports

### Codecov Integration

Coverage reports automatically uploaded to Codecov.

**Configuration**: `.codecov.yml`

**Features**:
- Pull request comments with coverage diff
- Status checks on PRs
- Coverage badges
- Historical trends

**Setup**:
1. Sign up at [codecov.io](https://codecov.io/)
2. Add repository
3. Add `CODECOV_TOKEN` to GitHub Secrets
4. Coverage uploads automatically

### Coverage Configuration

**File**: `.solcover.js`

**Excluded Files**:
- `LocalFHE.sol`
- Test files
- Mock contracts

**Settings**:
- Timeout: 100,000ms
- Mocha integration enabled

### Viewing Coverage

**On GitHub Actions**:
1. Go to Actions tab
2. Select workflow run
3. Check "Test" job logs
4. View coverage summary

**On Codecov**:
1. Visit codecov.io
2. View detailed reports
3. Check line-by-line coverage
4. Review trends over time

## Deployment Automation

### Manual Deployment Workflow

**Trigger**: Workflow Dispatch (Manual)

**Steps**:
1. Navigate to Actions > Deploy to Sepolia
2. Click "Run workflow"
3. Select options:
   - Network: sepolia or localhost
   - Verify: true or false
4. Monitor deployment progress
5. Check deployment summary

### Deployment Artifacts

Artifacts saved for 30 days:
- `deployments/*.json` - Network deployment data
- `contract-address.json` - Quick reference

**Download Artifacts**:
1. Go to workflow run
2. Scroll to "Artifacts" section
3. Download deployment files

### Deployment Secrets

Required GitHub Secrets:
- `SEPOLIA_RPC_URL` - Infura/Alchemy RPC endpoint
- `PRIVATE_KEY` - Deployer private key
- `ETHERSCAN_API_KEY` - For verification
- `CODECOV_TOKEN` - For coverage uploads

**Setting Secrets**:
1. Go to Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Add name and value
4. Save secret

## Configuration

### Required GitHub Secrets

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
CODECOV_TOKEN=your_codecov_token
```

### Branch Protection Rules

Recommended settings for `main` branch:

**Settings > Branches > Branch protection rules**:

- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - Test on Node.js 18.x
  - Test on Node.js 20.x
  - Code Quality Checks
  - Build and Compile
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging

### Workflow Permissions

**Settings > Actions > General**:

- Workflow permissions: Read and write permissions
- Allow GitHub Actions to create and approve pull requests: ✅

## Troubleshooting

### Common Issues

#### 1. Tests Failing in CI

**Symptoms**: Tests pass locally but fail in CI

**Solutions**:
- Check Node.js version compatibility
- Verify environment variables
- Review CI logs for specific errors
- Ensure dependencies are up to date

```bash
# Test with specific Node version locally
nvm use 18
npm test
```

#### 2. Coverage Upload Fails

**Symptoms**: "Error: Codecov token not found"

**Solutions**:
- Verify `CODECOV_TOKEN` secret exists
- Check token is valid on codecov.io
- Ensure token has correct permissions

#### 3. Solhint Errors

**Symptoms**: Linting fails on CI

**Solutions**:
```bash
# Run locally to see issues
npm run lint:sol

# Auto-fix if possible
npm run lint:sol:fix

# Check specific file
npx solhint contracts/YourContract.sol
```

#### 4. Contract Size Exceeds Limit

**Symptoms**: "Contract size exceeds 24KB"

**Solutions**:
- Enable optimizer in hardhat.config.js
- Split contract into libraries
- Remove unused code
- Use external libraries

#### 5. Deployment Fails

**Symptoms**: Deployment workflow fails

**Solutions**:
- Check all secrets are set correctly
- Verify private key format (no 0x prefix)
- Ensure sufficient balance for gas
- Check network RPC URL is valid

### Debug Workflow

**Enable Debug Logging**:

1. Go to Settings > Secrets
2. Add secret: `ACTIONS_STEP_DEBUG` = `true`
3. Re-run workflow
4. View detailed logs

### Checking Workflow Status

**CLI Method**:
```bash
gh run list
gh run view [run-id]
gh run watch
```

**Web Method**:
1. Go to repository > Actions
2. Select workflow
3. View run details
4. Check job logs

## Best Practices

### 1. Testing

- ✅ Write tests before pushing
- ✅ Maintain 80%+ coverage
- ✅ Test edge cases
- ✅ Mock external dependencies

### 2. Code Quality

- ✅ Run linter before committing
- ✅ Fix warnings, not just errors
- ✅ Follow naming conventions
- ✅ Document complex logic

### 3. Commits

- ✅ Small, focused commits
- ✅ Descriptive commit messages
- ✅ Reference issues when applicable
- ✅ Sign commits (optional)

### 4. Pull Requests

- ✅ Wait for CI to pass
- ✅ Request reviews
- ✅ Resolve conversations
- ✅ Keep PRs focused

### 5. Deployment

- ✅ Test on localhost first
- ✅ Deploy to testnet (Sepolia)
- ✅ Verify contracts
- ✅ Document deployed addresses

## Monitoring

### Workflow Status Badges

Add to README.md:

```markdown
![Test and Coverage](https://github.com/your-org/your-repo/workflows/Test%20and%20Coverage/badge.svg)
![CI](https://github.com/your-org/your-repo/workflows/Continuous%20Integration/badge.svg)
[![codecov](https://codecov.io/gh/your-org/your-repo/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/your-repo)
```

### Notifications

**Email Notifications**:
- Settings > Notifications
- Enable "Actions" notifications

**Slack Integration**:
- Use GitHub Slack app
- Subscribe to repository
- Get workflow notifications

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Codecov Documentation](https://docs.codecov.com/)
- [Solhint Rules](https://github.com/protofire/solhint/blob/master/docs/rules.md)
- [Hardhat Coverage](https://hardhat.org/hardhat-runner/plugins/solidity-coverage)

---

**Last Updated**: October 2025
