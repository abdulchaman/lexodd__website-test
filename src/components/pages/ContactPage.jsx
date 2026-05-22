import React, { useState } from "react";
import './ContactPage.css';
import ContactForm from "../common/ContactForm";

const ContactPage = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        company: "",
        message: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
    };

    const isValid =
        form.name.trim() &&
        form.email.trim() &&
        form.message.trim();

    return (
        <section className="section">
            <div className="container">

                {/* HEADER */}
                <div className="contact_header">
                    <h1>Let’s build operational systems</h1>

                    <p>
                        We design and engineer infrastructure for multi-location operations —
                        healthcare, logistics, diagnostics, and service networks.
                        Share your requirement and we will respond with a structured approach.
                    </p>
                </div>

               

                <ContactForm></ContactForm>

            </div>
        </section>
    );
};

export default ContactPage;