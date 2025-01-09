# API Testing Framework Comparison

A comprehensive comparison of popular API testing frameworks (Playwright, SuperTest, REST Assured) with performance testing using K6. Includes real-world examples, CI/CD integration, and detailed reporting.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Playwright Tests](https://img.shields.io/badge/tested%20with-playwright-45ba4b.svg)](https://playwright.dev/)
[![SuperTest](https://img.shields.io/badge/tested%20with-supertest-orange.svg)](https://github.com/visionmedia/supertest)
[![REST Assured](https://img.shields.io/badge/tested%20with-rest%20assured-blue.svg)](https://rest-assured.io/)
[![K6](https://img.shields.io/badge/performance%20tested%20with-k6-7d64ff.svg)](https://k6.io/)

## Key Features

- 🔄 Multiple framework implementations of the same API tests
- 📊 Performance testing and comparison metrics
- 🚀 GitHub Actions CI/CD integration
- 📈 Automated test reporting
- 🎯 Real-world testing scenarios

## 🛠 Technologies Used

- **Playwright** - For API functional testing
- **SuperTest** - For Node.js based API testing
- **REST Assured** - For Java-based API testing
- **K6** - For performance testing

## 📁 Project Structure

```
playwright-toolshop-api-tests/
├── tests/
│   └── api/
│       ├── petstore.spec.ts    # Playwright API tests for pet endpoints
│       └── store.spec.ts       # Playwright API tests for store endpoints
├── k6/
│   ├── store-performance.js    # K6 performance tests
│   └── store-playwright-converted.js # K6 tests converted from Playwright
├── java-api-tests/
│   ├── src/
│   │   ├── main/java/
│   │   │   └── com/example/
│   │   │       └── model/      # Java model classes
│   │   └── test/java/
│   │       └── com/example/
│   │           ├── config/     # Test configuration
│   │           └── tests/      # REST Assured tests
│   ├── pom.xml                 # Maven configuration
│   └── testng.xml             # TestNG configuration
└── swagger/
    └── can-system-v1.json     # Swagger API specification
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Java JDK 11 or higher
- Maven
- K6

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd playwright-toolshop-api-tests
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Install Java dependencies:
```bash
cd java-api-tests
mvn clean install
```

## 🧪 Running Tests

### Playwright Tests
```bash
# Run all Playwright tests
npm run test:playwright

# Run specific test file
npx playwright test tests/api/store.spec.ts
```

### SuperTest Tests
```bash
npm run test:supertest
```

### REST Assured Tests
```bash
cd java-api-tests
mvn clean test
```

### K6 Performance Tests
```bash
# Run basic performance test
k6 run k6/store-performance.js

# Run converted Playwright tests with K6
k6 run k6/store-playwright-converted.js
```

## 📊 Test Reports

### Playwright
- HTML reports are generated in `playwright-report/` directory
- View the report using: `npx playwright show-report`

### REST Assured
- TestNG reports are generated in `java-api-tests/target/surefire-reports/`

### K6
- Performance metrics are displayed in the console
- Can be integrated with Grafana for visualization

## 🔍 Test Coverage

The test suite covers the following endpoints:

### Store API
- Create order
- Get order by ID
- Get store inventory
- Delete order

### Pet API
- Create pet
- Get pet by ID
- Update pet
- Delete pet

## 📈 Performance Testing

The K6 performance tests include:

- Smoke testing (1 user, 30 seconds)
- Load testing (up to 20 concurrent users)
- Performance thresholds:
  - 95% of requests should complete within 500ms
  - Error rate should be below 10%

## 🔄 Framework Comparison

### Playwright
- Fast execution
- Simple setup
- Good for both API and UI testing
- Built-in async/await support

### SuperTest
- Node.js native
- Clean, fluent API
- Specifically designed for API testing
- Good integration with Jest

### REST Assured
- Java-based
- Strong typing
- Powerful assertion library
- Excellent for enterprise projects

### K6
- Dedicated performance testing
- Detailed metrics
- Configurable load patterns
- Good for CI/CD integration

## 🔄 Continuous Integration

This project uses GitHub Actions for continuous integration. The workflow:

1. Triggers on:
   - Push to main branch
   - Pull requests to main branch
   - Manual workflow dispatch

2. Runs all test suites:
   - Playwright API tests
   - SuperTest tests
   - REST Assured tests
   - K6 performance tests

3. Generates and uploads test reports:
   - Individual reports for each framework
   - Combined HTML report
   - Publishes reports to GitHub Pages

### 📊 Viewing Test Reports

After each workflow run:

1. Go to the Actions tab in GitHub
2. Click on the workflow run
3. Scroll down to the Artifacts section
4. Download and view the reports:
   - `playwright-report`: Playwright test results
   - `rest-assured-report`: REST Assured test results
   - `k6-report`: K6 performance test results
   - `combined-report`: Single HTML file with all results

You can also view the latest test report on GitHub Pages at:
`https://[your-username].github.io/[repository-name]/`

### 🔧 Configuration

The workflow can be configured by modifying:
- `.github/workflows/test-execution.yml`: Main workflow configuration
- `package.json`: Test execution commands
- Individual test framework configurations

### 📈 Performance Metrics

K6 performance tests report:
- Response times (p95, p99)
- Requests per second
- Error rates
- Custom metrics

These metrics are available in:
1. GitHub Actions console output
2. K6 JSON report
3. Generated HTML report

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
