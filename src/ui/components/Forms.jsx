// ReusableForm.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationSchema } from "./schema";

const ReusableForm = ({
  initialValues,
  onSubmit,
  children,
  buttonText = "Submit"
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnBlur={true}
      validateOnChange={true}
    >
      {({ 
        values, 
        errors, 
        touched, 
        handleChange, 
        handleBlur, 
        handleSubmit,
        isSubmitting 
      }) => (
        <Form onSubmit={handleSubmit}>

          {children({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting
          })}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : buttonText}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ReusableForm;