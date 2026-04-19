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
                    background: var(--slate-50); border: 1px solid var(--slate-200);
                    border-radius: 14px; height: 50px; padding: 0 20px; cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); user-select: none;
                }
                :global(.men-theme) .select-trigger { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
                
                .select-trigger:hover { border-color: var(--primary); background: var(--white); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                :global(.men-theme) .select-trigger:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); }
                
                .select-trigger.active { border-color: var(--fg); background: var(--white); box-shadow: 0 0 0 4px rgba(0,0,0,0.03); }
                :global(.men-theme) .select-trigger.active { border-color: white; background: rgba(255,255,255,0.08); box-shadow: 0 0 20px rgba(255,255,255,0.05); }

                .trigger-left { display: flex; align-items: center; gap: 12px; overflow: hidden; }
                .trigger-icon { color: var(--slate-400); flex-shrink: 0; opacity: 0.8; }
                .select-trigger span { font-size: 14px; font-weight: 700; color: var(--fg); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .select-trigger span.placeholder { color: var(--slate-500); font-weight: 500; }
                :global(.men-theme) .select-trigger span.placeholder { color: #64748b; }

                .chevron { color: var(--slate-400); transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); flex-shrink: 0; }
                .chevron.rotate { transform: rotate(180deg); color: var(--fg); }

                .select-options-menu {
                    position: absolute; top: calc(100% + 8px); left: 0; width: 100%;
                    background: var(--white); border: 1px solid var(--slate-200);
                    border-radius: 18px; overflow: hidden; z-index: 5000;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.12); padding: 8px;
                    max-height: 300px; overflow-y: auto;
                    scrollbar-width: thin; scrollbar-color: var(--slate-300) transparent;
                }
                :global(.men-theme) .select-options-menu { background: #1e293b; border-color: rgba(255,255,255,0.15); box-shadow: 0 30px 60px rgba(0,0,0,0.6); backdrop-filter: blur(20px); }

                .option-item {
                    padding: 12px 16px; font-size: 14px; font-weight: 700; color: var(--slate-600);
                    border-radius: 10px; cursor: pointer; transition: 0.2s;
                }
                :global(.men-theme) .option-item { color: var(--slate-300); }
                
                .option-item:hover { background: var(--slate-100); color: var(--fg); }
                :global(.men-theme) .option-item:hover { background: rgba(255,255,255,0.08); color: white; }
                
                .option-item.selected { background: var(--fg); color: var(--bg); }
                :global(.men-theme) .option-item.selected { background: white; color: #0f172a; }

                .animate-slide-down { animation: slideDown 0.4s cubic-bezier(0, 0, 0.2, 1); }
                @keyframes slideDown { 
                    from { opacity: 0; transform: translateY(-12px) scale(0.96); } 
                    to { opacity: 1; transform: translateY(0) scale(1); } 
                }

                .select-options-menu::-webkit-scrollbar { width: 4px; }
                .select-options-menu::-webkit-scrollbar-track { background: transparent; }
                .select-options-menu::-webkit-scrollbar-thumb { background: var(--slate-300); border-radius: 10px; }
                :global(.men-theme) .select-options-menu::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
}
