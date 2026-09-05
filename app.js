
// 1. Pi SDK 초기화
Pi.init({ version: "2.0", sandbox: false });

const scopes = ['username', 'payments', 'wallet_address'];

function onIncompletePaymentFound(payment) {
  if (payment && payment.identifier && payment.transaction && payment.transaction.txid) {
    fetch('/api/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId: payment.identifier, txid: payment.transaction.txid })
    });
  }
}

// 2. 접속하자마자 5명 카운트에 반영되는 "파이 로그인 인증" 자동 실행
window.addEventListener('DOMContentLoaded', () => {
  Pi.authenticate(scopes, onIncompletePaymentFound)
    .then((auth) => {
      console.log("로그인 성공:", auth.user.username);
      const statusEl = document.getElementById('loginStatus');
      if (statusEl) {
        statusEl.innerText = `접속 완료: ${auth.user.username}님 환영합니다!`;
      }
    })
    .catch((err) => {
      console.error("인증 실패:", err);
    });
});

// 3. 결제는 버튼을 눌렀을 때만 작동
function startPayment() {
  const paymentData = {
    amount: 0.01,
    memo: "VocaBook 해커톤 결제 테스트",
    metadata: { testId: String(Date.now()) }
  };

  const paymentCallbacks = {
    onReadyForServerApproval: function(paymentId) {
      return fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: paymentId })
      }).then(res => {
        if (!res.ok) throw new Error("서버 승인 실패");
        return res.json();
      });
    },
    onReadyForServerCompletion: function(paymentId, txid) {
      return fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: paymentId, txid: txid })
      }).then(res => res.json())
        .then(() => alert("결제가 정상 완료되었습니다!"));
    },
    onCancel: function(paymentId) {
      console.log("결제 취소됨:", paymentId);
    },
    onError: function(error) {
      alert("결제 에러: " + (error.message || JSON.stringify(error)));
    }
  };

  Pi.createPayment(paymentData, paymentCallbacks);
}

const payBtn = document.getElementById('payBtn');
if (payBtn) {
  payBtn.addEventListener('click', startPayment);
}


