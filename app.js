Pi.init({ version: "2.0", sandbox: false });

const scopes = ['username', 'payments', 'wallet_address'];

function onIncompletePaymentFound(payment) {
  console.log("미완료 결제 발견:", payment);
  if (payment && payment.transaction && payment.transaction.txid) {
    fetch('/api/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId: payment.identifier, txid: payment.transaction.txid })
    });
  }
}

// 결제 실행 함수
function startPayment() {
  const paymentData = {
    amount: 0.01,
    memo: "VocaBook 해커톤 결제 테스트",
    metadata: { testId: Date.now() }
  };

  const paymentCallbacks = {
    onReadyForServerApproval: function(paymentId) {
      return fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: paymentId })
      }).then(res => res.json());
    },
    onReadyForServerCompletion: function(paymentId, txid) {
      return fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: paymentId, txid: txid })
      }).then(res => res.json())
        .then(() => {
          alert("테스트 결제 완료!");
        });
    },
    onCancel: function(paymentId) {
      console.log("결제 취소:", paymentId);
    },
    onError: function(error, payment) {
      console.error("결제 에러:", error);
      alert("결제 에러: " + (error.message || JSON.stringify(error)));
    }
  };

  Pi.createPayment(paymentData, paymentCallbacks);
}

// 버튼 클릭 시: 인증(payments 포함)을 반드시 먼저 확인/완료한 뒤 결제창 실행
document.getElementById('payBtn').addEventListener('click', function() {
  Pi.authenticate(scopes, onIncompletePaymentFound)
    .then(function(auth) {
      // 인증 성공 후 결제 실행
      startPayment();
    })
    .catch(function(error) {
      alert("인증 실패: " + (error.message || JSON.stringify(error)));
    });
});


