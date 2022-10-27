import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { appellantGetAppeal } from '../../actions/appeal';
import { createOrder, paymentStatus, getPayment } from '../../actions/payment';

const ConfirmPayment = ({
    appellantGetAppeal,
    createOrder,
    paymentStatus,
    getPayment,
    match,
    payment: { payment, order, status },
    appeal: { appeal },
}) => {
    const { id } = match.params;
    useEffect(() => {
        appellantGetAppeal(id);
        paymentStatus(id);
        (async () => {
            await createOrder(id);
            getPayment(id);
        })();
    }, []);

    if (!order || !payment || !appeal) {
        return <div>Loading</div>;
    }

    if (
        status &&
        (status.status === 'S' || status.status === 'P') &&
        status.appealId === id
    ) {
        return <Redirect to={`/appellant/appeals/${id}/paymentstatus`} />;
    }

    // if (order && order.status === 'P') {
    //     return (
    //         <div className="bg-primary p-5" style={{ minHeight: '100vh' }}>
    //             <div
    //                 className="card"
    //                 style={{ width: '60%', margin: '0 auto' }}
    //             >
    //                 <div className="card-body mx-4">
    //                     <div className="container text-center">
    //                         <p>
    //                             Previous Payment is Under Process! Please wait
    //                             for sometime!
    //                         </p>
    //                         <Link
    //                             to="/appellant/dashboard"
    //                             className="btn btn-primary mt-3"
    //                         >
    //                             Go to dashboard
    //                         </Link>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="bg-primary p-5" style={{ minHeight: '100vh' }}>
            <div className="card" style={{ width: '60%', margin: '0 auto' }}>
                <div className="card-body mx-4">
                    <div className="container">
                        <p
                            className="my-5 mx-5 text-center"
                            style={{ fontSize: '30px' }}
                        >
                            Assam Real Estate Appellate Tribunal
                        </p>
                        <div className="row">
                            <ul className="list-unstyled">
                                <li className="text-black">
                                    Assam Real Estate Appellate Tribunal
                                </li>
                                <li className="text-muted mt-1">
                                    <span className="text-black">
                                        3rd Floor, Aditya Tower, Rukmini Gaon,
                                        G.S. Road
                                    </span>
                                </li>
                                <li className="text-black mt-1">
                                    Guwahati-781036
                                </li>
                            </ul>
                            <hr />
                            <div className="col-xl-10">
                                <p>Appeal ID</p>
                            </div>
                            <div className="col-xl-2">
                                <p className="float-end">{appeal.id}</p>
                            </div>
                            <hr />
                            <div className="col-xl-4">
                                <p>Appellant Name</p>
                            </div>
                            <div className="col-xl-8">
                                <p className="float-end">{appeal.fullname}</p>
                            </div>
                            <hr />
                            <div className="col-xl-4">
                                <p>Respondent Name</p>
                            </div>
                            <div className="col-xl-8">
                                <p className="float-end">
                                    {appeal.res_fullname}
                                </p>
                            </div>
                            <hr />
                            <div className="col-xl-10">
                                <p>Appeal Fee</p>
                            </div>
                            <div className="col-xl-2">
                                <p className="float-end">
                                    {' '}
                                    <i className="fa-solid fa-indian-rupee-sign"></i>{' '}
                                    1000
                                </p>
                            </div>
                            <hr />
                        </div>

                        <div className="row text-black">
                            <div className="col-xl-12">
                                <p className="float-end fw-bold">
                                    Total:{' '}
                                    <i className="fa-solid fa-indian-rupee-sign"></i>{' '}
                                    1000
                                </p>
                            </div>
                            <hr style={{ border: '2px solid black' }} />
                        </div>
                        <div className="row">
                            <div className="col-md-10"></div>
                            <div
                                className="col-md-2 text-center"
                                style={{ marginTop: '50px' }}
                            >
                                <form action={payment.processUrl} method="post">
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="messageType"
                                        value={payment.messageType}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="merchantId"
                                        value={payment.merchantId}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="serviceId"
                                        value={payment.serviceId}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="orderId"
                                        value={payment.orderId}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="customerId"
                                        value={payment.customerId}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="transactionAmount"
                                        value={payment.transactionAmount}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="currencyCode"
                                        value={payment.currencyCode}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="requestDateTime"
                                        value={payment.requestDateTime}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="successUrl"
                                        value={payment.successUrl}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="failUrl"
                                        value={payment.failUrl}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="additionalField1"
                                        value={payment.additionalField1}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="additionalField2"
                                        value={payment.additionalField2}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="additionalField3"
                                        value={payment.additionalField3}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="additionalField4"
                                        value={payment.additionalField4}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="additionalField5"
                                        value={payment.additionalField5}
                                    ></input>
                                    <input
                                        readOnly
                                        hidden
                                        type="text"
                                        name="checksum"
                                        value={payment.checksum}
                                    ></input>
                                    {/* ============================ */}
                                    <input
                                        readOnly
                                        type="submit"
                                        className="btn btn-primary text-uppercase"
                                        value="Pay now"
                                    ></input>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return { payment: state.payment, appeal: state.appeal };
};

export default connect(mapStateToProps, {
    appellantGetAppeal,
    createOrder,
    paymentStatus,
    getPayment,
})(ConfirmPayment);
