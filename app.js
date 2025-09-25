// Pi SDK 사용 범위 (username + payments)
const scopes = ['username', 'payments'];

// Pi 초기화
async function initPi() {
  try {
    const authResult = await Pi.authenticate(scopes, onIncompletePaymentFound);
    console.log('✅ Authenticated user:', authResult.user);
  } catch (err) {
    console.error('❌ Authentication failed:', err);
  }
}

// 결제 버튼 이벤트
document.addEventListener('DOMContentLoaded', () => {
  const payBtn = document.getElementById('payBtn');
  if (payBtn) {
    payBtn.addEventListener('click', async () => {
      try {
        const payment = await Pi.createPayment({
          amount: 1, // 테스트 금액 (1 Pi)
          memo: "Test Pi Payment",
          metadata: { type: "test" }
        }, {
          onReadyForServerApproval: (paymentId) => {
            console.log("🔗 Ready for server approval:", paymentId);
          },
          onReadyForServerCompletion: (paymentId, txid) => {
            console.log("✅ Ready for server completion:", paymentId, txid);
          },
          onCancel: (paymentId) => {
            console.log("⚠️ Payment cancelled:", paymentId);
          },
          onError: (error, payment) => {
            console.error("❌ Payment error:", error, payment);
          }
        });
      } catch (err) {
        console.error("❌ Payment failed:", err);
      }
    });
  }
});

// 미완료 결제 처리
function onIncompletePaymentFound(payment) {
  console.log("⚠️ Incomplete payment found:", payment);
}

initPi();
