'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';

interface Option {
    value: string;
    label: string | React.ReactNode;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: LucideIcon;
    className?: string;
    fullWidth?: boolean;
}

export default function CustomSelect({
    options,
    value,
    onChange,
    placeholder = 'Seleccionar...',
    icon: Icon,
    className = '',
    fullWidth = true
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        function handleEsc(event: KeyboardEvent) {
            if (event.key === 'Escape') setIsOpen(false);
        }
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <div
            className={`custom-select-container ${fullWidth ? 'w-full' : ''} ${className}`}
            ref={dropdownRef}
        >
            <div
                className={`select-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="trigger-left">
                    {Icon && <Icon size={14} className="trigger-icon" />}
                    <span className={!selectedOption ? 'placeholder' : ''}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown size={14} className={`chevron ${isOpen ? 'rotate' : ''}`} />
            </div>

            {isOpen && (
                <div className="select-options-menu animate-slide-down">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`option-item ${value === option.value ? 'selected' : ''}`}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .custom-select-container { position: relative; font-family: inherit; }
                
                .select-trigger {
                    display: flex; align-items: center; justify-content: space-between;
                    background: #fff; border: 1px solid #e2e8f0;
                    border-radius: 14px; height: 50px; padding: 0 20px; cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); user-select: none;
                }
                
                .select-trigger:hover { border-color: #ec4899; background: #fff; box-shadow: 0 4px 12px rgba(236, 72, 153, 0.05); }
                
                .select-trigger.active { border-color: #1e293b; background: #fff; box-shadow: 0 0 0 4px rgba(30, 41, 59, 0.03); }

                .trigger-left { display: flex; align-items: center; gap: 12px; overflow: hidden; }
                .trigger-icon { color: #94a3b8; flex-shrink: 0; }
                .select-trigger span { font-size: 14px; font-weight: 800; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .select-trigger span.placeholder { color: #94a3b8; font-weight: 600; }

                .chevron { color: #94a3b8; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); flex-shrink: 0; }
                .chevron.rotate { transform: rotate(180deg); color: #1e293b; }

                .select-options-menu {
                    position: absolute; top: calc(100% + 8px); left: 0; width: 100%;
                    background: #fff; border: 1px solid #e2e8f0;
                    border-radius: 18px; overflow: hidden; z-index: 5000;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.08); padding: 8px;
                    max-height: 300px; overflow-y: auto;
                    scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent;
                }

                .option-item {
                    padding: 12px 16px; font-size: 14px; font-weight: 800; color: #64748b;
                    border-radius: 10px; cursor: pointer; transition: 0.2s;
                }
                
                .option-item:hover { background: #fdf2f8; color: #ec4899; }
                
                .option-item.selected { background: #1e293b; color: #fff; }

                .animate-slide-down { animation: slideDown 0.4s cubic-bezier(0, 0, 0.2, 1); }
                @keyframes slideDown { 
                    from { opacity: 0; transform: translateY(-12px) scale(0.96); } 
                    to { opacity: 1; transform: translateY(0) scale(1); } 
                }

                .select-options-menu::-webkit-scrollbar { width: 4px; }
                .select-options-menu::-webkit-scrollbar-track { background: transparent; }
                .select-options-menu::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
}
