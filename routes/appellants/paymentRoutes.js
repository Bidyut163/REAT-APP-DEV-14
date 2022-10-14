const express = require('express');
const router = express.Router();

const CRC32 = require('crc-32');

// Models
const Payment = require('../../models/Payment');
const Appeal = require('../../models/Appeal');
const Appellant = require('../../models/Appellant');
const AppealState = require('../../models/AppealState');

// Middleware
const auth = require('../../middleware/auth');

// @route GET /payment/createOrder/${appealId}
// @desc create orderId
// @access Private
router.get('/createOrder/:appealId', auth, async (req, res) => {
    const payment = await Payment.findAll({
        where: { appealId: req.params.appealId },
    });

    // return an array of payment
    const paymentArray = payment.map((payment) => {
        return payment.get({ plain: true });
    });

    // find payment with status 'P'
    const orderCreatedArr = paymentArray.filter((payment) => {
        return (
            payment.status === 'P' ||
            payment.status === 'I' ||
            payment.status === 'S'
        );
    });

    // console.log('=================');
    // console.log(paymentArray);
    // console.log('Pending payment ===>');
    // console.log(pendingPaymentArr);
    // console.log(pendingPaymentArr.length);
    // console.log('=================');

    if (orderCreatedArr.length === 0) {
        // create orderID
        const order = Payment.build({
            status: 'I',
            appealId: req.params.appealId,
        });

        await order.save();

        return res.json(order);
    }

    res.json(orderCreatedArr[0]);
});

// @route GET /payment/checkStatus/${appealId}
// @desc check status of payment
// @access Private
router.get('/checkStatus/:appealId', auth, async (req, res) => {
    const payment = await Payment.findAll({
        where: { appealId: req.params.appealId },
    });

    // return an array of payment
    const paymentArray = payment.map((payment) => {
        return payment.get({ plain: true });
    });

    // find payment with status 'S'
    const successPayment = paymentArray.filter((payment) => {
        return payment.status === 'S';
    });

    if (successPayment.length !== 0) {
        return res.json(successPayment[0]);
    }

    // find payment with status 'P'
    const pendingPayment = paymentArray.filter((payment) => {
        return payment.status === 'P';
    });

    if (pendingPayment.length !== 0) {
        return res.json(pendingPayment[0]);
    }

    // find payment with status 'F'
    const failedPayment = paymentArray.filter((payment) => {
        return payment.status === 'F';
    });

    if (failedPayment.length !== 0) {
        return res.json(failedPayment[0]);
    }

    // find payment with status 'I'
    const initiatePayment = paymentArray.filter((payment) => {
        return payment.status === 'I';
    });

    if (initiatePayment.length !== 0) {
        return res.json(initiatePayment[0]);
    }

    // console.log('=================');
    // console.log(paymentArray);
    // console.log('Pending payment ===>');
    // console.log(pendingPaymentArr);
    // console.log(pendingPaymentArr.length);
    // console.log('=================');

    res.json(pendingPaymentArr[0]);
});

// @route POST payment/success
// @desc  POST payment success respone
// @access Public
router.post('/success', async (req, res) => {
    const msg = req.body.msg;

    const successMsgArr = msg.split('|');

    const SuccessFlag = successMsgArr[0];
    const MessageType = successMsgArr[1];
    const SurePayMerchantId = successMsgArr[2];
    const ServiceId = successMsgArr[3];
    const OrderId = successMsgArr[4];
    const CustomerId = successMsgArr[5];
    const TransactionAmount = successMsgArr[6];
    const CurrencyCode = successMsgArr[7];
    const PaymentMode = successMsgArr[8];
    const ResponseDateTime = successMsgArr[9];
    const SurePayTxnId = successMsgArr[10];
    const BankTransactionNo = successMsgArr[11];
    const TransactionStatus = successMsgArr[12];
    const AdditionalInfo1 = successMsgArr[13];
    const AdditionalInfo2 = successMsgArr[14];
    const AdditionalInfo3 = successMsgArr[15];
    const AdditionalInfo4 = successMsgArr[16];
    const AdditionalInfo5 = successMsgArr[17];
    const ErrorCode = successMsgArr[18];
    const ErrorDescription = successMsgArr[19];
    const CheckSum = successMsgArr[20];

    const successMsg = {
        SuccessFlag,
        MessageType,
        SurePayMerchantId,
        ServiceId,
        OrderId,
        CustomerId,
        TransactionAmount,
        CurrencyCode,
        PaymentMode,
        ResponseDateTime,
        SurePayTxnId,
        BankTransactionNo,
        TransactionStatus,
        AdditionalInfo1,
        AdditionalInfo2,
        AdditionalInfo3,
        AdditionalInfo4,
        AdditionalInfo5,
        ErrorCode,
        ErrorDescription,
        CheckSum,
    };

    await Payment.update(
        {
            status: SuccessFlag,
        },
        {
            where: {
                order_id: OrderId,
            },
        }
    );

    await AppealState.update(
        {
            appellant: 0,
            receptionist: 1,
            registrar: 0,
            bench: 0,
        },
        {
            where: { appealId: CustomerId },
        }
    );

    res.redirect('/appellant/dashboard');
});

// @route POST payment/fail
// @desc  POST payment failed respone
// @access Public

router.post('/fail', async (req, res) => {
    const msg = req.body.msg;

    const failMsgArr = msg.split('|');

    const FailureFlag = failMsgArr[0];
    const SurePayMerchantId = failMsgArr[1];
    const OrderId = failMsgArr[2];
    const ServiceId = failMsgArr[3];
    const PaymentMode = failMsgArr[4];
    const BankTransactionNo = failMsgArr[5];
    const ErrorCode = failMsgArr[6];
    const ErrorMessage = failMsgArr[7];
    const ErrorDescription = failMsgArr[8];
    const ResponseDateTime = failMsgArr[9];
    const CheckSum = failMsgArr[10];

    const failMsg = {
        FailureFlag,
        SurePayMerchantId,
        OrderId,
        ServiceId,
        PaymentMode,
        BankTransactionNo,
        ErrorCode,
        ErrorMessage,
        ErrorDescription,
        ResponseDateTime,
        CheckSum,
    };

    await Payment.update(
        {
            status: FailureFlag,
        },
        {
            where: {
                order_id: OrderId,
            },
        }
    );

    res.redirect('/appellant/dashboard');
});

// @route POST payment/paygov/response
// @desc  POST push response from NSDL
// @access Public
router.post('/paygov/response', (req, res) => {
    console.log('paygov push response hit');
    console.log(req.body);
    res.send('req.body.msg');
});

// @route GET payment/:id
// @desc  Get payment data
// @access Private
router.get('/fetchData/:id', auth, async (req, res) => {
    try {
        const payment = await Payment.findOne({
            where: { appealId: req.params.id },
        });

        const orderId = payment.get({ plain: true }).order_id;

        const appeal = await Appeal.findOne({
            where: { id: req.params.id },
        });

        const customerId = appeal.get({ plain: true }).appellantId;

        const appellant = await Appellant.findOne({
            where: { id: customerId },
        });

        const customerEmail = appellant.get({ plain: true }).email;

        // =======================================================
        const messageType = '0100';
        const merchantId = process.env.MERCHANT_ID;
        const serviceId = process.env.SERVICE_ID;
        const transactionAmount = 1000.0;
        const currencyCode = 'INR';
        const secretKey = process.env.NSDL_KEY;
        const successUrl = 'https://test.areatappeal.in/payment/success';
        const failUrl = 'https://test.areatappeal.in/payment/fail';
        const additionalField1 = customerEmail;
        const additionalField2 = customerEmail;
        const additionalField3 = customerEmail;
        const additionalField4 = customerEmail;
        const additionalField5 = customerEmail;

        // generate current day and time
        const date = new Date();
        const requestDateTime =
            ('00' + date.getDate()).slice(-2) +
            '-' +
            ('00' + (date.getMonth() + 1)).slice(-2) +
            '-' +
            date.getFullYear() +
            ' ' +
            ('00' + date.getHours()).slice(-2) +
            ':' +
            ('00' + date.getMinutes()).slice(-2) +
            ':' +
            ('000' + date.getMilliseconds()).slice(-3);

        // generate message
        const message = `${messageType}|${merchantId}|${serviceId}|${orderId}|${customerId}|${transactionAmount}|${currencyCode}|${requestDateTime}|${successUrl}|${failUrl}|${additionalField1}|${additionalField2}|${additionalField3}|${additionalField4}|${additionalField5}`;
        console.log('=====================================');
        console.log(message);

        // generate checksum
        const generateCRC32Checksum = (message, secretKey) => {
            const msg = message + '|' + secretKey;

            // get bytes array
            const enc = new TextEncoder();
            const bytesArray = enc.encode(msg);

            const checksum = CRC32.buf(bytesArray, 0, bytesArray.length) >>> 0;

            return checksum;
        };

        const checksum = generateCRC32Checksum(message, secretKey);

        const paymentData = {
            messageType: messageType,
            merchantId: merchantId,
            serviceId: serviceId,
            orderId: orderId,
            customerId: customerId,
            transactionAmount: transactionAmount,
            currencyCode: currencyCode,
            requestDateTime: requestDateTime,
            successUrl: successUrl,
            failUrl: failUrl,
            additionalField1: additionalField1,
            additionalField2: additionalField2,
            additionalField3: additionalField3,
            additionalField4: additionalField4,
            additionalField5: additionalField5,
            checksum: checksum,
        };

        res.json(paymentData);
    } catch (err) {
        console.log(err);
        res.status(500).send('SERVER ERROR');
    }
});

module.exports = router;
