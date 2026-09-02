// Pi SDK 초기화 (샌드박스 모드는 필요에 따라 false 처리)
Pi.init({ version: "2.0", sandbox: false });

// 결제 권한('payments')을 반드시 포함
const scopes = ['username', 'payments', 'wallet_address'];

function onIncompletePaymentFound(payment) {
  console.log("미완료 결제 발견:", payment);
};

// 1. 사용자 인증 실행
Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
  console.log("인증 성공:", auth);
}).catch(function(error) {
  console.error("인증 실패:", error);
});

// 2. 결제 버튼 이벤트 등록
document.getElementById('payBtn').addEventListener('click', function() {
  const paymentData = {
    amount: 0.01,
    memo: "VocaBook 테스트 결제",
    metadata: { test: "vocabook_step10" }
  };

  const paymentCallbacks = {
    onReadyForServerApproval: function(paymentId) {
      console.log("onReadyForServerApproval:", paymentId);
      // 서버가 없는 클라이언트 테스트 환경일 경우 SDK 승인 호출
      fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
        method: "POST"
      }).catch(() => {});
    },
    onReadyForServerCompletion: function(paymentId, txid) {
      console.log("onReadyForServerCompletion:", paymentId, txid);
      alert("결제가 정상적으로 완료되었습니다!");
    },
    onCancel: function(paymentId) {
      console.log("결제 취소:", paymentId);
    },
    onError: function(error, payment) {
      console.error("결제 에러:", error);
      alert("결제 에러: " + (error.message || error));
    }
  };

  Pi.createPayment(paymentData, paymentCallbacks);
});
