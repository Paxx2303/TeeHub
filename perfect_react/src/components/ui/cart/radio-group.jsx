import React from "react";

const RadioGroup = ({ value, onValueChange, children, className = "", ...props }) => (
  <div className={className} {...props}>
    {React.Children.map(children, (child) => {
      return React.cloneElement(child, { value, onValueChange });
    })}
  </div>
);

const RadioGroupItem = ({ id, value: itemValue, value, onValueChange, ...props }) => (
  <input
    type="radio"
    id={id}
    name="radio-group"
    checked={value === itemValue}
    onChange={() => onValueChange && onValueChange(itemValue)}
    {...props}
  />
);

export { RadioGroup, RadioGroupItem };


