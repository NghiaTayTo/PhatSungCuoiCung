// @flow 
import React from 'react';

import PaymentForm from '../../PaymentForm/PaymentForm';

import './InformationOfStore.css';
import '../Home/Home.css';


export const InformationOfStore = () => {
    return (
        <div className='page'>
            <PaymentForm
                name="John Doe"
                number="4111111111111111"
                expiry="1224"
                cvc="123"
                focused="number"
            />
        </div>
    );
};

export default InformationOfStore;