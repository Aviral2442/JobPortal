import React from 'react'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    document_title: Yup.string().required('Document title is required'),
    document_short_desc: Yup.string().required('Document short description is required'),
    document_long_desc: Yup.string().required('Document long description is required'),
    document_formated_desc1: Yup.string(),
    document_formated_desc2: Yup.string(),
    document_formated_desc3: Yup.string(),
    document_formated_desc4: Yup.string(),
    document_important_dates: Yup.array().of(Yup.object().shape({
        dates_label: Yup.string().required('Date label is required'),
        dates_value: Yup.string().required('Date value is required'),   
    })),
    document_important_links: Yup.array().of(Yup.object().shape({
        links_label: Yup.string().required('Link label is required'),
        links_url: Yup.string().required('Link URL is required').url('Invalid URL format'),
    })),
    document_application_fees: Yup.array().of(Yup.object().shape({
        links_label: Yup.string().required('Fee label is required'),
        links_url: Yup.string().required('Fee URL is required').url('Invalid URL format'),
    })),
    document_posted_date: Yup.number(),
});

const AddDocument = () => {
  return (
    <div>AddDocument</div>
  )
}

export default AddDocument