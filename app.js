// 1. SDK 초기화
Pi.init({ version: "2.0", sandbox: false });

// 2. 필수 권한 설정 ('payments' 필수)
const scopes = ['username', 'payments', 'wallet_address'];

// 미완료 결제가 남아있으면 처리해주는 핸들러
function onIncompletePaymentFound(payment) {
  console.log("미완료 결제 발견:", payment);
  // 미완료 결제가 있으면 콘솔에 출력하고 무시하거나 처리
};

// 3. 사용자 인증 실행
Pi.authenticate(scopes, onIncompletePaymentFound)
  .then(function(auth) {
    console.log("인증 성공:", auth);
  })
  .catch(function(error) {
    console.error("인증 실패:", error);
    alert("인증 에러: " + (error.message || JSON.stringify(error)));
  });

// 4. 결제 버튼 이벤트
document.getElementById('payBtn').addEventListener('click', function() {
  const paymentData = {
    amount: 0.01,
    memo: "VocaBook 테스트 결제",
    metadata: { testId: Date.now() }
  };

  const paymentCallbacks = {
    onReadyForServerApproval: function(paymentId) {
      console.log("승인 준비 (paymentId):", paymentId);
      // 서버가 없는 환경에서는 빈 Promise를 즉시 완료 반환하여 UI 지연을 막습니다.
      return Promise.resolve();
    },
    onReadyForServerCompletion: function(paymentId, txid) {
      console.log("완료 준비 (paymentId, txid):", paymentId, txid);
      alert("결제 완료! 트랜잭션 ID: " + txid);
      return Promise.resolve();
    },
    onCancel: function(paymentId) {
      console.log("결제 취소:", paymentId);
      alert("결제가 취소되었습니다.");
    },
    onError: function(error, payment) {
      console.error("결제 에러:", error);
      alert("결제 실패: " + (error.message || JSON.stringify(error)));
    }
  };

  try {
    Pi.createPayment(paymentData, paymentCallbacks);
  } catch (err) {
    alert("createPayment 오류: " + err);
  }
});

