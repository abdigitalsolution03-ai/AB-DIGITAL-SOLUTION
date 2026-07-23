import { InputHTMLAttributes, forwardRef, useEffect, useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
  shortcut?: string
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, shortcut = 'Ctrl+K', className = '', value, onChange, ...props }, ref) => {
    const [localValue, setLocalValue] = useState(value || '')

    useEffect(() => {
      setLocalValue(value || '')
    }, [value])

    const handleClear = () => {
      setLocalValue('')
      onClear?.()
      if (onChange) {
        const event = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>
        onChange(event)
      }
    }

    return (
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={18} />
        <input
          ref={ref}
          type="text"
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value)
            onChange?.(e)
          }}
          className="form-input pl-10 pr-20"
          {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {localValue && (
            <button onClick={handleClear} className="p-0.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
              <FiX size={14} />
            </button>
          )}
          {shortcut && (
            <span className="text-[10px] font-medium text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">
              {shortcut}
            </span>
          )}
        </div>
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'

export default SearchInput
