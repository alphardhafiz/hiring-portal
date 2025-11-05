import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface CustomDatePickerProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  disabled?: boolean;
  isRequire?: boolean;
  name?: string;
  placeholder?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ 
  value, 
  onChange, 
  disabled = false,
  isRequire = false,
  name = "date",
  placeholder = "Select your date of birth"
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
    // Format date as YYYY-MM-DD in local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedValue = `${year}-${month}-${day}`;
    
    const syntheticEvent = {
      target: {
        name,
        value: formattedValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  const handlePrevMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handlePrevYear = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth()));
  };

  const handleNextYear = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth()));
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSameDate = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 border-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
          disabled 
            ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
            : isOpen
            ? 'border-[#01959F]'
            : 'border-[#E0E0E0] hover:border-[#01959F]'
        }`}
      >
        <div className="flex items-center gap-3 flex-1">
          <Calendar className={`w-5 h-5 ${disabled ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
            {selectedDate ? formatDate(selectedDate) : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${disabled ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 w-1/2 bg-white border-2 border-[#E0E0E0] rounded-lg shadow-lg p-4">
          {/* Month/Year Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevYear}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Previous Year"
              >
                <ChevronsLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <span className="font-semibold text-gray-900">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={handleNextYear}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Next Year"
              >
                <ChevronsRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <div key={index} className="aspect-square">
                {date ? (
                  <button
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    className={`w-full h-full rounded-lg text-sm transition-colors ${
                      isSameDate(date, selectedDate)
                        ? 'bg-[#01959F] text-white font-semibold'
                        : isToday(date)
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'hover:bg-gray-100 text-gray-900'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Example Usage Component
interface FormData {
  dateOfBirth: string;
}

const DatePickerExample: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    dateOfBirth: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Date Picker Example</h2>
        
        <div className="space-y-6">
          {/* Required Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <CustomDatePicker
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              isRequire={true}
            />
          </div>

          {/* Disabled Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disabled Date Field
            </label>
            <CustomDatePicker
              name="disabledDate"
              value=""
              onChange={() => {}}
              disabled={true}
            />
          </div>

          {/* Display Selected Value */}
          {formData.dateOfBirth && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Selected Date:</p>
              <p className="font-semibold text-gray-900">{formData.dateOfBirth}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomDatePicker;