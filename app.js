Pi.init({ version: "2.0", sandbox: false });

const scopes = ['username', 'payments', 'wallet_address'];

function onIncompletePaymentFound(payment) {
  console.log("미완료 결제 발견:", payment);
  if (payment && payment.identifier && payment.transaction && payment.transaction.txid) {
    fetch('/api/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId: payment.identifier, txid: payment.transaction.txid })
    });
  }
}

function startPayment() {
  const paymentData = {
    amount: 0.01,
    memo: "VocaBook 해커톤 결제 테스트",
    metadata: { testId: String(Date.now()) }
  };

  const paymentCallbacks = {
    onReadyForServerApproval: function(paymentId) {
      console.log("승인 요청 시작:", paymentId);
      // 서버의 approve 응답이 끝날 때까지 반드시 return 대기해야 타임아웃이 나지 않습니다.
      return fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: paymentId })
      })
      .then(function(res) {
        if (!res.ok) {
          throw new Error("서버 승인 실패 (HTTP " + res.status + ")");
        }
        return res.json();
      })
      .then(function(data) {
        console.log("서버 승인 완료 데이터:", data);
      });
    },
    onReadyForServerCompletion: function(paymentId, txid) {
      console.log("결제 완료 요청:", paymentId, txid);
      return fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: paymentId, txid: txid })
      })
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        alert("결제가 정상적으로 완료되었습니다!");
      });
    },
    onCancel: function(paymentId) {
      console.log("결제 취소됨:", paymentId);
    },
    onError: function(error, payment) {
      console.error("결제 에러 발생:", error);
      alert("결제 에러: " + (error.message || JSON.stringify(error)));
    }
  };

  Pi.createPayment(paymentData, paymentCallbacks);
}

document.getElementById('payBtn').addEventListener('click', function() {
  Pi.authenticate(scopes, onIncompletePaymentFound)
    .then(function(auth) {
      startPayment();
    })
    .catch(function(error) {
      alert("인증 오류: " + (error.message || JSON.stringify(error)));
    });
});


