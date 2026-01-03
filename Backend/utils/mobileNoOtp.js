const axios = require('axios');

const sendMobileOtp = async (mobileNo, otp) => {
    try {
        const cleanMobile = mobileNo.replace(/\D/g, '').slice(-10);

        if (!cleanMobile || cleanMobile.length !== 10) {
            return { success: false, message: 'Invalid mobile number' };
        }

        if (!otp || otp.toString().length !== 6) {
            return { success: false, message: 'Invalid OTP' };
        }

        const message = `${otp} is the OTP to verify your mobile number with hurryupcabs.com - HUPCAB`;

        const url = `https://api.msg91.com/api/sendhttp.php`;

        const response = await axios.get(url, {
            params: {
                authkey: process.env.MSG91_AUTH_KEY,
                mobiles: `91${cleanMobile}`,
                message: message,
                sender: 'HUPCAB',
                route: 4,
                DLT_TE_ID: process.env.MSG91_DLT_TEMPLATE_ID,
                unicode: 1,
                encrypt: 0
            },
            timeout: 10000
        });

        console.log(response.data, 'MSG91 Send OTP Response');

        if (!response.data || response.data.toString().includes('error')) {
            return {
                success: false,
                message: 'OTP sending failed'
            };
        }

        return {
            success: true,
            message: 'OTP sent successfully',
            data: response.data
        };

    } catch (error) {
        console.error('MSG91 Send OTP Error:', error.response?.data || error.message);

        return {
            success: false,
            message: 'Failed to send OTP'
        };
    }
};

module.exports = sendMobileOtp;
