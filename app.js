  const paymentCallbacks = {
    onReadyForServerApproval: function(paymentId) {
      console.log("onReadyForServerApproval:", paymentId);
      // 자체 백엔드 승인 엔드포인트 호출
      return fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: paymentId })
      }).then(res => res.json());
    },
    onReadyForServerCompletion: function(paymentId, txid) {
      console.log("onReadyForServerCompletion:", paymentId, txid);
      // 자체 백엔드 완료 엔드포인트 호출
      return fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: paymentId, txid: txid })
      }).then(res => res.json())
        .then(() => {
          alert("결제 완료!");
        });
    },
    onCancel: function(paymentId) {
      console.log("결제 취소:", paymentId);
    },
    onError: function(error, payment) {
      console.error("결제 에러:", error);
    }
  };

