"use strict";
var utils = require("./../helpers/utils");

const EmpireKeys = {
	login_id: "8zb4t9JEz",
	transaction_key: "58s27AQ4ysZfKA5a",
};

var ApiContracts = require("authorizenet").APIContracts;
var ApiControllers = require("authorizenet").APIControllers;

var init = () => {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(EmpireKeys.login_id);
	merchantAuthenticationType.setTransactionKey(EmpireKeys.transaction_key);
	return merchantAuthenticationType;
};

//Object for transactions
var transaction = function () {
	this.card = (bill, inv, ccard, callback) => {
		var merchat = init();

		var creditCard = new ApiContracts.CreditCardType();
		creditCard.setCardNumber(ccard.number);
		creditCard.setExpirationDate(ccard.expirationdate);
		creditCard.setCardCode(ccard.cardcode);

		var paymentType = new ApiContracts.PaymentType();
		paymentType.setCreditCard(creditCard);

		var orderDetails = Order(inv);

		var billdetails = Bill(bill);

		var invoiceitem = IItem(inv);

		var lineItems = new ApiContracts.ArrayOfLineItem();
		lineItems.setLineItem([invoiceitem]);

		// var transactionSetting1 = new ApiContracts.SettingType();
		// transactionSetting1.setSettingName("duplicateWindow");
		// transactionSetting1.setSettingValue("120");

		var settingarray = Settings([{ name: "recurringbilling", value: "false" }]);

		var transactionSettings = new ApiContracts.ArrayOfSetting();
		transactionSettings.setSetting(settingarray);

		var transactionRequestType = new ApiContracts.TransactionRequestType();
		transactionRequestType.setTransactionType(
			ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
		);

		transactionRequestType.setPayment(paymentType);
		transactionRequestType.setAmount(inv.price);
		transactionRequestType.setLineItems(lineItems);
		transactionRequestType.setOrder(orderDetails);
		transactionRequestType.setBillTo(billdetails);
		transactionRequestType.setTransactionSettings(transactionSettings);

		var createRequest = new ApiContracts.CreateTransactionRequest();
		createRequest.setMerchantAuthentication(merchat);
		createRequest.setTransactionRequest(transactionRequestType);

		//pretty print request
		console.log(JSON.stringify(createRequest.getJSON(), null, 2));

		var cb = (ctrl) => {
			var apiResponse = ctrl.getResponse();

			var response = new ApiContracts.CreateTransactionResponse(apiResponse);

			//pretty print response
			console.log(JSON.stringify(response, null, 2));

			if (response != null) {
				if (
					response.getMessages().getResultCode() ==
					ApiContracts.MessageTypeEnum.OK
				) {
					if (response.getTransactionResponse().getMessages() != null) {
						console.log(
							"Successfully created transaction with Transaction ID: " +
								response.getTransactionResponse().getTransId()
						);
						console.log(
							"Response Code: " +
								response.getTransactionResponse().getResponseCode()
						);
						console.log(
							"Message Code: " +
								response
									.getTransactionResponse()
									.getMessages()
									.getMessage()[0]
									.getCode()
						);
						console.log(
							"Description: " +
								response
									.getTransactionResponse()
									.getMessages()
									.getMessage()[0]
									.getDescription()
						);
					} else {
						console.log("Failed Transaction.");
						if (response.getTransactionResponse().getErrors() != null) {
							console.log(
								"Error Code: " +
									response
										.getTransactionResponse()
										.getErrors()
										.getError()[0]
										.getErrorCode()
							);
							console.log(
								"Error message: " +
									response
										.getTransactionResponse()
										.getErrors()
										.getError()[0]
										.getErrorText()
							);
						}
					}
				} else {
					console.log("Failed Transaction. ");
					if (
						response.getTransactionResponse() != null &&
						response.getTransactionResponse().getErrors() != null
					) {
						console.log(
							"Error Code: " +
								response
									.getTransactionResponse()
									.getErrors()
									.getError()[0]
									.getErrorCode()
						);
						console.log(
							"Error message: " +
								response
									.getTransactionResponse()
									.getErrors()
									.getError()[0]
									.getErrorText()
						);
					} else {
						console.log(
							"Error Code: " + response.getMessages().getMessage()[0].getCode()
						);
						console.log(
							"Error message: " +
								response.getMessages().getMessage()[0].getText()
						);
					}
				}
			} else {
				console.log("Null Response.");
			}

			callback(response);
		};

		transactionController(createRequest.getJSON(), cb);
	};

	this.visasrc = {
		decrypt: (body, callback) => {
			var merchat = init();
			console.log(body);

			var opaqueData = new ApiContracts.OpaqueDataType();
			opaqueData.setDataDescriptor("COMMON.VCO.ONLINE.PAYMENT");
			opaqueData.setDataValue(body.datavalue);
			opaqueData.setDataKey(body.encKey);

			var decryptPaymentDataRequest = new ApiContracts.DecryptPaymentDataRequest();
			decryptPaymentDataRequest.setMerchantAuthentication(merchat);
			decryptPaymentDataRequest.setOpaqueData(opaqueData);
			decryptPaymentDataRequest.setCallId(body.callId);

			console.log(JSON.stringify(decryptPaymentDataRequest.getJSON(), null, 2));

			var cb = (ctrl) => {
				var apiResponse = ctrl.getResponse();

				var response = new ApiContracts.DecryptPaymentDataResponse(apiResponse);

				console.log(JSON.stringify(response, null, 2));

				if (response != null) {
					if (
						response.getMessages().getResultCode() ==
						ApiContracts.MessageTypeEnum.OK
					) {
						if (response.getCardInfo()) {
							console.log(
								"Card Number : " + response.getCardInfo().getCardNumber()
							);
						}

						if (response.getPaymentDetails()) {
							console.log(
								"Amount : " + response.getPaymentDetails().getAmount()
							);
						}

						console.log(
							"Message Code : " +
								response.getMessages().getMessage()[0].getCode()
						);
						console.log(
							"Message Text : " +
								response.getMessages().getMessage()[0].getText()
						);
					} else {
						console.log(
							"Result Code: " + response.getMessages().getResultCode()
						);
						console.log(
							"Error Code: " + response.getMessages().getMessage()[0].getCode()
						);
						console.log(
							"Error message: " +
								response.getMessages().getMessage()[0].getText()
						);
					}
				} else {
					console.log("Null Response.");
				}

				console.log("Sending response");
				callback(response);
			};

			transactionController(decryptPaymentDataRequest.getJSON(), cb);
		},
		create: (body, callback) => {
			var merchat = init();
			console.log(body);

			var opaqueData = new ApiContracts.OpaqueDataType();
			opaqueData.setDataDescriptor("COMMON.VCO.ONLINE.PAYMENT");
			opaqueData.setDataValue(body.datavalue);
			opaqueData.setDataKey(body.encKey);

			var paymentType = new ApiContracts.PaymentType();
			paymentType.setOpaqueData(opaqueData);

			var txnRequest = new ApiContracts.TransactionRequestType();
			txnRequest.setTransactionType(
				ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
			);
			txnRequest.setPayment(paymentType);

			var createRequest = new ApiContracts.CreateTransactionRequest();
			createRequest.setTransactionRequest(txnRequest);
			createRequest.setMerchantAuthentication(merchat);

			console.log(JSON.stringify(createRequest.getJSON(), null, 2));

			var cb = (ctrl) => {
				var apiResponse = ctrl.getResponse();

				var response = new ApiContracts.CreateTransactionResponse(apiResponse);

				console.log(JSON.stringify(response, null, 2));

				if (response != null) {
					if (
						response.getMessages().getResultCode() ==
						ApiContracts.MessageTypeEnum.OK
					) {
						if (response.getTransactionResponse().getMessages() != null) {
							console.log(
								"Successfully created transaction with Transaction ID: " +
									response.getTransactionResponse().getTransId()
							);
							console.log(
								"Response Code: " +
									response.getTransactionResponse().getResponseCode()
							);
							console.log(
								"Message Code: " +
									response
										.getTransactionResponse()
										.getMessages()
										.getMessage()[0]
										.getCode()
							);
							console.log(
								"Description: " +
									response
										.getTransactionResponse()
										.getMessages()
										.getMessage()[0]
										.getDescription()
							);
						} else {
							console.log("Failed Transaction.");
							if (response.getTransactionResponse().getErrors() != null) {
								console.log(
									"Error Code: " +
										response
											.getTransactionResponse()
											.getErrors()
											.getError()[0]
											.getErrorCode()
								);
								console.log(
									"Error message: " +
										response
											.getTransactionResponse()
											.getErrors()
											.getError()[0]
											.getErrorText()
								);
							}
						}
					} else {
						console.log("Failed Transaction. ");
						if (
							response.getTransactionResponse() != null &&
							response.getTransactionResponse().getErrors() != null
						) {
							console.log(
								"Error Code: " +
									response
										.getTransactionResponse()
										.getErrors()
										.getError()[0]
										.getErrorCode()
							);
							console.log(
								"Error message: " +
									response
										.getTransactionResponse()
										.getErrors()
										.getError()[0]
										.getErrorText()
							);
						} else {
							console.log(
								"Error Code: " +
									response.getMessages().getMessage()[0].getCode()
							);
							console.log(
								"Error message: " +
									response.getMessages().getMessage()[0].getText()
							);
						}
					}
				} else {
					console.log("Null Response.");
				}

				callback(response);
			};

			transactionController(createRequest.getJSON(), cb);
		}
	};
};

var transactionController = (getjson, callback) => {
	var ctrl = new ApiControllers.CreateTransactionController(getjson);
	//Defaults to sandbox
	//ctrl.setEnvironment(SDKConstants.endpoint.production);
	var cb = function () {
		callback(ctrl);
	};

	ctrl.execute(cb);
};

var Settings = (settingarray) => {
	var settingtypearray = new Array();
	settingarray.forEach((setting) => {
		var transactionSetting = new ApiContracts.SettingType();
		transactionSetting.setSettingName(setting.name);
		transactionSetting.setSettingValue(setting.value);

		settingtypearray.push(transactionSetting);
	});

	return settingtypearray;
};

var Order = (order) => {
	var orderDetails = new ApiContracts.OrderType();
	orderDetails.setInvoiceNumber(order.id);
	orderDetails.setDescription(order.description);

	return orderDetails;
};

var IItem = (inv) => {
	var invoiceitem = new ApiContracts.LineItemType();
	invoiceitem.setItemId(inv.id);
	invoiceitem.setName("Netsuite Invoice");
	invoiceitem.setDescription(inv.description);
	invoiceitem.setQuantity("1");
	invoiceitem.setUnitPrice(inv.price);

	return invoiceitem;
};

var Bill = (bill) => {
	var billTo = new ApiContracts.CustomerAddressType();
	billTo.setFirstName(bill.name);
	billTo.setLastName(bill.lastname);
	billTo.setCompany(bill.company);
	billTo.setAddress(bill.address);
	billTo.setCity(bill.city);
	billTo.setState(bill.state);
	billTo.setZip(bill.zip);
	billTo.setCountry(bill.country);

	return billTo;
};

exports.init = init;
exports.transaction = transaction;
