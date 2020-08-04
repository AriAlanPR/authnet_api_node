function onVisaCheckoutReady(apiKey){
V.init({ apikey: apiKey });
    V.on("payment.success", function(payment){  });
    V.on("payment.cancel", function(payment){  });
    V.on("payment.error", function(payment, error){ });
}

var a = 4;