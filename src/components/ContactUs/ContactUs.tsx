import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import emailjs from '@emailjs/browser'

import {
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Clock3,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

import './ContactUs.css'


/* =========================================================
   TYPES
========================================================= */

type FormData = {
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
}

type FormErrors = Partial<Record<keyof FormData, string>>


/* =========================================================
   INITIAL FORM
========================================================= */

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  message: '',
}


/* =========================================================
   VALIDATION
========================================================= */

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/


const validateForm = (
  data: FormData
): FormErrors => {

  const errors: FormErrors = {}


  /* -------------------------------------------------------
     NAME
  ------------------------------------------------------- */

  const name = data.name.trim()

  if (!name) {

    errors.name =
      'Please enter your name.'

  } else if (name.length > 100) {

    errors.name =
      'Name must not exceed 100 characters.'

  }


  /* -------------------------------------------------------
     EMAIL
  ------------------------------------------------------- */

  const email = data.email.trim()

  if (!email) {

    errors.email =
      'Please enter your email address.'

  } else if (!emailRegex.test(email)) {

    errors.email =
      'Please enter a valid email address.'

  }


  /* -------------------------------------------------------
     PHONE
  ------------------------------------------------------- */

  const phone = data.phone.trim()

  if (!phone) {

    errors.phone =
      'Please enter your phone number.'

  } else if (!/^\d{10}$/.test(phone)) {

    errors.phone =
      'Phone number must contain exactly 10 digits.'

  }


  /* -------------------------------------------------------
     COMPANY
  ------------------------------------------------------- */

  const company = data.company.trim()

  if (company.length > 100) {

    errors.company =
      'Company name must not exceed 100 characters.'

  }


  /* -------------------------------------------------------
     SERVICE
  ------------------------------------------------------- */

  if (!data.service) {

    errors.service =
      'Please select a service.'

  }


  /* -------------------------------------------------------
     PROJECT DETAILS
  ------------------------------------------------------- */

  const message = data.message.trim()

  if (!message) {

    errors.message =
      'Please enter your project details.'

  } else if (message.length < 50) {

    errors.message =
      `Project details must contain at least 50 characters. You have ${message.length}.`

  } else if (message.length > 400) {

    errors.message =
      'Project details must not exceed 400 characters.'

  }


  return errors
}


/* =========================================================
   COMPONENT
========================================================= */

export default function ContactUs() {

  const [formData, setFormData] =
    useState<FormData>(initialFormData)


  const [errors, setErrors] =
    useState<FormErrors>({})


  const [isSending, setIsSending] =
    useState(false)


  const [success, setSuccess] =
    useState(false)


  const [error, setError] =
    useState('')


  /* =======================================================
     HANDLE INPUT CHANGE
  ======================================================= */

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    const {
      name,
      value,
    } = e.target


    let nextValue = value


    /* -----------------------------------------------------
       PHONE
       Only numbers
    ----------------------------------------------------- */

    if (name === 'phone') {

      nextValue =
        value
          .replace(/\D/g, '')
          .slice(0, 10)
    }


    /* -----------------------------------------------------
       NAME
       Maximum 100 characters
    ----------------------------------------------------- */

    if (name === 'name') {

      nextValue =
        value.slice(0, 100)
    }


    /* -----------------------------------------------------
       COMPANY
       Maximum 100 characters
    ----------------------------------------------------- */

    if (name === 'company') {

      nextValue =
        value.slice(0, 100)
    }


    /* -----------------------------------------------------
       PROJECT DETAILS
       Maximum 400 characters
    ----------------------------------------------------- */

    if (name === 'message') {

      nextValue =
        value.slice(0, 400)
    }


    setFormData((previous) => ({
      ...previous,
      [name]: nextValue,
    }))


    setSuccess(false)
    setError('')


    /*
     * Validate the field while typing only if
     * that field already has an error.
     */

    if (
      errors[name as keyof FormData]
    ) {

      const nextData = {
        ...formData,
        [name]: nextValue,
      }

      const nextErrors =
        validateForm(nextData)


      setErrors((previous) => {

        const updated = {
          ...previous,
        }

        const field =
          name as keyof FormData


        if (nextErrors[field]) {

          updated[field] =
            nextErrors[field]

        } else {

          delete updated[field]

        }


        return updated
      })
    }
  }


  /* =======================================================
     HANDLE BLUR
  ======================================================= */

  const handleBlur = (
    e: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    const field =
      e.target.name as keyof FormData


    const validationErrors =
      validateForm(formData)


    setErrors((previous) => {

      const updated = {
        ...previous,
      }


      if (validationErrors[field]) {

        updated[field] =
          validationErrors[field]

      } else {

        delete updated[field]

      }


      return updated
    })
  }


  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault()


    setSuccess(false)
    setError('')


    /* -----------------------------------------------------
       VALIDATE EVERYTHING
    ----------------------------------------------------- */

    const validationErrors =
      validateForm(formData)


    setErrors(validationErrors)


    /*
     * Stop submission if anything is invalid.
     */

    if (
      Object.keys(validationErrors).length > 0
    ) {

      /*
       * Scroll to first invalid field.
       */

      const firstErrorField =
        Object.keys(validationErrors)[0]


      requestAnimationFrame(() => {

        const element =
          document.getElementById(
            firstErrorField
          )


        element?.focus({
          preventScroll: true,
        })


        element?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })

      })


      return
    }


    setIsSending(true)


    try {

      /* ---------------------------------------------------
         EMAILJS CONFIG
      --------------------------------------------------- */

      const serviceId =
        import.meta.env.VITE_EMAILJS_SERVICE_ID


      const templateId =
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID


      const publicKey =
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY


      if (
        !serviceId ||
        !templateId ||
        !publicKey
      ) {

        throw new Error(
          'Email service is not configured.'
        )
      }


      /* ---------------------------------------------------
         SEND EMAIL
      --------------------------------------------------- */

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name:
            formData.name.trim(),

          from_email:
            formData.email.trim(),

          phone:
            formData.phone.trim(),

          company:
            formData.company.trim(),

          service:
            formData.service,

          message:
            formData.message.trim(),

          reply_to:
            formData.email.trim(),

          to_email:
            'info.bharaatstructurals@gmail.com',
        },
        {
          publicKey,
        }
      )


      /* ---------------------------------------------------
         SUCCESS
      --------------------------------------------------- */

      setSuccess(true)

      setErrors({})

      setFormData(
        initialFormData
      )

    } catch (err) {

      console.error(
        'Contact form error:',
        err
      )


      setError(
        'We could not send your enquiry right now. Please email us directly at pasha.nadeem@bharaatstructurals.com'
      )

    } finally {

      setIsSending(false)
    }
  }


  /* =======================================================
     FIELD ERROR CLASS
  ======================================================= */

  const fieldClass = (
    field: keyof FormData
  ) => {

    return errors[field]
      ? 'contact-us-input-error'
      : ''
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="contact-us-page">

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="contact-us-grid" />

      <div className="contact-us-glow contact-us-glow-one" />

      <div className="contact-us-glow contact-us-glow-two" />

      <div className="contact-us-glow contact-us-glow-three" />


      {/* ===================================================
          PAGE WRAPPER
      =================================================== */}

      <div className="contact-us-wrap">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="contact-us-header">

          <div className="contact-us-eyebrow">

            <span className="contact-us-dot" />

            CONTACT BHARAAT STRUCTURALS

          </div>


          <h1>

            Let's build

            <span>
              something precise.
            </span>

          </h1>


          <p>
            Tell us about your project, requirements,
            drawings or structural engineering needs.
            Our team will get back to you with the
            next steps.
          </p>

        </header>


        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="contact-us-grid-layout">


          {/* =================================================
              LEFT INFORMATION
          ================================================= */}

          <section className="contact-us-info">


            <div className="contact-us-info-intro">

              <span>
                START A CONVERSATION
              </span>


              <h2>

                Have a project

                <br />

                <strong>
                  in mind?
                </strong>

              </h2>


              <p>
                Share your project details with us.
                Whether you need detailing, fabrication
                support, structural modelling or
                engineering services, our team is ready
                to understand your requirement.
              </p>

            </div>


            {/* =================================================
                CONTACT DETAILS
            ================================================= */}

            <div className="contact-us-details">


              {/* EMAIL */}

              <a
                href="mailto:info.bharaatstructurals@gmail.com"
                className="contact-us-detail"
              >

                <div className="contact-us-detail-icon">

                  <Mail size={18} />

                </div>


                <div>

                  <span>
                    EMAIL
                  </span>

                  <strong>
                    info.bharaatstructurals@gmail.com
                  </strong>

                </div>


                <ArrowUpRight
                  className="contact-us-detail-arrow"
                  size={17}
                />

              </a>


              {/* PHONE */}

              <a
                href="tel:+918025349898"
                className="contact-us-detail"
              >

                <div className="contact-us-detail-icon">

                  <Phone size={18} />

                </div>


                <div>

                  <span>
                    CALL OUR OFFICE
                  </span>

                  <strong>
                    +91 80 2534 9898
                  </strong>

                </div>


                <ArrowUpRight
                  className="contact-us-detail-arrow"
                  size={17}
                />

              </a>


              {/* OFFICE */}

              <div className="contact-us-detail">

                <div className="contact-us-detail-icon">

                  <MapPin size={18} />

                </div>


                <div>

                  <span>
                    OFFICE
                  </span>

                  <strong>
                    Bengaluru, Karnataka
                  </strong>

                  <small>
                    82/B, near SBI bank, AC Post,
                    Veerannapalya, Nagavara,
                    Bengaluru, Karnataka 560045
                  </small>

                </div>

              </div>


              {/* WORKING HOURS */}

              <div className="contact-us-detail">

                <div className="contact-us-detail-icon">

                  <Clock3 size={18} />

                </div>


                <div>

                  <span>
                    WORKING HOURS
                  </span>

                  <strong>
                    Monday – Friday
                  </strong>

                  <small>
                    09:00 AM – 06:00 PM
                  </small>

                </div>

              </div>


            </div>


            {/* =================================================
                LOCATION CARD
            ================================================= */}

            <a
              href="https://www.google.com/maps/search/?api=1&query=13.0414167,77.6136944"
              target="_blank"
              rel="noreferrer"
              className="contact-us-location"
            >

              <div>

                <MapPin size={17} />

              </div>


              <section>

                <span>
                  FIND US
                </span>

                <strong>
                  Bengaluru, Karnataka
                </strong>

                <small>
                  82/B, near SBI bank, AC Post,
                  Veerannapalya, Nagavara,
                  Bengaluru, Karnataka 560045
                </small>

                <small>
                  Open location in Google Maps
                </small>

              </section>


              <ArrowUpRight size={17} />

            </a>


          </section>


          {/* =================================================
              FORM
          ================================================= */}

          <section className="contact-us-form-card">


            <div className="contact-us-form-top">

              <div>

                <span>
                  PROJECT ENQUIRY
                </span>

                <h2>
                  Tell us about
                  <br />
                  your project.
                </h2>

              </div>


              <div className="contact-us-form-number">
                01
              </div>

            </div>


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

              <div className="contact-us-message success">

                <CheckCircle2 size={18} />

                <div>

                  <strong>
                    Enquiry sent successfully.
                  </strong>

                  <span>
                    We have received your enquiry.
                    A confirmation email will be sent
                    to your email address.
                  </span>

                </div>

              </div>

            )}


            {/* =================================================
                GENERAL ERROR
            ================================================= */}

            {error && (

              <div className="contact-us-message error">

                <AlertCircle size={18} />

                <div>

                  <strong>
                    Message not sent.
                  </strong>

                  <span>
                    {error}
                  </span>

                </div>

              </div>

            )}


            <form
              className="contact-us-form"
              onSubmit={handleSubmit}
              noValidate
            >


              {/* =================================================
                  NAME
              ================================================= */}

              <div className="contact-us-field">

                <label htmlFor="name">
                  YOUR NAME *
                </label>


                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={100}
                  autoComplete="name"
                  aria-invalid={
                    Boolean(errors.name)
                  }
                  className={fieldClass('name')}
                />


                <div className="contact-us-field-meta">

                  {errors.name && (

                    <span className="contact-us-error">
                      {errors.name}
                    </span>

                  )}

                  <span className="contact-us-counter">
                    {formData.name.length}/100
                  </span>

                </div>

              </div>


              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="contact-us-field">

                <label htmlFor="email">
                  EMAIL ADDRESS *
                </label>


                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                  aria-invalid={
                    Boolean(errors.email)
                  }
                  className={fieldClass('email')}
                />


                {errors.email && (

                  <span className="contact-us-error">
                    {errors.email}
                  </span>

                )}

              </div>


              {/* =================================================
                  PHONE + COMPANY
              ================================================= */}

              <div className="contact-us-two-fields">


                {/* PHONE */}

                <div className="contact-us-field">

                  <label htmlFor="phone">
                    PHONE NUMBER *
                  </label>


                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="10 digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="tel"
                    aria-invalid={
                      Boolean(errors.phone)
                    }
                    className={fieldClass('phone')}
                  />


                  <div className="contact-us-field-meta">

                    {errors.phone && (

                      <span className="contact-us-error">
                        {errors.phone}
                      </span>

                    )}

                    <span className="contact-us-counter">
                      {formData.phone.length}/10
                    </span>

                  </div>

                </div>


                {/* COMPANY */}

                <div className="contact-us-field">

                  <label htmlFor="company">
                    COMPANY
                  </label>


                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={100}
                    autoComplete="organization"
                    aria-invalid={
                      Boolean(errors.company)
                    }
                    className={fieldClass('company')}
                  />


                  <div className="contact-us-field-meta">

                    {errors.company && (

                      <span className="contact-us-error">
                        {errors.company}
                      </span>

                    )}

                    <span className="contact-us-counter">
                      {formData.company.length}/100
                    </span>

                  </div>

                </div>


              </div>


              {/* =================================================
                  SERVICE
              ================================================= */}

              <div className="contact-us-field">

                <label htmlFor="service">
                  SERVICE REQUIRED *
                </label>


                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={
                    Boolean(errors.service)
                  }
                  className={fieldClass('service')}
                >

                  <option value="">
                    Select a service
                  </option>

                  <option value="Structural Steel Detailing">
                    Structural Steel Detailing
                  </option>

                  <option value="BIM Modelling">
                    BIM Modelling
                  </option>

                  <option value="Connection Design">
                    Connection Design
                  </option>

                  <option value="Engineering Services">
                    Engineering Services
                  </option>

                  <option value="Tekla Automation">
                    Tekla Automation
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>


                {errors.service && (

                  <span className="contact-us-error">
                    {errors.service}
                  </span>

                )}

              </div>


              {/* =================================================
                  PROJECT DETAILS
              ================================================= */}

              <div className="contact-us-field">

                <div className="contact-us-message-label">

                  <label htmlFor="message">
                    PROJECT DETAILS *
                  </label>

                  <span
                    className={
                      formData.message.length < 50
                        ? 'contact-us-counter contact-us-counter-warning'
                        : 'contact-us-counter'
                    }
                  >
                    {formData.message.length}/400
                  </span>

                </div>


                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  maxLength={400}
                  minLength={50}
                  placeholder="Tell us about your project, requirements, drawings, timeline..."
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={
                    Boolean(errors.message)
                  }
                  className={fieldClass('message')}
                />


                <div className="contact-us-field-meta">

                  {errors.message && (

                    <span className="contact-us-error">
                      {errors.message}
                    </span>

                  )}

                  {!errors.message &&
                    formData.message.length > 0 &&
                    formData.message.length < 50 && (

                      <span className="contact-us-helper">
                        Minimum 50 characters required.
                      </span>

                  )}

                </div>

              </div>


              {/* =================================================
                  SUBMIT
              ================================================= */}

              <button
                type="submit"
                className="contact-us-submit"
                disabled={isSending}
              >

                <span>

                  {isSending
                    ? 'SENDING...'
                    : 'SEND ENQUIRY'
                  }

                </span>


                <div>

                  <Send size={16} />

                </div>

              </button>


              <p className="contact-us-form-note">

                By submitting this form, your enquiry
                will be sent securely to the Bharaat
                Structurals team.

              </p>


            </form>

          </section>


        </div>


        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="contact-us-bottom">

          <span />

          <strong>
            BHARAAT STRUCTURALS
          </strong>

          <small>
            BUILDING A STRONGER TOMORROW TOGETHER
          </small>

          <span />

        </div>


      </div>

    </main>
  )
}
// EmailJS production configuration