export const formatDate = (data) => {
    if (!data && data !== 0) return '-';
    
    try {
        let date;
        const dataStr = String(data);
        
        // Check if data is a Unix timestamp (numeric)
        if (/^\d+$/.test(dataStr)) {
            const timestamp = parseInt(dataStr);
            // If timestamp is in seconds (10 digits), convert to milliseconds
            // If timestamp is in milliseconds (13 digits), use as is
            date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp);
        } else {
            // It's a date string
            date = new Date(data);
        }
        
        // Check if date is valid
        if (isNaN(date.getTime())) return dataStr;
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}-${month}-${year} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
        return String(data);
    }
};

// Format date only (without time)
export const formatDateOnly = (data) => {
    if (!data && data !== 0) return '-';
    
    try {
        let date;
        const dataStr = String(data);
        
        // Check if data is a Unix timestamp (numeric)
        if (/^\d+$/.test(dataStr)) {
            const timestamp = parseInt(dataStr);
            date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp);
        } else {
            date = new Date(data);
        }
        
        if (isNaN(date.getTime())) return dataStr;
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    } catch {
        return String(data);
    }
};

// Format time only
export const formatTimeOnly = (data) => {
    if (!data && data !== 0) return '-';
    
    try {
        let date;
        const dataStr = String(data);
        
        if (/^\d+$/.test(dataStr)) {
            const timestamp = parseInt(dataStr);
            date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp);
        } else {
            date = new Date(data);
        }
        
        if (isNaN(date.getTime())) return dataStr;
        
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return String(data);
    }
};

// Format with custom options
export const formatDateCustom = (data, options = {}) => {
    if (!data && data !== 0) return '-';
    
    const { showTime = true, showDate = true, dateFormat = 'DD-MM-YYYY' } = options;
    
    try {
        let date;
        const dataStr = String(data);
        
        if (/^\d+$/.test(dataStr)) {
            const timestamp = parseInt(dataStr);
            date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp);
        } else {
            date = new Date(data);
        }
        
        if (isNaN(date.getTime())) return dataStr;
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        let formattedDate = '';
        
        if (showDate) {
            switch (dateFormat) {
                case 'MM-DD-YYYY':
                    formattedDate = `${month}-${day}-${year}`;
                    break;
                case 'YYYY-MM-DD':
                    formattedDate = `${year}-${month}-${day}`;
                    break;
                case 'DD-MM-YYYY':
                default:
                    formattedDate = `${day}-${month}-${year}`;
                    break;
            }
        }
        
        if (showTime) {
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            formattedDate = formattedDate ? `${formattedDate} ${time}` : time;
        }
        
        return formattedDate || '-';
    } catch {
        return String(data);
    }
};