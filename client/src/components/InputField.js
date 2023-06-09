import React from 'react';

function InputField({ methods, id, type, label, placeholder, validation }) {
  return (
    <div className='form-floating mb-3'>
      <input
        className='form-control'
        id={id}
        type={type}
        placeholder={placeholder}
        {...methods.register(id, validation)}
      />
      <label htmlFor={id} className='text-dark'>
        {label}
      </label>
      {methods.formState?.errors?.[id]?.message && (
        <small className='text-danger'>
          {methods.formState.errors[id].message}
        </small>
      )}
    </div>
  );
}

export default InputField;
