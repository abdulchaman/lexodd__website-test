import './what-we-do.css';
import { FadeUp, HoverCard, StaggerGrid, TextReveal } from './Animations';

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
                    <FadeUp className="narrow mb-lg">

                        {label && (
                            <div className="label">
                                <strong>
                                    {label}
                                </strong>
                            </div>
                        )}

                        {title && (
                            <TextReveal as="h2" className='mb' text={title} />
                        )}

                        {description && (
                            <div className=''>
                                <p className='main-para'>
                                    {description}
                                </p>
                            </div>

                        )}

                    </FadeUp>
                )}

                <StaggerGrid className="prb-blocks">

                    {items.map((item, index) => (
                        <HoverCard
                            as="article"
                            className="wwd_card"
                            aria-labelledby={`wwd-title-${index}`}
                            key={index}
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

                        </HoverCard>
                    ))}

                </StaggerGrid>

            </div>
        </section>
    );
}
