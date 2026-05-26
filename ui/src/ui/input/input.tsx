import * as React from 'react';
import styles from './input.module.css';

export interface InputProps extends React.ComponentProps<'input'> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`${styles.input} ${className || ''}`.trim()}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';