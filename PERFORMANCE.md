# Performance Optimization Guide

Complete guide for optimizing gas costs, contract size, and execution efficiency.

## Table of Contents

- [Overview](#overview)
- [Gas Optimization](#gas-optimization)
- [Contract Size Optimization](#contract-size-optimization)
- [Compiler Optimization](#compiler-optimization)
- [Performance Monitoring](#performance-monitoring)
- [Load Testing](#load-testing)
- [Best Practices](#best-practices)

## Overview

### Performance Goals

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Contract Size | < 24 KB | TBD | 📊 Monitor |
| Deployment Cost | < 2M gas | TBD | 📊 Monitor |
| Transaction Cost | < 200K gas | TBD | 📊 Monitor |
| Test Coverage | > 80% | TBD | 📊 Monitor |

### Performance Stack

```
Solidity Optimizer (Compiler)
    ↓
Via IR Compilation
    ↓
Gas Reporter (Monitoring)
    ↓
Contract Sizer (Analysis)
    ↓
Load Testing (Validation)
    ↓
CI/CD Automation
```

## Gas Optimization

### Optimization Strategies

#### 1. Storage Optimization

**Storage Costs**:
- `SSTORE` (new): 20,000 gas
- `SSTORE` (update): 5,000 gas
- `SLOAD`: 2,100 gas
- Memory: Much cheaper

**Best Practices**:
```solidity
// ✅ Pack variables < 32 bytes together
uint128 a;
uint128 b;  // Packed in single slot

// ❌ Don't alternate sizes
uint256 x;
uint128 y;  // New slot
uint256 z;  // New slot

// ✅ Use memory for temporary data
function calculate(uint256[] calldata data) external {
    uint256 sum;  // Memory variable
    for (uint256 i = 0; i < data.length; i++) {
        sum += data[i];
    }
    return sum;
}

// ❌ Don't use storage unnecessarily
uint256 public tempSum;  // Storage (expensive!)
```

#### 2. Function Optimization

**Function Visibility**:
```solidity
// ✅ Use external for functions called externally only
function processData(uint256[] calldata data) external {
    // Cheaper than public
}

// Use public only when needed internally
function getData() public view returns (uint256) {
    // Can be called internally and externally
}
```

**Parameter Types**:
```solidity
// ✅ Use calldata for read-only arrays
function verify(bytes calldata signature) external {
    // No copying, very efficient
}

// ❌ Avoid memory when calldata works
function verify(bytes memory signature) external {
    // Unnecessary copy
}
```

#### 3. Loop Optimization

**Cache Array Length**:
```solidity
// ✅ Cache length
function sum(uint256[] memory arr) public pure returns (uint256) {
    uint256 total;
    uint256 len = arr.length;  // Cache length
    for (uint256 i = 0; i < len; i++) {
        total += arr[i];
    }
    return total;
}

// ❌ Don't read length each iteration
function sum(uint256[] memory arr) public pure returns (uint256) {
    uint256 total;
    for (uint256 i = 0; i < arr.length; i++) {  // Reads length each time!
        total += arr[i];
    }
    return total;
}
```

**Limit Loop Iterations**:
```solidity
// ✅ Use pagination
uint256 constant MAX_ITEMS = 100;

function processBatch(uint256 offset, uint256 limit) external {
    require(limit <= MAX_ITEMS, "Limit too high");
    // Process items[offset:offset+limit]
}

// ❌ Unbounded loops
function processAll() external {
    for (uint256 i = 0; i < allItems.length; i++) {
        // Could run out of gas!
    }
}
```

#### 4. Data Type Optimization

**Use Appropriate Types**:
```solidity
// ✅ Use uint256 for single variables (no packing)
uint256 counter;  // No extra conversion cost

// Use smaller types only when packing
uint128 packedA;
uint128 packedB;  // Saves storage slot

// ❌ Don't use uint8 for single variables
uint8 smallCounter;  // Still uses full slot, extra conversion!
```

### Gas Reporter

**Configuration** (`.env`):
```env
REPORT_GAS=true
COINMARKETCAP_API_KEY=your_key_here
```

**Run Gas Report**:
```bash
# Generate gas report
npm run test:gas

# Save to file
npm run test:gas > gas-report.txt
```

**Sample Output**:
```
·-------------------------------------------------|----------------------------|-------------|
|               Solc version: 0.8.24              ·  Optimizer enabled: true  ·  Runs: 200  │
··················································|··················|·················|·······
|  Methods                                                                                   │
·························|························|··········|·········|·········|·········|
|  Contract              ·  Method                ·  Min     ·  Max    ·  Avg    ·  # calls │
·························|························|··········|·········|·········|·········|
|  PrivateArtInvestment  ·  registerInvestor      ·  45123  ·  62341  ·  53732  ·       10 │
·························|························|··········|·········|·········|·········|
|  PrivateArtInvestment  ·  listArtwork           ·  123456 ·  145678 ·  134567 ·        5 │
·························|························|··········|·········|·········|·········|
|  PrivateArtInvestment  ·  makePrivateInvestment ·  156789 ·  187654 ·  172222 ·       20 │
·························|························|··········|·········|·········|·········|
```

## Contract Size Optimization

### Size Limits

**Ethereum Limits**:
- Maximum contract size: 24 KB (24,576 bytes)
- Deployment fails if exceeded

### Check Contract Size

```bash
# Check all contracts
npm run size

# Save report
npm run size:report
```

### Optimization Techniques

#### 1. Code Splitting

**Separate Concerns**:
```solidity
// ✅ Split into multiple contracts
contract CoreLogic {
    // Essential functions
}

contract ExtendedFeatures {
    CoreLogic public core;
    // Additional features
}

// ❌ Everything in one contract
contract Monolith {
    // Too many functions!
    // Exceeds size limit
}
```

#### 2. Library Usage

**Extract Common Code**:
```solidity
// ✅ Use libraries for reusable code
library MathLib {
    function calculate(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b / 100;
    }
}

contract MyContract {
    using MathLib for uint256;
}

// Library code not included in contract bytecode
```

#### 3. Modifier Reduction

**Inline Simple Checks**:
```solidity
// ✅ Inline for simple checks
function withdraw() external {
    require(msg.sender == owner, "Not owner");
    // ...
}

// ❌ Modifier for simple check (adds bytecode)
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}
```

#### 4. Error String Optimization

**Use Custom Errors (0.8.4+)**:
```solidity
// ✅ Custom errors (much cheaper!)
error Unauthorized();
error InsufficientBalance(uint256 available, uint256 required);

function withdraw(uint256 amount) external {
    if (msg.sender != owner) revert Unauthorized();
    if (balance < amount) revert InsufficientBalance(balance, amount);
}

// ❌ String errors (expensive bytecode)
function withdraw(uint256 amount) external {
    require(msg.sender == owner, "Unauthorized access");
    require(balance >= amount, "Insufficient balance");
}
```

## Compiler Optimization

### Optimizer Configuration

**File**: `hardhat.config.js`

```javascript
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200  // Optimization level
      },
      viaIR: true,  // Advanced optimization
      evmVersion: "cancun"
    }
  }
};
```

### Optimization Runs

**Trade-off Analysis**:

| Runs | Deployment Cost | Execution Cost | Use Case |
|------|----------------|----------------|----------|
| 1 | Lowest | Highest | One-time contracts |
| 200 | Balanced | Balanced | **Recommended default** |
| 1000 | Medium | Low | Frequently used |
| 10000 | High | Lowest | High-frequency contracts |

**Test Different Settings**:
```bash
# Test with runs=200 (default)
npm run compile

# Test with runs=1000
OPTIMIZER_RUNS=1000 npm run compile

# Compare gas costs
npm run test:gas
```

### Via IR Optimization

**Benefits**:
- Advanced optimizations
- Better code generation
- Smaller bytecode (sometimes)

**Trade-offs**:
- Slower compilation
- May change gas patterns
- Less predictable

**Configuration**:
```javascript
settings: {
  viaIR: true  // Enable advanced optimization
}
```

## Performance Monitoring

### Automated Monitoring

#### GitHub Actions Integration

**Performance Workflow** (`.github/workflows/performance.yml`):
- Runs on every push/PR
- Gas benchmarking
- Contract size checks
- Optimizer testing
- Load testing

**View Results**:
1. Go to Actions tab
2. Select workflow run
3. View performance summary
4. Download artifacts

### Manual Monitoring

**Daily Checks**:
```bash
# Quick performance check
npm run analyze

# Detailed analysis
npm run test:gas
npm run size
npm run coverage
```

### Performance Metrics

**Track Over Time**:
```bash
# Save baseline
npm run test:gas > baseline-gas.txt
npm run size > baseline-size.txt

# After changes, compare
npm run test:gas > current-gas.txt
diff baseline-gas.txt current-gas.txt

# Automated in CI/CD
```

## Load Testing

### Simulation Testing

**Run Full Simulation**:
```bash
npm run simulate
```

**Simulation Includes**:
- Multiple user registrations
- Artwork listings
- Investment transactions
- Return distributions
- State verification

### Stress Testing

**Test Maximum Capacity**:
```javascript
describe("Load Tests", () => {
  it("handles 100 investors", async () => {
    for (let i = 0; i < 100; i++) {
      await contract.registerInvestor();
    }
  });

  it("processes 50 investments per artwork", async () => {
    for (let i = 0; i < 50; i++) {
      await contract.makePrivateInvestment(artworkId, shares);
    }
  });
});
```

### Performance Benchmarks

**Set Baselines**:
```javascript
const benchmarks = {
  registerInvestor: 150000,  // gas
  listArtwork: 200000,
  makeInvestment: 250000,
  distributeReturns: 300000
};

// Test against benchmarks
expect(gasUsed).to.be.below(benchmarks.functionName);
```

## Best Practices

### Development Workflow

#### 1. Optimization Cycle

```
Write Code
    ↓
Run Tests
    ↓
Check Gas Usage ──→ Optimize if needed
    ↓                    ↓
Check Size ──────────→ Refactor if needed
    ↓
Commit
```

#### 2. Before Committing

```bash
# Check everything
npm run validate

# Includes:
# - Linting
# - Compilation
# - Tests
# - Security check
```

#### 3. Before Deploying

```bash
# Full analysis
npm run analyze

# Review:
# - Gas costs
# - Contract sizes
# - Coverage
```

### Optimization Priorities

**Priority Order**:
1. **Correctness** - Security first!
2. **Functionality** - Features work properly
3. **Gas Optimization** - Reduce costs
4. **Size Optimization** - Stay under limit
5. **Readability** - Code maintainability

### Common Pitfalls

#### ❌ Premature Optimization

```solidity
// Don't sacrifice readability for minor savings
function obscureOptimization() external {
    assembly {
        // Complex assembly for 100 gas savings
    }
}
```

#### ❌ Ignoring Security

```solidity
// Don't remove checks to save gas
function unsafeWithdraw() external {
    // Missing authorization check!
    payable(msg.sender).transfer(balance);
}
```

#### ❌ Over-optimization

```solidity
// Don't optimize infrequently used functions
function rareOperation() external {
    // Called once per month
    // Not worth complex optimization
}
```

### Optimization Checklist

Before Production:
- [ ] Run gas reporter
- [ ] Check contract sizes
- [ ] Review optimizer settings
- [ ] Test with realistic load
- [ ] Profile memory usage
- [ ] Validate edge cases
- [ ] Document gas costs
- [ ] Set performance SLAs

## Tools Reference

### Command Summary

```bash
# Compilation
npm run compile              # Compile contracts
npm run clean               # Clean artifacts

# Testing
npm test                    # Run tests
npm run test:gas           # With gas reporting
npm run test:parallel      # Parallel execution
npm run coverage           # Coverage report

# Analysis
npm run size               # Contract sizes
npm run analyze            # Full analysis
npm run simulate           # Load testing

# Optimization
npm run lint               # Code quality
npm run format             # Code formatting
npm run validate           # Full validation
```

### Configuration Files

- `hardhat.config.js` - Compiler settings
- `.env.example` - Performance settings
- `.solhint.json` - Code quality rules
- `PERFORMANCE.md` - This guide

## Resources

### Documentation
- [Solidity Optimization](https://docs.soliditylang.org/en/latest/internals/optimiser.html)
- [Gas Optimization Tips](https://github.com/iskdrews/awesome-solidity-gas-optimization)
- [Hardhat Gas Reporter](https://github.com/cgewecke/hardhat-gas-reporter)

### Tools
- [Hardhat](https://hardhat.org/) - Development framework
- [Solidity Compiler](https://docs.soliditylang.org/) - Official compiler
- [ETH Gas Station](https://ethgasstation.info/) - Gas prices

---

**Last Updated**: October 2025
**Performance Version**: 1.0
**Next Review**: Monthly
