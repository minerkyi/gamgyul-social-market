import styles from './InputField.module.css'


function InputField({
    type = "text",
    placeholder = "",
    value = "",
    onChange = () => {},
    error,
    labelText,
    inputid,
    ...rest

}) {
  return (
    <div className={styles.inputWrapper}>
      <label htmlFor={inputid} className={styles.label}>{labelText}</label>
      <input
          className={styles['input-field']}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          id={inputid}
          {...rest}
      />
      {error && <span className={styles['input-validation']}>*{error.message}</span>}
    </div>
  );
}

export default InputField
