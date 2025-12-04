
const DateConversion = (string) => {
  return (
    new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })    
  )
}

export default DateConversion