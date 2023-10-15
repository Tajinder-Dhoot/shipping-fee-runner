request = JSON.parse(pm.request.body.raw);
response = pm.response.json();;

pm.test("verify shipping fee returned in response is correct", function () {
    if(request.membershipActive == true) {
        pm.expect(response.shippingFee).to.eql(0);
    }
    else {
        amount = request.cart.amount;
        discounts = request.cart.couponDiscount;
        netAmount = amount - discounts;
        if (netAmount < 35) {
            if(request.deliveryMethod == "standard") {
                pm.expect(response.shippingFee).to.be.eql(6.99)
            }
            else if(request.deliveryMethod == "prime") {
                pm.expect(response.shippingFee).to.be.eql(13.99)
            }
            else if(request.deliveryMethod == "pickup") {
                pm.expect(response.shippingFee).to.be.eql(0)
            }
            else {
                pm.expect(request.deliveryMethod).to.be.oneOf(['pickup','standard','prime']);
            }
        }
        else {
            pm.expect(response.shippingFee).to.be.eql(0)
        }
    }
});

pm.test("verify values of selected shipping are valid in request payload", function () {
    pm.expect(request.deliveryMethod).to.be.oneOf(['pickup','standard','prime']);
});

pm.test("verify response is 415 if content type of request is not json/application", function () {
    console.log(pm.request.headers.all())
    requestHeaders = pm.request.headers.all();
    for(let i = 0; i < requestHeaders.len; i++) {
        if(requestHeaders[i].key == 'Content-Type' & requestHeaders[i].value != 'json/application') {
                pm.response.to.have.status(415);
        }
    }
});