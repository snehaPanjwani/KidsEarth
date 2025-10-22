// A minimal payment simulator. Replace with real gateway integration as needed.
export async function processPayment({ amount, method, orderId }) {
    // Simulate async payment processing
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                transactionId: `tx_${Date.now()}`,
                paidAt: new Date()
            });
        }, 300); // simulate latency
    });
}