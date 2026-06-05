import { useMemo, useState } from 'react'
import "./contactForm.css"
import CustomSelect from './CustomSelect'
import { submitContact } from '../../services/api'

const initial = {
    name: '',
    company: '',
    email: '',
    countryCode: '',
    phone: '',
    industry: '',
    employees: '',
    message: '',
}

const countryCodes = [
    { label: "India (+91)", value: "+91" },
    { label: "United States (+1)", value: "+1" },
    { label: "United Kingdom (+44)", value: "+44" },
    { label: "United Arab Emirates (+971)", value: "+971" },
    { label: "Singapore (+65)", value: "+65" },
    { label: "Australia (+61)", value: "+61" },
    { label: "Canada (+1)", value: "+1" },
    { label: "Germany (+49)", value: "+49" },
    { label: "France (+33)", value: "+33" },
    { label: "Netherlands (+31)", value: "+31" },
    { label: "Saudi Arabia (+966)", value: "+966" },
    { label: "Qatar (+974)", value: "+974" },
]

function validate(values) {
    const errors = {}

    if (!values.name.trim()) errors.name = 'Name field is required.'
    if (!values.company.trim()) errors.company = 'Company field is required.'

    if (!values.email.trim()) errors.email = 'Email field is required.'
    else if (!/^\S+@\S+\.\S+$/.test(values.email.trim()))
        errors.email = 'Enter a valid email.'

    if (!values.countryCode) errors.countryCode = 'Country code is required.'

    if (!values.phone.trim()) errors.phone = 'Phone number field is required.'
    else if (!/^[0-9\-\s()]{6,15}$/.test(values.phone.trim()))
        errors.phone = 'Enter a valid phone number.'

    if (!values.industry) errors.industry = 'Industry field is required.'
    if (!values.employees) errors.employees = 'Employee count field is required.'

    if (!values.message.trim()) errors.message = 'Message field is required.'
    else if (values.message.trim().length < 20)
        errors.message = 'Message must be at least 20 characters.'

    return errors
}

function FieldError({ message }) {
    if (!message) return null

    return (
        <div
            className="field-error"
            role="alert"
            aria-live="polite"
        >
            {message}
        </div>
    )
}

function StatusPopup({
    open,
    type = "success",
    title,
    description,
    onClose,
}) {
    if (!open) return null

    return (
        <div
            className="popup-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
        >
            <div className={`popup-card ${type}`}>
                <button
                    className="popup-close"
                    onClick={onClose}
                    aria-label="Close message popup"
                    type="button"
                >
                    ×
                </button>

                <div className="popup-icon">
                    {type === "success" ? "✓" : "!"}
                </div>

                <h3 id="popup-title" className="popup-title">
                    {title}
                </h3>

                <p className="popup-description">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default function ContactForm() {
    const [values, setValues] = useState(initial)
    const [touched, setTouched] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const [popup, setPopup] = useState({
        open: false,
        type: "success",
        title: "",
        description: "",
    })

    const errors = useMemo(() => validate(values), [values])


    const setField = (key, value) => {
        setValues((v) => ({ ...v, [key]: value }))
    }

    const markTouched = (key) => {
        setTouched((t) => ({ ...t, [key]: true }))
    }

    const hasStartedTyping = Object.values(values).some(
        (value) => String(value).trim().length > 0
    )

    const isDisabled =
        submitting ||
        !hasStartedTyping ||
        Object.keys(errors).length > 0

    const onSubmit = async (e) => {
        e.preventDefault()
        setSubmitError('')

        const nextTouched = Object.keys(initial).reduce(
            (acc, k) => ({ ...acc, [k]: true }),
            {}
        )

        setTouched(nextTouched)

        const currentErrors = validate(values)

        if (Object.keys(currentErrors).length > 0) return

        setSubmitting(true)

        try {
            const payload = {
                name: values.name.trim(),
                company: values.company.trim(),
                email: values.email.trim(),
                countryCode: values.countryCode,
                phone: values.phone.trim(),
                industry: values.industry,
                employees: values.employees,
                message: values.message.trim(),
            }

            const response = await submitContact(payload)

            if (response.data.success || response.status === 200 || response.status === 201) {

                setPopup({
                    open: true,
                    type: "success",
                    title: "Message sent successfully",
                    description:
                        "Thank you for reaching out. Our team will get back to you shortly.",
                })

                setValues(initial)
                setTouched({})
            } else {
                throw new Error(`API request failed`)
            }
        } catch (err) {
            console.error(err)

            setSubmitError(
                err.response?.data?.message || 'Something went wrong — please try again, or email us directly at info@lexodd.com'
            )

            setPopup({
                open: true,
                type: "error",
                title: "Unable to send message",
                description:
                    err.response?.data?.message || "Something went wrong while submitting the form. Please try again shortly.",
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <div className="container mb-80">
                <div className="narrow form-wrapper">

                    <h3 className="mb-md">
                        Contact Us
                    </h3>

                    <form
                        onSubmit={onSubmit}
                        noValidate
                    >

                        <div className="form-group">

                            {/* NAME */}
                            <div>
                                <label
                                    className="input-label"
                                    htmlFor="full-name"
                                >
                                    Full Name
                                    <span className="required-note">*</span>
                                </label>

                                <input
                                    id="full-name"
                                    name="name"
                                    className={`input-item ${touched.name && errors.name ? 'error' : ''}`}
                                    type="text"
                                    value={values.name}
                                    required
                                    autoComplete="name"
                                    aria-invalid={!!(touched.name && errors.name)}
                                    aria-describedby={errors.name ? "name-error" : undefined}
                                    onBlur={() => markTouched('name')}
                                    onChange={(e) => setField('name', e.target.value)}
                                />

                                <FieldError
                                    message={touched.name ? errors.name : ''}
                                />
                            </div>

                            {/* COMPANY */}
                            <div>
                                <label
                                    className="input-label"
                                    htmlFor="company"
                                >
                                    Company/Organization
                                    <span className="required-note">*</span>
                                </label>

                                <input
                                    id="company"
                                    name="company"
                                    className={`input-item ${touched.company && errors.company ? 'error' : ''}`}
                                    type="text"
                                    value={values.company}
                                    required
                                    autoComplete="organization"
                                    aria-invalid={!!(touched.company && errors.company)}
                                    onBlur={() => markTouched('company')}
                                    onChange={(e) => setField('company', e.target.value)}
                                />

                                <FieldError
                                    message={touched.company ? errors.company : ''}
                                />
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label
                                    className="input-label"
                                    htmlFor="email"
                                >
                                    Email
                                    <span className="required-note">*</span>
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    className={`input-item ${touched.email && errors.email ? 'error' : ''}`}
                                    type="email"
                                    value={values.email}
                                    required
                                    autoComplete="email"
                                    inputMode="email"
                                    aria-invalid={!!(touched.email && errors.email)}
                                    onBlur={() => markTouched('email')}
                                    onChange={(e) => setField('email', e.target.value)}
                                />

                                <FieldError
                                    message={touched.email ? errors.email : ''}
                                />
                            </div>

                            {/* COUNTRY CODE */}
                            <CustomSelect
                                label="Country Code"
                                name="countryCode"
                                options={countryCodes}
                                value={values.countryCode}
                                setField={setField}
                                markTouched={markTouched}
                                error={touched.countryCode ? errors.countryCode : ""}
                            />

                            {/* PHONE */}
                            <div>
                                <label
                                    className="input-label"
                                    htmlFor="phone"
                                >
                                    Phone Number
                                    <span className="required-note">*</span>
                                </label>

                                <input
                                    id="phone"
                                    name="phone"
                                    className={`input-item ${touched.phone && errors.phone ? 'error' : ''}`}
                                    type="tel"
                                    value={values.phone}
                                    required
                                    autoComplete="tel"
                                    inputMode="tel"
                                    aria-invalid={!!(touched.phone && errors.phone)}
                                    onBlur={() => markTouched('phone')}
                                    onChange={(e) => setField('phone', e.target.value)}
                                />

                                <FieldError
                                    message={touched.phone ? errors.phone : ''}
                                />
                            </div>

                            {/* INDUSTRY */}
                            <CustomSelect
                                label="Industry"
                                name="industry"
                                options={[
                                    "Healthcare",
                                    "Logistics",
                                    "Franchise Operations",
                                    "Other",
                                ]}
                                value={values.industry}
                                setField={setField}
                                markTouched={markTouched}
                                error={touched.industry ? errors.industry : ""}
                            />

                            {/* EMPLOYEES */}
                            <CustomSelect
                                label="Employees"
                                name="employees"
                                options={[
                                    "10–50",
                                    "50–200",
                                    "200–500",
                                    "500+",
                                ]}
                                value={values.employees}
                                setField={setField}
                                markTouched={markTouched}
                                error={touched.employees ? errors.employees : ""}
                            />

                            {/* MESSAGE */}
                            <div>
                                <label
                                    className="input-label"
                                    htmlFor="message"
                                >
                                    How can we help you?
                                    <span className="required-note">*</span>
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    className={`input-item ${touched.message && errors.message ? 'error' : ''}`}
                                    value={values.message}
                                    required
                                    minLength={20}
                                    rows={6}
                                    placeholder="What operational problem are you trying to solve?"
                                    aria-invalid={!!(touched.message && errors.message)}
                                    onBlur={() => markTouched('message')}
                                    onChange={(e) => setField('message', e.target.value)}
                                />

                                <FieldError
                                    message={touched.message ? errors.message : ''}
                                />
                            </div>

                        </div>

                        {submitError && (
                            <div
                                className="submit-error"
                                role="alert"
                                aria-live="polite"
                            >
                                {submitError}
                            </div>
                        )}

                        {/* <button
                            type="submit"
                            disabled={isDisabled}
                            className={`grad-cta cta mt-lg submit-btn ${!hasStartedTyping ? 'idle' : ''} ${isDisabled ? 'disabled' : ''}`}
                            aria-label="Send contact form"
                        >
                            <span className="cta-text">
                                {submitting ? 'Sending...' : 'Send'}
                            </span>
                        </button> */}

                        <button
                            type="submit"
                            disabled={isDisabled}
                            aria-disabled={isDisabled}
                            aria-label={
                                isDisabled
                                    ? "Complete all required fields to enable send button"
                                    : "Send contact form"
                            }
                            className={`
        grad-cta 
        cta 
        mt-lg 
        submit-btn
        ${!hasStartedTyping ? 'idle' : ''}
    `}
                        >
                            <span className="cta-text">
                                {submitting ? 'Sending...' : 'Send'}
                            </span>
                        </button>

                    </form>
                </div>
            </div >

            <StatusPopup
                open={popup.open}
                type={popup.type}
                title={popup.title}
                description={popup.description}
                onClose={() =>
                    setPopup((prev) => ({
                        ...prev,
                        open: false,
                    }))
                }
            />
        </>
    )
}
