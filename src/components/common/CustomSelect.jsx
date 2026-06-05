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

    const getOptionValue = (option) => typeof option === 'object' ? option.value : option
    const getOptionLabel = (option) => typeof option === 'object' ? option.label : option
    const selectedOption = options.find((option) => getOptionValue(option) === value)
    const selectedLabel = selectedOption ? getOptionLabel(selectedOption) : "Select an option"

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
        setField(name, getOptionValue(option))
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
                {options.map((option, index) => {
                    const optionValue = getOptionValue(option)
                    const optionLabel = getOptionLabel(option)
                    const isSelected = value === optionValue

                    return (
                    <div
                        key={optionValue}
                        role="option"
                        aria-selected={isSelected}
                        className={`select-option 
              ${isSelected ? "selected" : ""} 
              ${focusedIndex === index ? "focused" : ""}`}
                        onClick={() => handleSelect(option)}
                        onMouseEnter={() => setFocusedIndex(index)}
                    >
                        {optionLabel}

                        {/* checkmark */}
                        {isSelected && (
                            <span className="check"><MdCheck /></span>
                        )}
                    </div>
                    )
                })}
            </div>

            {/* ERROR */}
            {error && <div className="field-error">{error}</div>}
        </div>
    )
}
