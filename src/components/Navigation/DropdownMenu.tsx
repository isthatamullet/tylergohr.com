"use client";

import { useCallback } from "react";
import styles from "./DropdownMenu.module.css";

export interface DropdownItem {
  title: string;
  description: string;
  href: string;
  icon?: string;
  badge?: string;
  type?: 'link' | 'page-link';
}

interface DropdownMenuProps {
  items: DropdownItem[];
  isVisible: boolean;
  onItemClick: (href: string) => void;
  className?: string;
}

export default function DropdownMenu({ 
  items, 
  isVisible, 
  onItemClick, 
  className = "" 
}: DropdownMenuProps) {
  
  const handleItemClick = useCallback((href: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onItemClick(href);
  }, [onItemClick]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${styles.dropdown} ${className}`}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          onClick={(event) => handleItemClick(item.href, event)}
          className={`${styles.dropdownItem} ${
            item.type === 'page-link' ? styles.pageLink : ''
          }`}
          role="menuitem"
        >
          <div className={styles.itemContent}>
            {item.icon && (
              <span className={styles.itemIcon}>{item.icon}</span>
            )}
            <div className={styles.itemText}>
              <div className={styles.dropdownTitle}>
                {item.title}
                {item.badge && (
                  <span className={styles.badge}>{item.badge}</span>
                )}
              </div>
              <div className={styles.dropdownDescription}>
                {item.description}
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}