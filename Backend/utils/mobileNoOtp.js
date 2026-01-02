const axios = require('axios');

const sendMobileOtp = async (mobileNo, otp) => {
    try {
        // Clean & validate Indian mobile number
        const cleanMobile = mobileNo.replace(/\D/g, '').slice(-10);

        if (!cleanMobile || cleanMobile.length !== 10) {
            return {
                success: false,
                message: 'Invalid mobile number'
            };
        }

        if (!otp || otp.toString().length !== 6) {
            return {
                success: false,
                message: 'Invalid OTP'
            };
        }

        const response = await axios.post(
            'https://control.msg91.com/api/v5/otp',
            {
                template_id: process.env.MSG91_OTP_TEMPLATE_ID,
                mobile: `91${cleanMobile}`,
                otp: otp
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authkey': process.env.MSG91_AUTH_KEY
                },
                timeout: 10000
            }
        );

        // MSG91 success check
        if (response.data?.type !== 'success') {
            return {
                success: false,
                message: response.data?.message || 'OTP sending failed'
            };
        }

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
            message: error.response?.data?.message || 'Failed to send OTP'
        };
    }
};

module.exports = sendMobileOtp;
