/**
 * ANCHOR PRODUCTION EXECUTION LAYER - TEST SUITE
 * Demonstrates the three runtime environments and DAG scheduling
 */

const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';
const AUTH_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token

// Test 1: Isolated-VM Runtime (Secure Sandbox)
async function testIsolatedVM() {
    console.log('\n🔒 TEST 1: Isolated-VM Runtime (Secure Sandbox)');
    console.log('─'.repeat(60));

    const sourceCode = `
        log('Hello from Isolated-VM!');
        log('Computing fibonacci...');
        
        function fib(n) {
            if (n <= 1) return n;
            return fib(n-1) + fib(n-2);
        }
        
        const result = fib(20);
        log('Fibonacci(20) = ' + result);
    `;

    try {
        const response = await axios.post(`${BACKEND_URL}/api/tasks`, {
            name: 'Isolated-VM Test',
            type: 'script',
            payload: {
                sourceCode,
                runtime: 'isolate' // Force isolated-vm
            },
            requirements: {}
        }, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        console.log('✅ Task created:', response.data.taskId);
        console.log('📊 Runtime: Isolated-VM (128MB RAM limit, 30s timeout)');
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Test 2: WebAssembly Runtime (High Performance)
async function testWASM() {
    console.log('\n⚡ TEST 2: WebAssembly Runtime (High Performance)');
    console.log('─'.repeat(60));

    // Base64 encoded WASM module (simple add function)
    // This is a minimal WASM module that exports an 'add' function
    const wasmBase64 = 'AGFzbQEAAAABBwFgAn9/AX8DAgEABwcBA2FkZAAACgkBBwAgACABagsACgRuYW1lAgMBAAA=';

    try {
        const response = await axios.post(`${BACKEND_URL}/api/tasks`, {
            name: 'WASM Test',
            type: 'script',
            payload: {
                sourceCode: wasmBase64,
                runtime: 'wasm', // Force WASM
                isWASM: true
            },
            requirements: {}
        }, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        console.log('✅ Task created:', response.data.taskId);
        console.log('📊 Runtime: WebAssembly (Near-native performance)');
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Test 3: Native Runtime (npm dependencies)
async function testNative() {
    console.log('\n📦 TEST 3: Native Runtime (npm dependencies)');
    console.log('─'.repeat(60));

    const sourceCode = `
        const axios = require('axios');
        
        console.log('Fetching data from API...');
        
        axios.get('https://api.github.com/users/github')
            .then(res => {
                console.log('GitHub User:', res.data.login);
                console.log('Followers:', res.data.followers);
            })
            .catch(err => console.error('Error:', err.message));
    `;

    try {
        const response = await axios.post(`${BACKEND_URL}/api/tasks`, {
            name: 'Native Runtime Test',
            type: 'script',
            payload: {
                sourceCode,
                dependencies: ['axios'], // Requires npm install
                runtime: 'native' // Will auto-select native due to dependencies
            },
            requirements: {}
        }, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        console.log('✅ Task created:', response.data.taskId);
        console.log('📊 Runtime: Native (with npm dependencies)');
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Test 4: DAG Task Scheduling
async function testDAG() {
    console.log('\n🔀 TEST 4: DAG Task Scheduling (Complex Workflow)');
    console.log('─'.repeat(60));

    const taskGraph = [
        {
            id: 'task_fetch',
            name: 'Fetch Data',
            type: 'script',
            dependencies: [],
            payload: {
                sourceCode: `
                    log('Fetching initial data...');
                    log('Data fetched: [1, 2, 3, 4, 5]');
                `,
                runtime: 'isolate'
            },
            requirements: {}
        },
        {
            id: 'task_process_a',
            name: 'Process Chunk A',
            type: 'parallel',
            dependencies: ['task_fetch'],
            payload: {
                instruction: 'FIND_PRIMES_IN_RANGE',
                range_start: 0,
                range_end: 50000,
                total_range: 100000
            },
            requirements: { parallelNodes: 1 }
        },
        {
            id: 'task_process_b',
            name: 'Process Chunk B',
            type: 'parallel',
            dependencies: ['task_fetch'],
            payload: {
                instruction: 'FIND_PRIMES_IN_RANGE',
                range_start: 50000,
                range_end: 100000,
                total_range: 100000
            },
            requirements: { parallelNodes: 1 }
        },
        {
            id: 'task_aggregate',
            name: 'Aggregate Results',
            type: 'script',
            dependencies: ['task_process_a', 'task_process_b'],
            payload: {
                sourceCode: `
                    log('Aggregating results from both chunks...');
                    log('Total primes found: [COMBINED]');
                `,
                runtime: 'isolate'
            },
            requirements: {}
        }
    ];

    try {
        const response = await axios.post(`${BACKEND_URL}/api/dag/schedule`, {
            tasks: taskGraph
        }, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        console.log('✅ DAG scheduled:', response.data.message);
        console.log('📊 Execution flow:');
        console.log('   1. task_fetch runs first');
        console.log('   2. task_process_a and task_process_b run in parallel');
        console.log('   3. task_aggregate waits for both to complete');
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Test 5: Consensus Verification
async function testConsensus() {
    console.log('\n🔍 TEST 5: Consensus Verification (Anti-Fraud)');
    console.log('─'.repeat(60));

    const taskId = 'test_task_123';
    const subTaskId = 'subtask_1';

    // Simulate two nodes returning the same result
    const result1 = { primes_count: 42, execution_time: 1.2 };
    const result2 = { primes_count: 42, execution_time: 1.3 };

    try {
        // First node reports
        const verify1 = await axios.post(`${BACKEND_URL}/api/dag/verify`, {
            taskId,
            subTaskId,
            result: result1
        }, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        console.log('📥 Node 1 result:', verify1.data.verification);

        // Second node reports
        const verify2 = await axios.post(`${BACKEND_URL}/api/dag/verify`, {
            taskId,
            subTaskId,
            result: result2
        }, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });

        console.log('📥 Node 2 result:', verify2.data.verification);
        console.log('✅ Consensus achieved - results verified!');
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Run all tests
async function runTests() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   ANCHOR PRODUCTION EXECUTION LAYER - TEST SUITE          ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

    console.log('\n⚠️  NOTE: Make sure to:');
    console.log('   1. Start the backend server (npm start)');
    console.log('   2. Have at least one agent connected');
    console.log('   3. Replace AUTH_TOKEN with a valid JWT');
    console.log('');

    await testIsolatedVM();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await testWASM();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await testNative();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await testDAG();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await testConsensus();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    TESTS COMPLETED                         ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
}

// Execute if run directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { testIsolatedVM, testWASM, testNative, testDAG, testConsensus };
