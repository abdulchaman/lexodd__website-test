import { div } from 'framer-motion/client';
import './what-we-do.css';
import { motion } from "framer-motion";
export default function WhatWeDo({
    label = "WHAT WE DO",
    title = "",
    description = "",
    items = [],
    sectionClass = "dark",
}) {
    return (
        <section className={`section what_we_do ${sectionClass}`}>
            <div className="container">

                {(label || title || description) && (
                    <div className="narrow mb-lg">

                        {label && (
                            <div className="label">
                                <strong>
                                    {label}
                                </strong>
                            </div>
                        )}

                        {title && (
                            <h2 className='mb'>
                                {title}
                            </h2>
                        )}

                        {description && (
                            <div className=''>
                                <p className='main-para'>
                                    {description}
                                </p>
                            </div>

                        )}

                    </div>
                )}

                <div className="prb-blocks">

                    {items.map((item, index) => (
                        <article
                            className="wwd_card"
                            aria-labelledby={`wwd-title-${index}`}
                        >
                            <div
                                className='nm mb'
                                aria-hidden="true"
                            >
                                {item.number || `#${index + 1}`}
                            </div>

                            <h3
                                id={`wwd-title-${index}`}
                                className='mb-md'
                            >
                                {item.title}
                            </h3>

                            <p>
                                {item.description}
                            </p>

                        </article>
                    ))}

                </div>

            </div>
        </section>
    );
}