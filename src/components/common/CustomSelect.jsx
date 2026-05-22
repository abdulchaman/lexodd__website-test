import { useState, useRef, useEffect } from "react"
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MdCheck } from "react-icons/md";

export default function CustomSelect({
    label,
    name,
    options,
    value,
    setField,
    markTouched,
    error,
}) {
    const [open, setOpen] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const containerRef = useRef(null)
    const listRef = useRef(null)

    const selectedLabel = value || "Select an option"

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (option) => {
        setField(name, option)
        markTouched(name)
        setOpen(false)
    }

    const handleKeyDown = (e) => {
        if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
            e.preventDefault()
            setOpen(true)
            setFocusedIndex(0)
            return
        }

        if (!open) return

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                setFocusedIndex((prev) => (prev + 1) % options.length)
                break
            case "ArrowUp":
                e.preventDefault()
                setFocusedIndex((prev) =>
                    prev <= 0 ? options.length - 1 : prev - 1
                )
                break
            case "Enter":
                e.preventDefault()
                if (focusedIndex >= 0) handleSelect(options[focusedIndex])
                break
            case "Escape":
                setOpen(false)
                break
            default:
                break
        }
    }

    return (
        <div className="custom-select" ref={containerRef}>

            {/* LABEL */}
            <label className="input-label">
                {label}
                <span className="required-note">*</span>
            </label>

            {/* BUTTON */}
            <button
                type="button"
                className={`select-trigger ${error ? "error" : ""}`}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-labelledby={`${name}-label`}
                onClick={() => setOpen((o) => !o)}
                onKeyDown={handleKeyDown}
                onBlur={() => markTouched(name)}
            >
                <span className={`select-value ${!value ? "placeholder" : ""}`}>
                    {selectedLabel}
                </span>

                {/* Chevron */}
                <span className={`chevron ${open ? "open" : ""}`}>
                    <MdOutlineKeyboardArrowDown />
                </span>
            </button>

            {/* DROPDOWN */}
            <div
                className={`select-dropdown ${open ? "open" : ""}`}
                role="listbox"
                ref={listRef}
                tabIndex={-1}
            >
                {options.map((option, index) => (
                    <div
                        key={option}
                        role="option"
                        aria-selected={value === option}
                        className={`select-option 
              ${value === option ? "selected" : ""} 
              ${focusedIndex === index ? "focused" : ""}`}
                        onClick={() => handleSelect(option)}
                        onMouseEnter={() => setFocusedIndex(index)}
                    >
                        {option}

                        {/* checkmark */}
                        {value === option && (
                            <span className="check"><MdCheck /></span>
                        )}
                    </div>
                ))}
            </div>

            {/* ERROR */}
            {error && <div className="field-error">{error}</div>}
        </div>
    )
}