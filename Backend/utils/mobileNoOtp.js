const axios = require('axios');

const sendMobileOtp = async (mobileNo, otp) => {
    try {
        const cleanMobile = mobileNo.replace(/\D/g, '').slice(-10);

        const response = await axios.post(
            'https://control.msg91.com/api/v5/otp',
            {
                template_id: process.env.MSG91_OTP_TEMPLATE_ID,
                mobile: `91${cleanMobile}`,
                otp: otp,
                otp_length: 6,
                otp_expiry: 5
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    authkey: process.env.MSG91_AUTH_KEY
                }
            }
        );

        console.log('MSG91 Response:', response.data);

        return {
            success: true,
            message: 'OTP sent successfully',
            data: response.data
        };
    } catch (error) {
        console.error(
            'MSG91 Send OTP Error:',
            error.response?.data || error.message
        );
        return {
            success: false,
            message: 'Failed to send OTP'
        };
    }
};

module.exports = sendMobileOtp;
