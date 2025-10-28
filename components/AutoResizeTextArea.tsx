import { useRef } from "react";

interface AutoResizeTextAreaProps {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function AutoResizeTextarea({
  name,
  placeholder = "",
  value,
  onChange,
}: AutoResizeTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto"; // reset biar scrollHeight up-to-date
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <textarea
      ref={textareaRef}
      name={name}
      value={value}
      placeholder={placeholder}
      rows={4}
      onInput={handleInput}
      onChange={(e) => {
        handleInput();
        onChange(e);
      }}
      className="w-full px-4 py-2 border-2 border-[#E0E0E0] rounded-lg focus:outline-none resize-none overflow-hidden"
    />
  );
}
